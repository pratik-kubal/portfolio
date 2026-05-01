import type { Metadata } from "next";
import { Header } from "@/components/header";
import { AdvisorPage } from "@/components/advisor-page";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Independent AI / technical solutions — chatbots, automations, and integrations designed, built, and deployed for small businesses and nonprofits. Technical scoping, running pilots, and handoff docs your team can maintain.",
  alternates: {
    canonical: "https://pratik-kubal.com/solutions",
  },
};

export default function Solutions() {
  return (
    <main className="page-transition">
      <Header />
      <AdvisorPage />
    </main>
  );
}
