"use client";

import { useEffect } from "react";

// Scroll-scrubbed crossfades between every [data-screen-label] block: each fades
// in as it rises into view and back out as it leaves the top. The last section
// never fades out. Faithful port of initSectionFades() from Portfolio.dc.html.
export function useSectionFades() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const secs = [...document.querySelectorAll<HTMLElement>("[data-screen-label]")];
    if (!secs.length) return;
    const last = secs[secs.length - 1];
    secs.forEach((s) => {
      s.style.willChange = "opacity";
    });
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      secs.forEach((s) => {
        const r = s.getBoundingClientRect();
        const enter = clamp((vh * 0.9 - r.top) / (vh * 0.4), 0, 1);
        const leave = clamp((r.bottom - vh * 0.1) / (vh * 0.35), 0, 1);
        const op = s === last ? enter : Math.min(enter, leave);
        s.style.opacity = op.toFixed(3);
        s.style.pointerEvents = op <= 0.01 ? "none" : "auto";
      });
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      secs.forEach((s) => {
        s.style.opacity = "";
        s.style.pointerEvents = "";
        s.style.willChange = "";
      });
    };
  }, []);
}
