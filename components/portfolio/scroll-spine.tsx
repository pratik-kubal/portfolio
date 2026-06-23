"use client";

import { useEffect, useRef } from "react";

// Fixed right-gutter scroll spine: a thin track that fills downward in lockstep
// with page scroll, with a click-to-jump milestone dot per content section.
// Faithful port of initSpine() from Portfolio.dc.html.
export function ScrollSpine() {
  const spineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spine = spineRef.current;
    if (!spine) return;
    const track = spine.querySelector<HTMLElement>("[data-spine-track]");
    const fill = spine.querySelector<HTMLElement>("[data-spine-fill]");
    const head = spine.querySelector<HTMLElement>("[data-spine-head]");
    if (!track || !fill) return;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const els = [...document.querySelectorAll<HTMLElement>("[data-screen-label]")].filter(
      (e) => e.getAttribute("data-screen-label") !== "Hero",
    );

    const dots = els.map((el) => {
      const d = document.createElement("button");
      d.type = "button";
      // The spine is aria-hidden (decorative; screen readers navigate via the
      // section <h2>s). Keep these jump dots out of the tab order so the
      // aria-hidden region has no focusable descendants — they stay clickable
      // by mouse but aren't phantom tab stops for keyboard/AT users.
      d.tabIndex = -1;
      d.style.cssText =
        "position:absolute;left:50%;top:0;width:24px;height:24px;border-radius:50%;border:none;background:transparent;padding:0;margin:0;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;";
      const full = el.getAttribute("data-screen-label") || "";
      d.setAttribute("aria-label", full);
      const dot = document.createElement("span");
      dot.style.cssText =
        "width:11px;height:11px;border-radius:50%;border:2px solid var(--accent);background:var(--bg);transform:scale(1);transition:background .25s ease,transform .25s ease,box-shadow .25s ease;pointer-events:none;";
      d.appendChild(dot);
      const lbl = document.createElement("span");
      lbl.setAttribute("data-spine-label", "");
      lbl.textContent = full.replace(/\s*narrative$/, "").replace(" — ", " · ");
      lbl.style.cssText =
        "position:absolute;right:calc(100% + 12px);top:50%;white-space:nowrap;font-family:var(--font-mono);font-size:.72rem;letter-spacing:.02em;color:var(--ink);background:var(--surface);border:var(--line-w) solid var(--line);border-radius:var(--radius-1);padding:3px 9px;box-shadow:2px 2px 0 0 var(--line);";
      dot.appendChild(lbl);
      d.addEventListener("click", () => {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
      track.appendChild(d);
      return { el, d, dot, frac: 0, displayFrac: 0 };
    });

    const measure = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const widget = document.querySelector<HTMLElement>("[data-bella]");
      let capFrac = 1;
      if (widget) {
        const bottomPx = parseFloat(getComputedStyle(widget).bottom) || 28;
        const capPx = window.innerHeight - bottomPx - 48 - 16;
        capFrac = clamp(capPx / window.innerHeight, 0, 1);
      }
      dots.forEach((o, i) => {
        const h2 = o.el.querySelector("h2");
        let triggerY: number;
        if (h2) {
          triggerY = h2.getBoundingClientRect().top + window.scrollY - 76;
        } else {
          triggerY = o.el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
        }
        o.frac = clamp(triggerY / maxScroll, 0, 1);
        o.displayFrac = i === dots.length - 1 ? Math.min(o.frac, capFrac) : o.frac;
        o.d.style.top = o.displayFrac * 100 + "%";
      });
    };

    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / maxScroll, 0, 1);
      fill.style.height = p * 100 + "%";
      if (head) {
        head.style.top = p * 100 + "%";
        head.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
      }
      dots.forEach((o) => {
        const reached = p >= (o.displayFrac != null ? o.displayFrac : o.frac) - 0.002;
        o.dot.style.background = reached ? "var(--accent)" : "var(--bg)";
        o.dot.style.boxShadow = reached
          ? "0 0 0 4px color-mix(in srgb,var(--accent) 16%,transparent)"
          : "none";
        o.dot.style.transform = reached ? "scale(1.18)" : "scale(1)";
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          update();
        });
      }
    };
    const onResize = () => {
      measure();
      update();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const t1 = setTimeout(onResize, 700);
    const t2 = setTimeout(onResize, 1800);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      dots.forEach((o) => o.d.remove());
    };
  }, []);

  return (
    <div
      ref={spineRef}
      data-spine=""
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        right: 0,
        width: "var(--spine-gutter)",
        zIndex: 40,
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "clamp(16px,2.2vw,30px)",
        pointerEvents: "none",
      }}
    >
      <div
        data-spine-hit=""
        style={{ position: "absolute", top: 96, right: 0, bottom: 0, left: 0, pointerEvents: "auto" }}
      />
      <div data-spine-track="" style={{ position: "relative", width: 2, height: "100%" }}>
        <div data-spine-line="" style={{ position: "absolute", inset: 0, background: "var(--line)" }}>
          <div
            data-spine-fill=""
            style={{ position: "absolute", left: "-0.5px", right: "-0.5px", top: 0, height: 0, background: "var(--accent)" }}
          />
          <div
            data-spine-head=""
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
              transform: "translate(-50%,-50%)",
              opacity: 0,
              boxShadow: "0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
