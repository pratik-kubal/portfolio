// app/api/career-chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Vec = { id: number; text: string; embedding: number[] };
let corpus: Vec[] | null = null;

function loadCorpus(): Vec[] {
  if (!corpus) {
    const p = path.resolve("data/career_vectors.json");
    corpus = JSON.parse(fs.readFileSync(p, "utf8"));
  }
  return corpus!;
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
    model: "text-embedding-3-small",
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
  const { message, history = [] } = await req.json() as {
    message: string;
    history?: { role: "user"|"assistant"; content: string }[];
  };

  const top = await retrieve(message, 6);
  const context = top.map(d => d.text).join("\n\n---\n\n");

  // Guardrail: only answer from provided context; say "not sure" otherwise
  const system = `You are a concise career Q&A assistant for Pratik Kubal.
Only use the 'Context' to answer questions. If the answer isn't in Context, say I'll have to ask him, you don't know.
Prefer bullet points and concrete metrics when available.`;

  const userPrompt =
`Context:
${context}

User question: ${message}`;

  // Stream a response using the Responses API
  const responseStream = openai.responses.stream({
    model: "gpt-5",                    // or gpt-4.1 if you prefer
    input: [
      { role: "system", content: system },
      ...history,
      { role: "user", content: userPrompt },
    ],
  });

  // Convert the OpenAI response stream to a ReadableStream
  const readable = new ReadableStream({
    async pull(controller) {
      for await (const chunk of responseStream) {
        controller.enqueue(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
      }
      controller.close();
    }
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
