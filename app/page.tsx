import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // ?ask= deep-links a question into Bella; ?question= kept as a legacy alias.
  const raw = params?.ask ?? params?.question;
  const initialQuestion = typeof raw === "string" ? raw : "";

  return <PortfolioPage initialQuestion={initialQuestion} />;
}
