"use client";

import { useEffect, type RefObject } from "react";
import { loadAnime, loadRough } from "./engines";
import { headlineProgress } from "./headline-progress";

const NS = "http://www.w3.org/2000/svg";

// Project 01 — the 90% latency ring. Count-up, rough.js orbit, the orbiting
// spark, and the before→after crossfade all key off one headline-tied progress,
// so they land on the same scroll frame. Port of initRoughRing + initNarrative.
export function useRingNarrative(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scrolly = sectionRef.current;
    if (!scrolly) return;
    const num = scrolly.querySelector<HTMLElement>("[data-narr-num]");
    const spark = scrolly.querySelector<HTMLElement>('[data-spark="1"]');
    const dot = spark ? spark.querySelector<HTMLElement>("[data-spark-dot]") : null;
    const beforeEls = [...scrolly.querySelectorAll<HTMLElement>('[data-state="before"]')];
    const afterEls = [...scrolly.querySelectorAll<HTMLElement>('[data-state="after"]')];
    const h2El = scrolly.querySelector<HTMLElement>("[data-narr-h2]");
    const labelEl = scrolly.querySelector<HTMLElement>("[data-narr-label]");
    const wire = scrolly.querySelector<HTMLElement>("[data-wire]");
    const dbNode = scrolly.querySelector<HTMLElement>("[data-db-node]");
    const orbitSvg = scrolly.querySelector<SVGElement>("[data-ring-orbit]");
    const setNum = (v: number) => {
      if (num) num.textContent = Math.min(90, Math.round(v)) + "%";
    };
    const showAfter = () => {
      beforeEls.forEach((e) => (e.style.opacity = "0"));
      afterEls.forEach((e) => (e.style.opacity = "1"));
      if (dbNode) dbNode.style.transform = "scale(1)";
      if (dot) {
        dot.style.background = "var(--accent-fill)";
        dot.style.boxShadow = "0 0 8px var(--accent-fill),0 0 18px var(--accent-fill)";
      }
    };

    let disposed = false;
    let visible = true;
    let streakRaf = 0;
    let scrollTick = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const onScrollFns: (() => void)[] = [];

    // ── rough.js orbit + node outlines (colors are CSS vars → theme-tracking) ──
    loadRough().then((rough) => {
      if (disposed || !rough || !wire) return;
      const inkStroke = (el: Element) =>
        el.querySelectorAll("path").forEach((p) => {
          (p as SVGElement).style.stroke = "var(--ink)";
          (p as SVGElement).style.fill = "none";
        });
      if (orbitSvg) {
        orbitSvg.innerHTML = "";
        const ring = rough
          .svg(orbitSvg)
          .circle(190, 190, 340, {
            stroke: "#16170F",
            strokeWidth: 2,
            roughness: 1.9,
            bowing: 1.4,
            fill: "#6F7D00",
            fillStyle: "hachure",
            fillWeight: 1,
            hachureGap: 3.2,
            hachureAngle: -41,
          });
        orbitSvg.appendChild(ring);
        const op = [...ring.querySelectorAll("path")] as SVGElement[];
        op.forEach((p) => (p.style.fill = "none"));
        const oOutline = op[op.length - 1];
        op.slice(0, -1).forEach((p) => {
          p.style.stroke = "var(--accent)";
          p.style.opacity = "0.16";
        });
        if (oOutline) {
          oOutline.style.stroke = "var(--ink)";
          oOutline.style.opacity = "0.4";
        }
      }
      wire.querySelectorAll("[data-ring-node]").forEach((node) => {
        node.querySelectorAll("[data-rough-node]").forEach((s) => s.remove());
        const ns = document.createElementNS(NS, "svg");
        ns.setAttribute("viewBox", "0 0 30 30");
        ns.setAttribute("data-rough-node", "");
        ns.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;";
        node.appendChild(ns);
        const c = rough.svg(ns).circle(15, 15, 25, { stroke: "#16170F", strokeWidth: 1.4, roughness: 1.5 });
        ns.appendChild(c);
        inkStroke(c);
      });
    });

    // ── narrative scroll + spark loop ──
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setNum(90);
      showAfter();
      return () => {
        disposed = true;
      };
    }

    loadAnime().then((mod) => {
      if (disposed) return;
      const animate = mod && mod.animate;
      if (!animate) {
        setNum(90);
        showAfter();
        return;
      }
      const CX = 190, CY = 190, R = 170, A0 = 180, B_DEG = 360, C_DEG = 540;
      const TRAIL_MS = 100, SEG = 16;
      const segs: SVGPathElement[] = [];
      if (orbitSvg) {
        for (let i = 0; i < SEG; i++) {
          const p = document.createElementNS(NS, "path") as SVGPathElement;
          p.setAttribute("data-spark-streak", "");
          p.style.cssText =
            "fill:none;stroke:var(--spark);stroke-linecap:round;opacity:0;filter:drop-shadow(0 0 5px var(--spark));";
          orbitSvg.appendChild(p);
          segs.push(p);
        }
      }
      const hist: { cx: number; cy: number; t: number }[] = [];
      const place = (deg: number) => {
        const t = (deg * Math.PI) / 180;
        const cx = CX + R * Math.cos(t), cy = CY + R * Math.sin(t);
        if (spark) spark.style.transform = `translate(${(cx - 7).toFixed(1)}px, ${(cy - 7).toFixed(1)}px)`;
        hist.unshift({ cx, cy, t: performance.now() });
        if (hist.length > 80) hist.pop();
      };
      const renderStreak = () => {
        if (disposed || !visible) {
          streakRaf = 0;
          return;
        }
        const now = performance.now();
        while (hist.length && now - hist[hist.length - 1].t > TRAIL_MS) hist.pop();
        for (let i = 0; i < SEG; i++) {
          const a = hist[i], b = hist[i + 1], p = segs[i];
          if (!p) break;
          if (!a || !b) {
            p.style.opacity = "0";
            continue;
          }
          const fr = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
          p.setAttribute("d", `M ${a.cx.toFixed(1)} ${a.cy.toFixed(1)} L ${b.cx.toFixed(1)} ${b.cy.toFixed(1)}`);
          p.style.strokeWidth = (2 + 4 * fr).toFixed(1);
          p.style.opacity = (0.85 * fr).toFixed(3);
        }
        streakRaf = requestAnimationFrame(renderStreak);
      };

      const setSparkColor = (col: string) => {
        if (dot) {
          dot.style.background = col;
          dot.style.boxShadow = `0 0 8px ${col},0 0 18px ${col}`;
        }
        segs.forEach((p) => {
          p.style.stroke = col;
          p.style.filter = `drop-shadow(0 0 5px ${col})`;
        });
      };
      setSparkColor("var(--spark)");

      if (num) num.style.display = "inline-block";
      if (dbNode) dbNode.style.transform = "scale(1.7)";
      if (spark) place(A0);
      setNum(0);
      beforeEls.forEach((e) => (e.style.opacity = "1"));
      afterEls.forEach((e) => (e.style.opacity = "0"));

      let isAfter = false, transitioned = false;
      const enterAfter = () => {
        if (transitioned) return;
        transitioned = true;
        isAfter = true;
        setSparkColor("var(--accent-fill)");
        animate(beforeEls, { opacity: 0, duration: 280, ease: "out(2)" });
        animate(afterEls, { opacity: [0, 1], translateY: [6, 0], duration: 460, ease: "out(3)" });
        if (wire) animate(wire, { scale: [1, 1.07, 1], duration: 640, ease: "inOut(2)" });
        if (num) animate(num, { scale: [1, 1.16, 1], duration: 560, ease: "inOut(2)" });
        if (dbNode) animate(dbNode, { scale: [1.7, 1], duration: 760, ease: "out(3)" });
        if (labelEl)
          animate(labelEl, {
            opacity: [1, 0],
            translateY: [0, -16],
            duration: 460,
            ease: "in(2)",
            onComplete: () => {
              labelEl.style.position = "static";
            },
          });
      };
      const exitAfter = () => {
        if (!transitioned) return;
        transitioned = false;
        isAfter = false;
        setSparkColor("var(--spark)");
        beforeEls.forEach((e) => (e.style.opacity = "1"));
        afterEls.forEach((e) => {
          e.style.opacity = "0";
          e.style.transform = "";
        });
        if (wire) wire.style.transform = "";
        if (num) num.style.transform = "";
        if (dbNode) dbNode.style.transform = "scale(1.7)";
        if (labelEl) {
          labelEl.style.position = "sticky";
          labelEl.style.opacity = "1";
          labelEl.style.transform = "";
        }
      };
      let tripScheduled = false;
      const loopTrip = () => {
        if (disposed || !visible || !spark) {
          tripScheduled = false;
          return;
        }
        spark.style.opacity = "1";
        const o = { a: A0 };
        place(A0);
        timers.push(
          setTimeout(() => {
            if (disposed) return;
            animate(o, {
              a: B_DEG,
              duration: 250,
              ease: "inOut(2)",
              onUpdate: () => place(o.a),
              onComplete: () => {
                const hold = isAfter ? 200 : 2000;
                if (dot) dot.style.animation = "pkspark .6s ease-in-out infinite";
                timers.push(
                  setTimeout(() => {
                    if (disposed) return;
                    if (dot) dot.style.animation = "";
                    animate(o, { a: C_DEG, duration: 300, ease: "inOut(2)", onUpdate: () => place(o.a), onComplete: loopTrip });
                  }, hold),
                );
              },
            });
          }, 500),
        );
      };
      const update = () => {
        if (!h2El) return;
        const { prog, top: h2top } = headlineProgress(h2El);
        setNum(transitioned ? 90 : prog * 90);
        if (h2top <= 76) enterAfter();
        else if (h2top > 200) exitAfter();
      };
      const onScroll = () => {
        if (!scrollTick) {
          scrollTick = true;
          requestAnimationFrame(() => {
            scrollTick = false;
            update();
          });
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", update);
      onScrollFns.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", update);
      });
      update();

      // Pause the spark streak + orbit trip while the section is off-screen so
      // they aren't burning rAF/anime cycles on a viz nobody can see.
      const startTrip = () => {
        if (tripScheduled) return;
        tripScheduled = true;
        loopTrip();
      };
      const sectionIO = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) {
            if (segs.length && !streakRaf)
              streakRaf = requestAnimationFrame(renderStreak);
            startTrip();
          } else if (streakRaf) {
            cancelAnimationFrame(streakRaf);
            streakRaf = 0;
          }
        },
        { threshold: 0 },
      );
      sectionIO.observe(scrolly);
      onScrollFns.push(() => sectionIO.disconnect());
    });

    return () => {
      disposed = true;
      if (streakRaf) cancelAnimationFrame(streakRaf);
      timers.forEach(clearTimeout);
      onScrollFns.forEach((fn) => fn());
      if (orbitSvg) orbitSvg.innerHTML = "";
      scrolly.querySelectorAll("[data-rough-node]").forEach((s) => s.remove());
    };
  }, [sectionRef]);
}
