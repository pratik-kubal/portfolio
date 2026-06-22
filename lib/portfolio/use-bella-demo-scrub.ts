"use client";

import { useEffect, type RefObject } from "react";
import { useTheme } from "next-themes";
import { loadAnime, loadRough } from "./engines";

const NS = "http://www.w3.org/2000/svg";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Repaint the demo window/bubbles/avatars/notes as hand-drawn rough.js SVGs (text
// stays crisp). Reads palette from CSS vars via inline style, so it tracks the
// theme. Idempotent — clears its own [data-rough-svg] first. Port of paintBellaRough.
function paintBellaRough(mount: HTMLElement, rough: any) {
  const win = mount.querySelector<HTMLElement>('[data-r="win"]');
  const head = mount.querySelector<HTMLElement>('[data-r="head"]');
  const inp = mount.querySelector<HTMLElement>('[data-r="inp"]');
  const vp = mount.querySelector<HTMLElement>("[data-bd-viewport]");
  const rows = [...mount.querySelectorAll<HTMLElement>("[data-bd-row]")];
  if (!win) return;

  mount.querySelectorAll("[data-rough-svg]").forEach((s) => s.remove());

  const mkSvg = (w: number, h: number, behind?: boolean) => {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("width", String(w));
    s.setAttribute("height", String(h));
    s.dataset.roughSvg = "1";
    s.style.cssText = `position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:${behind ? "0" : "-1"};`;
    return s;
  };
  const themed = (node: SVGElement, fillVar: string | null, strokeVar: string | null) => {
    node.querySelectorAll("path").forEach((p) => {
      const f = p.getAttribute("fill"), s = p.getAttribute("stroke");
      if (fillVar && f && f !== "none") (p as SVGElement).style.fill = fillVar;
      if (strokeVar && s && s !== "none") (p as SVGElement).style.stroke = strokeVar;
    });
    return node;
  };
  const box = (el: HTMLElement | null, o: any) => {
    if (!el) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    el.style.position = "relative";
    el.style.border = "none";
    el.style.background = "transparent";
    el.style.boxShadow = "none";
    const svg = mkSvg(w, h);
    const rc = rough.svg(svg);
    svg.appendChild(
      themed(
        rc.rectangle(1.5, 1.5, w - 3, h - 3, {
          fill: "#888",
          fillStyle: "solid",
          stroke: "#111",
          strokeWidth: o.sw || 1.3,
          roughness: o.rough == null ? 1.7 : o.rough,
          bowing: o.bow == null ? 2 : o.bow,
        }),
        o.fill,
        o.stroke,
      ),
    );
    el.insertBefore(svg, el.firstChild);
  };

  // window shell: offset accent shadow + sketched outline + two divider lines
  const w = win.offsetWidth, h = win.offsetHeight;
  win.style.position = "relative";
  win.style.border = "none";
  win.style.background = "transparent";
  win.style.boxShadow = "none";
  win.style.overflow = "visible";
  if (vp) vp.style.background = "transparent";
  [head, vp, inp].forEach((p) => {
    if (p) {
      p.style.position = "relative";
      p.style.zIndex = "1";
    }
  });
  const wsvg = mkSvg(w, h, true);
  const wrc = rough.svg(wsvg);
  wsvg.appendChild(
    themed(wrc.rectangle(6.5, 6.5, w - 7, h - 7, { fill: "#888", fillStyle: "solid", stroke: "none", roughness: 1.8 }), "var(--accent-fill)", null),
  );
  wsvg.appendChild(
    themed(wrc.rectangle(1.5, 1.5, w - 7, h - 7, { fill: "#888", fillStyle: "solid", stroke: "#111", strokeWidth: 1.8, roughness: 1.3, bowing: 1 }), "var(--surface)", "var(--ink)"),
  );
  const y1 = head ? head.offsetHeight : 0;
  const y2 = h - (inp ? inp.offsetHeight : 0);
  wsvg.appendChild(themed(wrc.line(4, y1, w - 9, y1, { stroke: "#111", strokeWidth: 1.2, roughness: 1.6, bowing: 1.5 }), null, "var(--line)"));
  wsvg.appendChild(themed(wrc.line(4, y2, w - 9, y2, { stroke: "#111", strokeWidth: 1.2, roughness: 1.6, bowing: 1.5 }), null, "var(--line)"));
  win.insertBefore(wsvg, win.firstChild);

  // avatars -> sketched circles
  mount.querySelectorAll<HTMLElement>('[data-r="ava"]').forEach((el) => {
    const aw = el.offsetWidth, ah = el.offsetHeight;
    if (!aw) return;
    el.style.background = "transparent";
    el.style.position = "relative";
    const svg = mkSvg(aw, ah);
    const rc = rough.svg(svg);
    svg.appendChild(themed(rc.circle(aw / 2, ah / 2, Math.min(aw, ah) - 2, { fill: "#888", fillStyle: "solid", stroke: "#111", strokeWidth: 1.2, roughness: 1.2, bowing: 2 }), "var(--accent-fill)", "var(--on-accent)"));
    el.insertBefore(svg, el.firstChild);
  });

  // bubbles measured at full height -> temporarily force final layout
  rows.forEach((r) => {
    (r as any)._op = r.style.opacity;
    (r as any)._tf = r.style.transform;
    r.style.opacity = "1";
    r.style.transform = "none";
  });
  mount.querySelectorAll<HTMLElement>('[data-r="u"]').forEach((el) => box(el, { fill: "var(--accent-fill)", stroke: "var(--on-accent)" }));
  mount.querySelectorAll<HTMLElement>('[data-r="b"]').forEach((el) => box(el, { fill: "var(--bg)", stroke: "var(--line)" }));
  box(mount.querySelector('[data-r="pill"]'), { fill: "var(--bg)", stroke: "var(--line)", sw: 1.2, rough: 1.8 });
  box(mount.querySelector('[data-r="send"]'), { fill: "var(--accent-fill)", stroke: "var(--on-accent)" });
  // note cards: sketched outline + thick accent left edge
  mount.querySelectorAll<HTMLElement>('[data-r="note"]').forEach((el) => {
    const nw = el.offsetWidth, nh = el.offsetHeight;
    if (!nw || !nh) return;
    el.style.position = "relative";
    el.style.border = "none";
    el.style.background = "transparent";
    const svg = mkSvg(nw, nh);
    const rc = rough.svg(svg);
    svg.appendChild(themed(rc.rectangle(3, 1.5, nw - 5, nh - 3, { fill: "#888", fillStyle: "solid", stroke: "#111", strokeWidth: 1.3, roughness: 1.5, bowing: 1.4 }), "var(--surface)", "var(--line)"));
    svg.appendChild(themed(rc.line(3.5, 4, 3.5, nh - 4, { stroke: "#111", strokeWidth: 4, roughness: 2, bowing: 1 }), null, "var(--accent-fill)"));
    el.insertBefore(svg, el.firstChild);
  });
  // restore live reveal state
  rows.forEach((r) => {
    r.style.opacity = (r as any)._op;
    r.style.transform = (r as any)._tf;
  });
}

// Scrubs the scripted Bella demo as the AI-Engineering card scrolls past: messages
// reveal one-by-one, the feed auto-scrolls, the annotation cards slide in, and the
// window is repainted hand-drawn (rough.js, rebuilt on theme change).
export function useBellaDemoScrub(sectionRef: RefObject<HTMLElement | null>) {
  const { theme } = useTheme();
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mount = root.querySelector<HTMLElement>("[data-bella-demo]");
    const vp = root.querySelector<HTMLElement>("[data-bd-viewport]");
    const feed = root.querySelector<HTMLElement>("[data-bd-feed]");
    const rows = [...root.querySelectorAll<HTMLElement>("[data-bd-row]")];
    const notes = [...root.querySelectorAll<HTMLElement>("[data-bd-note]")].map((el) => ({
      el,
      at: Number(el.getAttribute("data-at") || 0),
    }));
    const h2El = root.querySelector<HTMLElement>("[data-narr-h2]");
    const labelEl = root.querySelector<HTMLElement>("[data-narr-label]");
    if (!mount || !vp || !feed || !rows.length) return;

    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const smooth = (t: number) => {
      t = clamp(t, 0, 1);
      return 1 - Math.pow(1 - t, 3);
    };

    let winH = vp.clientHeight;
    const measured = rows.map((el) => ({ el, top: el.offsetTop, h: el.offsetHeight }));
    const remeasure = () => {
      winH = vp.clientHeight;
      measured.forEach((m) => {
        m.top = m.el.offsetTop;
        m.h = m.el.offsetHeight;
      });
    };

    notes.forEach((n) => {
      n.el.style.transition = "opacity .35s ease, transform .35s ease";
    });

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (p: number) => {
      const N = rows.length;
      const f = p * N;
      measured.forEach((m, i) => {
        const local = clamp(f - i, 0, 1);
        const s = smooth(local);
        m.el.style.opacity = s.toFixed(3);
        m.el.style.transform = `translateY(${((1 - s) * 12).toFixed(1)}px)`;
      });
      const a = clamp(Math.floor(f), 0, N - 1);
      const b = Math.min(a + 1, N - 1);
      const frac = clamp(f - a, 0, 1);
      const bottomA = measured[a].top + measured[a].h;
      const bottomB = measured[b].top + measured[b].h;
      const tgt = bottomA + (bottomB - bottomA) * frac + 14;
      feed.style.transform = `translateY(${(-Math.max(0, tgt - winH)).toFixed(1)}px)`;
      notes.forEach((n) => {
        const on = f > n.at + 0.7;
        n.el.style.opacity = on ? "1" : "0";
        n.el.style.transform = on ? "translateX(0)" : "translateX(10px)";
      });
    };
    const setFinal = () => {
      rows.forEach((r) => (r.style.opacity = "1"));
      notes.forEach((n) => {
        n.el.style.opacity = "1";
        n.el.style.transform = "translateX(0)";
      });
      const last = measured[measured.length - 1];
      feed.style.transform = `translateY(${-Math.max(0, last.top + last.h + 14 - winH)}px)`;
    };

    let disposed = false;
    let ticking = false;
    let tween: any = null;
    let animate: any = null;
    const proxy = { p: 0 };
    let current = -1;
    let doUpdate = () => {};

    remeasure();
    if (reduce) {
      setFinal();
    } else {
      apply(0);
      const paint = () => {
        if (Math.abs(proxy.p - current) > 0.0005) {
          current = proxy.p;
          apply(proxy.p);
        }
      };
      loadAnime().then((mod) => {
        if (!disposed) animate = mod && mod.animate;
      });
      // Settle-into-focus beat (mirrors ring/paper's before→after): once the
      // headline reaches the top the chatbox window pulse-scales and the kicker
      // label slides away; scrolling back up restores it.
      let transitioned = false;
      const enterAfter = () => {
        if (transitioned) return;
        transitioned = true;
        const win = mount.querySelector<HTMLElement>('[data-r="win"]');
        if (animate) {
          if (win) animate(win, { scale: [1, 1.04, 1], duration: 640, ease: "inOut(2)" });
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
        } else if (labelEl) {
          labelEl.style.opacity = "0";
          labelEl.style.position = "static";
        }
      };
      const exitAfter = () => {
        if (!transitioned) return;
        transitioned = false;
        if (labelEl) {
          labelEl.style.position = "sticky";
          labelEl.style.opacity = "1";
          labelEl.style.transform = "";
        }
      };
      doUpdate = () => {
        const vh = window.innerHeight;
        const h2top = h2El ? h2El.getBoundingClientRect().top : vh;
        const start = vh * 0.85;
        const target = clamp((start - h2top) / (start - 76), 0, 1);
        if (animate) {
          if (tween) tween.pause();
          tween = animate(proxy, { p: target, duration: 480, ease: "out(3)", onUpdate: paint });
        } else {
          proxy.p = target;
          paint();
        }
        if (h2top <= 76) enterAfter();
        else if (h2top > 200) exitAfter();
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            doUpdate();
          });
        }
      };
      const onResize = () => {
        remeasure();
        doUpdate();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      doUpdate();
      // cleanup of listeners is registered below via the disposed flag + removal
      (mount as any)._cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    // Hand-drawn rough.js repaint once rough + fonts are ready, then re-measure
    // (the sketched borders change heights) and re-apply the current progress.
    const fonts =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([loadRough(), fonts]).then(([rough]) => {
      if (disposed || !rough) return;
      try {
        paintBellaRough(mount, rough);
        remeasure();
        if (reduce) setFinal();
        else doUpdate();
      } catch {
        /* keep the clean fallback */
      }
    });

    return () => {
      disposed = true;
      const c = (mount as any)._cleanup;
      if (typeof c === "function") c();
      mount.querySelectorAll("[data-rough-svg]").forEach((s) => s.remove());
    };
  }, [sectionRef, theme]);
}
