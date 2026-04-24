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

This is a **Next.js 15 (App Router)** personal portfolio with an AI-powered career chat feature.

### Pages

- `/` — Landing page with header, hero section (name, tagline, quick-ask chips, text input that routes to `/chat`), and footer
- `/chat` — Full AI chat interface; accepts `?question=` query param for deep-linking from the hero

### AI Chat Pipeline

The chat passes resume data directly to the LLM as context:

1. `data/career.md` — Source of truth: resume content in Markdown, read directly as context
2. `app/api/career-chat/route.ts` — POST endpoint that:
   - Reads `data/career.md` and passes the full content as context to the LLM
   - Sends context to the LLM (`claude-sonnet-4-6` by default, configurable via `LLM_MODEL` env var)
   - Loads system prompt from `data/prompt.md` and user message template from `data/user-message.md`
   - Streams the response using Anthropic SDK (`anthropic.messages.stream`)
3. `components/ui/career-chat.tsx` — Client component that renders the chat UI, streams tokens into state, and renders with `react-markdown`

### Data Files

- `data/career.md` — Resume content (used directly as LLM context)
- `data/prompt.md` — System prompt for the LLM, including few-shot examples
- `data/user-message.md` — User message template with `{{context}}` and `{{message}}` placeholders

### Environment Variables

- `ANTHROPIC_API_KEY` — Required for the chat API
- `LLM_MODEL` — LLM to use (default: `claude-sonnet-4-6`)

### Key Components

- `components/starfield-background.tsx` — Canvas-based animated starfield with mouse-repulsion effect; rendered fixed behind all content via `layout.tsx`
- `components/header.tsx` — Fixed top nav with desktop/mobile menu and theme toggle; links to Home and AI Assistant
- `components/hero-section.tsx` — Landing section with chat input; navigates to `/chat?question=...`
- `components/footer.tsx` — Page footer
- `lib/utils.ts` — `cn()` (tailwind class merging) and `handleScroll()` (smooth scroll input into view on mobile focus)

### API Routes

- `app/api/career-chat/route.ts` — POST: AI chat streaming endpoint using full career.md context
- `app/api/now-playing/route.ts` — GET: Spotify currently-playing / recently-played endpoint (shapes track, falls back, caches)

### Testing

Vitest (`pnpm test`) with tests co-located next to the route:

- `app/api/career-chat/route.test.ts` — Unit tests for the career chat API (mocks Anthropic SDK and `node:fs`)

### Styling

Tailwind CSS v4, shadcn/ui components (`components/ui/`), dark mode default via `next-themes`. Color scheme uses emerald/green accents (`green-800`, `rgba(16, 185, 129, ...)`).

### Data Flow: Updating Resume Content

When `data/career.md` changes, the updated content is used automatically on the next request — no rebuild step needed.
