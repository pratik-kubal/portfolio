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
