// scripts/embed-career.ts
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function chunk(text, max = 800) {
  const paras = text.split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > max) { if (buf) chunks.push(buf); buf = p; }
    else buf = buf ? buf + "\n\n" + p : p;
  }
  if (buf) chunks.push(buf);
  return chunks;
}

async function main() {
  const md = fs.readFileSync(path.resolve("data/career.md"), "utf8");
  const parts = chunk(md);

  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: parts,
  });

  const out = parts.map((text, i) => ({
    id: i,
    text,
    embedding: emb.data[i].embedding,
  }));

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/career_vectors.json", JSON.stringify(out));
  console.log(`Embedded ${out.length} chunks -> data/career_vectors.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
