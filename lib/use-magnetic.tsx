// lib/useMagnetic.ts
"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";

type Opts = { strength?: number; radius?: number; disableOnTouch?: boolean };

export function useMagnetic(
  ref: RefObject<HTMLElement>,
  { strength = 0.25, radius = 160, disableOnTouch = true }: Opts = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disableOnTouch && "ontouchstart" in window) return;

    el.style.willChange = "transform";

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const mx = e.clientX - cx;
      const my = e.clientY - cy;
      const dist = Math.hypot(mx, my);

      if (dist > radius) {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        return;
      }
      gsap.to(el, {
        x: mx * strength,
        y: my * strength,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength, radius, disableOnTouch]);
}
