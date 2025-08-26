"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Github, Linkedin } from "lucide-react"

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  function goToChats(q?: string) {
    var finalQ = (q ?? question).trim();
    if (!finalQ) return;
    finalQ = finalQ.replace("my", "his")
    finalQ = String(finalQ).charAt(0).toUpperCase() + String(finalQ).slice(1)
    router.push(`/chat?question=${encodeURIComponent(finalQ)}`);
  }

  const chips = [
    "my work experience",
    "my professional summary",
    "my Skills",
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">Pratik Kubal</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Software Developer crafting scalable systems and robust architectures
          </p>
        </div>

        {/* Chips Row */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => goToChats(c)}
              className="rounded-full px-4 py-2 text-sm bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
            >
              Ask AI about {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToChats();
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something else about me..."
              className="w-full sm:w-96 rounded-xl border px-3 py-2 border-green-800 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
              onFocus={(e) => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (window.innerWidth < 768) {
                  setTimeout(() => {
                    e.target.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "nearest",
                    })
                  }, 300) // Delay to allow virtual keyboard to appear
                  }
                }}
            />
            <Button disabled={!question.trim()}  type="submit" size="lg" className="rounded-xl px-4 py-2 bg-primary text-primary-foreground">
              <span>Ask AI</span>
            </Button>
          </form>

          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/pratik-kubal" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.linkedin.com/in/pratik-kubal/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
