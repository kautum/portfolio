"use client";

import { useEffect } from "react";

/**
 * Three ambient behaviours that would each be trivial alone and together do
 * most of the work of making the page feel alive:
 *
 *  1. The page ground takes its colour from whichever chapter you are in, and
 *     eases between them. Sections declare `data-tint` and `data-tint-dark`.
 *  2. Anything marked `data-parallax` drifts against the scroll. One rAF loop
 *     handles every element, so this stays cheap.
 *  3. A crosshair follows the pointer on fine-pointer devices, after rauno.me.
 *     It is decorative, so it is spring-smoothed rather than pinned exactly to
 *     the cursor, and it never appears on touch.
 */
export default function Ambience() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tint]")
    );

    // ---- 1. chapter tint -------------------------------------------------
    let current: HTMLElement | null = null;

    const applyTint = () => {
      if (!current) return;
      const key = root.dataset.theme === "dark" ? "tintDark" : "tint";
      const value = current.dataset[key];
      if (value) root.style.setProperty("--ground", value);
    };

    const io = new IntersectionObserver(
      (entries) => {
        // whichever tinted section covers the middle of the screen wins
        const mid = window.innerHeight / 2;
        for (const entry of entries) {
          const r = entry.target.getBoundingClientRect();
          if (r.top <= mid && r.bottom >= mid) {
            current = entry.target as HTMLElement;
            applyTint();
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    // the toggle flips data-theme on <html>, so watch for that rather than
    // the media query
    const themeWatcher = new MutationObserver(applyTint);
    themeWatcher.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // ---- 2. parallax + 3. crosshair --------------------------------------
    const floats = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    let cursor: HTMLDivElement | null = null;
    let targetX = -100;
    let targetY = -100;
    let cx = -100;
    let cy = -100;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && !reduce.matches) {
      cursor = document.createElement("div");
      cursor.className = "crosshair";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = "<span></span><span></span>";
      document.body.appendChild(cursor);
    }

    const onPointer = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    if (cursor) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    const frame = () => {
      if (!reduce.matches) {
        for (const el of floats) {
          const speed = parseFloat(el.dataset.parallax || "0.08");
          const r = el.getBoundingClientRect();
          const fromCentre = r.top + r.height / 2 - window.innerHeight / 2;
          el.style.transform = `translate3d(0, ${(-fromCentre * speed).toFixed(1)}px, 0)`;
        }
      }
      if (cursor) {
        // ease toward the pointer instead of snapping, so it reads as a
        // physical object rather than a second mouse pointer
        cx += (targetX - cx) * 0.16;
        cy += (targetY - cy) * 0.16;
        cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      io.disconnect();
      themeWatcher.disconnect();
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
      cursor?.remove();
    };
  }, []);

  return null;
}
