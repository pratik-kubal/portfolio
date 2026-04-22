import type { Metadata } from "next";
import { Header } from "@/components/header";
import CareerChat from "@/components/ui/career-chat";

export const metadata: Metadata = {
  title: "AI Career Assistant",
  description:
    "Chat with an AI assistant to learn about Pratik Kubal's skills, experience, and projects in full-stack engineering, FinTech, and cloud architecture.",
  robots: { index: false, follow: false },
};

export default async function Chat({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialQuestion =
    typeof params?.question === "string" ? params.question : "";

  return (
    <main className="page-transition">
      <Header />
      <CareerChat initialQuestion={initialQuestion} variant="page" />
    </main>
  );
}
