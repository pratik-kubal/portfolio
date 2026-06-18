import type { ReactNode } from "react";

// Shared shell for the v2 legal pages (Privacy / Cookies / Terms): minimal nav,
// centered 680px column, "Legal" kicker, h1, body, pending pill, back button.
// Renders inside .pk-root so it follows the active theme.
export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div id="top" className="pk-root pk-legal">
      <nav className="pk-nav">
        <a href="/" className="pk-logo">
          pratik-kubal<span className="dot">.com</span>
        </a>
        <a href="/" className="pk-mlink pk-legal-back">
          ← Back to home
        </a>
      </nav>

      <main className="pk-legal-main">
        <p className="pk-legal-kicker">Legal</p>
        <h1 className="pk-legal-h1">{title}</h1>
        {children}
        <span className="pk-legal-pill">
          <span className="dot" aria-hidden="true" />
          Last updated — pending
        </span>
        <a href="/" className="pk-btn pk-legal-backbtn">
          ← Back to pratik-kubal.com
        </a>
      </main>

      <footer className="pk-legal-foot">
        © 2026 Pratik Kubal. All rights reserved.
      </footer>
    </div>
  );
}
