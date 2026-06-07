import Link from "next/link";

const YEAR = 2026;

export function Footer() {
  return (
    <footer className="site-foot" aria-label="Site footer">
      <div className="site-foot__rule" />
      <div className="site-foot__inner">
        <p className="site-foot__copy">
          <span className="site-foot__mark">©</span> {YEAR}{" "}
          <b>Pratik Kubal</b>
          <span className="site-foot__loc"> — Philadelphia, PA</span>
        </p>
        <nav className="site-foot__nav" aria-label="Legal">
          <Link href="/privacy">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
