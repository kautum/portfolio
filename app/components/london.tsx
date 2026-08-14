"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/* ==================================================================
   London Climate Resilience, the group coursework. A five-dimensional
   scatter over 33 boroughs, redrawn here from the same merged CSV.

   Park access on x, flood risk on y, air pollution in colour, obesity
   in marker size. The finding is the one the trend line understates:
   parks improve overall livability a little, but flood exposure is set
   by where a borough sits relative to the Thames, not by its parks.
   ================================================================== */

type Borough = [name: string, parks: number, flood: number, obesity: number, pollution: number];

const BOROUGHS: Borough[] = [
  ["Barking and Dagenham", 3.22, 25, 69.3, 0],
  ["Barnet", 3.45, 2, 58.6, 0.3],
  ["Bexley", 2.57, 13, 64.2, 0],
  ["Brent", 2.76, 4, 61.3, 0.7],
  ["Bromley", 2.89, 6, 60.4, 0],
  ["Camden", 9.12, 0, 52.4, 11],
  ["City of London", 10.78, 3, 48.6, 41.3],
  ["Croydon", 2.76, 3, 62, 0],
  ["Ealing", 4.22, 6, 59.8, 0.5],
  ["Enfield", 3.48, 16, 62.4, 0.1],
  ["Greenwich", 3.74, 23, 60.2, 0.2],
  ["Hackney", 7.27, 3, 58.3, 0.8],
  ["Hammersmith and Fulham", 4.48, 89, 45.6, 2.6],
  ["Haringey", 6.32, 9, 53.4, 0.1],
  ["Harrow", 1.91, 3, 58.5, 0],
  ["Havering", 2.57, 8, 65.8, 0],
  ["Hillingdon", 2.41, 6, 63, 0],
  ["Hounslow", 2.91, 25, 58.1, 1.1],
  ["Islington", 11.23, 0, 42.6, 3.4],
  ["Kensington and Chelsea", 4.82, 6, 54.6, 8.7],
  ["Kingston upon Thames", 1.68, 10, 51, 0],
  ["Lambeth", 6, 22, 54.8, 2.2],
  ["Lewisham", 4.98, 17, 55.7, 0],
  ["Merton", 3.62, 13, 63.8, 0],
  ["Newham", 3.72, 50, 59, 0.8],
  ["Redbridge", 2.49, 5, 58, 0.5],
  ["Richmond upon Thames", 3.45, 43, 56.3, 0],
  ["Southwark", 10.65, 68, 57.4, 2.4],
  ["Sutton", 3.09, 5, 65.8, 0],
  ["Tower Hamlets", 11.96, 34, 60.4, 5.2],
  ["Waltham Forest", 4.12, 7, 62.1, 0.2],
  ["Wandsworth", 3.6, 30, 56, 0.3],
  ["Westminster", 7.89, 16, 51.9, 19.6],
];

/** Boroughs worth naming: the ones that carry the argument. */
const CALLOUTS = new Set([
  "Hammersmith and Fulham",
  "Southwark",
  "Newham",
  "Islington",
  "Harrow",
]);

const NS = "http://www.w3.org/2000/svg";

const drawLondon = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#1f1d1a");
  const mute = token(svg, "--ink-mute", "#6e695f");
  const clean = token(svg, "--c3", "#7295d1");
  const dirty = token(svg, "--c2", "#e8836b");
  const trend = token(svg, "--c4", "#7fae92");

  const padL = 40;
  const padR = 18;
  const padT = 30;
  const padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const x = (v: number) => padL + ((v - 1) / (12.5 - 1)) * plotW;
  const y = (v: number) => padT + plotH - (v / 95) * plotH;

  svg.appendChild(
    rc.line(padL, y(0), padL + plotW, y(0), { ...HAND, stroke: ink, strokeWidth: 1.2, seed: 4 })
  );
  [25, 50, 75].forEach((v, i) =>
    svg.appendChild(
      rc.line(padL, y(v), padL + plotW, y(v), {
        ...HAND,
        stroke: mute,
        strokeWidth: 0.6,
        roughness: 0.5,
        seed: 10 + i,
      })
    )
  );

  const text = (tx: number, ty: number, s: string, anchor: string, size: number, fill: string) => {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(tx));
    t.setAttribute("y", String(ty));
    t.setAttribute("text-anchor", anchor);
    t.setAttribute("font-size", String(size));
    t.setAttribute("fill", fill);
    t.setAttribute("font-family", "var(--font-geist-sans), sans-serif");
    t.textContent = s;
    svg.appendChild(t);
  };

  [0, 25, 50, 75].forEach((v) => text(padL - 7, y(v) + 4, `${v}%`, "end", 11, mute));
  text(padL, h - 16, "2 parks", "start", 11, mute);
  text(padL + plotW, h - 16, "12 parks", "end", 11, mute);
  text(padL + plotW / 2, h - 2, "parks within 1km", "middle", 11.5, mute);

  // the fitted livability trend from the coursework, r squared about 0.42
  svg.appendChild(
    rc.line(x(1.7), y(42), x(12), y(33), {
      ...HAND,
      stroke: trend,
      strokeWidth: 2.4,
      roughness: 0.6,
      strokeLineDash: [7, 5],
      seed: 55,
    })
  );

  BOROUGHS.forEach(([name, parks, flood, obesity, pollution], i) => {
    // size carries obesity, colour carries air pollution, as in the original
    const r = 9 + ((obesity - 42.6) / (69.3 - 42.6)) * 13;
    const polluted = pollution > 3;
    svg.appendChild(
      rc.circle(x(parks), y(flood), r, {
        ...HAND,
        stroke: ink,
        strokeWidth: 1,
        roughness: 0.8,
        fill: polluted ? dirty : clean,
        fillStyle: polluted ? "cross-hatch" : "hachure",
        hachureGap: 3.4,
        fillWeight: 1.5,
        seed: 100 + i * 2,
      })
    );
    if (CALLOUTS.has(name)) {
      const short = name.replace(" and Fulham", "").replace("City of ", "");
      text(x(parks), y(flood) - r / 2 - 7, short, "middle", 11, ink);
    }
  });
};

export function LondonChart() {
  return (
    <div className="chart">
      <p className="meta">
        33 London boroughs. Flood risk against park access, sized by obesity, coloured by air
        pollution
      </p>
      <RoughSvg
        height={300}
        label="Scatter plot of 33 London boroughs. Park access runs along the horizontal axis and flood risk up the vertical. Hammersmith and Fulham sits at 89 percent flood risk despite average park access, and Southwark at 68 percent despite high park access, while inland boroughs like Harrow sit near zero with few parks."
        draw={drawLondon}
      />
      <div className="legend">
        <span className="legend-item">
          <i style={{ background: "var(--c3)" }} /> Cleaner air
        </span>
        <span className="legend-item">
          <i style={{ background: "var(--c2)" }} /> More polluted
        </span>
        <span className="legend-item">
          <i style={{ background: "var(--c4)" }} /> Livability trend
        </span>
      </div>
      <p className="chart-note">
        <span className="hand-note">parks help. the river decides.</span>
        Bigger circles are more obese boroughs. The composite livability index does rise with
        park access, but only modestly, at an r squared of about 0.42. Flood exposure is set by
        the Thames: Hammersmith and Fulham has average park access and 89 per cent of properties
        in the floodplain, while Harrow has the fewest parks in London and almost no flood risk
        at all.
      </p>
    </div>
  );
}
