// app/api/rturn-chat/route.ts
//
// POST /api/rturn-chat — Claude-powered chat backend for the TURN
// (Tenant Union Representative Network) concept widget at /rturn.
// Grounds answers in the scraped rturn.net markdown corpus under
// data/rturn-net/.

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

const MAX_MESSAGE = 1000;
const MAX_HISTORY = 12;

// Navigation/planning files that aren't tenant-facing content.
const SKIP_FILES = new Set(["PLAN.md"]);

let knowledgeBase: string | null = null;

function loadKnowledgeBase(): string {
  if (knowledgeBase) return knowledgeBase;
  const dir = path.resolve("data/rturn-net");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !SKIP_FILES.has(f))
    .sort();
  const sections = files.map((file) => {
    const body = fs.readFileSync(path.join(dir, file), "utf8").trim();
    return `--- ${file} ---\n${body}`;
  });
  knowledgeBase = sections.join("\n\n");
  return knowledgeBase;
}

const SYSTEM_PROMPT = `You are TURN, the friendly online advocate for the Tenant Union Representative Network — a Philadelphia non-profit that helps tenants understand their rights and connect with help.

Tone: warm, plain English, in the moment. Imagine a tenant texting you under stress. Keep replies short (2–5 sentences). Light Markdown is fine — use **bold** for the key phrase the reader most needs to see, *italics* for gentle emphasis, and short bulleted lists only when the answer is genuinely a list of items. Do NOT use Markdown headings.

A KNOWLEDGE BASE block scraped from rturn.net is included below. Treat it as the authoritative source for any facts about TURN's services, clinics, programs, rights guidance, hours, contact info, and Philadelphia tenant law. Do not fabricate information that is not present in the KNOWLEDGE BASE.

If the user's question can't be answered from the KNOWLEDGE BASE, say so briefly and point them toward TURN directly (a clinic, the hotline, or rturn.net). Never give legal advice that would substitute for an attorney — when something is clearly legal-advice territory, encourage them to talk to TURN or attend an eviction-defense clinic.

End most replies with one short follow-up question that helps you understand the tenant's situation, unless the user has signalled they're done.`;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { message, history } = body as {
    message?: unknown;
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
  // Anthropic requires the conversation to start with a user turn. Strip any
  // leading assistant messages (e.g. an initial UI greeting that leaked through).
  while (cappedHistory.length > 0 && cappedHistory[0].role !== "user") {
    cappedHistory.shift();
  }

  const knowledge = `\n\nKNOWLEDGE BASE (rturn.net, scraped 2026):\n${loadKnowledgeBase()}`;

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: SYSTEM_PROMPT + knowledge,
    messages: [...cappedHistory, { role: "user", content: message }],
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
