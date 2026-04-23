# Resume Kit Context

Reference for content imported from [pratik-kubal/claude-resume-kit](https://github.com/pratik-kubal/claude-resume-kit). When files from that repo are pasted into `data/` (or referenced in `career.md`), use this document to interpret them. **Do not re-clone or re-read the upstream repo** — everything needed is here.

---

## What the kit is

A JD-tailored resume/cover-letter generator. The core loop:

1. **Extract once** from papers/projects → structured `extraction` files.
2. **Build a knowledge base** → per-position `experience` files + per-role-type `bundle` files.
3. **Per JD**: pick a bundle, build a `session` file, emit LaTeX, then `critique`.

All outputs are `.tex` (compiled locally). The kit is Claude-Code-native; its skills (`/setup-extract`, `/setup-build-kb`, `/make-resume`, `/make-cl`, `/edit-resume`, `/critique`) live in `.claude/skills/`. In this portfolio we only consume the **data artifacts**, not the skills themselves.

---

## File types that may appear in `data/`

| File pattern | Origin | What it contains |
|---|---|---|
| `career.md` | already here | Master consolidated resume (source of truth for the chat) |
| `experience_<name>.md` | kit `resume_builder/experience/` | One file per position. Achievements with source, methods, metrics, pre-written bullets |
| `bundle_<role_type>.md` | kit `resume_builder/bundles/` | Per-target-audience positioning guide (S1–S5 sections) |
| `extraction_<paper>.md` | kit `knowledge_base/extractions/` | Structured paper/project extraction with provenance |
| `config.md` | kit root `config.md` | Personal info, provenance flags, role-type decision tree, KB corrections |
| `session_<job>.md` | kit `output/<folder>/` | Per-JD state: analysis, bullet plan, critique scores |
| `ai_fingerprint_rules.md` | kit `resume_builder/support/` | Banned-word/anti-pattern list for human-sounding output |

Treat `career.md` as the **flattened, human-readable master**; the kit files are the **structured sources** that back it.

---

## Experience file schema

One H1 per position. Each achievement block looks like:

```
### <ID>: <Short title>
**Source:** <citation or "Internal infrastructure project (unpublished)">
**Methods:** <tools/techniques, comma-separated>
**Quantitative:** <metrics>
**Bullet (2L):** <2-line resume-ready bullet, LaTeX-escaped>
**Bullet (3L):** <3-line CV-ready variant>
**Tags:** <role-type tags, e.g. academic, industry_rd>
**Significance:** <why this matters; cover-letter fuel>
```

- IDs are position-scoped (e.g. `L1`–`L6` for postdoc, `P1`–`P5` for PhD). They are stable handles used in bundle priority matrices.
- Each position may start with a **Cross-Position Themes** block — short narrative arcs for cover letters.
- Bullets already have LaTeX math escapes (`$\times$`, `$^\circ$C`, `\%`). Do not re-escape when rendering in markdown UIs; prefer plaintext versions if quoting on the web.

## Bundle file schema

One file per target role type. Fixed section headers:

- **S1: Role Profile** — target employers, what they value (ranked list), positioning strategy, differentiation angle.
- **S2: Summary Guide** — tagline pattern, summary building blocks, do's/don'ts.
- **S3: Achievement Reframing Map** — a priority matrix of achievement IDs (from experience files) with rationale and reframing notes. Priority tiers: `must` / `strong` / `if room`.
- **S4: Skills Guide** — bold vs. include vs. omit; grouping strategy (e.g. 5 named groups).
- **S5: Cover Letter Guide** — opening hook options, paragraph templates, anti-patterns.

Bundles **reference** experience achievements by ID (e.g. "L1", "L4"); they do not duplicate bullet text.

## Extraction file schema

One per paper/project. Sections:

- **Metadata** — authors, year, journal, DOI, author position, status, citations.
- **Methods & Tools** — full stack used.
- **Key Results (with numbers)** — quantitative outcomes.
- **Collaboration & Scope** — PI, collaborators, user's specific role.
- **Provenance** — publication status, peer review notes, **claiming rules** (FULL / SHARED / NO ownership buckets), safe verbs, unsafe claims.
- **Resume Bullet Seeds** — STAR-formatted raw material that feeds the experience file.

Extractions are the **truth layer**; experience bullets are derived from them, and anything not in an extraction should not appear in output.

## Config file schema

`config.md` holds:

- **Personal Info** — name, email, phone, links, work auth.
- **Document Preferences** — page counts, bullet variant (`2L`, `3L`, or mix), skills layout config (e.g. `4-3-2-2-2`).
- **Provenance Flags** — table: item → status → correct framing (e.g. "under review at X — never say published").
- **KB Corrections Log** — verified errors never to re-introduce (e.g. "Spearman is 0.82, not 0.85").
- **Role Types** — tier 1/2/3 with bundle file mapping.
- **Role-Type Decision Tree** — JD keywords → primary/secondary profile.
- **FIXED Sections** — template sections never modified per JD (Education, Publications, Awards, header).
- **Output Rules** — email to use, package format.

---

## Vocabulary and conventions

### Bullet variants
- `2L` = targets two rendered lines in the LaTeX resume class. Shorter.
- `3L` = three rendered lines. Used in CVs or when a bullet warrants depth.
- "Rendered lines" ≠ source lines. Character budgets come from `resume_builder/helpers/char_count.py`.

### Tags on achievements
Lowercase snake_case, match role-type keys (e.g. `academic`, `industry_rd`). An achievement's tag list determines which bundles may select it.

### Provenance statuses
`published` · `under review` · `unpublished` (internal) · `preprint`. These gate which verbs and framings are allowed — see anti-fabrication rules below.

### STAR bullet seeds
Situation / Task / Action / Result. Lives inside extractions; gets compressed into the `Bullet (2L/3L)` fields on experience files.

### Priority hierarchy (hard rule)
**Accuracy > Relevance > Impact > ATS > Brevity.** Any ambiguity resolves up this chain.

### Verb discipline
- **Full-ownership verbs** (Developed, Built, Engineered, Designed) — only for solo/lead work.
- **Hedged verbs** (Contributed, Co-developed, Supported, Provided) — for shared or contributing-author work.
- When in doubt, hedge.

### Anti-fabrication rules (override everything)
- Never claim unpublished work is published.
- Never claim internal tools are peer-reviewed.
- Never inflate author position.
- Never claim collaborators' experimental results as the user's own.
- No LOC counts or test counts in output.
- Institutional funding is not a personal award.
- Publications use `et al.` after the user's position; if ≤4 authors total, list all.

### LaTeX conventions (if rendering `.tex`)
Templates load `mhchem`:
- Chemical formulas: `\ce{H2O}` not `H$_2$O`.
- "Approximately": `$\sim$64` — raw `~` is a non-breaking space, not a tilde.
- Greek: `$\beta$`, `$\alpha$`.
- Em-dashes: max 2 per full document; prefer commas/semicolons/parens for mid-bullet breaks.

### AI fingerprint avoidance
Output must avoid the kit's banned-word list (loaded from `ai_fingerprint_rules.md` when present). Typical watchouts: *leverage, utilize, spearheaded, cutting-edge, innovative, passionate, seamless, dive deep, unlock, empower*. Prefer concrete verbs + numbers.

---

## Session file (only if present)

A session file is per-JD generation state. Key sections: JD Info, JD Analysis (requirements/ATS keywords/gaps), Company Context, Framing Strategy, Cover Letter Plan, Bullet Plan (table per position with achievement IDs and variant choices), Output Files, Critique Summary, Edit History, Status.

If a session file is pasted in, it is **read-mostly context** — don't regenerate its contents, but you can quote bullet plans or critique scores.

---

## How this relates to `career.md`

`data/career.md` is the flattened master used as LLM context for the career chat. It already contains consolidated bullets, averaged metrics, role-positioning table, and metrics table. If new experience/bundle/extraction files are pasted into `data/`:

1. They **augment** `career.md` — they do not replace it.
2. When answering recruiter questions, prefer specifics from an imported `extraction_*.md` over the consolidated bullet in `career.md` (extractions are the truth layer).
3. Provenance flags in `config.md` override anything in `career.md` if they conflict (e.g. if career.md says "published" but config flags "under review", trust config).
4. The KB Corrections Log in `config.md` is authoritative for any numeric discrepancy.

---

## Quick lookup: "if I see X, it's a Y"

| Signal | File type |
|---|---|
| `### L1:`, `### P3:` with **Bullet (2L):** / **Bullet (3L):** | experience file |
| `## S1: Role Profile` through `## S5: Cover Letter Guide` | bundle file |
| `## Provenance` + `## Resume Bullet Seeds` + STAR blocks | extraction file |
| `## Provenance Flags` + `## Role-Type Decision Tree` | config.md |
| `## JD Analysis` + `## Bullet Plan` + Status checklist | session file |
| `## Banned Words` / `## Anti-Patterns` | ai_fingerprint_rules.md |
