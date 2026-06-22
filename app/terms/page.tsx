import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";
import { LINKS } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of pratik-kubal.com, its content, and its AI chat assistant.",
  alternates: {
    canonical: "https://pratik-kubal.com/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" lastUpdated="June 22, 2026">
      <p className="pk-legal-lead">
        This is my personal portfolio. By browsing pratik-kubal.com (the
        &ldquo;Site&rdquo;), you agree to these terms — they&rsquo;re meant to be
        short and plain.
      </p>
      <p className="pk-legal-body">
        Everything here — the writing, design, code, and project descriptions —
        is mine unless noted otherwise. You&rsquo;re welcome to read it, link to
        it, and share it, but please don&rsquo;t republish or reuse it as your
        own without asking first.
      </p>
      <p className="pk-legal-body">
        The Site includes an AI assistant (&ldquo;Bella&rdquo;) that answers
        questions about my background. Its replies are generated automatically
        and are for general information only — they can be incomplete or wrong,
        aren&rsquo;t professional advice, and aren&rsquo;t a binding offer or
        commitment. For anything that matters, please confirm with me directly.
      </p>
      <p className="pk-legal-body">
        The Site is provided &ldquo;as is,&rdquo; without warranties of any kind,
        and I&rsquo;m not liable for any loss arising from its use. It may link
        to or embed third-party services (such as GitHub, LinkedIn, or Spotify)
        that I don&rsquo;t control and that carry their own terms.
      </p>
      <p className="pk-legal-body">
        I may update these terms from time to time; the date below reflects the
        latest version. For how I handle data and cookies, see the{" "}
        <a className="pk-mlink" href="/privacy">
          Privacy
        </a>{" "}
        and{" "}
        <a className="pk-mlink" href="/cookies">
          Cookie
        </a>{" "}
        policies. Questions? Reach me at{" "}
        <a className="pk-mlink" href={`mailto:${LINKS.email}`}>
          {LINKS.email}
        </a>
        .
      </p>
    </LegalLayout>
  );
}
