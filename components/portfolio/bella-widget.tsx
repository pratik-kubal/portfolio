"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { bellaWidget } from "@/data/portfolio";
import type { QuestionSource } from "@/lib/db/log-question";

export type BellaController = {
  open: () => void;
  ask: (message: string, source: QuestionSource, selectedQuote?: string) => void;
};

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "bella:session-id";
function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function BellaWidget({
  controllerRef,
  initialQuestion = "",
}: {
  controllerRef: MutableRefObject<BellaController | null>;
  initialQuestion?: string;
}) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgsRef = useRef<Msg[]>(msgs);
  msgsRef.current = msgs;
  const streamingRef = useRef(isStreaming);
  streamingRef.current = isStreaming;
  const autoSent = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const send = useCallback(
    (message: string, source: QuestionSource, selectedQuote?: string) => {
      const m = message.trim();
      if (!m || streamingRef.current) return;
      setStarted(true);
      setInput("");
      const history = msgsRef.current;
      const nextHistory: Msg[] = [...history, { role: "user", content: m }];
      const aiIndex = nextHistory.length;
      setMsgs([...nextHistory, { role: "assistant", content: "" }]);
      setIsStreaming(true);
      requestAnimationFrame(scrollToBottom);

      fetch("/api/bella", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: m,
          history: nextHistory,
          sessionId: getOrCreateSessionId(),
          source,
          turnIndex: history.length,
          selectedQuote: selectedQuote ?? null,
        }),
      })
        .then(async (res) => {
          if (!res.ok || !res.body) throw new Error(`bad status ${res.status}`);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            setMsgs((h) => {
              const c = [...h];
              c[aiIndex] = { role: "assistant", content: acc };
              return c;
            });
            scrollToBottom();
          }
        })
        .catch(() => {
          setMsgs((h) => {
            const c = [...h];
            c[aiIndex] = {
              role: "assistant",
              content:
                "Sorry — I couldn't reach the server just now. Please try again in a moment.",
            };
            return c;
          });
        })
        .finally(() => {
          setIsStreaming(false);
          requestAnimationFrame(scrollToBottom);
        });
    },
    [scrollToBottom],
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    setTimeout(() => {
      try {
        inputRef.current?.focus();
      } catch {
        /* noop */
      }
    }, 80);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // Expose the imperative controller to the highlight-to-ask popover + deeplink.
  useEffect(() => {
    controllerRef.current = {
      open: openPanel,
      ask: (message, source, quote) => {
        openPanel();
        send(message, source, quote);
      },
    };
    return () => {
      controllerRef.current = null;
    };
  }, [controllerRef, openPanel, send]);

  // ?ask= deep link → open + send once.
  useEffect(() => {
    if (autoSent.current || !initialQuestion) return;
    autoSent.current = true;
    openPanel();
    send(initialQuestion, "deeplink");
  }, [initialQuestion, openPanel, send]);

  return (
    <div className="pk-bella" data-bella="">
      {!open ? (
        <button
          type="button"
          className="pk-bella-teaser"
          aria-label="Open chat with Bella"
          onClick={openPanel}
        >
          <span className="pk-bella-ava" aria-hidden="true">
            B
          </span>
          <span className="label">Ask Bella</span>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </button>
      ) : (
        <div className="pk-bella-panel">
          <div
            className="pk-bella-head"
            title="Click to minimize"
            onClick={close}
          >
            <div className="avawrap">
              <div className="ava" aria-hidden="true">
                B
              </div>
              <span className="status" aria-hidden="true" />
            </div>
            <div className="meta">
              <b>{bellaWidget.name}</b>
              <span>{bellaWidget.role}</span>
            </div>
            <button
              type="button"
              className="pk-bella-close"
              aria-label="Close chat"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              ✕
            </button>
          </div>

          <div className="pk-bella-body" ref={bodyRef}>
            <div className="pk-bella-greet">
              <div className="ava" aria-hidden="true">
                B
              </div>
              <div className="bub">{bellaWidget.greeting}</div>
            </div>

            {!started ? (
              <div className="pk-bella-chips">
                {bellaWidget.chips.map((c) => (
                  <button
                    key={c.query}
                    type="button"
                    className="pk-bella-chip"
                    onClick={() => send(c.query, "chip")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="pk-bella-feed">
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <div className="pk-bella-row u" key={i}>
                    <div className="pk-bella-bub u">{m.content}</div>
                  </div>
                ) : (
                  <div className="pk-bella-row b" key={i}>
                    <div className="ava" aria-hidden="true">
                      B
                    </div>
                    <div className="pk-bella-bub b">
                      {m.content ? (
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </Markdown>
                      ) : (
                        <span className="pk-bella-typing" aria-label="Bella is typing">
                          <span style={{ animationDelay: "0s" }} />
                          <span style={{ animationDelay: "0.18s" }} />
                          <span style={{ animationDelay: "0.36s" }} />
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="pk-bella-inputrow">
            <input
              ref={inputRef}
              type="text"
              className="pk-bella-input"
              aria-label={bellaWidget.inputPlaceholder}
              placeholder={bellaWidget.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send(input, "typed");
                }
              }}
            />
            <button
              type="button"
              className="pk-bella-send"
              aria-label="Send"
              disabled={isStreaming || !input.trim()}
              onClick={() => send(input, "typed")}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
