// app/api/ucd-faq-chat/route.ts
//
// POST /api/ucd-faq-chat — Claude-powered FAQ chat backend for the
// UCD demo page. Reads the same ANTHROPIC_API_KEY as the rest of the
// portfolio.

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TOPICS, type TopicId } from "@/data/ucd-topics";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are City Desk, the friendly help-desk assistant for University City.
You answer concisely (3–6 short sentences). Prefer the CONTEXT block provided for the
topic the user picked. If the user picked a topic, your answer MUST stay on that topic.
If the user's free-text question doesn't match any topic, answer briefly and suggest the
closest 1–2 chip topics they could pick instead.

If — and only if — the CONTEXT block does not contain the specific information needed to
answer the user's question, use the web_search tool to look it up on universitycity.org.
Do not search when the CONTEXT already covers the answer. When you do cite information
fetched from the web, weave it into the prose naturally; do not paste raw URLs.

Always write in plain prose. Do NOT output Markdown headings, lists, or tables — the
client renders structured UI separately based on topicId. End with a single short
follow-up question only if it would actually help.`;

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
    ? `\n\nTOPIC: ${topic.label}\nCONTEXT: ${topic.context}`
    : "";

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: SYSTEM_PROMPT + topicContext,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 2,
        allowed_domains: ["universitycity.org", "www.universitycity.org"],
      },
    ],
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
