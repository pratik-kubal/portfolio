import { describe, it, expect, vi, beforeEach } from "vitest";

// ── hoisted mocks ────────────────────────────────────────────────────────────
const { mockMessagesStream, mockLogQuestion, mockAfter } = vi.hoisted(() => ({
  mockMessagesStream: vi.fn(),
  mockLogQuestion: vi.fn(),
  mockAfter: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(function () {
    return { messages: { stream: mockMessagesStream } };
  }),
}));

vi.mock("next/server", () => ({
  NextRequest: class {},
  after: mockAfter,
}));

vi.mock("@/lib/db/log-question", () => ({
  logQuestion: mockLogQuestion,
}));

const mockReadFileSync = vi.hoisted(() =>
  vi.fn((filePath: string) => {
    if (String(filePath).includes("bella-prompt.md")) {
      return "You are Bella, Pratik's recruiting assistant.";
    }
    // career.md — résumé context
    return "Pratik is a software engineer with Java and AWS experience.";
  }),
);

vi.mock("node:fs", () => ({
  default: { readFileSync: mockReadFileSync },
}));

function makeStream(...texts: string[]) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const text of texts) {
        yield { type: "content_block_delta", delta: { type: "text_delta", text } };
      }
    },
  };
}

function makeRequest(body: object) {
  return new Request("http://localhost/api/bella", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

async function readText(res: Response): Promise<string> {
  let text = "";
  for await (const chunk of res.body as any) text += chunk;
  return text;
}

const { POST } = await import("./route");

describe("POST /api/bella", () => {
  beforeEach(() => {
    mockMessagesStream.mockReturnValue(makeStream("He's strong in Java + AWS"));
    mockLogQuestion.mockReset();
    mockLogQuestion.mockResolvedValue(true);
    mockAfter.mockReset();
  });

  it("returns a text/event-stream response", async () => {
    const res = await POST(makeRequest({ message: "Tech stack?" }) as any);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("streams the LLM response text", async () => {
    const res = await POST(makeRequest({ message: "Tech stack?" }) as any);
    expect(await readText(res)).toContain("He's strong in Java + AWS");
  });

  it("rejects an empty message with 400", async () => {
    const res = await POST(makeRequest({ message: "   " }) as any);
    expect(res.status).toBe(400);
  });

  it("rejects an over-long message with 400", async () => {
    const res = await POST(makeRequest({ message: "x".repeat(2001) }) as any);
    expect(res.status).toBe(400);
  });

  it("returns 400 on a malformed JSON body", async () => {
    const req = new Request("http://localhost/api/bella", {
      method: "POST",
      body: "not json at all",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("caps history to the last 12 turns and truncates long turn content", async () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "x".repeat(5000),
    }));
    await POST(makeRequest({ message: "Next?", history }) as any);
    const sent = mockMessagesStream.mock.calls.at(-1)![0].messages;
    // 12 kept history turns + the current user turn
    expect(sent.length).toBe(13);
    for (const m of sent.slice(0, 12)) {
      expect(m.content.length).toBeLessThanOrEqual(4000);
    }
  });

  it("uses the Bella system prompt from bella-prompt.md", async () => {
    await POST(makeRequest({ message: "Who is Pratik?" }) as any);
    expect(mockMessagesStream).toHaveBeenCalledWith(
      expect.objectContaining({
        system: "You are Bella, Pratik's recruiting assistant.",
      }),
    );
  });

  it("grounds the user turn in career.md and includes the question", async () => {
    await POST(makeRequest({ message: "What are his skills?" }) as any);
    const userTurn = mockMessagesStream.mock.calls.at(-1)![0].messages.at(-1)
      .content as string;
    expect(userTurn).toContain(
      "Pratik is a software engineer with Java and AWS experience.",
    );
    expect(userTurn).toContain("What are his skills?");
  });

  it("includes a highlighted quote in the user turn when provided", async () => {
    await POST(
      makeRequest({
        message: 'Tell me more about: "the 90% latency win"',
        selectedQuote: "the 90% latency win",
      }) as any,
    );
    const userTurn = mockMessagesStream.mock.calls.at(-1)![0].messages.at(-1)
      .content as string;
    expect(userTurn).toContain("[HIGHLIGHTED TEXT]");
    expect(userTurn).toContain("the 90% latency win");
  });

  it("logs highlight questions with the source and selected quote", async () => {
    await POST(
      makeRequest({
        message: 'Tell me more about: "Aurora migration"',
        sessionId: "sess-hl",
        source: "highlight",
        selectedQuote: "Aurora migration",
        turnIndex: 2,
      }) as any,
    );
    expect(mockLogQuestion).toHaveBeenCalledOnce();
    expect(mockLogQuestion.mock.calls[0][0]).toMatchObject({
      sessionId: "sess-hl",
      source: "highlight",
      selectedQuote: "Aurora migration",
      turnIndex: 2,
    });
    expect(mockAfter).toHaveBeenCalledOnce();
  });

  it("skips logging when sessionId is missing", async () => {
    await POST(makeRequest({ message: "Anonymous" }) as any);
    expect(mockLogQuestion).not.toHaveBeenCalled();
    expect(mockAfter).not.toHaveBeenCalled();
  });

  it("normalizes an unknown source to 'unknown'", async () => {
    await POST(
      makeRequest({ message: "Hi", sessionId: "s1", source: "bogus" }) as any,
    );
    expect(mockLogQuestion.mock.calls[0][0].source).toBe("unknown");
  });

  it("still streams when the analytics insert fails", async () => {
    mockLogQuestion.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(
      makeRequest({ message: "Skills?", sessionId: "s2", source: "typed" }) as any,
    );
    expect(await readText(res)).toContain("He's strong in Java + AWS");
    errSpy.mockRestore();
  });
});
