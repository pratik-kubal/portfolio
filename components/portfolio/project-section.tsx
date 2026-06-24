import type { ReactNode, RefObject } from "react";
import type { Project } from "@/data/portfolio";
import { RichText } from "./rich-text";
import { HighlightDemoCaption } from "./highlight-demo-caption";

function finalMetric(p: Project): string {
  if (p.count) return p.count.to.toFixed(p.count.decimals) + p.count.suffix;
  return p.metric;
}

// Generic sticky-scroll metric card; the right sticky viz is passed as `viz`.
// Animated hooks (data-narr-num / data-narr-h2) are read by the per-section
// motion effects. With no JS / reduced motion the final value shows. The kicker
// label is intentionally NOT tagged (no data-narr-label) and not sticky — it's a
// plain static section label that scrolls with the card, not an animated element.
export function ProjectSection({
  project,
  viz,
  sectionRef,
}: {
  project: Project;
  viz: ReactNode;
  sectionRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      id={project.id}
      data-screen-label={project.screenLabel}
      data-pk-viz={project.viz}
      className="pk-section"
    >
      <div className="pk-split">
        <div className="pk-card">
          <div className="pk-narr-label">
            <p>{project.kicker}</p>
          </div>
          <h2
            data-narr-h2=""
            className={`pk-h2${project.viz === "ring" ? " narrow" : ""}`}
          >
            {project.headline}
          </h2>
          <p className="pk-metric">
            {project.count ? (
              <span data-narr-num="">{finalMetric(project)}</span>
            ) : null}
            {project.metricCaptionIsHighlightDemo ? (
              <small className="pk-metric-hl">
                <HighlightDemoCaption />
              </small>
            ) : (
              <small>{project.metricCaption}</small>
            )}
          </p>
          <h3 className="pk-h3">{project.h3}</h3>
          <p className="pk-body">{project.body}</p>
          <ul className="pk-bullets">
            {project.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className="pk-tags">
            {project.tags.map((t, i) => (
              <span key={i} className="pk-tag">
                {t}
              </span>
            ))}
          </div>
          {project.footnote ? (
            <p className="pk-footnote">
              <RichText line={project.footnote} />
            </p>
          ) : null}
          {project.repo ? (
            <p className="pk-repo">
              <a
                className="pk-mlink"
                href={project.repo.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.repo.text}
              </a>
            </p>
          ) : null}
        </div>
        {viz}
      </div>
    </section>
  );
}
