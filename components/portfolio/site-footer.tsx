import { footer } from "@/data/portfolio";
import { SpotifyCard } from "./spotify-card";

const isExternal = (href: string) => /^https?:|^mailto:/.test(href);

export function SiteFooter() {
  return (
    <footer className="pk-footer">
      <div className="pk-foot-row">
        <div className="pk-foot-brand">
          <a href="#top" className="pk-logo">
            pratik-kubal<span className="dot">.com</span>
          </a>
          <p className="pk-foot-tagline">{footer.tagline}</p>

          <div className="pk-foot-divider" aria-hidden="true" />

          {/* Spotify "was listening to" — live via /api/now-playing, static fallback. */}
          <SpotifyCard />
        </div>

        <div className="pk-foot-cols">
          <nav aria-label="Sitemap" className="pk-foot-col">
            <p>Sitemap</p>
            {footer.sitemap.map((l) => (
              <a key={l.href} className="pk-mlink" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Legal" className="pk-foot-col">
            <p>Legal</p>
            {footer.legal.map((l) => (
              <a key={l.href} className="pk-mlink" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Elsewhere" className="pk-foot-col">
            <p>Elsewhere</p>
            {footer.elsewhere.map((l) => (
              <a
                key={l.href}
                className="pk-mlink"
                href={l.href}
                target={isExternal(l.href) ? "_blank" : undefined}
                rel={isExternal(l.href) ? "noopener noreferrer" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="pk-copyright">
        <span>{footer.copyrightLeft}</span>
        <span>{footer.copyrightRight}</span>
      </div>
    </footer>
  );
}
