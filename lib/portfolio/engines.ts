"use client";

// Lazy, cached loaders for the motion engines (installed npm deps, not CDN).
// Both resolve to null on failure so callers fall back to the static final state.

/* eslint-disable @typescript-eslint/no-explicit-any */
let animePromise: Promise<any> | null = null;
export function loadAnime(): Promise<any> {
  if (!animePromise) {
    animePromise = import("animejs")
      .then((m) => (m as any).default ?? m)
      .catch(() => null);
  }
  return animePromise;
}

let roughPromise: Promise<any> | null = null;
export function loadRough(): Promise<any> {
  if (!roughPromise) {
    roughPromise = import("roughjs")
      .then((m) => (m as any).default ?? m)
      .catch(() => null);
  }
  return roughPromise;
}

// Resolve once `el` first scrolls into view (cached per element so multiple
// callers on the same section share one observer). Used to defer the engine
// downloads — a visitor who never reaches a section never fetches animejs/roughjs
// for it. Falls back to resolving immediately when IntersectionObserver is absent.
const visibleOnce = new WeakMap<Element, Promise<void>>();
function whenVisible(el: Element | null): Promise<void> {
  if (!el || typeof IntersectionObserver === "undefined") return Promise.resolve();
  let p = visibleOnce.get(el);
  if (!p) {
    p = new Promise<void>((resolve) => {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            resolve();
          }
        },
        // Negative bottom margin so a section that merely peeks in at the very
        // bottom edge (e.g. the first project sitting right under the hero) does
        // NOT trigger a load until it's meaningfully on screen — that keeps the
        // chunks off the initial paint for a visitor who never actually scrolls.
        { threshold: 0, rootMargin: "0px 0px -20% 0px" },
      );
      io.observe(el);
    });
    visibleOnce.set(el, p);
  }
  return p;
}

// Visibility-gated variants: identical to loadAnime/loadRough but the dynamic
// import doesn't fire until the section is on screen. Swap these in at call sites
// whose work is below the fold so the chunks stay off the initial-load critical path.
export function loadAnimeWhenVisible(el: Element | null): Promise<any> {
  return whenVisible(el).then(loadAnime);
}
export function loadRoughWhenVisible(el: Element | null): Promise<any> {
  return whenVisible(el).then(loadRough);
}
