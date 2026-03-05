// app/api/career-chat/route.ts
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

let careerText: string | null = null;
let promptText: string | null = null;
let userMessageTemplate: string | null = null;

function loadCareer(): string {
  if (!careerText) {
    careerText = fs.readFileSync(path.resolve("data/career.md"), "utf8");
  }
  return careerText;
}

function loadPrompt(): string {
  if (!promptText) {
    promptText = fs.readFileSync(path.resolve("data/prompt.md"), "utf8");
  }
  return promptText;
}

function loadUserMessage(context: string, message: string): string {
  if (!userMessageTemplate) {
    userMessageTemplate = fs.readFileSync(
      path.resolve("data/user-message.md"),
      "utf8",
    );
  }
  return userMessageTemplate
    .replace("{{context}}", context)
    .replace("{{message}}", message);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, history } = body as {
    message: unknown;
    history?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return new Response("Invalid message", { status: 400 });
  }
  if (message.length > 2000) {
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
        safeHistory.push({ role: item.role, content: item.content });
      }
    }
  }
  // Cap history to last 20 turns to limit token cost
  const cappedHistory = safeHistory.slice(-20);

  const context = loadCareer();

  const systemPrompt = loadPrompt();

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...cappedHistory,
      { role: "user", content: loadUserMessage(context, message) },
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
