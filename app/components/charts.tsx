"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { RoughSvg } from "./Sketch";
import { HAND, text, token } from "../lib/sketch";

/* ------------------------------------------------------------------
   1. The dissertation finding: the same detector, measured two ways.
   Texture differs as well as colour, so the two bars stay
   distinguishable without relying on hue.
   ------------------------------------------------------------------ */
const drawHonest = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1c1b19");
  const faint = token(svg, "--ink-faint", "#8d877c");
  const sky = token(svg, "--sky", "#4a9fd0");
  const coral = token(svg, "--coral", "#e2725b");

  const padL = 46;
  const padR = 16;
  const padT = 44;
  const padB = 66;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const baseY = padT + plotH;
  const yOf = (v: number) => baseY - v * plotH;

  // axis
  svg.appendChild(
    rc.line(padL, baseY, padL + plotW, baseY, { ...HAND, stroke: ink, seed: 11 })
  );
  [0, 0.5, 1].forEach((v, i) => {
    // only the midline is drawn across — a line at 1.0 collides with the
    // value label sitting above the 0.9002 bar
    if (v === 0.5) {
      svg.appendChild(
        rc.line(padL - 5, yOf(v), padL + plotW, yOf(v), {
          ...HAND,
          stroke: faint,
          strokeWidth: 1,
          roughness: 1.1,
          seed: 20 + i,
        })
      );
    }
    text(svg, padL - 12, yOf(v) + 4, v.toFixed(1), {
      size: 12,
      fill: faint,
      anchor: "end",
    });
  });

  const barW = Math.min(118, plotW / 3.6);
  const c1 = padL + plotW * 0.28;
  const c2 = padL + plotW * 0.72;

  const bars = [
    { c: c1, v: 0.9002, colour: sky, style: "hachure", label: "Random split", seed: 3 },
    {
      c: c2,
      v: 0.6059,
      colour: coral,
      style: "cross-hatch",
      label: "Machines held out",
      seed: 7,
    },
  ] as const;

  bars.forEach((b) => {
    svg.appendChild(
      rc.rectangle(b.c - barW / 2, yOf(b.v), barW, b.v * plotH, {
        ...HAND,
        stroke: ink,
        fill: b.colour,
        fillStyle: b.style,
        hachureGap: 5,
        fillWeight: 2,
        seed: b.seed,
      })
    );
    text(svg, b.c, yOf(b.v) - 14, b.v.toFixed(4), { size: 19, weight: 700, fill: ink });
    text(svg, b.c, baseY + 24, b.label, { size: 13.5, fill: ink });
  });

  text(svg, c1, baseY + 43, "what the field reports", { size: 12.5, fill: faint });
  text(svg, c2, baseY + 43, "what is actually true", { size: 12.5, fill: faint });

  // margin note pointing at the honest bar
  const noteX = Math.min(w - padR - 4, c2 + barW / 2 + 34);
  if (plotW > 380) {
    text(svg, noteX, yOf(0.6059) - 46, "I published", {
      size: 17,
      hand: true,
      fill: coral,
      anchor: "middle",
      rotate: -6,
    });
    text(svg, noteX, yOf(0.6059) - 27, "this one", {
      size: 17,
      hand: true,
      fill: coral,
      anchor: "middle",
      rotate: -6,
    });
    svg.appendChild(
      rc.curve(
        [
          [noteX, yOf(0.6059) - 18],
          [noteX - 8, yOf(0.6059) - 4],
          [c2 + barW / 2 - 6, yOf(0.6059) + 8],
        ],
        { ...HAND, stroke: coral, strokeWidth: 1.7, seed: 31 }
      )
    );
  }
};

export function HonestChart() {
  return (
    <RoughSvg
      height={330}
      draw={drawHonest}
      label="Bar chart. The same intrusion detector scores 0.9002 macro-F1 under a random data split, and 0.6059 once entire attacker machines are held out of training."
    />
  );
}

/* ------------------------------------------------------------------
   2. Celcom: what the chatbot did to reporting time.
   ------------------------------------------------------------------ */
