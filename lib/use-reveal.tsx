"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 1, y: 0 },
      {
        scrollTrigger: { 
            trigger: ref.current,
            pin: true,
            start: "top top",
            end: "+=300" }
      }
    );
  }, []);
  return ref;
}
