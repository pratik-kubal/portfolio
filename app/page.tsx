import { Header } from "@/components/header";
import { EditorialCard } from "@/components/editorial-card";

export default async function Home({
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
      <EditorialCard initialQuestion={initialQuestion} />
    </main>
  );
}
