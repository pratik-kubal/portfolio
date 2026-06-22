import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio";
import { RichText } from "./rich-text";

const after: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  textAlign: "center",
  color: "var(--muted)",
  opacity: 0,
};

// Hand-drawn paper stack (Project 02). Sheets rain in to a 2.4× pile driven by
// the same headline-tied progress as the count-up (see usePaperStack).
export function PaperStackViz({ project }: { project: Project }) {
  return (
    <div className="pk-viz">
      <div style={{ position: "relative", width: "100%", height: 20, textAlign: "center" }}>
        <p className="pk-viz-top">{project.vizTop}</p>
      </div>

      <div
        data-ps-box=""
        style={{
          position: "relative",
          width: 380,
          height: 380,
          overflow: "hidden",
          background: "var(--bg)",
          borderRadius: "var(--radius-0)",
        }}
      >
        <div
          data-ps-shadow=""
          style={{
            position: "absolute",
            left: "50%",
            bottom: 52,
            width: 236,
            height: 26,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background: "color-mix(in srgb,var(--ink) 13%,transparent)",
            filter: "blur(9px)",
            zIndex: 1,
            opacity: 0.18,
          }}
        />
        <div data-ps-stack="" style={{ position: "absolute", inset: 0, zIndex: 10 }} />
        <div
          data-ps-marks=""
          style={{ position: "absolute", inset: 0, zIndex: 45, opacity: 0, pointerEvents: "none" }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", height: "3em" }}>
        {project.paperstack ? (
          <p data-state-02="after" style={after}>
            <RichText line={project.paperstack.after} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
