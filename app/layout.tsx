import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const siteUrl = "https://pratik-kubal.com";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pratik Kubal - Full-Stack Software Engineer",
    template: "%s | Pratik Kubal",
  },
  description:
    "Full-stack software engineer with 5+ years of experience in Java, Python, React, Next.js, and AWS. Specializing in FinTech, microservices, and AI/LLM integration. Based in Philadelphia, PA.",
  keywords: [
    "Pratik Kubal",
    "full-stack engineer",
    "software engineer",
    "Java",
    "Python",
    "React",
    "Next.js",
    "TypeScript",
    "AWS",
    "microservices",
    "FinTech",
    "Philadelphia",
    "portfolio",
  ],
  authors: [{ name: "Pratik Kubal", url: siteUrl }],
  creator: "Pratik Kubal",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Pratik Kubal - Full-Stack Software Engineer",
    description:
      "Full-stack software engineer with 5+ years of experience in Java, Python, React, Next.js, and AWS. Specializing in FinTech, microservices, and AI/LLM integration.",
    siteName: "Pratik Kubal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratik Kubal - Full-Stack Software Engineer",
    description:
      "Full-stack software engineer with 5+ years of experience in Java, Python, React, Next.js, and AWS. Specializing in FinTech, microservices, and AI/LLM integration.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pratik Kubal",
  url: siteUrl,
  email: "pratik-kubal@outlook.com",
  jobTitle: "Full-Stack Software Engineer",
  description:
    "Full-stack software engineer with 5+ years of experience in FinTech, AWS, microservices, and AI/LLM integration.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Philadelphia",
    addressRegion: "PA",
    addressCountry: "US",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "SUNY" },
    { "@type": "CollegeOrUniversity", name: "University of Mumbai" },
  ],
  sameAs: [
    "https://linkedin.com/in/pratik-kubal",
    "https://github.com/pratik-kubal",
    siteUrl,
  ],
  knowsAbout: [
    "Java",
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "AWS",
    "Microservices",
    "FinTech",
    "AI/LLM Integration",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <style>{`
html {
  font-family: var(--font-serif);
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
        <Script
          id="apollo-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){
                var n=Math.random().toString(36).substring(7),
                    o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
                o.async=true;
                o.defer=true;
                o.onload=function(){window.trackingFunctions.onLoad({appId:"69c1476f4668580011e33138"})};
                document.head.appendChild(o)
              }
              initApollo();
            `,
          }}
        />
      </body>
    </html>
  );
}
