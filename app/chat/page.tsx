import { Header } from "@/components/header"
import CareerChat from "@/components/ui/career-chat";

export default async function Chat({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialQuestion =
    typeof params?.question === "string" ? params.question : "";

  return (
    <main className="min-h-screen">
      <Header />
      <div>
        <CareerChat initialQuestion = {initialQuestion}/>
      </div>
    </main>
  );
}
