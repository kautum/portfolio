"use client";

import { useEffect } from "react";

/**
 * Pointer-tracked spotlight on the cards and panels.
 *
 * The cards were the last inert thing on the page: a lot of text in a box that
 * did nothing when you approached it. This writes the pointer position into two
 * CSS custom properties on whichever card is under the cursor, and the CSS
 * paints a soft highlight there.
 *
 * One listener on the document rather than one per card, because there are
 * around twenty of them and per-card listeners is how a page starts stuttering.
 * It does nothing at all under prefers-reduced-motion or on a device without a
 * real pointer.
 */
const SELECTOR = ".card, .sstrip-panel, .panel";

export default function Spotlight() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let current: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = (event.target as Element | null)?.closest?.(SELECTOR) as
          | HTMLElement
          | null;

        if (target !== current) {
          current?.removeAttribute("data-lit");
          current = target;
          current?.setAttribute("data-lit", "");
        }
        if (!current) return;

        const box = current.getBoundingClientRect();
        current.style.setProperty("--lx", `${event.clientX - box.left}px`);
        current.style.setProperty("--ly", `${event.clientY - box.top}px`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      current?.removeAttribute("data-lit");
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return null;
}
