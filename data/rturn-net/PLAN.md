# RTURN Chatbot — Implementation Plan

A RAG chatbot over the scraped `rturn.net` content (Tenant Union Representation
Network — Philadelphia tenant rights). Mirrors the existing `/chat` (career)
pipeline where it can, adds a vector-retrieval step on Neon (`pgvector`) for
grounded answers with source citations.

## 1. Decisions to make first

These are the only choices that ripple through the rest of the plan — pin them
before writing code.

- **Embedding provider**
  - Option A: **Voyage AI** (`voyage-3`, 1024 dims) — Anthropic's recommended
    pair, separate API key (`VOYAGE_API_KEY`), small monthly free tier.
  - Option B: **OpenAI** `text-embedding-3-small` (1536 dims) — cheaper, ubiquitous.
  - Pick one; the schema's vector dimension depends on it.
- **Surface**
  - New page `/rturn` reusing `components/ui/career-chat.tsx` with different
    system prompt + endpoint, **or** a separate component if the UX needs to
    diverge (e.g. inline source links beneath each answer).
- **Citations in UI**
  - If yes, the API needs to emit retrieved chunks alongside the stream
    (e.g. JSON header frame before the text stream, or a sidecar GET).

## 2. Content cleanup

Out of 81 files, drop the index/pagination/sitemap pages — they're navigation
scaffolding, not content. Keep only the named topical pages.

Drop patterns:
- `index.md`, `index.json`
- `sitemap.md`
- `page__N.md`
- `news.md`, `news__page__N.md`
- `category__*.md` (including `category__news__page__N.md`,
  `category__webinars__page__N.md`, `category__uncategorized.md`)

Keep everything else (~55–60 real content pages: rights guides, clinics, news
posts, announcements).

Implementation: a small `scripts/rturn/list-content.ts` that returns the kept
file list, used by both the ingest script and tests.

## 3. Database schema (Neon + pgvector)

