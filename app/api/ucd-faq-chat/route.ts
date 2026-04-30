// app/api/ucd-faq-chat/route.ts
//
// POST /api/ucd-faq-chat — Claude-powered FAQ chat backend for the
// UCD demo page. Reads the same ANTHROPIC_API_KEY as the rest of the
// portfolio.

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { TOPICS, type TopicId } from "@/data/ucd-topics";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

let knowledgeBase: string | null = null;

function loadKnowledgeBase(): string {
  if (!knowledgeBase) {
    knowledgeBase = fs.readFileSync(
      path.resolve("data/ucd-knowledge.md"),
      "utf8",
    );
  }
  return knowledgeBase;
}

const SYSTEM_PROMPT = `You are City Desk, the friendly help-desk assistant for University City District (UCD).
You answer concisely (3–6 short sentences).

A KNOWLEDGE BASE block scraped from universitycity.org is included below. Use it as the
authoritative source for any UCD facts, programs, events, staff, transportation, or
neighborhood resources. If a TOPIC CONTEXT block is also provided, treat it as a hint
about which area of the knowledge base the user is most interested in — start there, but
freely draw on the rest of the KNOWLEDGE BASE whenever it helps answer the question more
fully. The user is not locked into the picked topic; if their message takes the
conversation somewhere else, follow it.

Do not fabricate information that is not present in the KNOWLEDGE BASE or TOPIC CONTEXT.
If the answer truly isn't there, say so briefly and point the user to universitycity.org
or the most relevant page from the knowledge base.

Always write in plain prose. Do NOT output Markdown headings, lists, or tables — the
client renders structured UI separately based on topicId. Weave any URLs into prose
naturally; do not paste raw URL lists. End with a single short follow-up question only
if it would actually help.`;

const MAX_MESSAGE = 500;
const MAX_HISTORY = 8;

const ALLOWED_TOPIC_IDS = new Set<string>(TOPICS.map((t) => t.id));

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const {
    message,
    topicId,
    history,
  } = body as {
    message?: unknown;
    topicId?: unknown;
    history?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return new Response("Invalid message", { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return new Response(`Message exceeds ${MAX_MESSAGE} chars`, {
      status: 400,
    });
  }

  let safeTopicId: TopicId | null = null;
  if (typeof topicId === "string" && ALLOWED_TOPIC_IDS.has(topicId)) {
    safeTopicId = topicId as TopicId;
  }

  const validRoles = new Set(["user", "assistant"]);
  const safeHistory: { role: "user" | "assistant"; content: string }[] = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (
        item &&
        typeof item === "object" &&
        validRoles.has((item as { role?: unknown }).role as string) &&
        typeof (item as { content?: unknown }).content === "string"
      ) {
        const m = item as { role: "user" | "assistant"; content: string };
        safeHistory.push({ role: m.role, content: m.content });
      }
    }
  }
  const cappedHistory = safeHistory.slice(-MAX_HISTORY);

  const topic = safeTopicId
    ? TOPICS.find((t) => t.id === safeTopicId)
    : null;
  const topicContext = topic
    ? `\n\nTOPIC: ${topic.label}\nTOPIC CONTEXT: ${topic.context}`
    : "";

  const knowledge = `\n\nKNOWLEDGE BASE (universitycity.org, April 2026):\n${loadKnowledgeBase()}`;

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: SYSTEM_PROMPT + topicContext + knowledge,
    messages: [
      ...cappedHistory,
      { role: "user", content: message },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of claudeStream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(event.delta.text);
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
