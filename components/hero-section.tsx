"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  function goToChats() {
    const q = question.trim();
    router.push(`/chat?question=${encodeURIComponent(q)}`);
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">Pratik Kubal</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Software Developer crafting scalable systems and robust architectures
          </p>
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
            placeholder="Ask about my work, skills, projects..."
            className="w-full sm:w-96 rounded-xl border px-3 py-2"
          />
          <Button type="submit" size="lg" className="text-lg px-8">
            <span>Ask</span>
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
