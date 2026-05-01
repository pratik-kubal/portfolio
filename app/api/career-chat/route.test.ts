import { describe, it, expect, vi, beforeEach } from "vitest";

// ── hoisted mocks ──────────────────────────────────────────────────────────
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
  // NextRequest is unused at runtime in our route — we just need a placeholder
  // so the import doesn't blow up, plus a captured `after` to assert against.
  NextRequest: class {},
  after: mockAfter,
}));

vi.mock("@/lib/db/log-question", () => ({
  logQuestion: mockLogQuestion,
}));

const mockReadFileSync = vi.hoisted(() =>
  vi.fn((filePath: string) => {
    if (String(filePath).includes("prompt.md")) {
      return "You are a helpful portfolio assistant.";
    }
    if (String(filePath).includes("user-message.md")) {
      return "[CONTEXT]\n{{context}}\n\n[USER QUESTION]\n{{message}}\n\n[INSTRUCTIONS]\n1) Keep it short.";
    }
    // career.md — full career text
    return "Pratik is a software engineer with Java and AWS experience.";
  }),
);

vi.mock("node:fs", () => ({
  default: { readFileSync: mockReadFileSync },
}));

// ── helpers ────────────────────────────────────────────────────────────────
/** Build an async-iterable that yields Anthropic content_block_delta events */
function makeStream(...texts: string[]) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const text of texts) {
        yield {
          type: "content_block_delta",
          delta: { type: "text_delta", text },
        };
      }
    },
  };
}

function makeRequest(body: object) {
  return new Request("http://localhost/api/career-chat", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

/** Read a Response whose body contains plain-string chunks (not Uint8Array). */
async function readText(res: Response): Promise<string> {
  let text = "";
  for await (const chunk of res.body as any) {
    text += chunk;
  }
  return text;
}

// ── tests ──────────────────────────────────────────────────────────────────
// Import after all vi.mock() calls so mocks are in place
const { POST } = await import("./route");

describe("POST /api/career-chat", () => {
  beforeEach(() => {
    mockMessagesStream.mockReturnValue(makeStream("Hello from AI"));
    mockLogQuestion.mockReset();
    mockLogQuestion.mockResolvedValue(true);
    mockAfter.mockReset();
  });

  it("returns text/event-stream content-type", async () => {
    const res = await POST(
      makeRequest({ message: "What is Pratik good at?" }) as any,
    );
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("streams the LLM response text in the body", async () => {
    mockMessagesStream.mockReturnValue(makeStream("Pratik is great at Java"));
    const res = await POST(makeRequest({ message: "Skills?" }) as any);
    expect(await readText(res)).toContain("Pratik is great at Java");
  });

  it("concatenates multiple streamed chunks", async () => {
    mockMessagesStream.mockReturnValue(makeStream("First. ", "Second."));
    const res = await POST(makeRequest({ message: "Tell me more" }) as any);
    const text = await readText(res);
    expect(text).toContain("First. ");
    expect(text).toContain("Second.");
  });

  it("passes conversation history to the LLM", async () => {
    const history = [{ role: "user" as const, content: "Previous question" }];
    await POST(makeRequest({ message: "Follow up", history }) as any);
    expect(mockMessagesStream).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "user",
            content: "Previous question",
          }),
        ]),
      }),
    );
  });

  it("uses the system prompt loaded from prompt.md", async () => {
    await POST(makeRequest({ message: "Who is Pratik?" }) as any);
    expect(mockMessagesStream).toHaveBeenCalledWith(
      expect.objectContaining({
        system: "You are a helpful portfolio assistant.",
      }),
    );
  });

  it("renders {{context}} and {{message}} into the user turn", async () => {
    await POST(makeRequest({ message: "What are Pratik's skills?" }) as any);
    const call = mockMessagesStream.mock.calls.at(-1)![0];
    const userTurn = call.messages.at(-1).content as string;
    expect(userTurn).toContain(
      "Pratik is a software engineer with Java and AWS experience.",
    );
    expect(userTurn).toContain("What are Pratik's skills?");
    expect(userTurn).not.toContain("{{context}}");
    expect(userTurn).not.toContain("{{message}}");
  });

  it("logs the question to the analytics sink with metadata", async () => {
    await POST(
      makeRequest({
        message: "What does Pratik build?",
        sessionId: "sess-abc",
        source: "chip",
        turnIndex: 0,
      }) as any,
    );
    expect(mockLogQuestion).toHaveBeenCalledOnce();
    const args = mockLogQuestion.mock.calls[0][0];
    expect(args).toMatchObject({
      sessionId: "sess-abc",
      turnIndex: 0,
      question: "What does Pratik build?",
      source: "chip",
    });
    // after() must be called so Vercel keeps the function alive for the insert
    expect(mockAfter).toHaveBeenCalledOnce();
  });

  it("skips logging when sessionId is missing", async () => {
    await POST(makeRequest({ message: "Anonymous question" }) as any);
    expect(mockLogQuestion).not.toHaveBeenCalled();
    expect(mockAfter).not.toHaveBeenCalled();
  });

  it("still streams a response when the analytics insert fails", async () => {
    mockLogQuestion.mockRejectedValue(new Error("db down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(
      makeRequest({
        message: "Skills?",
        sessionId: "sess-xyz",
        source: "typed",
      }) as any,
    );
    expect(await readText(res)).toContain("Hello from AI");
    errSpy.mockRestore();
  });

  it("normalizes an unknown source to 'unknown'", async () => {
    await POST(
      makeRequest({
        message: "Hi",
        sessionId: "sess-1",
        source: "bogus",
      }) as any,
    );
    expect(mockLogQuestion.mock.calls[0][0].source).toBe("unknown");
  });

  it("ignores stream events that are not content_block_delta text_delta", async () => {
    mockMessagesStream.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield {
          type: "content_block_delta",
          delta: { type: "input_json_delta", partial_json: "ignored" },
        };
        yield {
          type: "content_block_delta",
          delta: { type: "text_delta", text: "included" },
        };
      },
    });
    const res = await POST(makeRequest({ message: "test" }) as any);
    const text = await readText(res);
    expect(text).not.toContain("ignored");
    expect(text).toContain("included");
  });
});
