// app/api/bella/route.ts
// Bella — the recruiter chat assistant. Server-only Claude API streaming, grounded
// in data/career.md + data/bella-prompt.md.
import { NextRequest, after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { logQuestion, type QuestionSource } from "@/lib/db/log-question";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

const KNOWN_SOURCES: ReadonlySet<QuestionSource> = new Set([
  "typed",
  "chip",
  "deeplink",
  "highlight",
  "unknown",
]);

const MAX_MESSAGE_LEN = 2000;
// Bound the client-supplied history: prior turns are forwarded verbatim to Claude,
// so cap both how many we keep and how long each one can be to limit token cost.
const MAX_HISTORY_TURNS = 12;
const MAX_HISTORY_CONTENT_LEN = 4000;
const MAX_QUOTE_LEN = 500;

// The highlighted snippet is visitor-controlled and gets embedded inside a
// triple-quote block in the user turn. Collapse whitespace and squash quote/
// backtick runs so it can't close the block early or fake its own section
// headers (e.g. a newline followed by "[INSTRUCTIONS]").
function sanitizeQuote(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/[`"]{2,}/g, '"')
    .trim()
    .slice(0, MAX_QUOTE_LEN);
}

let careerText: string | null = null;
let bellaPrompt: string | null = null;

function loadCareer(): string {
  if (!careerText) {
    careerText = fs.readFileSync(path.resolve("data/career.md"), "utf8");
  }
  return careerText;
}

function loadBellaPrompt(): string {
  if (!bellaPrompt) {
    bellaPrompt = fs.readFileSync(path.resolve("data/bella-prompt.md"), "utf8");
  }
  return bellaPrompt;
}

function buildUserMessage(
  context: string,
  message: string,
  quote: string | null,
): string {
  const quoteBlock = quote
    ? `\n\n[HIGHLIGHTED TEXT]\nThe visitor highlighted this text on the page and is asking about it:\n"""${quote}"""`
    : "";
  return (
    `[CONTEXT]\n${context}${quoteBlock}\n\n` +
    `[QUESTION]\n${message}\n\n` +
    `[INSTRUCTIONS]\n` +
    `Answer as Bella — about Pratik, in the third person. Ground every claim in the context. ` +
    `Lead with impact and numbers. Use Markdown bullets for lists. Keep it tight. Never use emojis.`
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return new Response("Invalid JSON", { status: 400 });
  }
  const { message, history, sessionId, source, turnIndex, selectedQuote } =
    body as {
      message: unknown;
      history?: unknown;
      sessionId?: unknown;
      source?: unknown;
      turnIndex?: unknown;
      selectedQuote?: unknown;
    };

  if (typeof message !== "string" || !message.trim()) {
    return new Response("Invalid message", { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return new Response("Message too long", { status: 400 });
  }

  const validRoles = new Set(["user", "assistant"]);
  const safeHistory: { role: "user" | "assistant"; content: string }[] = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (
        item &&
        typeof item === "object" &&
        validRoles.has(item.role) &&
        typeof item.content === "string"
      ) {
        safeHistory.push({
          role: item.role,
          content: item.content.slice(0, MAX_HISTORY_CONTENT_LEN),
        });
      }
    }
  }
  const cappedHistory = safeHistory.slice(-MAX_HISTORY_TURNS);

  const safeQuote =
    typeof selectedQuote === "string" && selectedQuote.trim()
      ? sanitizeQuote(selectedQuote)
      : null;

  // Fire-and-forget analytics insert (parallel with the stream, kept alive by after()).
  const safeSessionId =
    typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : null;
  if (safeSessionId) {
    const safeSource: QuestionSource =
      typeof source === "string" && KNOWN_SOURCES.has(source as QuestionSource)
        ? (source as QuestionSource)
        : "unknown";
    const safeTurnIndex =
      typeof turnIndex === "number" && Number.isFinite(turnIndex)
        ? turnIndex
        : safeHistory.length;
    const headers = req.headers;
    const logPromise = logQuestion({
      sessionId: safeSessionId,
      turnIndex: safeTurnIndex,
      question: message,
      source: safeSource,
      selectedQuote: safeQuote,
      model: CLAUDE_MODEL,
      country: headers.get("x-vercel-ip-country"),
      region: headers.get("x-vercel-ip-country-region"),
      ip:
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip"),
      userAgent: headers.get("user-agent"),
    }).catch((err) => {
      console.error("[bella-log] unexpected:", err);
    });
    after(logPromise);
  }

  const context = loadCareer();
  const systemPrompt = loadBellaPrompt();

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...cappedHistory,
      { role: "user", content: buildUserMessage(context, message, safeQuote) },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of claudeStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(event.delta.text);
          }
        }
        controller.close();
      } catch (err) {
        console.error("[bella] stream error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
