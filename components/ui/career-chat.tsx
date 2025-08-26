// components/CareerChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownAsync from 'react-markdown';
import { useRouter } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

export default function CareerChat({ initialQuestion = "" }: { initialQuestion?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const autoSentRef = useRef(false);

  useEffect(() => { boxRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs, isStreaming]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !showFullChat) {
      inputRef.current.focus();
    }
  }, [showFullChat]);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q) return;

    // Transition to full chat view when first message is sent
    if (!showFullChat) {
      setShowFullChat(true);
    }

    if (!question) setInput(""); // clear input only if typed manually

    const nextHistory = [...msgs, { role: "user" as const, content: q }];
    setMsgs(nextHistory);
    setIsStreaming(true);

    const res = await fetch("/api/career-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, history: nextHistory }),
    });

    const aiIndex = nextHistory.length;
    setMsgs(h => [...h, { role: "assistant", content: "" }]);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";

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
    setIsStreaming(false);
  }

  // Auto-send once if the page provided an initial question, then strip ?question
  useEffect(() => {
    if (autoSentRef.current) return;
    if (!initialQuestion) return;
    autoSentRef.current = true;
    send(initialQuestion);
    router.replace("/chat", { scroll: false });
  }, [initialQuestion, router]);

  // Show centered input initially
  if (!showFullChat && msgs.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl text-center space-y-6 animate-in fade-in duration-500">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ask about Pratik
            </h1>
            <p className="text-muted-foreground text-lg">
              Get insights about my work experience, skills, and projects
            </p>
          </div>
          
          <form 
            className="space-y-4" 
            onSubmit={(e) => { 
              e.preventDefault(); 
              send(); 
            }}
          >
            <div className="relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What do you want to know?"
                className="w-full rounded-xl border border-primary/20 px-6 py-4 text-lg bg-card/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
                disabled={isStreaming}
              />
              <button 
                type="submit"
                disabled={isStreaming || !input.trim()} 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all duration-200"
              >
                {isStreaming ? "..." : "Ask"}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "What's your recent work?",
                "Tell me about your skills",
                "What projects have you built?",
                "Your educational background?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    send(suggestion);
                  }}
                  className="px-3 py-1.5 text-sm rounded-full border border-border bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
          
          <p className="text-xs text-muted-foreground">
            Answers are generated from his resume & projects. If it's not in my experience, I'll say so.
          </p>
        </div>
      </section>
    );
  }

  // Show full chat interface after first message
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8">
      <div 
        id="chat" 
        className="w-full max-w-2xl bg-card/80 rounded-2xl bg-transparent flex flex-col h-[70vh] md:h-[75vh] animate-in slide-in-from-bottom-4 duration-500"
      >
        <div ref={boxRef} className="p-2 overflow-auto space-y-3 mt-auto">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block rounded-2xl px-3 py-2  ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <MarkdownAsync>{m.content}</MarkdownAsync>
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border/50 text-foreground rounded-2xl px-3 py-2">
                <span className="inline-flex gap-1 align-middle">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-100ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce" />
                </span>
              </div>
            </div>
          )}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you want to know?"
            className="flex-1 rounded-xl border px-3 py-2 border-green-800 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
          />
          <button disabled={isStreaming || !input.trim()} className="rounded-xl px-4 py-2 bg-primary text-primary-foreground">{isStreaming ? "..." : "Ask"}</button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Answers are generated from his resume & projects. If it's not in my experience, I'll say so.
        </p>
      </div>
    </section>
  );
}