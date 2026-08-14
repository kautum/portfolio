"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/* ==================================================================
   Charts from the seafood coursework, drawn from the real datasets in
   github.com/kautum/telling-stories-with-data, so the numbers on this
   page are the numbers in the analysis.
   ================================================================== */

const NS = "http://www.w3.org/2000/svg";

function label(
  svg: SVGSVGElement,
  x: number,
  y: number,
  s: string,
  opts: { anchor?: string; size?: number; fill: string; mono?: boolean } = { fill: "#000" }
) {
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("text-anchor", opts.anchor ?? "middle");
  t.setAttribute("font-size", String(opts.size ?? 11.5));
  t.setAttribute("fill", opts.fill);
  t.setAttribute(
    "font-family",
    opts.mono ? "var(--font-geist-mono), monospace" : "var(--font-geist-sans), sans-serif"
  );
  t.textContent = s;
  svg.appendChild(t);
}

/** World production, million tonnes a year. FAO via Our World in Data. */
const PRODUCTION: [number, number, number][] = [
  [1960, 2.0, 31.6],
  [1965, 2.7, 43.3],
  [1970, 3.5, 58.2],
  [1975, 5.6, 55.8],
  [1980, 7.6, 58.1],
  [1985, 11.3, 67.1],
  [1990, 17.9, 79.4],
  [1995, 32.4, 92.9],
  [2000, 43.0, 89.9],
  [2005, 58.9, 89.9],
  [2010, 78.0, 87.7],
  [2013, 95.0, 90.5],
  [2016, 108.2, 90.2],
  [2019, 119.7, 92.8],
  [2022, 126.9, 88.0],
];

const drawProduction = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1f1d1a");
  const mute = token(svg, "--ink-mute", "#6e695f");
  const farmed = token(svg, "--c4", "#7fae92");
  const wild = token(svg, "--c3", "#7295d1");

  const padL = 38;
  const padR = 14;
  const padT = 18;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMax = 140;

  const x = (year: number) => padL + ((year - 1960) / (2022 - 1960)) * plotW;
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  svg.appendChild(
    rc.line(padL, y(0), padL + plotW, y(0), { ...HAND, stroke: ink, strokeWidth: 1.2, seed: 61 })
  );
  [50, 100].forEach((v, i) =>
    svg.appendChild(
      rc.line(padL, y(v), padL + plotW, y(v), {
        ...HAND,
        stroke: mute,
        strokeWidth: 0.7,
        roughness: 0.6,
        seed: 70 + i,
      })
    )
  );

  [0, 50, 100].forEach((v) =>
    label(svg, padL - 8, y(v) + 4, String(v), { anchor: "end", fill: mute })
  );
  label(svg, padL, h - 6, "1960", { anchor: "start", fill: mute });
  label(svg, padL + plotW, h - 6, "2022", { anchor: "end", fill: mute });

  svg.appendChild(
    rc.linearPath(
      PRODUCTION.map(([yr, , cap]) => [x(yr), y(cap)] as [number, number]),
      { ...HAND, stroke: wild, strokeWidth: 2.6, roughness: 0.7, seed: 21 }
    )
  );
  svg.appendChild(
    rc.linearPath(
      PRODUCTION.map(([yr, aq]) => [x(yr), y(aq)] as [number, number]),
      { ...HAND, stroke: farmed, strokeWidth: 2.6, roughness: 0.7, seed: 22 }
    )
  );

  // the crossover is the point of the chart, so it gets marked
  svg.appendChild(
    rc.line(x(2013), y(0), x(2013), y(108), {
      ...HAND,
      stroke: ink,
      strokeWidth: 1,
      roughness: 0.5,
      strokeLineDash: [5, 5],
      seed: 33,
    })
  );
  label(svg, x(2013), y(118), "2013", { fill: ink, size: 12.5, mono: true });
};

export function ProductionChart() {
  return (
    <div className="chart">
      <p className="meta">World fish production, million tonnes a year</p>
      <RoughSvg
        height={230}
        label="Line chart. Farmed fish production rises from 2 million tonnes in 1960 to 127 million in 2022, overtaking wild capture in 2013. Wild capture has been roughly flat near 90 million tonnes since 1990."
        draw={drawProduction}
      />
      <div className="legend">
        <span className="legend-item">
          <i style={{ background: "var(--c4)" }} /> Farmed
        </span>
        <span className="legend-item">
          <i style={{ background: "var(--c3)" }} /> Wild caught
        </span>
      </div>
      <p className="chart-note">
        <span className="hand-note">2013, farmed overtakes wild</span>
        Wild catch stopped growing around 1990 and has sat near 90 million tonnes ever since.
        Almost every extra fish eaten after that came from a farm.
      </p>
    </div>
  );
}

/** Kilograms of CO2 equivalent per kilogram of edible weight, 2021. */
const EMISSIONS: [string, number][] = [
  ["Seaweed", 1.1],
  ["Bivalves", 1.4],
  ["Salmon", 5.1],
  ["Shrimp", 9.4],
  ["Tilapia", 10.7],
  ["Other freshwater", 18.9],
];

const drawEmissions = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1f1d1a");
  const mute = token(svg, "--ink-mute", "#6e695f");
  const c = token(svg, "--c2", "#e8836b");

  const padL = Math.min(126, w * 0.34);
  const padR = 42;
  const plotW = w - padL - padR;
  const rowH = h / EMISSIONS.length;
  const max = 20;

  EMISSIONS.forEach(([name, value], i) => {
    const y = i * rowH + rowH * 0.2;
    const barH = rowH * 0.54;
    svg.appendChild(
      rc.rectangle(padL, y, Math.max(4, (value / max) * plotW), barH, {
        ...HAND,
        stroke: ink,
        strokeWidth: 1.4,
        fill: c,
        fillStyle: "hachure",
        hachureGap: 4,
        fillWeight: 2,
        seed: 80 + i * 3,
      })
    );
    label(svg, padL - 10, y + barH / 2 + 4, name, { anchor: "end", size: 12.5, fill: mute });
    label(svg, padL + (value / max) * plotW + 8, y + barH / 2 + 4, value.toFixed(1), {
      anchor: "start",
      size: 12.5,
      fill: ink,
      mono: true,
    });
  });
};

export function EmissionsChart() {
  return (
    <div className="chart">
      <p className="meta">Kilograms of CO2 equivalent per kilogram eaten, 2021</p>
      <RoughSvg
        height={200}
        label="Bar chart. Emissions per kilogram of edible seafood range from 1.1 for seaweed and 1.4 for bivalves up to 18.9 for other farmed freshwater fish."
        draw={drawEmissions}
      />
      <p className="chart-note">
        <span className="hand-note">a seventeenfold spread</span>
        Swapping farmed freshwater fish for bivalves changes the carbon cost of a meal by more
        than an order of magnitude, which is a larger lever than most diet advice bothers with.
      </p>
    </div>
  );
}
