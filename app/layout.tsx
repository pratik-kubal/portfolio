import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { StarfieldBackground } from "@/components/starfield-background"
import "./globals.css"
import SmoothScroll from "@/components/ui/smooth-scroll";

export const metadata: Metadata = {
  title: "Pratik Kubal - Backend Developer",
  description:
    "Portfolio of Pratik Kubal, a passionate backend software developer specializing in scalable systems and modern technologies.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <SmoothScroll>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <StarfieldBackground />
            <div className="relative z-10">{children}</div>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
