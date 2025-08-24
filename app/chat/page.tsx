import { Header } from "@/components/header"
import CareerChat from "@/components/ui/career-chat";

export default function Chat() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <CareerChat />
      </div>
    </main>
  );
}
