// components/CareerChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/use-reveal";
import MarkdownAsync from 'react-markdown';



type Msg = { role: "user" | "assistant"; content: string };

export default function CareerChat() {
  const ref = useReveal();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => { boxRef.current?.scrollTo({ top: 1e6 }); }, [msgs]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    const nextHistory = [...msgs, { role: "user" as const, content: q }];
    setMsgs(nextHistory);

    const res = await fetch("/api/career-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, history: nextHistory }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    const aiIndex = nextHistory.length;
    setMsgs(h => [...h, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      setMsgs(h => {
        const copy = [...h];
        copy[aiIndex] = { role: "assistant", content: acc };
        return copy;
      });
    }
  }

  return (
    <div id="chat" className="bg-card rounded-2xl border p-4 max-w-xxl min-h-screen flex flex-col h-full" ref={ref}>
        <div ref={boxRef} className="p-2 overflow-hidden space-y-3 mt-auto">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block rounded-2xl px-3 py-2  ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <MarkdownAsync>{m.content}</MarkdownAsync>
            </div>
          </div>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my work, skills, projects..."
          className="flex-1 rounded-xl border px-3 py-2"
        />
        <button className="rounded-xl px-4 py-2 bg-primary text-primary-foreground">Ask</button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Answers are generated from my resume & projects. If it’s not in my experience, I’ll say so.
      </p>
    </div>
  );
}