Add to `lib/db/schema.sql` (idempotent — re-runnable):

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS rturn_chunks (
  id           BIGSERIAL PRIMARY KEY,
  source_file  TEXT NOT NULL,         -- e.g. "leasing.md"
  source_url   TEXT,                  -- from index.json
  source_title TEXT,                  -- from index.json
  chunk_index  INT  NOT NULL,         -- 0-based within the file
  heading      TEXT,                  -- nearest preceding heading, if any
  content      TEXT NOT NULL,
  token_count  INT  NOT NULL,
  content_hash TEXT NOT NULL,         -- sha256(content) for idempotent reindex
  embedding    VECTOR(1024) NOT NULL, -- adjust dim to chosen model
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_file, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_rturn_chunks_embedding
  ON rturn_chunks USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_rturn_chunks_source
  ON rturn_chunks (source_file);
```

Apply via the existing `lib/db/migrate.ts` runner (already idempotent).

## 4. Ingestion pipeline

New file: `scripts/rturn/ingest.ts` (run with `tsx`, like `migrate.ts`).

Steps:
1. Load `data/rturn-net/index.json` → map of `file → { url, title }`.
2. For each kept file (see §2):
   1. Read markdown.
   2. Chunk:
      - Split on `##` / `###` headings first.
      - Within each section, split further if > ~500 tokens, with ~50-token
        overlap. Use `gpt-tokenizer` or rough char/token heuristic — exact
        tokenizer doesn't matter much for embedding quality.
      - Track the nearest preceding heading on each chunk for citation context.
   3. Compute `content_hash = sha256(content)`.
   4. Skip embed+insert if `(source_file, chunk_index, content_hash)` already
      exists — keeps reruns cheap.
   5. Otherwise embed, then `INSERT ... ON CONFLICT (source_file, chunk_index)
      DO UPDATE` so re-scrapes overwrite cleanly.
3. After inserting, delete rows for files no longer in the kept list (cleanup
   on rescrape).
4. Print summary: files processed, chunks added/updated/skipped, total tokens.

Add an npm script:

```json
"rturn:ingest": "tsx scripts/rturn/ingest.ts"
```

## 5. API route

New file: `app/api/rturn-chat/route.ts`. Mirrors `career-chat` but swaps the
"load whole file" step for retrieval.

Per request:
1. Validate `message` (same validation as `career-chat`).
2. Embed the user's message with the chosen provider.
3. `SELECT ... ORDER BY embedding <=> $1 LIMIT 8` (cosine distance).
4. Build context string by concatenating retrieved chunks with their
   `[source_title](source_url)` headers — so the model sees provenance.
5. Stream from Anthropic with `system` = `data/rturn-prompt.md`,
   user message = `data/rturn-user-message.md` template with
   `{{context}}` + `{{message}}`.
6. (Optional) Emit retrieved chunk metadata as the first chunk of the stream
   (JSON line + `\n`) so the UI can render citations.
7. Reuse the existing `logQuestion` analytics path — add a `source` value like
   `"rturn"` or extend the schema with a `surface` column if you want to
   distinguish surfaces in analytics.

## 6. Prompts

New files:
- `data/rturn-prompt.md` — system prompt. Establish persona ("knowledgeable
  Philadelphia tenant-rights assistant grounded in TURN's published
  materials"), refusal posture for non-grounded questions, instruction to
  cite the source title/URL when answering, and a hard rule that legal
  guidance must point users toward TURN's clinics rather than substitute for
  counsel. Include 2–3 few-shot examples like `data/prompt.md` does.
- `data/rturn-user-message.md` — template with `{{context}}` and `{{message}}`,
  explicit instruction to answer only from `{{context}}` and to say "I don't
  have that information" otherwise.

## 7. Frontend

Cheapest path: new route `app/rturn/page.tsx` that mounts
`components/ui/career-chat.tsx` with props for endpoint + placeholder copy.
That likely requires adding an `endpoint` (and prompt-pack) prop to
`career-chat.tsx` rather than hardcoding `/api/career-chat` — small refactor.

If citations are wanted in the UI, fork the component into
`components/ui/rturn-chat.tsx` and parse the leading metadata frame from the
stream. Render sources as a small list under each assistant message.

Decide whether the landing page advertises this surface or it stays a
deep-link.

## 8. Testing

- `scripts/rturn/ingest.test.ts` — pure-function tests for the chunker
  (heading split, overlap, hash stability). No DB.
- `app/api/rturn-chat/route.test.ts` — mock Anthropic SDK, mock the SQL
  client (return canned chunks), assert prompt assembly + streaming behavior,
  same shape as `career-chat/route.test.ts`.

## 9. Environment variables

Add to README/CLAUDE.md once implemented:

- `VOYAGE_API_KEY` (or `OPENAI_API_KEY`) — embedding provider.
- `RTURN_TOP_K` (optional, default `8`) — retrieval depth.
- `RTURN_EMBED_MODEL` (optional) — pin the embedding model name.
- Reuses existing `DATABASE_URL`, `ANTHROPIC_API_KEY`, `LLM_MODEL`.

## 10. Operational notes

- **Re-ingestion**: rerun `pnpm rturn:ingest` whenever the scraped corpus
  changes. The hash check + ON CONFLICT means it's safe to run repeatedly.
- **Cost ballpark**: ~60 files × est. 4–10 chunks each ≈ 300–600 chunks.
  One-time embed cost is sub-cent on either provider. Per-query embed +
  retrieval is negligible; the dominant cost is the Anthropic generation.
- **Eval (later)**: keep a small `scripts/rturn/eval.ts` with a curated list
  of question→expected-source pairs to sanity-check retrieval after content
  updates.

## 11. Build order (suggested)

1. Decide §1 (embedding provider + citations yes/no).
2. Schema migration (§3).
3. Chunker + ingest script with tests (§4).
4. API route + prompts with unit tests (§5, §6).
5. Frontend wiring (§7).
6. Manual QA against a handful of representative questions
   ("what are my rights if my landlord won't make repairs?", "how do
   eviction defense clinics work?", "is good cause eviction the law?").
7. Document env vars and the `pnpm rturn:ingest` step in `CLAUDE.md`.
