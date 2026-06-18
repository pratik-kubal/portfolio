"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import type { BellaController } from "./bella-widget";

// Select ≥4 chars of page text → floating "Ask Bella about this" popover →
// opens Bella prefilled with the quote. Port of initBellaHighlight.
export function HighlightToAsk({
  controllerRef,
}: {
  controllerRef: MutableRefObject<BellaController | null>;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const quoteRef = useRef("");
  const popRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hide = () => {
      setPos(null);
      quoteRef.current = "";
    };
    const maybeShow = () => {
      const sel = window.getSelection();
      const text = sel && sel.toString ? sel.toString().trim() : "";
      if (!text || text.length < 4) {
        hide();
        return;
      }
      const node = sel?.anchorNode ?? null;
      const host = node?.nodeType === 1 ? (node as Element) : node?.parentElement;
      if (host && (host.closest("[data-bella]") || (popRef.current && popRef.current.contains(node)))) {
        hide();
        return;
      }
      let rect: DOMRect;
      try {
        rect = sel!.getRangeAt(0).getBoundingClientRect();
      } catch {
        hide();
        return;
      }
      if (!rect || (!rect.width && !rect.height)) {
        hide();
        return;
      }
      quoteRef.current = text;
      const pw = popRef.current?.offsetWidth || 180;
      const ph = popRef.current?.offsetHeight || 36;
      let left = rect.left + rect.width / 2 - pw / 2;
      left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));
      let top = rect.top - ph - 10;
      if (top < 10) top = rect.bottom + 10;
      setPos({ x: left, y: top });
    };

    const onMouseUp = () => setTimeout(maybeShow, 0);
    const onMouseDown = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) hide();
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  if (!pos) return null;

  const onAsk = () => {
    const q = quoteRef.current.replace(/\s+/g, " ").trim();
    if (!q) return;
    const shown = q.length > 120 ? q.slice(0, 120) + "…" : q;
    window.getSelection()?.removeAllRanges?.();
    setPos(null);
    controllerRef.current?.ask(`Tell me more about: “${shown}”`, "highlight", q);
  };

  return (
    <button
      ref={popRef}
      type="button"
      className="pk-hl-popover"
      aria-label="Ask Bella about the selected text"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={onAsk}
    >
      <span className="dia" aria-hidden="true" />
      <span>Ask Bella about this</span>
    </button>
  );
}
