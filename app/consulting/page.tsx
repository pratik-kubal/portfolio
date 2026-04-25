import type { Metadata } from "next";
import { Header } from "@/components/header";
import { ConsultingPage } from "@/components/consulting-page";

export const metadata: Metadata = {
  title: "Consulting",
  description:
    "Independent advisory practice — AI readiness assessments and nonprofit AI strategy. Written, short engagements, honest about uncertainty.",
  alternates: {
    canonical: "https://pratik-kubal.com/consulting",
  },
};

export default function Consulting() {
  return (
    <main className="page-transition">
      <Header />
      <ConsultingPage />
    </main>
  );
}
