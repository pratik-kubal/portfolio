// Lazy Neon HTTP client. Returns null if DATABASE_URL is unset so callers
// can no-op cleanly in environments without a database (local dev, CI).

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null | undefined;

export function getSql(): NeonQueryFunction<false, false> | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL;
  cached = url ? neon(url) : null;
  return cached;
}

// Test-only: clear the memoized client so unit tests can swap env vars.
export function __resetSqlForTests() {
  cached = undefined;
}
