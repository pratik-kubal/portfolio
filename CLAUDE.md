# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack at localhost:3000
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run Next.js ESLint

# Regenerate career embeddings (requires OPENAI_API_KEY)
OPENAI_API_KEY=... node scripts/embed-career.js
```

Note: `next.config.mjs` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`, so TypeScript and ESLint errors won't fail builds.

## Architecture

This is a **Next.js 15 (App Router)** personal portfolio with an AI-powered career chat feature.

### Pages
- `/` — Landing page with hero section: name, tagline, quick-ask chips, and a text input that routes to `/chat`
- `/chat` — Full AI chat interface; accepts `?question=` query param for deep-linking from the hero

### AI Chat Pipeline (RAG)
The chat uses **retrieval-augmented generation** against resume data:

1. `data/career.md` — Source of truth: resume content in Markdown
2. `scripts/embed-career.js` — One-time script that chunks `career.md`, calls OpenAI embeddings (`text-embedding-3-small`), and writes `data/career_vectors.json`
3. `app/api/career-chat/route.ts` — POST endpoint that:
   - Embeds the user query and does cosine similarity search against `career_vectors.json`
   - Sends top-6 chunks as context to the LLM (`gpt-4.1` by default, configurable via `LLM_MODEL` env var)
   - Streams the response using OpenAI Responses API (`openai.responses.stream`)
4. `components/ui/career-chat.tsx` — Client component that renders the chat UI, streams tokens into state, and renders with `react-markdown`

### Environment Variables
- `OPENAI_API_KEY` — Required for the chat API and embedding script
- `LLM_MODEL` — LLM to use (default: `gpt-4.1`)
- `EMBEDDING_MODEL` — Embedding model (default: `text-embedding-3-small`)

### Key Components
- `components/starfield-background.tsx` — Canvas-based animated starfield with mouse-repulsion effect; rendered fixed behind all content via `layout.tsx`
- `components/hero-section.tsx` — Landing section with chat input; navigates to `/chat?question=...`
- `lib/utils.ts` — `cn()` (tailwind class merging) and `handleScroll()` (smooth scroll input into view on mobile focus)

### Styling
Tailwind CSS v4, shadcn/ui components (`components/ui/`), dark mode default via `next-themes`. Color scheme uses emerald/green accents (`green-800`, `rgba(16, 185, 129, ...)`).

### Data Flow: Updating Resume Content
When `data/career.md` changes, re-run the embedding script to regenerate `data/career_vectors.json` before deploying.
