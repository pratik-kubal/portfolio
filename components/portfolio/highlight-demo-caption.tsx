import type { CSSProperties } from "react";

// The AI-Engineering metric caption doubles as a "highlight any text → ask Bella"
// teaser: words light up one-by-one as the line scrolls through a band, then the
// popup focuses in (driven by useHighlightDemo). Final/no-JS state = all lit + popup.
const WORDS = ["You", "can", "highlight", "any", "text", "on", "this", "page", "to"];

const wordStyle: CSSProperties = {
  color: "var(--accent-text)",
  padding: "1px 0",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const popStyle: CSSProperties = {
  position: "absolute",
  left: "66%",
  top: "calc(100% + 8px)",
  pointerEvents: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "var(--surface)",
  border: "var(--line-w) solid var(--ink)",
  boxShadow: "var(--shadow-block)",
  borderRadius: "var(--radius-1)",
  padding: "5px 10px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  fontWeight: 500,
  textTransform: "none",
  letterSpacing: 0,
  color: "var(--ink)",
};

export function HighlightDemoCaption() {
  return (
    <span
      data-hl-demo=""
      style={{
        position: "relative",
        display: "inline-block",
        maxWidth: "100%",
        fontWeight: 700,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {WORDS.map((w, i) => (
        <span key={i} data-hl-word="" data-base="var(--accent-text)" style={wordStyle}>
          {w}
          {i < WORDS.length - 1 ? " " : ""}
        </span>
      ))}
      <span data-hl-pop="" aria-hidden="true" role="presentation" style={popStyle}>
        <span
          aria-hidden="true"
          style={{ width: 7, height: 7, background: "var(--accent-fill)", transform: "rotate(45deg)", display: "inline-block", flex: "none" }}
        />
        Ask Bella about it
      </span>
    </span>
  );
}
