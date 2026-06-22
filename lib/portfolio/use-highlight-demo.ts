"use client";

import { useEffect, type RefObject } from "react";
import { loadAnime } from "./engines";
import { headlineProgress } from "./headline-progress";

// Scroll-scrubbed "user highlights the text" moment in the AI-Engineering caption:
// words light up as the line rises through a band, then the "Ask Bella about it"
// popup pops in. Port of initHighlightDemo from Portfolio.dc.html.
export function useHighlightDemo(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const demo = root.querySelector<HTMLElement>("[data-hl-demo]");
    if (!demo) return;
    const words = [...demo.querySelectorAll<HTMLElement>("[data-hl-word]")];
    const pop = demo.querySelector<HTMLElement>("[data-hl-pop]");
    const h2El = root.querySelector<HTMLElement>("[data-narr-h2]");
    if (!words.length) return;

    const lit = (w: HTMLElement, on: boolean) => {
      w.style.background = on ? "var(--accent-fill)" : "transparent";
      w.style.color = on ? "var(--on-accent)" : w.dataset.base || "var(--ink)";
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => lit(w, true));
      return;
    }

    if (pop) {
      pop.style.opacity = "0";
      pop.style.transform = "translateY(6px) scale(.92)";
      pop.style.transition = "opacity .28s ease, transform .28s ease";
    }
    let ticking = false;
    let shown = false;
    let disposed = false;

    const update = () => {
      // Key off the headline (same progress as the chatbox scrub / projects 2 & 3),
      // so the words light up and the popup focuses in together with the diagram.
      const { prog } = headlineProgress(h2El);
      const n = Math.round(prog * words.length);
      words.forEach((w, i) => lit(w, i < n));
      const done = prog >= 1;
      if (done === shown) return;
      shown = done;
      if (!pop) return;
      if (done) {
        pop.style.opacity = "1";
        pop.style.transform = "translateY(0) scale(1)";
        loadAnime().then((m) => {
          if (!disposed && m && m.animate && shown)
            m.animate(pop, { scale: [1, 1.07, 1], duration: 460, ease: "inOut(2)" });
        });
      } else {
        pop.style.opacity = "0";
        pop.style.transform = "translateY(6px) scale(.92)";
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          update();
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);
}
