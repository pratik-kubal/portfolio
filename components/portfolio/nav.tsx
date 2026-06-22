import { ThemeToggle } from "./theme-toggle";
import { LINKS } from "@/data/portfolio";

export function Nav() {
  return (
    <nav className="pk-nav">
      <a href="#top" className="pk-logo">
        pratik-kubal<span className="dot">.com</span>
      </a>
      <div className="pk-nav-right">
        <ThemeToggle />
        <a
          href={LINKS.resume}
          className="pk-btn pk-btn-outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
