"use client";

import { useEffect, type RefObject } from "react";
import { useTheme } from "next-themes";
import { loadAnime, loadRough } from "./engines";

const NS = "http://www.w3.org/2000/svg";

interface Sheet {
  el: HTMLDivElement;
  i: number;
  restTX: number;
  restTY: number;
  restRot: number;
  rainSX: number;
  rainSY: number;
  rainSRot: number;
  phase: number;
  launch: number;
  fallLen: number;
}

// Project 02 — the 2.4× throughput paper stack. The hand-drawn sheets rain in
// and stack as ONE headline-tied progress drives them, the 1.0×→2.4× count-up,
// and the before→after focus together. Port of initThroughput + the psXxx() set.
// Rebuilds the rough.js sheets on theme change (colors are baked into the paths).
export function usePaperStack(sectionRef: RefObject<HTMLElement | null>) {
  const { theme } = useTheme();
  useEffect(() => {
    const scrolly = sectionRef.current;
    if (!scrolly) return;
    const num = scrolly.querySelector<HTMLElement>("[data-narr-num]");
    const h2El = scrolly.querySelector<HTMLElement>("[data-narr-h2]");
    const labelEl = scrolly.querySelector<HTMLElement>("[data-narr-label]");
    const box = scrolly.querySelector<HTMLElement>("[data-ps-box]");
    const beforeEls = [...scrolly.querySelectorAll<HTMLElement>('[data-state-02="before"]')];
    const afterEls = [...scrolly.querySelectorAll<HTMLElement>('[data-state-02="after"]')];
    const psStackEl = scrolly.querySelector<HTMLElement>("[data-ps-stack]");
    const psMarksEl = scrolly.querySelector<HTMLElement>("[data-ps-marks]");
    const psShadowEl = scrolly.querySelector<HTMLElement>("[data-ps-shadow]");
    if (!psStackEl) return;

    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const setNum = (v: number) => {
      if (num) num.textContent = v.toFixed(1) + "×";
    };
    const showAfter = () => {
      beforeEls.forEach((e) => (e.style.opacity = "0"));
      afterEls.forEach((e) => (e.style.opacity = "1"));
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let rough: any = null;
    let sheets: Sheet[] = [];
    let psN = 12;
    let geo: Record<string, number> = {};
    let pal: Record<string, string> | null = null;
    let psP = 0;
    let ready = false;
    let disposed = false;
    let scrollTick = false;
    const cleanups: (() => void)[] = [];

    const hexMix = (a: string, b: string, t: number) => {
      const parse = (h: string) => {
        h = String(h).trim().replace("#", "");
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      };
      const A = parse(a), B = parse(b);
      const ch = (i: number) =>
        Math.max(0, Math.min(255, Math.round(A[i] * t + B[i] * (1 - t)))).toString(16).padStart(2, "0");
      return "#" + ch(0) + ch(1) + ch(2);
    };

    const psPalette = () => {
      const root = document.getElementById("top") || document.documentElement;
      const cs = getComputedStyle(root);
      const get = (n: string, fb: string) => cs.getPropertyValue(n).trim() || fb;
      const ink = get("--ink", "#16170F");
      const surface = get("--surface", "#FCFCF8");
      const accentFill = get("--accent-fill", "#C7DD3A");
      const onAccent = get("--on-accent", "#1F2400");
      const muted = get("--muted", "#5F6356");
      const bg = get("--bg", "#F4F5F0");
      return { ink, surface, accentFill, onAccent, muted, bg, addedPaper: hexMix(accentFill, surface, 0.6) };
    };

    const psMakeSheetSVG = (
      seed: number,
      w: number,
      skew: number,
      code: string,
      p: Record<string, string>,
      paperFill: string,
      chipFill: string,
      chipText: string,
    ) => {
      const CX = 190, CY = 130, drop = 16, depth = 33;
      const bL = [CX - w - skew * 0.4, CY - depth - 6];
      const fL = [CX - w, CY + drop];
      const bR = [CX + w - skew, CY - depth];
      const fR = [CX + w, CY + drop * 0.45];
      const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const Ledge = (v: number) => lerp(bL, fL, v);
      const Redge = (v: number) => lerp(bR, fR, v);
      let s = (seed * 2654435) % 2147483647;
      if (s <= 0) s += 2147483646;
      const rnd = () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
      const svg = document.createElementNS(NS, "svg");
      const rc = rough.svg(svg);
      svg.appendChild(
        rc.polygon([fL, fR, bR, bL], {
          fill: paperFill,
          fillStyle: "solid",
          stroke: p.ink,
          strokeWidth: 1.9,
          roughness: 1.5,
          bowing: 1.5,
          seed,
        }),
      );
      [0.52, 0.66, 0.8, 0.92].forEach((v, k) => {
        const L = Ledge(v), Rr = Redge(v);
        const frac = 0.55 + rnd() * 0.36;
        const a = lerp(L, Rr, 0.13), b = lerp(L, Rr, 0.13 + frac * 0.78);
        svg.appendChild(rc.line(a[0], a[1], b[0], b[1], { stroke: p.muted, strokeWidth: 0.95, roughness: 1.5, bowing: 0.9, seed: seed + 11 + k }));
      });
      const anchor = lerp(Ledge(0.27), Redge(0.27), 0.07);
      const cw = 50, chh = 16, cx = anchor[0], cy = anchor[1] - chh * 0.5;
      svg.appendChild(
        rc.rectangle(cx, cy, cw, chh, { fill: chipFill, fillStyle: "solid", stroke: p.ink, strokeWidth: 1.25, roughness: 1.15, bowing: 0.6, seed: seed + 5 }),
      );
      const tx = cx + cw / 2, ty = cy + chh / 2 + 3.3;
      const txt = document.createElementNS(NS, "text");
      txt.setAttribute("x", String(tx));
      txt.setAttribute("y", String(ty));
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-family", "'Geist Mono', ui-monospace, monospace");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", "600");
      txt.setAttribute("letter-spacing", "0.04em");
      txt.setAttribute("fill", chipText);
      txt.setAttribute("transform", "rotate(-2.5 " + tx + " " + ty + ")");
      txt.textContent = code || "DOC";
      svg.appendChild(txt);
      return (
        '<svg xmlns="' + NS + '" viewBox="0 0 380 260" width="380" height="260" style="position:absolute;left:0;top:0;overflow:visible;display:block;">' +
        svg.innerHTML +
        "</svg>"
      );
    };

    const psDrawMarks = () => {
      if (!psMarksEl || !rough || !geo || !pal) return;
      const g = geo;
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 380 380");
      svg.setAttribute("width", "380");
      svg.setAttribute("height", "380");
      svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;";
      const rc = rough.svg(svg);
      const bracket = (x: number, y0: number, y1: number, tick: number, o: object) => {
        svg.appendChild(rc.line(x, y0, x, y1, o));
        svg.appendChild(rc.line(x, y0, x + tick, y0, o));
        svg.appendChild(rc.line(x, y1, x + tick, y1, o));
      };
      const label = (x: number, yMid: number, text: string, fill: string, weight: string) => {
        const t = document.createElementNS(NS, "text");
        t.setAttribute("x", String(x));
        t.setAttribute("y", String(yMid));
        t.setAttribute("fill", fill);
        t.setAttribute("font-family", "'Geist Mono', ui-monospace, monospace");
        t.setAttribute("font-size", "9.5");
        t.setAttribute("font-weight", weight);
        t.setAttribute("letter-spacing", "0.08em");
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("transform", "rotate(-90 " + x + " " + yMid + ")");
        t.textContent = text;
        svg.appendChild(t);
      };
      const beforeTopY = g.whiteTopY != null ? g.whiteTopY : g.baselineTopY;
      bracket(348, beforeTopY, g.stackBottomY, -9, { stroke: pal.ink, strokeWidth: 1.5, roughness: 1.1, bowing: 0.7, seed: 73 });
      label(359, (beforeTopY + g.stackBottomY) / 2, "BEFORE", pal.ink, "600");
      const afterTopY = g.greenTopY != null ? g.greenTopY : g.fullTopY;
      bracket(366, afterTopY, g.stackBottomY, -9, { stroke: pal.ink, strokeWidth: 1.5, roughness: 1.1, bowing: 0.7, seed: 71 });
      label(375, (afterTopY + g.stackBottomY) / 2, "AFTER", pal.ink, "600");
      psMarksEl.innerHTML = "";
      psMarksEl.appendChild(svg);
    };

    const psBuildSheets = () => {
      if (!psStackEl || !rough) return;
      pal = psPalette();
      psStackEl.innerHTML = "";
      const reqN = 22;
      const mkRng = (seed: number) => {
        let s = seed % 2147483647;
        if (s <= 0) s += 2147483646;
        return () => {
          s = (s * 16807) % 2147483647;
          return (s - 1) / 2147483646;
        };
      };
      const r = mkRng(20260615);
      const baseY = 295, OFF = 8.6;
      const codes = ["W-2", "1003", "1099", "DEED", "NOTE", "VOE", "URLA", "1040", "VOD", "DOT", "ID", "HMDA"];
      const baseline = Math.max(1, Math.round(reqN / 2.4));
      const A = Math.max(1, Math.round(baseline * 1.4));
      const N = baseline + A;
      psN = N;
      geo = {
        baselineTopY: baseY - (baseline - 1) * OFF - 39,
        fullTopY: baseY - (N - 1) * OFF - 12 - 33,
        stackBottomY: baseY + 16,
        creamLeftBottomY: baseY - (baseline - 1) * OFF + 16,
      };
      sheets = [];
      for (let i = 0; i < N; i++) {
        const w = 116 + r() * 30;
        const skew = 18 + r() * 10;
        const restXoff = (r() * 2 - 1) * 7;
        let restY = baseY - i * OFF;
        let restRot = (r() * 2 - 1) * 2.3;
        if (i === N - 1) {
          restRot = -7;
          restY -= 12;
        } else if (i === N - 2) {
          restRot = 4;
          restY -= 5;
        }
        const restTY = restY - 130;
        const side = r() < 0.5 ? -1 : 1;
        const rainSX = restXoff + side * (18 + r() * 42);
        const rainSY = -235 - r() * 120;
        const rainSRot = side * (16 + r() * 32);
        const phase = 1.5 + r() * 1.4;
        let launch: number, fallLen: number;
        if (i < baseline) {
          launch = -1;
          fallLen = 1.7 / N;
        } else {
          const k = i - baseline;
          launch = (k / A) * 0.9;
          fallLen = 1.6 / A;
        }
        const el = document.createElement("div");
        el.style.cssText =
          "position:absolute;left:0;top:0;width:380px;height:260px;transform-origin:190px 130px;will-change:transform;backface-visibility:hidden;";
        const added = i >= baseline;
        const paper = added ? pal.addedPaper : pal.surface;
        const chip = added ? pal.surface : pal.accentFill;
        const chipTxt = added ? pal.ink : pal.onAccent;
        el.innerHTML = psMakeSheetSVG(i * 7 + 3, w, skew, codes[i % codes.length], pal, paper, chip, chipTxt);
        psStackEl.appendChild(el);
        sheets.push({ el, i, restTX: restXoff, restTY, restRot, rainSX, rainSY, rainSRot, phase, launch, fallLen });
      }
      // bracket reference geometry (front-left of first green sheet, highest right corner)
      const firstGreen = sheets[baseline] || sheets[baseline - 1];
      if (firstGreen) {
        const s = firstGreen, a = (s.restRot * Math.PI) / 180;
        const w = 116; // representative; bracket only needs an approximate top
        geo.whiteTopY = 130 + -w * Math.sin(a) + 16 * Math.cos(a) + s.restTY;
      }
      let minRightY = Infinity;
      for (const s of sheets) {
        const a = (s.restRot * Math.PI) / 180;
        const wApprox = 131;
        const fRy = 130 + wApprox * Math.sin(a) + 16 * 0.45 * Math.cos(a) + s.restTY;
        const bRy = 130 + (wApprox - 23) * Math.sin(a) + -33 * Math.cos(a) + s.restTY;
        minRightY = Math.min(minRightY, fRy, bRy);
      }
      if (isFinite(minRightY)) geo.greenTopY = minRightY;
      psDrawMarks();
    };

    const psApply = (p: number) => {
      psP = p;
      const eC = (q: number) => 1 - Math.pow(1 - q, 3);
      const eQ = (q: number) => 1 - Math.pow(1 - q, 2);
      let settled = 0;
      for (const s of sheets) {
        const q = Math.max(0, Math.min(1, (p - s.launch) / s.fallLen));
        if (q >= 1) settled++;
        const e = eC(q), ex = eQ(q);
        const flut = Math.sin(q * Math.PI * s.phase) * (1 - q);
        const tx = s.rainSX + (s.restTX - s.rainSX) * ex + flut * 22;
        const ty = s.rainSY + (s.restTY - s.rainSY) * e;
        const rot = s.rainSRot + (s.restRot - s.rainSRot) * ex + flut * 7;
        const air = q < 1;
        s.el.style.transform = "translate(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg)";
        s.el.style.zIndex = String(10 + s.i);
        s.el.style.filter =
          "drop-shadow(0 " + (air ? 9 : 3) + "px " + (air ? 7 : 2) + "px rgba(22,23,15," + (air ? 0.14 : 0.09) + "))";
      }
      const N = psN || 12;
      if (psMarksEl) psMarksEl.style.opacity = String(Math.max(0, Math.min(1, (p - 0.86) / 0.1)));
      if (psShadowEl) psShadowEl.style.opacity = String(0.18 + (settled / N) * 0.4);
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadRough().then((r) => {
      if (disposed || !r) return;
      rough = r;
      psBuildSheets();
      ready = true;
      psApply(reduce ? 1 : psP);
    });

    if (reduce) {
      setNum(2.4);
      showAfter();
      if (labelEl) labelEl.style.position = "static";
      return () => {
        disposed = true;
        if (psStackEl) psStackEl.innerHTML = "";
        if (psMarksEl) psMarksEl.innerHTML = "";
      };
    }

    setNum(1.0);
    beforeEls.forEach((e) => (e.style.opacity = "1"));
    afterEls.forEach((e) => (e.style.opacity = "0"));

    loadAnime().then((mod) => {
      if (disposed) return;
      const animate = mod && mod.animate;
      let transitioned = false;
      const enterAfter = () => {
        if (transitioned) return;
        transitioned = true;
        if (!animate) {
          showAfter();
          if (labelEl) labelEl.style.position = "static";
          return;
        }
        animate(beforeEls, { opacity: 0, duration: 280, ease: "out(2)" });
        animate(afterEls, { opacity: [0, 1], translateY: [6, 0], duration: 460, ease: "out(3)" });
        if (box) animate(box, { scale: [1, 1.05, 1], duration: 640, ease: "inOut(2)" });
        if (num) animate(num, { scale: [1, 1.16, 1], duration: 560, ease: "inOut(2)" });
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
        beforeEls.forEach((e) => (e.style.opacity = "1"));
        afterEls.forEach((e) => {
          e.style.opacity = "0";
          e.style.transform = "";
        });
        if (box) box.style.transform = "";
        if (num) num.style.transform = "";
        if (labelEl) {
          labelEl.style.position = "sticky";
          labelEl.style.opacity = "1";
          labelEl.style.transform = "";
        }
      };
      const update = () => {
        if (!h2El) return;
        const vh = window.innerHeight;
        const h2top = h2El.getBoundingClientRect().top;
        const start = vh * 0.85;
        const prog = clamp((start - h2top) / (start - 76), 0, 1);
        psP = prog;
        if (ready) psApply(transitioned ? 1 : prog);
        setNum(transitioned ? 2.4 : 1.0 + prog * 1.4);
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
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", update);
      });
      update();
    });

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      if (psStackEl) psStackEl.innerHTML = "";
      if (psMarksEl) psMarksEl.innerHTML = "";
    };
  }, [sectionRef, theme]);
}
