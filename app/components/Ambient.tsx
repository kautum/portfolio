"use client";

import { useEffect, useRef } from "react";

/**
 * The drifting light field behind the page.
 *
 * Soft blobs of the site's own accent colours move slowly across a canvas and
 * fade in and out. It reads as depth without adding a single element to the
 * layout, and because every colour is read from the CSS custom properties it
 * works in both themes and follows the per-chapter tint as you scroll.
 *
 * Canvas rather than animated CSS gradients: this is one compositor layer that
 * we control, instead of several large elements the browser has to repaint.
 */

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: string;
  phase: number;
  speed: number;
};

const TOKENS = ["--c1", "--c2", "--c3", "--c4", "--c5", "--c6"];

export default function Ambient() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let blobs: Blob[] = [];

    const readColours = () => {
      const cs = getComputedStyle(document.documentElement);
      return TOKENS.map((t) => cs.getPropertyValue(t).trim() || "#888888");
    };

    const build = () => {
      const colours = readColours();
      const count = w < 700 ? 4 : 6;
      blobs = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06,
        r: Math.min(w, h) * (0.28 + Math.random() * 0.22),
        hue: colours[i % colours.length],
        phase: Math.random() * Math.PI * 2,
        speed: 0.00018 + Math.random() * 0.00016,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // "lighter" on a dark ground makes the blobs glow; on a light ground it
      // would blow out, so the alpha stays low and the mode stays normal.
      const dark = document.documentElement.dataset.theme === "dark";
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      for (const b of blobs) {
        // each blob breathes on its own cycle, so the field never pulses in unison
        const fade = 0.5 + 0.5 * Math.sin(b.phase + t * b.speed);
        const alpha = (dark ? 0.16 : 0.13) * fade;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, hexToRgba(b.hue, alpha));
        g.addColorStop(1, hexToRgba(b.hue, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
      }
    };

    const tick = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    resize();

    if (still.matches) {
      // one static frame, no loop at all
      draw(0);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // the palette changes with the theme toggle and with each chapter tint
    const themeWatcher = new MutationObserver(build);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });

    const onVisibility = () => {
      running = !document.hidden && !still.matches;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeWatcher.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="ambient" aria-hidden="true" />;
}

/** Accepts #rgb, #rrggbb, or an rgb()/rgba() string and returns rgba at `a`. */
function hexToRgba(colour: string, a: number) {
  const c = colour.trim();
  if (c.startsWith("rgb")) {
    const nums = c.match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${a})`;
    }
    return `rgba(136, 136, 136, ${a})`;
  }
  let hex = c.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
  const n = parseInt(hex, 16);
  if (Number.isNaN(n)) return `rgba(136, 136, 136, ${a})`;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
