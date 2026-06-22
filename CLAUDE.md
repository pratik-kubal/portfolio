# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack at localhost:3000
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run Next.js ESLint
pnpm test         # Run Vitest tests
```

Note: `next.config.mjs` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`, so TypeScript and ESLint errors won't fail builds.

## Architecture

This is a **Next.js 15 (App Router)** personal portfolio. The landing page is the **"v2" design**
(citron-on-warm-paper, three themes, scroll-driven narratives, and **Bella** — an on-page AI chat
assistant). An older "editorial" route (`/ucd-faq-demo`) still exists as a legacy page.

### Pages

- `/` — Single-scroll v2 portfolio (hero with Möbius figure → 3 project narratives → nonprofit →
  about → footer). Accepts `?ask=` (or legacy `?question=`) to deep-link a question into Bella.
- `/privacy`, `/cookies`, `/terms` — v2 legal pages. **Copy is placeholder, pending the owner's
  final text** (see `components/portfolio/legal-layout.tsx`). The earlier detailed privacy text is
  preserved in `components/privacy-policy.tsx`.
- `/ucd-faq-demo` — legacy editorial page (kept working, lower priority).

### v2 Portfolio Design (the landing page)

Recreated from the `design_handoff_portfolio/` handoff. Everything renders inside a `.pk-root`
wrapper whose tokens are **scoped** in `app/globals.css` (so the v2 `--ink`/`--accent`/`--muted`
don't collide with the legacy editorial tokens on `:root`/`.dark`).

- **Theming:** three modes — Light (default), Dark, Noir (`bw`) — swapped by `data-theme` on `<html>`
  via `next-themes` (`attribute={['class','data-theme']}`, `defaultTheme="light"`, system off). The
  `.dark` class is mirrored so legacy pages keep working. Toggle: `components/portfolio/theme-toggle.tsx`.
- **Fonts:** Space Grotesk (display) / Geist (body) / Geist Mono (mono) via `next/font/google`,
  mapped to `--font-display/body/mono` inside `.pk-root` (distinct from the legacy font vars).
- **Copy/data:** all section copy lives in `data/portfolio.ts` (typed `projects[]`, `nonprofit[]`,
  hero/about/footer, the scripted Bella demo, the live widget greeting/chips).
- **Components:** `components/portfolio/` — `portfolio-page.tsx` (client island), `nav.tsx`,
  `hero.tsx`, `mobius-figure.tsx`, `project-section.tsx` + the three vizzes (`ring-viz`,
  `paper-stack-viz`, `bella-demo-conversation`), `nonprofit.tsx`, `about.tsx`, `site-footer.tsx`
  (+ `spotify-card.tsx`), `scroll-spine.tsx`, `bella-widget.tsx`, `highlight-to-ask.tsx`.
- **Motion** (`lib/portfolio/`): ported from the handoff's rough.js/anime.js logic into `useEffect`
  hooks. `engines.ts` lazy-loads `animejs`+`roughjs` (npm, not CDN). `use-ring-narrative`,
  `use-paper-stack`, `use-bella-demo-scrub`, `use-highlight-demo`, `use-section-fades` each tie a
  single headline-derived scroll progress to a count-up + viz + caption so they land on one frame.
  A pre-paint `data-motion="on"` gate (in `layout.tsx`) hides only the animated bits; `prefers-
  reduced-motion` and no-JS fall back to the final visual state.

### Bella (on-page AI assistant)

`bella-widget.tsx` is a fixed lower-right chat widget (collapsed pill ↔ panel, starter chips, streamed
replies, graceful error state). `highlight-to-ask.tsx` lets a visitor select ≥4 chars of page text →
"Ask Bella about this" popover → opens Bella prefilled with `Tell me more about: "…"`.

- `app/api/bella/route.ts` — server-only streaming Route Handler:
  Anthropic `messages.stream()` → `ReadableStream` of text deltas, grounded in `data/career.md` +
  `data/bella-prompt.md` (Bella's third-person recruiter-assistant persona). Accepts `selectedQuote`
  and a `"highlight"` source; logs via `after(logQuestion(...))`.

### Data Files

- `data/career.md` — Resume content; the LLM context for Bella (`/api/bella`)
- `data/bella-prompt.md` — System prompt for `/api/bella` (Bella's third-person assistant persona)
- `data/portfolio.ts` — Typed copy/data for the v2 landing page
- `data/resume-kit-context.md` — Authoring notes for consolidating resume-kit content into `career.md`

### Environment Variables

- `ANTHROPIC_API_KEY` — Required for the chat API
- `LLM_MODEL` — LLM to use (default: `claude-sonnet-4-6`)
- `DATABASE_URL` — Neon Postgres connection string. Optional: when unset, the question-analytics logger silently no-ops so local dev keeps working.
- `IP_HASH_SALT` — Random secret used to salt SHA-256 hashes of visitor IPs before they're stored. When unset, `ip_hash` is left null (the raw IP is never persisted either way).

### Question Analytics

Every inbound user message to `/api/bella` is captured to the `chat_questions` table in Neon. The
insert is fire-and-forget via Next.js `after()` so it runs in parallel with the LLM stream and never
blocks the response.

- `lib/db/schema.sql` — DDL for `chat_questions` (incl. `selected_quote`). Apply with
  `pnpm db:migrate` (idempotent — re-runs are safe). **Run this after pulling so the
  `selected_quote` column exists.**
- `lib/db/client.ts` — Lazy Neon HTTP client; returns null if `DATABASE_URL` is unset.
- `lib/db/log-question.ts` — Sanitizes the question, hashes the IP, normalizes UA, and inserts. Never
  throws. Sources: `typed` / `chip` / `deeplink` / `highlight` / `unknown`; `selectedQuote` is the
  optional highlight-to-ask text.

Bella generates a UUID `sessionId` once per browser (localStorage: `bella:session-id`) and tags every
request with `source` and `turnIndex` so multi-turn conversations can be reconstructed.

### Key Components

The v2 landing-page components live in `components/portfolio/` (see "v2 Portfolio Design" above).
Legacy editorial components that still serve `/ucd-faq-demo`: `ucd-faq-page.tsx`,
`force-light-theme.tsx`, `components/ui/button.tsx`. `mailto-link.tsx` is used by
`components/privacy-policy.tsx`. `theme-provider.tsx` wraps next-themes in `layout.tsx`.
`lib/utils.ts` — `cn()` + `handleScroll()`. (`components/privacy-policy.tsx` is the old detailed
privacy copy, kept as a source for the final legal pages.)

### API Routes

- `app/api/bella/route.ts` — POST: Bella's streaming assistant (career.md + bella-prompt.md context)
- `app/api/now-playing/route.ts` — GET: Spotify currently-playing / recently-played (shapes track,
  falls back, caches). The v2 footer `spotify-card.tsx` consumes this, with a static design fallback.
- `app/api/ucd-faq-chat/route.ts` — POST: chat for the legacy `/ucd-faq-demo`.

### Testing

Unit tests via Vitest (`pnpm test`), co-located with the code:

- `app/api/bella/route.test.ts` — Bella API (mocks Anthropic SDK, `node:fs`, `after`, the logger)
- `lib/db/log-question.test.ts` — analytics logger (incl. `selected_quote` / `highlight`)
- `app/sitemap.test.ts`, `app/robots.test.ts` — metadata routes

E2E via Playwright (`pnpm test:e2e`, kept out of `pnpm test`): `e2e/portfolio.spec.ts` covers theme
swap, Bella open, highlight-to-ask, and the legal pages. First run needs `npx playwright install`.

### Styling

Tailwind CSS v4. The v2 design is hand-authored CSS scoped under `.pk-root` in `app/globals.css`
(signature citron `#C7DD3A` accent, `data-theme` three-mode swap, hard `3px 3px 0` block shadows).
Legacy editorial/UCD styles remain in the same file under their own scopes.

### Data Flow: Updating Resume Content

When `data/career.md` changes, the updated content is used automatically on the next request — no rebuild step needed.