const drawImpact = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1c1b19");
  const faint = token(svg, "--ink-faint", "#8d877c");
  const sky = token(svg, "--sky", "#4a9fd0");
  const mustard = token(svg, "--mustard", "#d9a520");

  const padL = 14;
  const padR = 64;
  const plotW = w - padL - padR;
  const barH = 40;

  const rows = [
    { label: "Reporting by hand", frac: 1, colour: mustard, style: "hachure", y: 44, seed: 5 },
    {
      label: "After the chatbot shipped",
      frac: 0.4,
      colour: sky,
      style: "zigzag",
      y: 122,
      seed: 9,
    },
  ] as const;

  rows.forEach((r) => {
    text(svg, padL, r.y - 9, r.label, { size: 14, fill: ink, anchor: "start" });
    svg.appendChild(
      rc.rectangle(padL, r.y, Math.max(6, plotW * r.frac), barH, {
        ...HAND,
        stroke: ink,
        fill: r.colour,
        fillStyle: r.style,
        hachureGap: 5,
        fillWeight: 2,
        seed: r.seed,
      })
    );
    text(svg, padL + plotW * r.frac + 12, r.y + barH / 2 + 5, `${Math.round(r.frac * 100)}%`, {
      size: 15,
      weight: 700,
      fill: faint,
      anchor: "start",
    });
  });

  if (plotW > 300) {
    text(svg, padL + plotW * 0.52, 196, "60% of the time back", {
      size: 19,
      hand: true,
      fill: sky,
      rotate: -2,
    });
  }
};

export function ImpactChart() {
  return (
    <RoughSvg
      height={215}
      draw={drawImpact}
      label="Bar chart. Manual reporting time fell by 60 percent after the retrieval chatbot was adopted at Celcom Solutions."
    />
  );
}

/* ------------------------------------------------------------------
   3. The route here: Chennai to London.
   ------------------------------------------------------------------ */
const STOPS = [
  { year: "2021", up: true },
  { year: "2023", up: false },
  { year: "Jan 25", up: true },
  { year: "Jul 25", up: false },
  { year: "Sep 25", up: true },
  { year: "Aug 26", up: false },
];

const drawJourney = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1c1b19");
  const faint = token(svg, "--ink-faint", "#8d877c");
  const sky = token(svg, "--sky", "#4a9fd0");
  const coral = token(svg, "--coral", "#e2725b");

  const padL = 26;
  const padR = 26;
  const midY = h / 2;
  const spanW = w - padL - padR;
  const step = spanW / (STOPS.length - 1);

  svg.appendChild(
    rc.line(padL, midY, padL + spanW, midY, { ...HAND, stroke: faint, strokeWidth: 1.8, seed: 4 })
  );

  STOPS.forEach((s, i) => {
    const x = padL + step * i;
    const last = i === STOPS.length - 1;
    svg.appendChild(
      rc.circle(x, midY, last ? 20 : 14, {
        ...HAND,
        stroke: ink,
        fill: last ? coral : sky,
        fillStyle: "solid",
        seed: 40 + i,
      })
    );
    text(svg, x, s.up ? midY - 20 : midY + 30, s.year, {
      size: 12.5,
      fill: last ? coral : faint,
      weight: last ? 700 : 400,
    });
  });
};

export function JourneyChart() {
  return (
    <RoughSvg
      height={110}
      draw={drawJourney}
      label="Timeline from 2021 to August 2026, marking six steps from starting a BTech in Chennai to submitting an MSc dissertation in London."
    />
  );
}

/* ------------------------------------------------------------------
   A drawn underline, for the one word that should carry emphasis.
   ------------------------------------------------------------------ */
const drawUnderline = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const sky = token(svg, "--sky", "#4a9fd0");
  svg.appendChild(
    rc.curve(
      [
        [4, h - 8],
        [w * 0.32, h - 14],
        [w * 0.68, h - 5],
        [w - 4, h - 12],
      ],
      { ...HAND, stroke: sky, strokeWidth: 4, roughness: 1.4, seed: 77 }
    )
  );
};

export function Underline() {
  return (
    <RoughSvg height={22} draw={drawUnderline} label="" className="hero-underline" />
  );
}
