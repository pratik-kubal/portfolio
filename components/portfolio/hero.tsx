import { hero, LINKS } from "@/data/portfolio";
import { MobiusFigure } from "./mobius-figure";

export function Hero() {
  return (
    <header data-screen-label="Hero" className="pk-hero pk-bleed">
      <div className="pk-hero-inner">
        <div className="pk-hero-top">
          <div className="pk-hero-intro">
            <p className="pk-kicker">{hero.kicker}</p>
            <h1 className="pk-h1">{hero.name}</h1>
            <p className="pk-subhead">{hero.subhead}</p>
            <p className="pk-hero-muted">{hero.muted}</p>
          </div>
          <div className="pk-hero-figwrap">
            <MobiusFigure />
          </div>
        </div>

        <div className="pk-hero-lower">
          <p className="pk-hero-body">{hero.body}</p>
          <div className="pk-cta-row">
            <a href="#work" className="pk-btn pk-btn-fill">
              My Work
            </a>
            <a
              href={LINKS.resume}
              className="pk-btn pk-btn-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
            <span className="pk-cta-links">
              <a
                className="pk-mlink"
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
              <a
                className="pk-mlink"
                href={LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </span>
          </div>
          <p className="pk-scrollhint">
            {hero.scrollHint} <span aria-hidden="true">↓</span>
          </p>
        </div>
      </div>
    </header>
  );
}
