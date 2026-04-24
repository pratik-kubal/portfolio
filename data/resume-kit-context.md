# Resume Kit Context

Reference for content imported from [pratik-kubal/claude-resume-kit](https://github.com/pratik-kubal/claude-resume-kit). When kit files are pasted into `data/`, use this document to interpret them and re-consolidate them into `data/career.md`. **Do not re-clone or re-read the upstream repo** — everything needed to consume the data here is below.

This portfolio only consumes the **data artifacts** of the kit. It does not run the kit's resume-generation skills (`/setup-extract`, `/setup-build-kb`, `/make-resume`, etc.) and does not render LaTeX. So this doc deliberately omits LaTeX conventions, bundle / session / extraction schemas, AI-fingerprint rules, and bullet-variant (2L/3L) rendering rules — those are only relevant inside the kit itself.

---

## How content flows in this repo

1. The kit produces structured per-position files in `data/experience/` (e.g. `experience_dmt_swe1.md`).
2. Those files are flattened and consolidated into `data/career.md`.
3. `data/career.md` is the **only** file the chat reads. It is the entry point and the source of truth for the LLM.
4. The experience files persist as the structured backing layer — if the chat ever drifts from them, the experience files win.

When new experience files are added to `data/experience/`, re-consolidate them into `data/career.md` using the conventions below.

---

## Experience file schema (what to expect in `data/experience/`)

One H1 per position. Each achievement block looks like:

```
### <ID>: <Short title>
**Source:** <which resumes this came from>
**User's role:** <sole / lead / contributor / assisted / mentor / etc.>
**Context:** <one-paragraph background>
**Bullet variants:** <1L / 2L / 3L resume-ready bullets — pick the longest that fits when consolidating>
**Key skills:** <tools / techniques>
**ATS keywords:** <for resume tailoring — ignore for chat>
**Reframing notes:** <per-role-type guidance — ignore for chat>
```

When consolidating into `career.md`:

- Use the **3L** variant if present (most detail), else 2L. Strip LaTeX escapes (`$\times$` → `×`, `$\sim$` → `~`, `\%` → `%`).
- Drop ATS keywords and reframing notes — they're for resume tailoring, not chat answers.
- Preserve the **User's role** semantically (sole developer / led / assisted) — it gates verb choice.
- Each position may start with a **Cross-Position Section** — short narrative arc useful for the role's intro paragraph in `career.md`.

---

## Rules that always apply (chat or resume)

### Priority hierarchy
**Accuracy > Relevance > Impact > ATS > Brevity.** Any ambiguity resolves up this chain.

### Verb discipline
- **Full-ownership verbs** (Developed, Built, Engineered, Designed, Led) — only when the user was solo or the lead.
- **Hedged verbs** (Contributed to, Co-developed, Supported, Assisted, Helped) — for shared or contributing-author work.
- When in doubt, hedge. The experience file's `User's role` field is authoritative.

### Anti-fabrication rules (override everything)
- Never claim unpublished work is published.
- Never claim internal tools are peer-reviewed.
- Never inflate author position or ownership beyond what the source states.
- Never claim collaborators' results as the user's own.
- No LOC counts or test counts unless they appear in the source.
- Institutional funding is not a personal award.
- Don't invent dates, employers, projects, education details, or metrics. If something isn't in the source files, the chat should say "I don't have that info yet."

### Provenance statuses (if present in any imported file)
`published` · `under review` · `unpublished (internal)` · `preprint`. These gate which verbs and framings are allowed — see anti-fabrication rules above.

### Duplicate work
The same body of work sometimes appears under two names across different resumes (e.g. "Self-Service React Micro-Frontend" and "Rules Based Document Classification System" are the same project). When consolidating, fold them into one entry — never double-count metrics.

---

## How this relates to `career.md`

- `data/career.md` is the **flattened, human-readable master** the chat consumes.
- The experience files are the **structured truth layer**.
- If a numeric or factual conflict surfaces between `career.md` and an experience file, **the experience file wins** — update `career.md` to match.
- If a `config.md` is later imported (it isn't currently), its **Provenance Flags** and **KB Corrections Log** would override both — but treat that as a future case, not a current one.
