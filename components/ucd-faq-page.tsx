"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { TOPICS, type Topic, type TopicId } from "@/data/ucd-topics";

interface Turn {
  id: number;
  q: string;
  topicId: TopicId | null;
  loading: boolean;
  text: string;
  errored: boolean;
}

function Placeholder({
  label,
  h,
}: {
  label: string;
  h: number;
}) {
  const safe = label.replace(/\W/g, "");
  return (
    <div className="ucd-ph" style={{ height: h }} aria-label={label}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 400 160"
      >
        <defs>
          <pattern
            id={`ucd-p-${safe}`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="14"
              stroke="currentColor"
              strokeOpacity=".18"
              strokeWidth="6"
            />
          </pattern>
        </defs>
        <rect width="400" height="160" fill={`url(#ucd-p-${safe})`} />
      </svg>
      <span className="ucd-ph-label">{label}</span>
    </div>
  );
}

function MapAnswer() {
  const stops = [
    { x: 18, y: 72, label: "30th St Station" },
    { x: 30, y: 58, label: "Drexel Square" },
    { x: 44, y: 50, label: "Penn Campus" },
    { x: 58, y: 44, label: "Market & 40th" },
    { x: 72, y: 56, label: "Clark Park" },
    { x: 84, y: 70, label: "Cedar Park" },
  ];
  return (
    <div className="ucd-ans">
      <p>
        The City Shuttle runs on a continuous loop, weekdays 7am–7pm. Here&apos;s
        the route:
      </p>
      <div className="ucd-map">
        <svg viewBox="0 0 400 200" width="100%" height="240">
          {[...Array(20)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 20}
              y1="0"
              x2={i * 20}
              y2="200"
              stroke="var(--map-grid)"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 20}
              x2="400"
              y2={i * 20}
              stroke="var(--map-grid)"
              strokeWidth="0.5"
            />
          ))}
          <path
            d="M0,150 C 60,140 100,170 160,160 C 220,150 260,180 320,170 C 360,165 400,175 400,180 L 400,200 L 0,200 Z"
            fill="var(--map-water)"
          />
          <ellipse
            cx="290"
            cy="115"
            rx="38"
            ry="22"
            fill="var(--map-park)"
          />
          <text
            x="290"
            y="118"
            textAnchor="middle"
            fontSize="8"
            fill="var(--map-park-text)"
            fontWeight="600"
          >
            Clark Park
          </text>
          <path
            d={
              `M ${stops[0].x * 4} ${stops[0].y * 2} ` +
              stops
                .slice(1)
                .map((s) => `L ${s.x * 4} ${s.y * 2}`)
                .join(" ")
            }
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
          {stops.map((s, i) => (
            <g key={i}>
              <circle
                cx={s.x * 4}
                cy={s.y * 2}
                r="6"
                fill="var(--bg)"
                stroke="var(--accent)"
                strokeWidth="2"
              />
              <circle
                cx={s.x * 4}
                cy={s.y * 2}
                r="2.2"
                fill="var(--accent)"
              />
              <text
                x={s.x * 4}
                y={s.y * 2 - 11}
                textAnchor="middle"
                fontSize="7.5"
                fill="var(--ink)"
                fontWeight="600"
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="ucd-map-meta">
          <span className="ucd-livedot" /> Live · 6 stops · Next at 30th St in 4
          min
        </div>
      </div>
      <div className="ucd-link-row">
        <a className="ucd-lnk" href="#">
          View full schedule →
        </a>
        <a className="ucd-lnk" href="#">
          Track shuttle live →
        </a>
      </div>
    </div>
  );
}

function EventsAnswer() {
  const events = [
    { d: "MAY", n: "02", title: "Spring Night Market", where: "40th & Walnut", time: "5–10pm" },
    { d: "MAY", n: "09", title: "Outdoor Movie: Coco", where: "Drexel Square", time: "8pm" },
    { d: "MAY", n: "15", title: "Saturday Farmers Market", where: "Clark Park", time: "10am–2pm" },
    { d: "MAY", n: "22", title: "Jazz on the Porch", where: "Cedar Park", time: "6–8pm" },
  ];
  return (
    <div className="ucd-ans">
      <p>Here&apos;s what&apos;s happening in University City this month:</p>
      <ul className="ucd-events">
        {events.map((e, i) => (
          <li key={i}>
            <div className="ucd-date">
              <span className="m">{e.d}</span>
              <span className="n">{e.n}</span>
            </div>
            <div className="ucd-ev-body">
              <h4>{e.title}</h4>
              <p>
                {e.where} · {e.time}
              </p>
            </div>
            <a
              className="ucd-ev-link"
              href="#"
              aria-label={`More about ${e.title}`}
            >
              →
            </a>
          </li>
        ))}
      </ul>
      <div className="ucd-link-row">
        <a className="ucd-lnk" href="#">
          See full calendar →
        </a>
      </div>
    </div>
  );
}

function RestaurantsAnswer() {
  const places = [
    { name: "White Dog Café", tag: "New American · $$$", note: "Local sourcing, courtyard seating." },
    { name: "Han Dynasty", tag: "Sichuan · $$", note: "Get the dan dan noodles." },
    { name: "Renata’s Kitchen", tag: "Italian · $$", note: "Hand-rolled pasta, all day." },
    { name: "Sang Kee Noodle", tag: "Cantonese · $", note: "Wonton soup is the move." },
  ];
  return (
    <div className="ucd-ans">
      <p>
        A few neighborhood favorites — all within a 10-minute walk of campus:
      </p>
      <div className="ucd-cards">
        {places.map((p, i) => (
          <article key={i} className="ucd-card">
            <Placeholder label={p.name} h={120} />
            <div className="ucd-card-body">
              <h4>{p.name}</h4>
              <span className="ucd-meta">{p.tag}</span>
              <p>{p.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function JobsAnswer() {
  return (
    <div className="ucd-ans">
      <p>
        Yes — the Skills Initiative connects residents with hiring partners
        across health, hospitality, and the trades. Here&apos;s how to start:
      </p>
      <ol className="ucd-steps">
        <li>
          <strong>Submit a short profile</strong> — takes about 5 minutes, no
          résumé required.
        </li>
        <li>
          <strong>Get matched to a coach</strong> who reviews open roles with
          you weekly.
        </li>
        <li>
          <strong>Interview prep &amp; wardrobe support</strong> available at no
          cost.
        </li>
        <li>
          <strong>Onboarding follow-up</strong> for the first 90 days on the
          job.
        </li>
      </ol>
      <div className="ucd-cta-row">
        <a className="ucd-cta primary" href="#">
          Start your profile
        </a>
        <a className="ucd-cta ghost" href="#">
          Browse open roles
        </a>
      </div>
      <p className="ucd-hint">
        Average match time last quarter: <strong>11 days</strong>.
      </p>
    </div>
  );
}

function ParksAnswer() {
  const parks = [
    { name: "Clark Park", size: "9.1 acres", tags: ["Farmers Market", "Off-leash", "Concerts"] },
    { name: "Cedar Park", size: "2.4 acres", tags: ["Playground", "Jazz nights"] },
    { name: "Drexel Sq.", size: "1.3 acres", tags: ["Food trucks", "Movies", "Wifi"] },
  ];
  return (
    <div className="ucd-ans">
      <p>Three parks within the district, each with its own personality:</p>
      <div className="ucd-parks">
        {parks.map((p, i) => (
          <div key={i} className="ucd-park">
            <Placeholder label={p.name} h={140} />
            <div className="ucd-park-body">
              <h4>
                {p.name} <span className="ucd-meta">· {p.size}</span>
              </h4>
              <div className="ucd-tags">
                {p.tags.map((t) => (
                  <span key={t} className="ucd-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SponsorAnswer() {
  const items = [
    "Free and open to the public",
    "Hosted within district boundaries",
    "Submitted at least 6 weeks ahead",
    "Aligned with a community partner",
  ];
  return (
    <div className="ucd-ans">
      <p>
        The city co-sponsors roughly{" "}
        <strong>40 community events a year</strong>. The bar is simple:
      </p>
      <div className="ucd-checklist">
        {items.map((c) => (
          <div key={c} className="ucd-check">
            <span className="ucd-ck">✓</span>
            {c}
          </div>
        ))}
      </div>
      <div className="ucd-cta-row">
        <a className="ucd-cta primary" href="#">
          Open the application
        </a>
      </div>
      <p className="ucd-hint">Decisions in 10 business days.</p>
    </div>
  );
}

function SafetyAnswer() {
  return (
    <div className="ucd-ans">
      <p>
        Clean &amp; Safe is the district&apos;s on-the-ground services team. By
        the numbers:
      </p>
      <div className="ucd-stats">
        <div className="ucd-stat">
          <span className="big">42</span>
          <span className="lbl">ambassadors</span>
        </div>
        <div className="ucd-stat">
          <span className="big">7d</span>
          <span className="lbl">coverage</span>
        </div>
        <div className="ucd-stat">
          <span className="big">14k</span>
          <span className="lbl">bags collected/yr</span>
        </div>
        <div className="ucd-stat">
          <span className="big">{"<"}5m</span>
          <span className="lbl">avg response</span>
        </div>
      </div>
      <p>To request a walk-along, report graffiti, or flag an unsafe spot:</p>
      <div className="ucd-link-row">
        <a className="ucd-lnk" href="#">
          Report an issue →
        </a>
        <a className="ucd-lnk" href="#">
          Request an escort →
        </a>
      </div>
    </div>
  );
}

function BusinessAnswer() {
  return (
    <div className="ucd-ans">
      <p>Three programs cover the full lifecycle of opening a storefront:</p>
      <ul className="ucd-biz">
        <li>
          <h4>Storefront Improvement</h4>
          <p>
            Matching grants up to <strong>$15,000</strong> for facade, signage,
            and lighting upgrades.
          </p>
        </li>
        <li>
          <h4>Commercial Corridor Match</h4>
          <p>
            Help finding the right block, broker, and rent benchmark for your
            concept.
          </p>
        </li>
        <li>
          <h4>Permit Concierge</h4>
          <p>One human guides you through L&amp;I, zoning, and health in parallel.</p>
        </li>
      </ul>
      <div className="ucd-link-row">
        <a className="ucd-lnk" href="#">
          Book a free consult →
        </a>
      </div>
    </div>
  );
}

function RehabAnswer() {
  return (
    <div className="ucd-ans">
      <p>
        Yes — the Home Repair Loan Program offers low-interest financing for
        owner-occupied homes within the district.
      </p>
      <Placeholder label="Before / After — Rehab program" h={180} />
      <ul className="ucd-bullets">
        <li>
          Up to <strong>$25,000</strong> per household
        </li>
        <li>0% interest for households under 80% AMI</li>
        <li>Roof, plumbing, electrical, and accessibility work qualify</li>
      </ul>
      <div className="ucd-cta-row">
        <a className="ucd-cta primary" href="#">
          Check eligibility
        </a>
        <a className="ucd-cta ghost" href="#">
          Download the FAQ (PDF)
        </a>
      </div>
    </div>
  );
}

function ContactAnswer() {
  return (
    <div className="ucd-ans">
      <p>Of course. Here&apos;s how to reach a person depending on what you need:</p>
      <table className="ucd-contact">
        <tbody>
          <tr>
            <td>General questions</td>
            <td>
              <a className="ucd-lnk" href="#">
                help@citydesk.org
              </a>
            </td>
            <td>Mon–Fri</td>
          </tr>
          <tr>
            <td>Clean &amp; Safe dispatch</td>
            <td>
              <a className="ucd-lnk" href="#">
                (215) 555-0188
              </a>
            </td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Press</td>
            <td>
              <a className="ucd-lnk" href="#">
                press@citydesk.org
              </a>
            </td>
            <td>Mon–Fri</td>
          </tr>
          <tr>
            <td>Walk-in</td>
            <td>3940 Chestnut St</td>
            <td>9am–5pm</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const ANSWERS: Record<TopicId, () => ReactNode> = {
  events: EventsAnswer,
  shuttle: MapAnswer,
  restaurants: RestaurantsAnswer,
  jobs: JobsAnswer,
  parks: ParksAnswer,
  sponsor: SponsorAnswer,
  safety: SafetyAnswer,
  business: BusinessAnswer,
  rehab: RehabAnswer,
  contact: ContactAnswer,
};

function ChipRow({
  topics,
  onPick,
  disabled,
}: {
  topics: Topic[];
  onPick: (t: Topic) => void;
  disabled: boolean;
}) {
  return (
    <div className="ucd-chips">
      {topics.map((t) => (
        <button
          key={t.id}
          type="button"
          className="ucd-chip"
          onClick={() => onPick(t)}
          disabled={disabled}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="ucd-typing" aria-label="City Desk is typing">
      <span />
      <span />
      <span />
    </div>
  );
}

function TurnRow({ turn }: { turn: Turn }) {
  const Comp = turn.topicId ? ANSWERS[turn.topicId] : null;
  const showTyping = turn.loading && !turn.text;
  const showProse = !!turn.text && !(turn.errored && Comp);
  return (
    <div className="ucd-turn">
      <div className="ucd-bubble user">
        <div className="ucd-who">You</div>
        <div className="ucd-msg">{turn.q}</div>
      </div>
      <div className="ucd-bubble bot">
        <div className="ucd-who">
          <span className="ucd-avatar">CD</span>
          <span>City Desk</span>
        </div>
        {showTyping ? (
          <TypingDots />
        ) : (
          <div className="ucd-ans">
            {showProse && <p>{turn.text}</p>}
            {Comp && <Comp />}
          </div>
        )}
      </div>
    </div>
  );
}

function guessTopic(q: string): TopicId | null {
  const lc = q.toLowerCase();
  const match = TOPICS.find(
    (t) =>
      lc.includes(t.id) ||
      lc.includes(t.label.toLowerCase()) ||
      t.q
        .toLowerCase()
        .split(" ")
        .some((w) => w.length > 4 && lc.includes(w.replace(/[?.,]/g, ""))),
  );
  if (match) return match.id;
  if (lc.includes("job")) return "jobs";
  if (lc.includes("rehab") || lc.includes("home")) return "rehab";
  if (lc.includes("boundar") || lc.includes("safe")) return "safety";
  if (lc.includes("thing")) return "events";
  return null;
}

export function UcdFaqPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [turns]);

  async function ask(q: string, topicId: TopicId | null) {
    if (busy) return;
    if (!q.trim()) return;
    const id = Date.now();
    setBusy(true);
    setInput("");

    const newTurn: Turn = {
      id,
      q,
      topicId,
      loading: true,
      text: "",
      errored: false,
    };
    setTurns((t) => [...t, newTurn]);

    const history: { role: "user" | "assistant"; content: string }[] = [];
    for (const t of turns) {
      history.push({ role: "user", content: t.q });
      if (t.text) {
        history.push({ role: "assistant", content: t.text });
      }
    }

    try {
      const res = await fetch("/api/ucd-faq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, topicId, history }),
      });

      if (!res.ok || !res.body) {
        setTurns((arr) =>
          arr.map((x) =>
            x.id === id
              ? {
                  ...x,
                  loading: false,
                  errored: true,
                  text: "Sorry — something went wrong. Please try again.",
                }
              : x,
          ),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setTurns((arr) =>
          arr.map((x) =>
            x.id === id ? { ...x, loading: false, text: acc } : x,
          ),
        );
      }
    } catch {
      setTurns((arr) =>
        arr.map((x) =>
          x.id === id
            ? {
                ...x,
                loading: false,
                errored: true,
                text: "Sorry — something went wrong. Please try again.",
              }
            : x,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  function onChip(t: Topic) {
    ask(t.q, t.id);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input, guessTopic(input));
  }

  function reset() {
    setTurns([]);
  }

  return (
    <div className="ucd-faq-root">
      <header className="ucd-nav">
        <div className="ucd-nav-inner">
          <div className="ucd-logo">
            <span className="ucd-logo-mark">CD</span>
            <span className="ucd-logo-text">City Desk</span>
          </div>
          <nav className="ucd-nav-links" aria-label="Primary">
            <a href="#">Neighborhood ▾</a>
            <a href="#">Events ▾</a>
            <a href="#">About ▾</a>
            <a href="#">Business ▾</a>
            <a href="#">What We Do ▾</a>
          </nav>
          <div className="ucd-nav-cta">
            <button type="button" className="ucd-pill">
              Donate
            </button>
            <button type="button" className="ucd-icon" aria-label="Language">
              🌐
            </button>
          </div>
        </div>
      </header>

      <main className="ucd-main">
        <div className="ucd-hero">
          <div className="ucd-kicker">THE CITY HELP DESK</div>
          <h1>
            Search all things <em>University City.</em>
          </h1>
        </div>

        <section className="ucd-chatbox" aria-label="FAQ chat">
          <div className="ucd-thread" ref={threadRef} aria-live="polite">
            {turns.length === 0 ? (
              <div className="ucd-empty">
                <div className="ucd-empty-kicker">Welcome</div>
                <p className="ucd-empty-headline">
                  Ask anything about University City — or tap a topic below to
                  get started.
                </p>
                <div className="ucd-empty-suggested">
                  {[
                    "How do I find things to do in University City?",
                    "Can the city help me find a job?",
                    "What are the city's service boundaries?",
                    "How can I rehab my home or commercial property?",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="ucd-sg-btn"
                      onClick={() => ask(q, guessTopic(q))}
                      disabled={busy}
                    >
                      <span>{q}</span>
                      <span className="ucd-plus">+</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              turns.map((t) => <TurnRow key={t.id} turn={t} />)
            )}
          </div>

          <div className="ucd-dock">
            <div className="ucd-dock-chips">
              <ChipRow topics={TOPICS} onPick={onChip} disabled={busy} />
            </div>
            <form className="ucd-search" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder={
                  turns.length === 0
                    ? "Ask anything — or pick a topic above"
                    : "Ask a follow-up…"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask a question"
                maxLength={500}
                disabled={busy}
              />
              {turns.length > 0 && (
                <button
                  type="button"
                  className="ucd-dock-reset"
                  onClick={reset}
                  title="Clear conversation"
                  disabled={busy}
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="ucd-search-btn"
                aria-label="Submit"
                disabled={busy || !input.trim()}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="ucd-foot">
        <div className="ucd-foot-inner">
          <div className="ucd-foot-col">
            <div className="ucd-foot-title">University City Desk</div>
            <p>
              3940 Chestnut Street
              <br />
              Philadelphia, PA 19104
              <br />
              (215) 555-0186
            </p>
          </div>
          <div className="ucd-foot-col">
            <div className="ucd-foot-h">About</div>
            <a href="#">About Us</a>
            <a href="#">Calendar</a>
            <a href="#">FAQ</a>
            <a href="#">In The News</a>
          </div>
          <div className="ucd-foot-col">
            <div className="ucd-foot-h">Get Involved</div>
            <a href="#">Join Our Team</a>
            <a href="#">Annual Review</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="ucd-foot-col">
            <div className="ucd-foot-title">
              Get our <em>Newsletter.</em>
            </div>
            <form
              className="ucd-news-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input placeholder="Enter your address" aria-label="Email" />
              <button aria-label="Subscribe" type="submit">
                →
              </button>
            </form>
          </div>
        </div>
        <div className="ucd-foot-bottom">
          <div className="ucd-socials" aria-hidden>
            <span>▣</span>
            <span>◐</span>
            <span>f</span>
            <span>▶</span>
            <span>𝕏</span>
            <span>◉</span>
            <span>♪</span>
          </div>
          <div className="ucd-legal">© 2026 City Desk · Privacy · Terms</div>
        </div>
      </footer>
    </div>
  );
}
