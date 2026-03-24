import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { StarfieldBackground } from "@/components/starfield-background";
import "./globals.css";

const siteUrl = "https://pratik-kubal.com";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
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
          <StarfieldBackground />
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
