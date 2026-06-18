import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio";
import { RichText } from "./rich-text";

const capTop: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  textAlign: "center",
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  color: "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const capBottom: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  textAlign: "center",
  color: "var(--muted)",
};
const node: CSSProperties = {
  position: "absolute",
  top: 175,
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "var(--surface)",
};
const nodeLabel: CSSProperties = {
  position: "absolute",
  top: 218,
  transform: "translateX(-50%)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  color: "var(--ink)",
  whiteSpace: "nowrap",
};

// Hand-drawn ring (Project 01). The rough.js orbit + node outlines and the
// orbiting spark + before→after crossfade are driven by useRingNarrative.
export function RingViz({ project }: { project: Project }) {
  const r = project.ring!;
  return (
    <div className="pk-viz">
      <div style={{ position: "relative", width: "100%", height: 20 }}>
        <p data-state="before" style={capTop}>
          {r.topBefore}
        </p>
        <p data-state="after" style={capTop}>
          {r.topAfter}
        </p>
      </div>

      <div data-wire="" style={{ position: "relative", width: 380, height: 380 }}>
        <svg
          data-ring-orbit=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        />
        <div data-ring-node="" style={{ ...node, left: 5 }} />
        <div style={{ ...nodeLabel, left: 20 }}>Client</div>
        <div
          data-db-node=""
          data-ring-node=""
          style={{ ...node, left: 345, transformOrigin: "center" }}
        />
        <div style={{ ...nodeLabel, left: 360 }}>Database</div>
        <div
          data-spark="1"
          style={{ position: "absolute", left: 0, top: 0, width: 14, height: 14, transform: "translate(13px,183px)" }}
        >
          <div
            data-spark-dot=""
            style={{
              width: 14,
              height: 14,
              borderRadius: "var(--radius-pill)",
              background: "var(--spark)",
              boxShadow: "0 0 8px var(--spark),0 0 18px var(--spark)",
            }}
          />
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "3em" }}>
        <p data-state="before" style={capBottom}>
          {r.bottomBefore}
        </p>
        <p data-state="after" style={capBottom}>
          <RichText line={r.bottomAfter} />
        </p>
      </div>
    </div>
  );
}
