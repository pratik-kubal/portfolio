// Shared headline-tied scroll progress for the project narratives (01–03) and the
// highlight demo. They all key off the same band so their count-ups and vizzes
// land on the same scroll frame — keeping the band here is the single source of
// truth, instead of the formula (and its magic numbers) drifting between hooks.
const NAV_OFFSET = 76; // sticky-nav height — progress reaches 1 as the headline meets it
const START_VH_FACTOR = 0.85; // progress starts once the headline enters the lower 85% of the viewport

// `top` is the headline's viewport-relative top (also used for the before→after
// hysteresis); `prog` is the clamped 0→1 scroll progress. A null headline reports
// `top = vh` (progress 0), matching the pre-headline state.
export function headlineProgress(h2El: HTMLElement | null): {
  prog: number;
  top: number;
} {
  const vh = window.innerHeight;
  const top = h2El ? h2El.getBoundingClientRect().top : vh;
  const start = vh * START_VH_FACTOR;
  const prog = Math.min(1, Math.max(0, (start - top) / (start - NAV_OFFSET)));
  return { prog, top };
}
