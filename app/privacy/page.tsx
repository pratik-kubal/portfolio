import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PrivacyPolicy } from "@/components/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How pratik-kubal.com collects, uses, and protects your information — including the AI chat assistant, analytics, cookies, third-party integrations, and your data rights.",
  alternates: {
    canonical: "https://pratik-kubal.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="pp-page">
      <Header />
      <PrivacyPolicy />
      <Footer />
    </main>
  );
}
