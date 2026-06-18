import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How pratik-kubal.com collects, uses, and protects your information — including the AI chat assistant, analytics, cookies, and third-party integrations.",
  alternates: {
    canonical: "https://pratik-kubal.com/privacy",
  },
};

// PLACEHOLDER COPY — final wording is supplied by the site owner. It must not be
// shipped as-is. The previous detailed policy is preserved in
// components/privacy-policy.tsx and can be adapted into this layout.
export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="pk-legal-lead">
        Placeholder — the final privacy policy is pending review.
      </p>
      <p className="pk-legal-body">
        For transparency in the meantime: this site runs an AI chat assistant
        (&ldquo;Bella&rdquo;) that logs the questions visitors ask so the
        experience can be improved, and a third-party visitor-analytics tracker
        that may set cookies. The full policy — what is collected, how long it is
        kept, and your choices — will live here.
      </p>
    </LegalLayout>
  );
}
