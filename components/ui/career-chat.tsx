"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownAsync from "react-markdown";
import { useRouter } from "next/navigation";
import { handleScroll } from "@/lib/utils";
import { person } from "@/data/person";

type Msg = { role: "user" | "assistant"; content: string };

export default function CareerChat({
  initialQuestion = "",
}: {
  initialQuestion?: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const autoSentRef = useRef(false);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [msgs, isStreaming]);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q) return;

    if (!question) setInput("");

    const nextHistory = [...msgs, { role: "user" as const, content: q }];
    setMsgs(nextHistory);
    setIsStreaming(true);

    const aiIndex = nextHistory.length;
    setMsgs((h) => [...h, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: nextHistory }),
      });

      if (!res.ok || !res.body) {
        setMsgs((h) => {
          const copy = [...h];
          copy[aiIndex] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          };
          return copy;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((h) => {
          const copy = [...h];
          copy[aiIndex] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMsgs((h) => {
        const copy = [...h];
        copy[aiIndex] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  useEffect(() => {
    if (autoSentRef.current) return;
    if (!initialQuestion) return;
    autoSentRef.current = true;
    send(initialQuestion);
    router.replace("/", { scroll: false });
  }, [initialQuestion, router]);

  return (
    <section className="v3-chat">
      <div className="tag">
        <i />
        LIVE
      </div>
      <h3>Talk to a small AI trained on my work.</h3>
      <div className="note">
        It knows about my projects, experience, and how to reach me. It will
        politely refuse questions outside that scope.
      </div>

      <div className="v3-convo" ref={boxRef}>
        {msgs.length === 0 && <div className="v3-bub a">{person.chatOpener}</div>}
        {msgs.map((m, i) => (
          <div className={`v3-bub ${m.role === "user" ? "u" : "a"}`} key={i}>
            {m.role === "assistant" ? (
              <MarkdownAsync>{m.content}</MarkdownAsync>
            ) : (
              m.content
            )}
          </div>
        ))}
        {isStreaming && (
          <div className="v3-bub a" style={{ opacity: 0.55 }}>
            thinking…
          </div>
        )}
      </div>

      {msgs.length === 0 && (
        <div className="v3-chips3">
          {person.prompts.map((q) => (
            <button key={q} type="button" onClick={() => send(q)}>
              “{q}”
            </button>
          ))}
        </div>
      )}

      <form
        className="v3-ask"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          spellCheck={false}
          onFocus={handleScroll(inputRef)}
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !input.trim()}>
          Ask
        </button>
      </form>
    </section>
  );
}
