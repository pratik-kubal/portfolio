"use client";
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import Chat from "@/components/career-chat"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <Chat></Chat>
      <Footer />
    </main>
  )
}
