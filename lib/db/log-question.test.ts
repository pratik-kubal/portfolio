import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockSqlTag, mockGetSql } = vi.hoisted(() => ({
  mockSqlTag: vi.fn(),
  mockGetSql: vi.fn(),
}));

vi.mock("./client", () => ({
  getSql: mockGetSql,
  __resetSqlForTests: vi.fn(),
}));

const { logQuestion, uaFamily } = await import("./log-question");

const baseInput = {
  sessionId: "sess-1",
  turnIndex: 0,
  question: "What are Pratik's skills?",
  source: "typed" as const,
  model: "claude-sonnet-4-6",
  country: "US",
  region: "CA",
  ip: "203.0.113.5",
  userAgent: "Mozilla/5.0 (Macintosh) Chrome/120",
};

describe("logQuestion", () => {
  beforeEach(() => {
    mockSqlTag.mockReset();
    mockGetSql.mockReset();
    mockSqlTag.mockResolvedValue(undefined);
    mockGetSql.mockReturnValue(mockSqlTag);
    process.env.IP_HASH_SALT = "test-salt";
  });

  afterEach(() => {
    delete process.env.IP_HASH_SALT;
  });

  it("inserts a row when the DB is configured", async () => {
    const ok = await logQuestion(baseInput);
    expect(ok).toBe(true);
    expect(mockSqlTag).toHaveBeenCalledOnce();
  });

  it("no-ops when DATABASE_URL is unset (getSql returns null)", async () => {
    mockGetSql.mockReturnValue(null);
    const ok = await logQuestion(baseInput);
    expect(ok).toBe(false);
    expect(mockSqlTag).not.toHaveBeenCalled();
  });

  it("returns false (and never throws) when the SQL call rejects", async () => {
    mockSqlTag.mockRejectedValue(new Error("connection refused"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const ok = await logQuestion(baseInput);
    expect(ok).toBe(false);
    errSpy.mockRestore();
  });

  it("rejects empty questions and missing session ids", async () => {
    expect(await logQuestion({ ...baseInput, question: "   " })).toBe(false);
    expect(await logQuestion({ ...baseInput, sessionId: "" })).toBe(false);
    expect(mockSqlTag).not.toHaveBeenCalled();
  });

  it("hashes the IP with IP_HASH_SALT and never stores the raw IP", async () => {
    await logQuestion(baseInput);
    // Neon sql is a tagged template — interpolated values are positional args
    // after the strings array. Order matches the INSERT column list:
    // [strings, sessionId, turnIndex, question, length, source, model,
    //  country, region, ip_hash, ua]
    const ipHash = mockSqlTag.mock.calls[0][9] as string;
    expect(ipHash).toBeTruthy();
    expect(ipHash).not.toContain("203.0.113.5");
    expect(ipHash).toMatch(/^[a-f0-9]{32}$/);
  });

  it("leaves ip_hash null when IP_HASH_SALT is missing", async () => {
    delete process.env.IP_HASH_SALT;
    await logQuestion(baseInput);
    expect(mockSqlTag.mock.calls[0][9]).toBeNull();
  });

  it("normalizes unknown sources to 'unknown'", async () => {
    await logQuestion({
      ...baseInput,
      source: "evil-injection" as never,
    });
    expect(mockSqlTag.mock.calls[0][5]).toBe("unknown");
  });

  it("truncates questions over 2000 characters", async () => {
    const long = "x".repeat(3000);
    await logQuestion({ ...baseInput, question: long });
    expect((mockSqlTag.mock.calls[0][3] as string).length).toBe(2000);
    expect(mockSqlTag.mock.calls[0][4]).toBe(2000);
  });
});

describe("uaFamily", () => {
  it.each([
    ["Mozilla/5.0 ... Chrome/120 Safari/537", "chrome"],
    ["Mozilla/5.0 ... Firefox/121", "firefox"],
    ["Mozilla/5.0 ... Edg/120", "edge"],
    ["Mozilla/5.0 (iPhone) Safari/604", "ios"],
    ["Googlebot/2.1", "bot"],
    ["", null],
  ])("classifies %s as %s", (ua, expected) => {
    expect(uaFamily(ua || null)).toBe(expected);
  });
});
