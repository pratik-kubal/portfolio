// Persist a single inbound chat question for analytics.
//
// Design contract:
// - Never throws. Failures are logged and swallowed; the chat must keep working
//   when the DB is unavailable.
// - No-ops cleanly when DATABASE_URL is unset (local dev) or when the row would
//   be invalid (empty question, missing session_id, etc.).
// - Stores only a salted hash of the IP — never the raw IP. Hashing is skipped
//   if IP_HASH_SALT is unset, and the column is left null.

import crypto from "node:crypto";
import { getSql } from "./client";

export type QuestionSource = "typed" | "chip" | "deeplink" | "unknown";

const KNOWN_SOURCES = new Set<QuestionSource>([
  "typed",
  "chip",
  "deeplink",
  "unknown",
]);

export type LogQuestionInput = {
  sessionId: string;
  turnIndex: number;
  question: string;
  source: QuestionSource;
  model: string | null;
  country: string | null;
  region: string | null;
  ip: string | null;
  userAgent: string | null;
};

const MAX_QUESTION_LEN = 2000;
const MAX_SESSION_LEN = 128;

export async function logQuestion(input: LogQuestionInput): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  const question = input.question.trim();
  if (!question) return false;

  const sessionId = input.sessionId.trim();
  if (!sessionId || sessionId.length > MAX_SESSION_LEN) return false;

  const truncated = question.slice(0, MAX_QUESTION_LEN);
  const source: QuestionSource = KNOWN_SOURCES.has(input.source)
    ? input.source
    : "unknown";
  const turnIndex = Number.isFinite(input.turnIndex)
    ? Math.max(0, Math.trunc(input.turnIndex))
    : 0;

  const ipHash = hashIp(input.ip);
  const ua = uaFamily(input.userAgent);

  try {
    await sql`
      INSERT INTO chat_questions (
        session_id, turn_index, question, question_length,
        source, model, country, region, ip_hash, ua_family
      ) VALUES (
        ${sessionId}, ${turnIndex}, ${truncated}, ${truncated.length},
        ${source}, ${input.model}, ${input.country}, ${input.region},
        ${ipHash}, ${ua}
      )
    `;
    return true;
  } catch (err) {
    console.error("[chat-log] insert failed:", err);
    return false;
  }
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return null;
  return crypto
    .createHash("sha256")
    .update(salt)
    .update(ip)
    .digest("hex")
    .slice(0, 32);
}

// Map a raw User-Agent string to a coarse family. We deliberately avoid
// storing the full UA — the goal is bot/abuse signal, not fingerprinting.
export function uaFamily(ua: string | null): string | null {
  if (!ua) return null;
  if (/bot|crawl|spider|preview|monitor/i.test(ua)) return "bot";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  if (/firefox/i.test(ua)) return "firefox";
  if (/edg\//i.test(ua)) return "edge";
  if (/chrome/i.test(ua)) return "chrome";
  if (/safari/i.test(ua)) return "safari";
  return "other";
}
