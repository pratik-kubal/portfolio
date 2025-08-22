import CareerChat from "@/components/ui/career-chat";

export default function Chat() {
  return (
      <section className="py-20 px-4" id="chat">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ask about my career</h2>
      <CareerChat />
      </section>
  );
}
