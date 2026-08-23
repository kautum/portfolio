"use client";

import { useEffect } from "react";

/**
 * 3D tilt and a moving light on the cards.
 *
 * Cards lean a few degrees toward the pointer and a soft highlight tracks
 * across their surface, so they read as physical panels catching light rather
 * than flat rectangles. One delegated listener, rAF throttled, and it turns
 * itself off entirely on touch devices and under reduced motion.
 */

const CARDS = ".card, .panel, .sstrip-panel, .chart, .feature";
const MAX_DEG = 5;

export default function Tilt() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let active: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let frame = 0;
    let px = 0;
    let py = 0;

    const clear = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--tilt-rx");
      el.style.removeProperty("--tilt-ry");
      el.style.removeProperty("--tilt-mx");
      el.style.removeProperty("--tilt-my");
      el.style.removeProperty("--tilt-lit");
    };

    const apply = () => {
      frame = 0;
      if (!active || !rect) return;
      const cx = (px - rect.left) / rect.width;
      const cy = (py - rect.top) / rect.height;
      // clamp so a fast flick past the edge cannot throw a wild angle
      const nx = Math.min(1, Math.max(0, cx));
      const ny = Math.min(1, Math.max(0, cy));
      active.style.setProperty("--tilt-ry", `${(nx - 0.5) * 2 * MAX_DEG}deg`);
      active.style.setProperty("--tilt-rx", `${(0.5 - ny) * 2 * MAX_DEG}deg`);
      active.style.setProperty("--tilt-mx", `${nx * 100}%`);
      active.style.setProperty("--tilt-my", `${ny * 100}%`);
      active.style.setProperty("--tilt-lit", "1");
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(CARDS) as HTMLElement | null;
      if (target !== active) {
        clear(active);
        active = target;
        // one layout read per card entered, never inside the frame loop
        rect = active ? active.getBoundingClientRect() : null;
      }
      if (!active) return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      clear(active);
      active = null;
      rect = null;
    };

    // a card's box moves when the page scrolls, so the cached rect must go
    const invalidate = () => {
      if (active) rect = active.getBoundingClientRect();
    };

    const enable = () => {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", invalidate, { passive: true });
      window.addEventListener("resize", invalidate);
      document.documentElement.classList.add("tilt-on");
    };

    const disable = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      document.documentElement.classList.remove("tilt-on");
      onLeave();
    };

    const decide = () => {
      if (fine.matches && !still.matches) enable();
      else disable();
    };

    decide();
    fine.addEventListener("change", decide);
    still.addEventListener("change", decide);

    return () => {
      fine.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
      disable();
    };
  }, []);

  return null;
}
