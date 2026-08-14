"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/* ==================================================================
   Two figures from "Making Hidden Costs Visible", drawn from the real
   datasets in github.com/kautum/telling-stories-with-data.

   These are stages three and two of the paper's six-stage narrative,
   which is where its argument actually lives. The demand curve and the
   protein alternatives bookend the story; the collapse in stock health
   and the fact that bycatch is designed into the gear are the story.
   ================================================================== */

const NS = "http://www.w3.org/2000/svg";

function label(
  svg: SVGSVGElement,
  x: number,
  y: number,
  s: string,
  opts: { anchor?: string; size?: number; fill: string; mono?: boolean; weight?: number }
) {
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("text-anchor", opts.anchor ?? "middle");
  t.setAttribute("font-size", String(opts.size ?? 11.5));
  t.setAttribute("fill", opts.fill);
  if (opts.weight) t.setAttribute("font-weight", String(opts.weight));
  t.setAttribute(
    "font-family",
    opts.mono ? "var(--font-geist-mono), monospace" : "var(--font-geist-sans), sans-serif"
  );
  t.textContent = s;
  svg.appendChild(t);
}

/* ------------------------------------------------------------------
   Stage three. Share of world fish stocks inside biologically
   sustainable limits, FAO assessments, 1974 to 2021.
   ------------------------------------------------------------------ */
const STOCKS: [number, number][] = [
  [1974, 90.0],
  [1978, 88.5],
  [1982, 84.4],
  [1986, 78.3],
  [1990, 75.6],
  [1994, 76.2],
  [1998, 74.1],
  [2002, 74.5],
  [2006, 71.4],
  [2010, 68.2],
  [2014, 68.1],
  [2018, 65.2],
  [2021, 62.3],
];

const drawStocks = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1f1d1a");
  const mute = token(svg, "--ink-mute", "#6e695f");
  const ok = token(svg, "--c4", "#7fae92");
  const bad = token(svg, "--c2", "#e8836b");

  const padL = 38;
  const padR = 14;
  const padT = 16;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const x = (yr: number) => padL + ((yr - 1974) / (2021 - 1974)) * plotW;
  const y = (v: number) => padT + plotH - (v / 100) * plotH;

  // everything above the line is overexploited, so the gap is the story
  svg.appendChild(
    rc.rectangle(padL, padT, plotW, plotH, {
      ...HAND,
      stroke: bad,
      strokeWidth: 0,
      fill: bad,
      fillStyle: "hachure",
      hachureGap: 7,
      fillWeight: 1.6,
      hachureAngle: 41,
      seed: 12,
    })
  );

  const pts = STOCKS.map(([yr, v]) => [x(yr), y(v)] as [number, number]);
  const area: [number, number][] = [
    [padL, y(0)],
    ...pts,
    [padL + plotW, y(0)],
  ];
  svg.appendChild(
    rc.polygon(area, {
      ...HAND,
      stroke: "transparent",
      strokeWidth: 0,
      fill: ok,
      fillStyle: "solid",
      seed: 14,
    })
  );
  svg.appendChild(rc.linearPath(pts, { ...HAND, stroke: ink, strokeWidth: 2.4, seed: 15 }));
  svg.appendChild(
    rc.line(padL, y(0), padL + plotW, y(0), { ...HAND, stroke: ink, strokeWidth: 1.2, seed: 16 })
  );

  [0, 50, 100].forEach((v) =>
    label(svg, padL - 8, y(v) + 4, `${v}%`, { anchor: "end", fill: mute })
  );
  label(svg, padL, h - 6, "1974", { anchor: "start", fill: mute });
  label(svg, padL + plotW, h - 6, "2021", { anchor: "end", fill: mute });

  // the safe share is the area under the line, so its label goes low, and the
  // overexploited label goes above the line where the gap is widest, on the right
  label(svg, padL + plotW * 0.32, y(32), "within safe limits", {
    fill: ink,
    size: 13,
    weight: 500,
  });
  label(svg, padL + plotW * 0.72, y(83), "overexploited", { fill: ink, size: 13, weight: 500 });
};

export function StocksChart() {
  return (
    <div className="chart">
      <p className="meta">Share of world fish stocks inside biologically sustainable limits</p>
      <RoughSvg
        height={220}
        label="Area chart. The share of world fish stocks within biologically sustainable limits falls from 90 percent in 1974 to 62 percent in 2021, so the overexploited share rises from 10 percent to 38 percent."
        draw={drawStocks}
      />
      <p className="chart-note">
        <span className="hand-note">90% down to 62%, in one working life</span>
        Ten per cent of stocks were being fished beyond safe limits in 1974. By 2021 it was
        thirty-eight. FAO assessments, and the first stage of the story where the cost stops
        being abstract.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Stage two. Discards by gear type, 2014, from Kleisner et al. via the
   coursework's bycatch dataset. Bycatch is a property of the gear.
   ------------------------------------------------------------------ */
const GEAR: [string, number][] = [
  ["Bottom trawl", 4.16],
  ["Seine", 1.54],
  ["Midwater trawl", 0.94],
  ["Gillnets", 0.79],
  ["Other", 0.63],
  ["Longline", 0.36],
  ["Boat dredge", 0.2],
];

const TOTAL = GEAR.reduce((a, [, v]) => a + v, 0);

const drawGear = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1f1d1a");
  const mute = token(svg, "--ink-mute", "#6e695f");
  const hot = token(svg, "--c2", "#e8836b");
  const cool = token(svg, "--c5", "#a58cc9");

  const padL = Math.min(112, w * 0.3);
  const padR = 52;
  const plotW = w - padL - padR;
  const rowH = h / GEAR.length;
  const max = 4.4;

  GEAR.forEach(([name, value], i) => {
    const y = i * rowH + rowH * 0.2;
    const barH = rowH * 0.56;
    // the top gear is the finding, so only it gets the loud colour
    svg.appendChild(
      rc.rectangle(padL, y, Math.max(4, (value / max) * plotW), barH, {
        ...HAND,
        stroke: ink,
        strokeWidth: 1.3,
        fill: i === 0 ? hot : cool,
        fillStyle: i === 0 ? "cross-hatch" : "hachure",
        hachureGap: 4.5,
        fillWeight: 1.9,
        seed: 30 + i * 4,
      })
    );
    label(svg, padL - 10, y + barH / 2 + 4, name, {
      anchor: "end",
      size: 12.5,
      fill: i === 0 ? ink : mute,
      weight: i === 0 ? 500 : 400,
    });
    label(
      svg,
      padL + (value / max) * plotW + 8,
      y + barH / 2 + 4,
      `${Math.round((value / TOTAL) * 100)}%`,
      { anchor: "start", size: 12.5, fill: ink, mono: true }
    );
  });
};

export function GearChart() {
  return (
    <div className="chart">
      <p className="meta">Share of global discards by fishing gear, 2014</p>
      <RoughSvg
        height={215}
        label="Bar chart. Bottom trawling accounts for 48 percent of global fish discards, followed by seine at 18 percent and midwater trawl at 11 percent."
        draw={drawGear}
      />
      <p className="chart-note">
        <span className="hand-note">bycatch is a design choice, not an accident</span>
        Discards are fish caught and thrown back dead. Nearly half of them come from one gear
        type. That makes bycatch a structural property of how the fishing is done, rather than
        bad luck on a given trip.
      </p>
    </div>
  );
}
