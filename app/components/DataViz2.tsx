"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/* ==================================================================
   DataViz2 — two more dark technical brutalist chart primitives,
   matching the register set in DataViz.tsx / dataviz.css: near-black
   canvas, uppercase monospace HUD labels, crosshair "+" marks at plot
   corners, hairline grids, ring-style markers, glow only on the real
   data marks, zero border-radius, tabular-nums throughout.

   1. DiscardsBar — global fish discards by gear type, 2014. Exact
      figures, nothing invented: bottom trawl 48%, seine 18%, midwater
      trawl 11%, gillnets 9%, other 7%, longline 4%, boat dredge 2%.
   2. BoroughScatter — the real 33-borough dataset lives in
      app/components/london.tsx (the BOROUGHS array). Copied verbatim
      here, not re-derived: park access, flood risk, obesity, air
      pollution per borough. The trend line reuses the exact anchor
      points london.tsx already draws for its own fitted line
      (parks 1.7 -> index 42, parks 12 -> index 33, r^2 about 0.42) —
      that pair is the only "fitted line" value that exists in this
      codebase, so it is reused rather than re-fit from scratch.
   ================================================================== */

function useReveal(margin: `${number}${"px" | "%"} ${number}${"px" | "%"}` = "-10% 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin });
  const reduced = useReducedMotion();
  return { ref, reveal: inView || !!reduced, reduced: !!reduced };
}

/* ================================================================
   1. DiscardsBar
   ================================================================ */

const DISCARDS: [gear: string, pct: number][] = [
  ["Bottom trawl", 48],
  ["Seine", 18],
  ["Midwater trawl", 11],
  ["Gillnets", 9],
  ["Other", 7],
  ["Longline", 4],
  ["Boat dredge", 2],
];

export interface DiscardsBarProps {
  className?: string;
}

/** Global fish discards by gear type, 2014. Bottom trawl alone accounts
 * for nearly half, so it is drawn in the accent-2 glow colour while
 * every other bar stays in the plain accent — the point is structural,
 * not a rounding accident. */
