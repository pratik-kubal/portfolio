// Apply lib/db/schema.sql to the Neon database referenced by DATABASE_URL.
// Idempotent — every statement uses IF NOT EXISTS.
//
// Usage: pnpm db:migrate

import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(url);
  const ddl = fs.readFileSync(path.resolve("lib/db/schema.sql"), "utf8");

  const statements = ddl
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    await sql.query(stmt);
  }

  console.log(`Applied ${statements.length} statements.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
