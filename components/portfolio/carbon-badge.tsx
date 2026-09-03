"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Script from "next/script";

// Website Carbon badge (websitecarbon.com). The vendor script runs once on load,
// grabs #wcb, and injects both the pill markup and its own <style> — so React
// must never own the children of this div (hence the empty, self-closing tag).
//
// A theme swap doesn't need the script to re-run: the real skinning is done by
// the `.pk-root #wcb.carbonbadge` token overrides in globals.css, which outrank
// the injected vendor CSS and follow --surface/--accent-fill through all three
// themes. The vendor's own `wcb-d` class is still toggled underneath as a
// fallback skin in case those overrides ever go missing.
export function CarbonBadge() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Match the SSR default (light) until mounted, like theme-toggle.tsx. Noir
  // ("bw") is a light palette, so only true dark gets the vendor's dark skin.
  const dark = mounted && theme === "dark";

  return (
    <>
      <div
        id="wcb"
        className={dark ? "carbonbadge wcb-d" : "carbonbadge"}
        suppressHydrationWarning
      />
      <Script
        src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js"
        strategy="lazyOnload"
      />
    </>
  );
}
