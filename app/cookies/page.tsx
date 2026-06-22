import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";
import { LINKS } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How pratik-kubal.com uses cookies and similar technologies, including third-party visitor analytics and the AI chat assistant.",
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
        two small items in your browser&rsquo;s local storage — not traditional
        cookies, but the same idea. One remembers the theme you pick (light,
        dark, or noir) so the Site looks the way you left it. The other is a
        random ID that lets the AI assistant (&ldquo;Bella&rdquo;) keep track of
        a single conversation across messages. Neither is tied to your name or
        email, and both stay on your device.
      </p>
      <p className="pk-legal-body">
        To understand who&rsquo;s visiting, in aggregate, the Site uses a
        third-party visitor-analytics tool (Apollo.io). It may set its own
        cookies to recognize repeat visits. That data is handled under{" "}
        <a
          className="pk-mlink"
          href="https://www.apollo.io/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apollo&rsquo;s privacy policy
        </a>
        , not mine.
      </p>
      <p className="pk-legal-body">
        The Site also links to or embeds third-party services — such as GitHub,
        LinkedIn, and Spotify — that I don&rsquo;t control and that may set their
        own cookies governed by their own terms.
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
