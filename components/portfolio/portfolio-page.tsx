"use client";

import { useRef } from "react";
import { projects } from "@/data/portfolio";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { ProjectSection } from "./project-section";
import { BellaDemoConversation } from "./bella-demo-conversation";
import { RingViz } from "./ring-viz";
import { PaperStackViz } from "./paper-stack-viz";
import { Nonprofit } from "./nonprofit";
import { About } from "./about";
import { SiteFooter } from "./site-footer";
import { ScrollSpine } from "./scroll-spine";
import { BellaWidget, type BellaController } from "./bella-widget";
import { HighlightToAsk } from "./highlight-to-ask";
import { useSectionFades } from "@/lib/portfolio/use-section-fades";
import { useRingNarrative } from "@/lib/portfolio/use-ring-narrative";
import { usePaperStack } from "@/lib/portfolio/use-paper-stack";
import { useHighlightDemo } from "@/lib/portfolio/use-highlight-demo";
import { useBellaDemoScrub } from "@/lib/portfolio/use-bella-demo-scrub";

// Themed root + composition for the v2 portfolio. `initialQuestion` deep-links a
// question straight into Bella (?ask= / ?question=).
export function PortfolioPage({
  initialQuestion = "",
}: {
  initialQuestion?: string;
}) {
  const [bella, ring, paper] = projects;
  const bellaSectionRef = useRef<HTMLElement | null>(null);
  const ringSectionRef = useRef<HTMLElement | null>(null);
  const paperSectionRef = useRef<HTMLElement | null>(null);
  const bellaControllerRef = useRef<BellaController | null>(null);

  useSectionFades();
  useHighlightDemo(bellaSectionRef);
  useBellaDemoScrub(bellaSectionRef);
  useRingNarrative(ringSectionRef);
  usePaperStack(paperSectionRef);

  return (
    <div id="top" className="pk-root">
      <Nav />
      <main className="pk-main">
        <Hero />
        <ProjectSection
          project={bella}
          viz={<BellaDemoConversation project={bella} />}
          sectionRef={bellaSectionRef}
        />
        <ProjectSection
          project={ring}
          viz={<RingViz project={ring} />}
          sectionRef={ringSectionRef}
        />
        <ProjectSection
          project={paper}
          viz={<PaperStackViz project={paper} />}
          sectionRef={paperSectionRef}
        />
        <Nonprofit />
        <About />
        <SiteFooter />
      </main>
      <ScrollSpine />
      <BellaWidget
        controllerRef={bellaControllerRef}
        initialQuestion={initialQuestion}
      />
      <HighlightToAsk controllerRef={bellaControllerRef} />
    </div>
  );
}
