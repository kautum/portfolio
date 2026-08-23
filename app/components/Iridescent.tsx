"use client";

import { useEffect } from "react";
import "../iridescent.css";

/* ============================================================
   Iridescent.tsx — scroll-driven hue rotation for the dark
   design system's accent tokens. Drives --accent, --accent-2,
   --accent-glow(-soft) and --accent-gradient on <html>; every
   existing surface that already consumes those tokens (buttons,
   glow-text, chips, .stat-accent) shifts with it for free.

   Interpolation space: OKLCH, lightness (L) and chroma (C) held
   FIXED across the whole sweep -- only hue turns. That's what
   keeps the sweep from ever crossing a muddy/grey midpoint (a
   naive hex/RGB lerp between teal and amber goes through a dead
   grey-brown around the midpoint; a fixed-L/C hue rotation never
   can, since it's always moving along the same iso-lightness ring)
   and it's what makes the contrast guarantee below hold at every
   point in between the stops, not just at the four named stops.

   Hue stops (unwrapped so the lerp always turns the same way
   instead of ping-ponging the long way round the wheel):
     teal 185deg -> violet 275deg -> magenta 325deg -> amber 415deg (=55deg)
   at L=0.72 C=0.15 for --accent, and the same path +30deg at a
   lighter/lower-chroma L=0.78 C=0.12 for --accent-2 (an analogous
   partner hue, same trick dark.css's own coral->amber pairing uses).

   Contrast, computed (not eyeballed) against bg #0a0a0a across the
   ENTIRE sweep at ~0.15deg resolution, both the accent and accent-2
   paths: worst case 7.42:1, at hue ~352deg (the tail end of the
   magenta->amber turn). That clears the 4.5:1 text floor and the
   3:1 non-text floor with plenty of margin -- see the agent report
   for the script that produced this number.
   ============================================================ */

const HUE_STOPS = [185, 275, 325, 415];
const ACCENT_L = 0.72;
const ACCENT_C = 0.15;
const ACCENT2_L = 0.78;
const ACCENT2_C = 0.12;
const ACCENT2_HUE_OFFSET = 30;

// prefers-reduced-motion: one fixed point on the same sweep (still
// carries the same contrast guarantee), no animation at all.
const REDUCED_MOTION_HUE = 300;

// Skip a repaint for sub-degree hue deltas (~1 scroll pixel on a
// typical page height) so idle/sub-pixel scroll ticks don't touch
// style or fire the event.
const HUE_EPSILON = 0.05;

type Rgb = [number, number, number];

type HueColors = {
  accent: string;
  accent2: string;
  glow: string;
  glowSoft: string;
  gradient: string;
  hue: number;
};

/** OKLCH -> gamma-encoded sRGB, each channel clamped to [0, 1]. */
function oklchToSrgb(l: number, c: number, hueDeg: number): Rgb {
  const h = (hueDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const enc = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };
  return [enc(r), enc(g), enc(bl)];
}

function toHex([r, g, b]: Rgb): string {
  const ch = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

function toRgbaString([r, g, b]: Rgb, alpha: number): string {
  const ch = (v: number) => Math.round(v * 255);
  return `rgba(${ch(r)}, ${ch(g)}, ${ch(b)}, ${alpha})`;
}

/** Hue at scroll progress t in [0, 1], lerped across HUE_STOPS then wrapped to [0, 360). */
function hueAt(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (HUE_STOPS.length - 1);
  const seg = Math.min(Math.floor(scaled), HUE_STOPS.length - 2);
  const localT = scaled - seg;
  const h0 = HUE_STOPS[seg];
  const h1 = HUE_STOPS[seg + 1];
  return (h0 + (h1 - h0) * localT) % 360;
}

function colorsForHue(hue: number): HueColors {
  const accentRgb = oklchToSrgb(ACCENT_L, ACCENT_C, hue);
  const accent2Rgb = oklchToSrgb(ACCENT2_L, ACCENT2_C, (hue + ACCENT2_HUE_OFFSET) % 360);
  const accent = toHex(accentRgb);
  const accent2 = toHex(accent2Rgb);
  return {
    accent,
    accent2,
    glow: toRgbaString(accentRgb, 0.45),
    glowSoft: toRgbaString(accentRgb, 0.18),
    gradient: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
    hue,
  };
}

/** Writes the tokens to <html> and tells anyone else listening (e.g. the three.js hero). */
function applyColors(colors: HueColors, progress: number) {
  const root = document.documentElement.style;
  root.setProperty("--accent", colors.accent);
  root.setProperty("--accent-2", colors.accent2);
  root.setProperty("--accent-glow", colors.glow);
  root.setProperty("--accent-glow-soft", colors.glowSoft);
  root.setProperty("--accent-gradient", colors.gradient);
  window.dispatchEvent(new CustomEvent("hue-change", { detail: { ...colors, progress } }));
}

export default function Iridescent() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (query.matches) {
      applyColors(colorsForHue(REDUCED_MOTION_HUE), 0);
      return;
    }

    let maxScroll = 0;
    let lastHue = -1;
    let scrollTicking = false;
    let resizeTicking = false;

    // Layout read lives here, outside the per-scroll-frame path, and
    // only runs on mount + on an actual resize/content-height change.
    const measure = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };

    // The only work done inside the scroll-driven rAF: read scrollY
    // (a cheap scroll-offset read, not a layout read), compute the
    // interpolated color, and write it. No layout reads in here.
    const update = () => {
      scrollTicking = false;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      const hue = hueAt(progress);
      if (Math.abs(hue - lastHue) < HUE_EPSILON) return;
      lastHue = hue;
      applyColors(colorsForHue(hue), progress);
    };

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      if (resizeTicking) return;
      resizeTicking = true;
      requestAnimationFrame(() => {
        resizeTicking = false;
        measure();
        onScroll();
      });
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // ponytail: content height can change after mount (images, fonts,
    // the three.js hero resizing) without a window resize firing --
    // ResizeObserver on <html> catches that so maxScroll never goes
    // stale. Its own callback is rAF-throttled the same way.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="ir-sheen" aria-hidden="true">
      <div className="ir-sheen__layer" />
      <div className="ir-wash" />
    </div>
  );
}
