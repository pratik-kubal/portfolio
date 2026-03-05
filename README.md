# Portfolio

Personal portfolio site with an AI-powered career assistant. Ask it anything about my background, experience, or skills — it answers by reasoning over my actual resume content in real time.

**Live:** [pratik-kubal.com](https://pratik-kubal.com) <!-- update if needed -->

---

## What it does

- **Landing page** — Hero section with suggested question chips and a freeform input that deep-links directly into the chat (`/chat?question=...`)
- **AI career chat** — Streaming chat interface backed by Claude (Anthropic). The full resume is injected as context on every request, so answers are grounded in real data rather than fine-tuned guesses
- **Animated starfield** — Canvas-based background with per-star twinkling and a mouse-repulsion physics effect; stars smoothly lerp back to their origin positions

---

## Technical highlights

### Streaming AI pipeline

The chat endpoint (`app/api/career-chat/route.ts`) constructs a `ReadableStream` directly from the Anthropic SDK's async-iterable stream, forwarding only `text_delta` events to the client. This keeps the server response lean and lets the UI render tokens as they arrive with no polling or buffering.

### Input validation at the boundary

The API validates and sanitizes every field before it touches the LLM:

- Message type and length are checked (rejects non-strings and messages over 2 000 characters)
- Conversation history is rebuilt from scratch — only items with a whitelisted role (`user` | `assistant`) and a string `content` pass through
- History is capped at 20 turns to bound token cost

### Data-driven content

Resume content lives in `data/career.md` and is read at runtime, so updating your resume takes effect on the next request — no rebuild, no redeploy. The system prompt and user-message template are likewise file-driven, making the LLM behavior easy to iterate on independently of the application code.

### Configurable model

The LLM model defaults to `claude-sonnet-4-6` but is overridable via `LLM_MODEL` env var — useful for swapping to a cheaper or faster model in staging without touching code.

### Tested streaming logic

Unit tests (`route.test.ts`) use Vitest with hoisted mocks to verify the full streaming contract: correct `Content-Type`, multi-chunk concatenation, history passthrough, system prompt injection, template rendering, and filtering of non-text delta events. The mock implements `Symbol.asyncIterator` to match the SDK's actual interface.

---

## Stack

| Layer           | Choice                              |
| --------------- | ----------------------------------- |
| Framework       | Next.js 15 (App Router) + React 19  |
| Language        | TypeScript                          |
| Styling         | Tailwind CSS v4, shadcn/ui          |
| AI              | Anthropic SDK (`claude-sonnet-4-6`) |
| Testing         | Vitest                              |
| Package manager | pnpm                                |
| Dev server      | Turbopack                           |

---

## Running locally

```bash
# Install dependencies
pnpm install

# Add your Anthropic key
cp .env.local.example .env.local   # then fill in ANTHROPIC_API_KEY

# Start dev server
pnpm dev          # http://localhost:3000

# Run tests
pnpm test

# Production build
pnpm build && pnpm start
```

### Environment variables

| Variable            | Required | Default             | Description                   |
| ------------------- | -------- | ------------------- | ----------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | —                   | Anthropic API key             |
| `LLM_MODEL`         | No       | `claude-sonnet-4-6` | Model to use for the chat API |

---

## Project structure

```
app/
  api/
    career-chat/
      route.ts        # Streaming POST endpoint
      route.test.ts   # Unit tests
    contact/
      route.tsx       # Contact form handler
  (pages)/
    page.tsx          # Landing / hero
    chat/page.tsx     # Chat interface
components/
  starfield-background.tsx   # Canvas animation with mouse physics
  hero-section.tsx
  header.tsx
  ui/                        # shadcn/ui primitives
data/
  career.md           # Resume content (LLM context)
  prompt.md           # System prompt
  user-message.md     # User message template
```
