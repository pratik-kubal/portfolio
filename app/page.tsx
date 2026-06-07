import { Header } from "@/components/header";
import { EditorialCard } from "@/components/editorial-card";
import { Footer } from "@/components/footer";

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
      <Footer />
    </main>
  );
}
