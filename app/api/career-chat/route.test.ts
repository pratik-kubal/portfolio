import { describe, it, expect, vi, beforeEach } from "vitest";

// ── hoisted mocks ──────────────────────────────────────────────────────────
const { mockEmbeddingsCreate, mockResponsesStream } = vi.hoisted(() => ({
  mockEmbeddingsCreate: vi.fn(),
  mockResponsesStream: vi.fn(),
}));

vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      embeddings: { create: mockEmbeddingsCreate },
      responses: { stream: mockResponsesStream },
    };
  }),
}));

const mockReadFileSync = vi.hoisted(() =>
  vi.fn((filePath: string) => {
    if (String(filePath).includes("prompt.md")) {
      return "You are a helpful portfolio assistant.";
    }
    if (String(filePath).includes("user-message.md")) {
      return "[CONTEXT]\n{{context}}\n\n[USER QUESTION]\n{{message}}\n\n[INSTRUCTIONS]\n1) Keep it short.";
    }
    // career_vectors.json — two chunks with orthogonal embeddings
    return JSON.stringify([
      { id: 1, text: "Pratik is a software engineer.", embedding: [1, 0, 0] },
      { id: 2, text: "He has Java and AWS experience.", embedding: [0, 1, 0] },
    ]);
  })
);

vi.mock("node:fs", () => ({
  default: { readFileSync: mockReadFileSync },
}));

// ── helpers ────────────────────────────────────────────────────────────────
/** Build an async-iterable that yields content-part events */
function makeStream(...texts: string[]) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const text of texts) {
        yield { type: "response.content_part.done", part: { text } };
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
    mockEmbeddingsCreate.mockResolvedValue({
      data: [{ embedding: [1, 0, 0] }],
    });
    mockResponsesStream.mockReturnValue(makeStream("Hello from AI"));
  });

  it("returns text/event-stream content-type", async () => {
    const res = await POST(makeRequest({ message: "What is Pratik good at?" }) as any);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("streams the LLM response text in the body", async () => {
    mockResponsesStream.mockReturnValue(makeStream("Pratik is great at Java"));
    const res = await POST(makeRequest({ message: "Skills?" }) as any);
    expect(await readText(res)).toContain("Pratik is great at Java");
  });

  it("concatenates multiple streamed chunks", async () => {
    mockResponsesStream.mockReturnValue(makeStream("First. ", "Second."));
    const res = await POST(makeRequest({ message: "Tell me more" }) as any);
    const text = await readText(res);
    expect(text).toContain("First. ");
    expect(text).toContain("Second.");
  });

  it("calls OpenAI embeddings with the user message", async () => {
    await POST(makeRequest({ message: "What skills does Pratik have?" }) as any);
    expect(mockEmbeddingsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ input: "What skills does Pratik have?" })
    );
  });

  it("passes conversation history to the LLM", async () => {
    const history = [{ role: "user" as const, content: "Previous question" }];
    await POST(makeRequest({ message: "Follow up", history }) as any);
    expect(mockResponsesStream).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.arrayContaining([
          expect.objectContaining({ role: "user", content: "Previous question" }),
        ]),
      })
    );
  });

  it("uses the system prompt loaded from prompt.md", async () => {
    await POST(makeRequest({ message: "Who is Pratik?" }) as any);
    expect(mockResponsesStream).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.arrayContaining([
          expect.objectContaining({
            role: "system",
            content: "You are a helpful portfolio assistant.",
          }),
        ]),
      })
    );
  });

  it("renders {{context}} and {{message}} into the user turn", async () => {
    await POST(makeRequest({ message: "What are Pratik's skills?" }) as any);
    const call = mockResponsesStream.mock.calls.at(-1)![0];
    const userTurn = call.input.at(-1).content as string;
    expect(userTurn).toContain("Pratik is a software engineer.");
    expect(userTurn).toContain("What are Pratik's skills?");
    expect(userTurn).not.toContain("{{context}}");
    expect(userTurn).not.toContain("{{message}}");
  });

  it("ignores stream events that are not response.content_part.done", async () => {
    mockResponsesStream.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield { type: "response.content_part", part: { text: "ignored" } };
        yield { type: "response.content_part.done", part: { text: "included" } };
      },
    });
    const res = await POST(makeRequest({ message: "test" }) as any);
    const text = await readText(res);
    expect(text).not.toContain("ignored");
    expect(text).toContain("included");
  });
});
