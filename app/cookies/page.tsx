import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How pratik-kubal.com uses cookies and similar technologies, including third-party visitor analytics and the AI chat assistant.",
  alternates: {
    canonical: "https://pratik-kubal.com/cookies",
  },
};

// PLACEHOLDER COPY — final wording is supplied by the site owner. Do not ship as-is.
export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p className="pk-legal-lead">
        Placeholder — the final cookie policy is pending review.
      </p>
      <p className="pk-legal-body">
        This site uses a third-party visitor-analytics tracker, which may set
        cookies, and stores a small identifier in your browser so the chat
        assistant can keep context across messages. The full disclosure — cookie
        names, purposes, durations, and how to opt out — will live here.
      </p>
    </LegalLayout>
  );
}
