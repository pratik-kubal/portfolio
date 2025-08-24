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
Only use the 'Context' to answer questions. The context is simplified, so you have to reframe it in your own words for a recuriter audience.
Use Markdown formatting.
If the answer isn't in Context, say I don't know.
Keep the conversation going`;

  const userPrompt =
`Context:
${context}

User question: ${message}`;

  // Stream a response using the Responses API
  // const response = openai.responses.stream({
  //   model: "gpt-4.1",                    // or gpt-4.1 if you prefer
  //   input: [
  //     { role: "system", content: system },
  //     ...history,
  //     { role: "user", content: userPrompt },
  //   ],
  //   stream: true
  // });
  let response = [
    { type: "response.content_part", part: { text: "This is a placeholder response. The Responses API is not yet available to the public. Please try again later." } },
    { type: "response.content_part.done", part: { text: "*This* is a placeholder response. The Responses API is not yet available to the public. Please try again later."} }
  ]

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        if (chunk.type === "response.content_part.done" && "text" in chunk.part) {
          controller.enqueue(chunk.part.text);
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
