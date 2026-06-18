import type { RichLine } from "@/data/portfolio";

// Renders a RichLine (mixed plain text / bold-accent / inline link) used by
// footnotes and viz captions.
export function RichText({ line }: { line: RichLine }) {
  return (
    <>
      {line.parts.map((p, i) => {
        if (typeof p === "string") return <span key={i}>{p}</span>;
        if (p.href) {
          return (
            <a
              key={i}
              className="pk-mlink"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.text}
            </a>
          );
        }
        if (p.bold) {
          return (
            <b key={i} style={{ color: "var(--accent-text)", fontWeight: 600 }}>
              {p.text}
            </b>
          );
        }
        return <span key={i}>{p.text}</span>;
      })}
    </>
  );
}
