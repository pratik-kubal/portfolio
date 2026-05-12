"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MsgRole = "bot" | "user";
type Msg = { role: MsgRole; text: string; time: string };

const GREETING_TEXT =
  "Hi — I'm TURN. I help Philly tenants understand their rights and connect with an advocate. What's going on?";

const CHIPS = [
  "I'm facing eviction",
  "Know my rights",
  "Talk to an advocate",
];

function formatTime(d: Date): string {
  return d
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

function roleToApi(role: MsgRole): "user" | "assistant" {
  return role === "user" ? "user" : "assistant";
}

export function RturnChatPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: GREETING_TEXT, time: "" },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // Fill the greeting timestamp on mount so SSR/CSR don't diverge.
  useEffect(() => {
    setMsgs((prev) => {
      if (prev[0]?.role !== "bot" || prev[0].time) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], time: formatTime(new Date()) };
      return copy;
    });
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [msgs, isStreaming]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || isStreaming) return;

    setInput("");
    setHasInteracted(true);

    const now = new Date();
    const userMsg: Msg = { role: "user", text: q, time: formatTime(now) };
    const placeholder: Msg = { role: "bot", text: "", time: formatTime(now) };

    // History for the API: everything finalized so far, excluding the new
    // user message (the API appends it explicitly). The leading greeting is a
    // UI placeholder, not a real assistant turn — drop it so the conversation
    // starts on a user message as Anthropic expects.
    const apiHistory = msgs
      .map((m) => ({ role: roleToApi(m.role), content: m.text }))
      .filter((_, i, arr) => !(i === 0 && arr[0].role === "assistant"));

    const aiIndex = msgs.length + 1;
    setMsgs((prev) => [...prev, userMsg, placeholder]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/rturn-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: apiHistory }),
      });

      if (!res.ok || !res.body) {
        setMsgs((prev) => {
          const copy = [...prev];
          copy[aiIndex] = {
            role: "bot",
            text: "Sorry — something went wrong. Please try again, or call TURN at 215-940-3900.",
            time: formatTime(new Date()),
          };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }

      setMsgs((prev) => {
        const copy = [...prev];
        copy[aiIndex] = {
          role: "bot",
          text: acc,
          time: formatTime(new Date()),
        };
        return copy;
      });
    } catch {
      setMsgs((prev) => {
        const copy = [...prev];
        copy[aiIndex] = {
          role: "bot",
          text: "Sorry — something went wrong. Please try again, or call TURN at 215-940-3900.",
          time: formatTime(new Date()),
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="rturn-root">
      <div className="rturn-grain" aria-hidden />
      <main className="rturn-stage">
        <header className="rturn-caption">
          <div className="rturn-kicker">Concept · 2026</div>
          <h1>
            An on-site advocate for <em>Philadelphia tenants.</em>
          </h1>
          <p className="rturn-sub">
            Reimagining the TURN intake widget — answering questions about
            rights, repairs, and eviction in plain English, in the moment
            a tenant needs them most.
          </p>
        </header>

        <div
          className="rturn-device"
          role="img"
          aria-label="TURN chat widget concept rendered inside a mobile phone frame"
        >
          <div className="rturn-device-bezel">
            <div className="rturn-screen">
              <div className="rturn-statusbar" aria-hidden>
                <span>9:41</span>
                <div className="rturn-statusbar-right">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                    <rect x="0" y="6" width="3" height="4" rx="0.5" />
                    <rect x="4" y="4" width="3" height="6" rx="0.5" />
                    <rect x="8" y="2" width="3" height="8" rx="0.5" />
                    <rect x="12" y="0" width="3" height="10" rx="0.5" />
                  </svg>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M1 4 A 6 6 0 0 1 13 4" />
                    <path d="M3 6 A 4 4 0 0 1 11 6" />
                    <circle cx="7" cy="8.5" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                  <svg width="22" height="11" viewBox="0 0 22 11" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="0.5" y="0.5" width="18" height="10" rx="2" />
                    <rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor" />
                    <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <header className="rturn-chathead">
                <button type="button" className="rturn-back" aria-label="Back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className="rturn-avatar" aria-hidden>
                  <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 20 L20 9 L32 20" />
                    <path d="M11 19 V31 H29 V19" />
                    <path d="M17 31 V23 H23 V31" />
                  </svg>
                </div>
                <div className="rturn-titles">
                  <div className="rturn-name">
                    TURN
                    <span className="rturn-live" aria-label="Live">
                      <span className="rturn-live-dot" aria-hidden />
                      LIVE
                    </span>
                  </div>
                  <div className="rturn-status">I am here to assist you!</div>
                </div>
                <button type="button" className="rturn-kebab" aria-label="More options">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.7" />
                    <circle cx="12" cy="12" r="1.7" />
                    <circle cx="12" cy="19" r="1.7" />
                  </svg>
                </button>
              </header>

              <div className="rturn-thread" aria-live="polite" ref={threadRef}>
                {msgs.map((m, i) => {
                  const isLast = i === msgs.length - 1;
                  const isStreamingBubble =
                    isLast && isStreaming && m.role === "bot" && !m.text;
                  return (
                    <div
                      key={i}
                      className={`rturn-row ${m.role}`}
                      style={
                        i < 3 && !hasInteracted
                          ? { animationDelay: `${320 + i * 220}ms` }
                          : undefined
                      }
                    >
                      {m.role === "user" && <div className="rturn-who">You</div>}
                      <div className="rturn-bubble">
                        <div className="rturn-msg">
                          {isStreamingBubble ? (
                            "Thinking..."
                          ) : m.role === "bot" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.text}
                            </ReactMarkdown>
                          ) : (
                            m.text
                          )}
                        </div>
                        {m.time && <span className="rturn-time">{m.time}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!hasInteracted && (
                <div className="rturn-chips" role="group" aria-label="Quick replies">
                  {CHIPS.map((c, i) => (
                    <button
                      type="button"
                      key={c}
                      className="rturn-chip"
                      style={{ animationDelay: `${1180 + i * 90}ms` }}
                      onClick={() => send(c)}
                      disabled={isStreaming}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="rturn-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  type="text"
                  placeholder="We are here to help you"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Type a message"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  className="rturn-attach"
                  aria-label="Send message"
                  disabled={isStreaming || !input.trim()}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>

              <footer className="rturn-foot">
                <span className="rturn-foot-mark" aria-hidden>✦</span>
                <span>
                  Concept by <strong>Pratik Kubal</strong>
                </span>
              </footer>

              <div className="rturn-homebar" aria-hidden />
            </div>
          </div>
        </div>

        <div className="rturn-hint" aria-live="polite">
          <svg
            className="rturn-hint-arrow"
            viewBox="0 0 110 90"
            width="74"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M 100 78 C 78 80, 52 64, 28 22" />
            <path d="M 29 32 L 28 22 L 36 28" />
          </svg>
          <span>
            Go ahead — type a question. TURN replies live.
          </span>
        </div>

        <div className="rturn-credits">
          <span>Mockup · pratik-kubal.com/rturn · May 2026</span>
          <a href="/solutions" className="rturn-back-link">
            ← Back to solutions
          </a>
        </div>
      </main>
    </div>
  );
}
