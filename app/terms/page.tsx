import type { Metadata } from "next";
import { LegalLayout } from "@/components/portfolio/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of pratik-kubal.com, its content, and its AI chat assistant.",
  alternates: {
    canonical: "https://pratik-kubal.com/terms",
  },
};

// PLACEHOLDER COPY — final wording is supplied by the site owner. Do not ship as-is.
export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use">
      <p className="pk-legal-lead">
        Placeholder — the final terms of use are pending review.
      </p>
      <p className="pk-legal-body">
        This is a personal portfolio. Content is shared for reference; please
        don&rsquo;t reproduce it without permission. The full terms governing use
        of this site and its AI chat assistant will live here.
      </p>
    </LegalLayout>
  );
}
