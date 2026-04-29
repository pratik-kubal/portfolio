import type { Metadata } from "next";
import { Header } from "@/components/header";
import { AdvisorPage } from "@/components/advisor-page";

export const metadata: Metadata = {
  title: "Advisor",
  description:
    "Independent advisory practice — conversational AI & FAQ automation, AI readiness assessments, and nonprofit AI strategy. Written, short engagements, honest about uncertainty.",
  alternates: {
    canonical: "https://pratik-kubal.com/advisor",
  },
};

export default function Advisor() {
  return (
    <main className="page-transition">
      <Header />
      <AdvisorPage />
    </main>
  );
}
