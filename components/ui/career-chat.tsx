"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownAsync from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { handleScroll } from "@/lib/utils";
import { nextChatScroll } from "@/lib/chat-scroll";
import { person } from "@/data/person";

type Msg = { role: "user" | "assistant"; content: string };

// Wrap each word in <span class="v3-word"> so new words can fade in as they
// stream. Whitespace stays as plain text so wrapping stays natural. React
// reconciles spans positionally, so only newly-appended words animate on mount.
const WORD_SKIP_TAGS = new Set(["code", "pre"]);
function rehypeSplitWords() {
  type HastNode = {
    type: string;
    tagName?: string;
    value?: string;
    children?: HastNode[];
    properties?: Record<string, unknown>;
  };
  const walk = (node: HastNode, inSkip: boolean) => {
    if (!node.children) return;
    const skipHere =
      inSkip ||
      (node.type === "element" &&
        !!node.tagName &&
        WORD_SKIP_TAGS.has(node.tagName));
    const out: HastNode[] = [];
    for (const child of node.children) {
      if (
        !skipHere &&
        child.type === "text" &&
        typeof child.value === "string"
      ) {
        for (const part of child.value.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            out.push({ type: "text", value: part });
          } else {
            out.push({
              type: "element",
              tagName: "span",
              properties: { className: ["v3-word"] },
              children: [{ type: "text", value: part }],
            });
          }
        }
      } else {
        walk(child, skipHere);
        out.push(child);
      }
    }
    node.children = out;
  };
  return (tree: HastNode) => walk(tree, false);
}

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
  const followRef = useRef(false);

  const router = useRouter();
  const autoSentRef = useRef(false);

  useEffect(() => {
    const el = boxRef.current;
    const inputEl = inputRef.current;
    if (!el || !inputEl) return;
    let stickInner = true;
    let prevY = window.scrollY;
    const onInnerScroll = () => {
      stickInner = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    };
    const onWindowScroll = () => {
      if (window.scrollY < prevY - 4) followRef.current = false;
      prevY = window.scrollY;
    };
    const pin = () => {
      const action = nextChatScroll({
        inner: {
          scrollTop: el.scrollTop,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
        },
        inputClientBottom: inputEl.getBoundingClientRect().bottom,
        viewportHeight: window.innerHeight,
        stickInner,
        follow: followRef.current,
      });
      if (action.innerScrollTo !== null) el.scrollTop = action.innerScrollTo;
      if (action.windowScrollBy > 0) {
        window.scrollBy({ top: action.windowScrollBy });
        prevY = window.scrollY;
      }
    };
    el.addEventListener("scroll", onInnerScroll, { passive: true });
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    const ro = new ResizeObserver(pin);
    Array.from(el.children).forEach((c) => ro.observe(c));
    const mo = new MutationObserver(() => {
      Array.from(el.children).forEach((c) => ro.observe(c));
      pin();
    });
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      el.removeEventListener("scroll", onInnerScroll);
      window.removeEventListener("scroll", onWindowScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q) return;

    if (!question) setInput("");

    const nextHistory = [...msgs, { role: "user" as const, content: q }];
    setMsgs(nextHistory);
    setIsStreaming(true);

    const aiIndex = nextHistory.length;
    setMsgs((h) => [...h, { role: "assistant", content: "" }]);
    followRef.current = true;

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
      <div className="v3-chat-scroll" ref={boxRef}>
      <h3>Skip the intro call — interview me here.</h3>
      <div className="note">
        A Claude-powered assistant with full context on my background.
      </div>

      <div className="v3-convo">
        {msgs.length === 0 && <div className="v3-bub a">{person.chatOpener}</div>}
        {msgs.map((m, i) => (
          <div className={`v3-bub ${m.role === "user" ? "u" : "a"}`} key={i}>
            {m.role === "assistant" ? (
              <MarkdownAsync
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSplitWords]}
              >
                {m.content}
              </MarkdownAsync>
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
      </div>
    </section>
  );
}
