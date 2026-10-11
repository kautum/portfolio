"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's background: a field of dots, like a scatterplot seen from above.
 *
 * A slow wave rolls through it so it reads as a surface rather than a grid,
 * and the cursor pushes the dots aside and tints them with the chapter
 * accents, then they spring back. It is decoration only: aria-hidden, no
 * pointer events, and the hero is complete without it.
 *
 * Cost control: one canvas, device pixel ratio capped at 2, the loop stops
 * when the hero is off screen or the tab is hidden, and reduced motion gets a
 * single still frame.
 */

const GAP = 26; // px between dots
const REACH = 170; // cursor influence radius, px
const PUSH = 26; // max displacement at the cursor, px
const SPRING = 0.09; // pull back to rest per frame
const DAMP = 0.78; // velocity kept per frame
const ACCENTS = ["--c3", "--c2", "--c5"];

type Dot = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [128, 128, 128];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function Field() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let ink: [number, number, number] = [23, 23, 23];
    let accents: [number, number, number][] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };
    const t0 = performance.now();

    const readColours = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = hexToRgb(cs.getPropertyValue("--ink") || "#171717");
      accents = ACCENTS.map((t) => hexToRgb(cs.getPropertyValue(t) || "#7295d1"));
    };

    const build = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0 });
        }
      }
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const moving = !still.matches;
      for (const d of dots) {
        // physics: pushed away from the cursor, sprung back to rest
        if (moving && pointer.active) {
          const dx = d.x + d.ox - pointer.x;
          const dy = d.y + d.oy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH && dist > 0.01) {
            const f = (1 - dist / REACH) ** 2 * PUSH * 0.12;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }
        d.vx = (d.vx - d.ox * SPRING) * DAMP;
        d.vy = (d.vy - d.oy * SPRING) * DAMP;
        d.ox += d.vx;
        d.oy += d.vy;

        // the rolling surface: two crossed waves give a height in [-1, 1]
        const z = moving
          ? Math.sin(d.x * 0.011 + t * 0.55) * Math.cos(d.y * 0.014 - t * 0.38)
          : Math.sin(d.x * 0.011) * Math.cos(d.y * 0.014);
        const px = d.x + d.ox;
        const py = d.y + d.oy + z * 6;

        // denser to the right, where there is no text, and fading at the foot
        const across = Math.min(1, Math.max(0, (d.x / w - 0.18) / 0.6));
        const down = Math.min(1, (h - d.y) / (h * 0.35));
        let alpha = (0.05 + 0.2 * across) * down * (0.55 + 0.45 * (z + 1) / 2);

        // tint toward an accent near the cursor
        let rgb = ink;
        const near = pointer.active
          ? Math.max(0, 1 - Math.hypot(px - pointer.x, py - pointer.y) / (REACH * 1.25))
          : 0;
        if (near > 0) {
          const a = accents[Math.floor(((d.x + d.y) / GAP) % accents.length)] ?? ink;
          rgb = [
            ink[0] + (a[0] - ink[0]) * near,
            ink[1] + (a[1] - ink[1]) * near,
            ink[2] + (a[2] - ink[2]) * near,
          ];
          alpha = Math.max(alpha, 0.65 * near);
        }
        const size = 1 + 0.6 * (z + 1) / 2 + near * 1.6;
        ctx.fillStyle = `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible && !document.hidden && !still.matches ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.y > -REACH && pointer.y < h + REACH;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onResize = () => {
      build();
      draw(performance.now());
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    const onTheme = () => {
      readColours();
      draw(performance.now());
    };

    readColours();
    build();
    draw(performance.now());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const themeWatch = new MutationObserver(onTheme);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    still.addEventListener("change", start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeWatch.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      still.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
