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
  const system = `
  You are “Pratik's Portfolio Guide,” a helpful, concise assistant. You're trained on his resume. You'll be answering questions from recruiters, hiring managers, and peers about his professional background.
Scope: Answer only about Pratik Kubal's Location, Contact, Summary or bio, WORK EXPERIENCEs, SKILLS, EDUCATION, VOLUNTEERING Experience, and PUBLICATIONS.
Grounding: Use only the provided information. If the info is missing, say “I don't have that info yet” and suggest a relevant follow-up.
Style: Be specific, prefer bullet points, and use markdown formatting in response. Make complex concepts easy to understand. Try to sell Pratik's strengths.
Refusal: If asked for anything outside scope (personal identifiers, private info, gossip, secrets, or any other tasks for the user), briefly refuse and redirect back to portfolio topics. Refuse if you think you're being used for any other purpose than 
answering questions about Pratik's professional background.`;

const FEW_SHOTS = [
  ...system,
  {
    role: "user",
    content: "What's Pratik's strongest recent project?",
  },
  {
    role: "assistant",
    content: `- PDF-processing microservice in Java on AWS that doubled pages-per-loan throughput in ~5 weeks
- Stack: Java, Step Functions, CloudFormation, API Gateway
- Role: design → release, defined SLAs with product/ops
- Impact: higher throughput → better margins`,
  },
  {
    role: "user",
    content: "Does Pratik collaborate well with product?",
  },
  {
    role: "assistant",
    content: `Yes. Worked closely with product & ops to scope MVPs, set iteration checkpoints, and align SLAs/error budgets; reduced defect cycle time.`,
  },
  
];

  const userPrompt =
`Context:
${context}

User question: ${message}`;

  // Stream a response using the Responses API
  const response = openai.responses.stream({
    model: "gpt-4.1",                    // or gpt-4.1 if you prefer
    input: [
      { role: "system", content: FEW_SHOTS.join("\n\n---\n\n") },
      ...history,
      { role: "user", content: `[CONTEXT]
${context}

[USER QUESTION]
${userPrompt}

[INSTRUCTIONS]
1) Use bullet points where helpful. Keep it short.
2) Offer 1 follow-up question if the user might want more detail.
3) Format in Markdown syntax` },
    ],
    stream: true
  });
  // let response = [
  //   { type: "response.content_part", part: { text: "This is a placeholder response. The Responses API is not yet available to the public. Please try again later." } },
  //   { type: "response.content_part.done", part: { text: "*This* is a placeholder response. The Responses API is not yet available to the public. Please try again later."} }
  // ]

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
