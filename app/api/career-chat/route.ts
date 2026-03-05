// app/api/career-chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";
const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

type Vec = { id: number; text: string; embedding: number[] };
let corpus: Vec[] | null = null;
let promptText: string | null = null;
let userMessageTemplate: string | null = null;

function loadCorpus(): Vec[] {
  if (!corpus) {
    const p = path.resolve("data/career_vectors.json");
    corpus = JSON.parse(fs.readFileSync(p, "utf8"));
  }
  return corpus!;
}

function loadPrompt(): string {
  if (!promptText) {
    promptText = fs.readFileSync(path.resolve("data/prompt.md"), "utf8");
  }
  return promptText;
}

function loadUserMessage(context: string, message: string): string {
  if (!userMessageTemplate) {
    userMessageTemplate = fs.readFileSync(path.resolve("data/user-message.md"), "utf8");
  }
  return userMessageTemplate
    .replace("{{context}}", context)
    .replace("{{message}}", message);
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { 
    dot += a[i] * b[i];
    na += a[i]*a[i];
    nb += b[i]*b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function retrieve(query: string, k = 5) {
  const { data } = await openai.embeddings.create({
    model: embeddingModel,
    input: query
  });
  const q = data[0].embedding;
  const docs = loadCorpus()
    .map(v => ({ ...v, score: cosine(q, v.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  return docs;
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

  const top = await retrieve(message, 6);
  const context = top.map(d => d.text).join("\n\n---\n\n");

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
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(event.delta.text);
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
