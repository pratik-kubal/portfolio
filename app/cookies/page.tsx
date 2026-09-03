import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";
import { LINKS } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How pratik-kubal.com uses cookies and similar technologies, including local storage for theme preferences and the AI chat assistant.",
  alternates: {
    canonical: "https://pratik-kubal.com/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="June 22, 2026">
      <p className="pk-legal-lead">
        This is my personal portfolio, so there isn&rsquo;t much to track. I
        don&rsquo;t run advertising cookies, and I don&rsquo;t sell or share
        anything about you. Here&rsquo;s the short, plain version of what gets
        stored in your browser and why.
      </p>
      <p className="pk-legal-body">
        To keep things working, pratik-kubal.com (the &ldquo;Site&rdquo;) saves
        three small items in your browser&rsquo;s local storage — not traditional
        cookies, but the same idea. One remembers the theme you pick (light,
        dark, or noir) so the Site looks the way you left it. Another is a
        random ID that lets the AI assistant (&ldquo;Bella&rdquo;) keep track of
        a single conversation across messages. The third caches the carbon
        estimate shown in the footer badge so the page isn&rsquo;t re-measured on
        every visit. None is tied to your name or email, and all stay on your
        device.
      </p>
      <p className="pk-legal-body">
        The Site doesn&rsquo;t use any third-party advertising or
        visitor-tracking cookies. It does link to or embed third-party services —
        such as GitHub, LinkedIn, Spotify, and Website Carbon — that I
        don&rsquo;t control and that may set their own cookies governed by their
        own terms.
      </p>
      <p className="pk-legal-body">
        You&rsquo;re in control. Most browsers let you block or delete cookies
        and clear site data, and private or incognito windows won&rsquo;t keep
        any of it. Blocking won&rsquo;t break the Site — you&rsquo;ll just lose
        your saved theme and chat history. For more on how I handle data, see
        the{" "}
        <a className="pk-mlink" href="/privacy">
          Privacy
        </a>{" "}
        policy. Questions? Reach me at{" "}
        <a className="pk-mlink" href={`mailto:${LINKS.email}`}>
          {LINKS.email}
        </a>
        .
      </p>
    </LegalLayout>
  );
}