export function DiscardsBar({ className = "" }: DiscardsBarProps) {
  const { ref, reveal, reduced } = useReveal();

  const W = 640;
  const padL = 132;
  const padR = 54;
  const padT = 18;
  const padB = 30;
  const rowH = 30;
  const rowGap = 12;
  const barH = 20;
  const plotW = W - padL - padR;
  const plotH = DISCARDS.length * rowH + (DISCARDS.length - 1) * rowGap;
  const H = padT + plotH + padB;
  const domainMax = 50;
  const ticks = [0, 10, 20, 30, 40, 50];

  const xFor = (v: number) => padL + (v / domainMax) * plotW;
  const yFor = (i: number) => padT + i * (rowH + rowGap);

  const ariaLabel =
    "Horizontal bar chart of global fish discards by gear type, 2014: bottom trawl 48 percent, seine 18 percent, midwater trawl 11 percent, gillnets 9 percent, other 7 percent, longline 4 percent, boat dredge 2 percent. Bottom trawl alone accounts for nearly half of all discards.";

  return (
    <div ref={ref} className={`dv2-bars ${className}`} role="img" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="dv2-bars-svg" preserveAspectRatio="xMidYMid meet">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={xFor(v)} x2={xFor(v)} y1={padT} y2={padT + plotH} className="dv2-bars-grid" />
            <text x={xFor(v)} y={padT + plotH + 18} textAnchor="middle" className="dv2-bars-tick dv-num">
              {v}%
            </text>
          </g>
        ))}

        {/* HUD crosshair marks at the plot corners */}
        {[padL, padL + plotW].flatMap((x) =>
          [padT, padT + plotH].map((y) => (
            <text key={`${x}-${y}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="dv2-crosshair-mark" aria-hidden="true">
              +
            </text>
          ))
        )}

        {DISCARDS.map(([gear, pct], i) => {
          const rowY = yFor(i);
          const barY = rowY + (rowH - barH) / 2;
          const fullWidth = xFor(pct) - padL;
          const dominant = i === 0;
          return (
            <g key={gear}>
              <text x={padL - 12} y={rowY + rowH / 2} textAnchor="end" dominantBaseline="middle" className="dv2-bars-label">
                {gear}
              </text>
              <motion.rect
                x={padL}
                y={barY}
                width={fullWidth}
                height={barH}
                className={`dv2-bars-bar${dominant ? " dv2-dominant" : ""}`}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                initial={{ scaleX: reduced ? 1 : 0 }}
                animate={{ scaleX: reveal ? 1 : 0 }}
                transition={{
                  duration: reduced ? 0 : 0.8,
                  delay: reduced ? 0 : i * 0.09,
                  ease: "easeOut",
                }}
              />
              <motion.text
                x={padL + fullWidth + 8}
                y={rowY + rowH / 2}
                dominantBaseline="middle"
                className={`dv2-bars-value dv-num${dominant ? " dv2-dominant-text" : ""}`}
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: reveal ? 1 : 0 }}
                transition={{
                  duration: reduced ? 0 : 0.3,
                  delay: reduced ? 0 : i * 0.09 + 0.5,
                }}
              >
                {pct}%
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ================================================================
   2. BoroughScatter
   ================================================================ */

type Borough = [name: string, parks: number, flood: number, obesity: number, pollution: number];

/* Verbatim from app/components/london.tsx (BOROUGHS const). Do not
 * re-derive: name, park access (per 1000 people), flood risk (% of
 * properties in the floodplain), obesity (%), air pollution index. */
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

const OBESITY_MIN = Math.min(...BOROUGHS.map((b) => b[3]));
const OBESITY_MAX = Math.max(...BOROUGHS.map((b) => b[3]));
const POLLUTION_MAX = Math.max(...BOROUGHS.map((b) => b[4]));

// Same axis domains london.tsx uses to plot this data: parks 1-12.5, flood 0-95.
const PARK_MIN = 1;
const PARK_MAX = 12.5;
const FLOOD_MAX = 95;

// The exact trend-line anchor points already drawn in london.tsx for the
// fitted "composite livability index" line (r^2 about 0.42): parks 1.7 -> 42,
// parks 12 -> 33, plotted on the same 0-95 scale as flood risk. Reused as-is.
const TREND: [number, number][] = [
  [1.7, 42],
  [12, 33],
];

const BOROUGHS_BY_PARKS = BOROUGHS.map((b, i) => ({ b, i })).sort((a, z) => a.b[1] - z.b[1]);

export interface BoroughScatterProps {
  className?: string;
}

/** 33 London boroughs: park access (x), flood risk (y), obesity (marker
 * size), air pollution (marker colour), plus the fitted livability
 * trend line (r^2 about 0.42). Hover or focus a marker, or tab in and
 * use the arrow keys, to read a borough's values. */
export function BoroughScatter({ className = "" }: BoroughScatterProps) {
  const { ref, reveal, reduced } = useReveal();
  const [focusPos, setFocusPos] = useState(0);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  const W = 640;
  const H = 340;
  const padL = 44;
  const padR = 20;
  const padT = 22;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xFor = (v: number) => padL + ((v - PARK_MIN) / (PARK_MAX - PARK_MIN)) * plotW;
  const yFor = (v: number) => padT + plotH - (v / FLOOD_MAX) * plotH;
  const rFor = (obesity: number) => 4 + ((obesity - OBESITY_MIN) / (OBESITY_MAX - OBESITY_MIN)) * 11;
  const colorFor = (pollution: number) => {
    const t = Math.round(Math.sqrt(pollution / POLLUTION_MAX) * 100);
    return `color-mix(in srgb, var(--dv-accent) ${t}%, var(--dv-ink-mute) ${100 - t}%)`;
  };

  const label = ([name, parks, flood, obesity, pollution]: Borough) =>
    `${name}: ${parks.toFixed(2)} parks per thousand, ${flood}% flood risk, ${obesity}% obesity, ${pollution} air pollution index`;

  const focusNode = (pos: number) => {
    const clamped = Math.min(BOROUGHS_BY_PARKS.length - 1, Math.max(0, pos));
    setFocusPos(clamped);
    nodeRefs.current[clamped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        focusNode(focusPos + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        focusNode(focusPos - 1);
        break;
      case "Home":
        e.preventDefault();
        focusNode(0);
        break;
      case "End":
        e.preventDefault();
        focusNode(BOROUGHS_BY_PARKS.length - 1);
        break;
      case "Escape":
        setCurrentIdx(null);
        (document.activeElement as HTMLElement | null)?.blur();
        break;
      default:
        break;
    }
  };

  const current = currentIdx !== null ? BOROUGHS[currentIdx] : null;

  return (
    <div
      ref={ref}
      className={`dv2-scatter ${className}`}
      role="group"
      aria-label="Scatter plot of 33 London boroughs: park access on the horizontal axis, flood risk on the vertical, marker size for obesity, marker colour for air pollution, and a fitted livability trend line at r squared about 0.42. Hammersmith and Fulham has average park access but 89 percent of properties in the floodplain. Harrow has the fewest parks and almost no flood risk."
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dv2-scatter-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 25, 50, 75].map((v) => (
          <g key={v}>
            <line x1={padL} x2={padL + plotW} y1={yFor(v)} y2={yFor(v)} className="dv2-scatter-grid" />
            <text x={padL - 8} y={yFor(v)} textAnchor="end" dominantBaseline="middle" className="dv2-scatter-tick dv-num">
              {v}%
            </text>
          </g>
        ))}
        <text x={padL} y={H - 6} textAnchor="start" className="dv2-scatter-axislabel">
          FEWER PARKS
        </text>
        <text x={padL + plotW} y={H - 6} textAnchor="end" className="dv2-scatter-axislabel">
          MORE PARKS
        </text>

        {/* HUD crosshair marks at the plot corners */}
        {[padL, padL + plotW].flatMap((x) =>
          [padT, padT + plotH].map((y) => (
            <text key={`${x}-${y}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="dv2-crosshair-mark" aria-hidden="true">
              +
            </text>
          ))
        )}

        <motion.line
          x1={xFor(TREND[0][0])}
          y1={yFor(TREND[0][1])}
          x2={xFor(TREND[1][0])}
          y2={yFor(TREND[1][1])}
          className="dv2-scatter-trend"
          initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
          animate={{ pathLength: reveal ? 1 : 0, opacity: reveal ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.15, ease: "easeInOut" }}
        />

        {BOROUGHS_BY_PARKS.map(({ b, i }, pos) => {
          const [name, parks, flood, obesity, pollution] = b;
          const r = rFor(obesity);
          const isCurrent = currentIdx === i;
          return (
            <g
              key={name}
              ref={(el) => {
                nodeRefs.current[pos] = el;
              }}
              tabIndex={pos === focusPos ? 0 : -1}
              role="button"
              aria-label={label(b)}
              className={`dv2-scatter-point${isCurrent ? " dv2-active" : ""}`}
              onFocus={() => {
                setFocusPos(pos);
                setCurrentIdx(i);
              }}
              onBlur={() => setCurrentIdx(null)}
              onMouseEnter={() => setCurrentIdx(i)}
              onMouseLeave={() => setCurrentIdx(null)}
              onKeyDown={onKeyDown}
            >
              <motion.circle
                cx={xFor(parks)}
                cy={yFor(flood)}
                r={r}
                stroke={colorFor(pollution)}
                initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
                animate={{ scale: reveal ? 1 : 0, opacity: reveal ? 1 : 0 }}
                transition={{
                  duration: reduced ? 0 : 0.4,
                  delay: reduced ? 0 : Math.min(pos, 33) * 0.02,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${xFor(parks)}px ${yFor(flood)}px` }}
              />
            </g>
          );
        })}
      </svg>

      <output aria-live="polite" className="dv2-scatter-readout">
        {current ? (
          <span className="dv2-scatter-readout-text">
            <span className="dv2-scatter-readout-name">{current[0]}</span>
            <span className="dv-num">Parks {current[1].toFixed(2)}</span>
            <span className="dv-num">Flood {current[2]}%</span>
            <span className="dv-num">Obesity {current[3]}%</span>
            <span className="dv-num">Pollution {current[4]}</span>
          </span>
        ) : (
          <span className="dv2-scatter-readout-hint">Point at or focus a borough to read its values.</span>
        )}
      </output>
    </div>
  );
}
