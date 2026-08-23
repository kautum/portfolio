"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/* ==================================================================
   DataViz — dark technical brutalist chart primitives.

   Four real datasets, exactly as given, nothing invented:
   1. SlopeReversal — pooled macro-F1 0.9002 (random split) vs 0.6059
      (attacker-machine holdout); LightGBM and RandomForest swap rank.
      No per-model score exists, so only those two pooled numbers are
      ever printed; the crossing lines show rank order only.
   2. StocksArea — 13 real FAO points, share of world fish stocks
      within biologically sustainable limits, 1974-2021. Not smoothed.
   3. HostGrid — 68 hosts: 59 benign, 8 attacker machines caught, 1
      missed (8 of 9 caught, 0 false alarms across 59 benign, matching
      the 0.9853 binary accuracy figure).
   4. BigMetric — reusable count-up hero number, the workhorse for a
      minimal-text page.
   ================================================================== */

/* ---------- shared ---------- */

type DvMargin = `${number}${"px" | "%"} ${number}${"px" | "%"}`;

/** Scroll-reveal gate: true once in view, or immediately under
 * prefers-reduced-motion so the final state always renders complete. */
function useReveal(margin: DvMargin = "-10% 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin });
  const reduced = useReducedMotion();
  return { ref, reveal: inView || !!reduced, reduced: !!reduced };
}

/* ================================================================
   1. SlopeReversal
   ================================================================ */

interface SlopeLine {
  id: string;
  name: string;
  colorVar: string;
  leftT: number; // 0 = top, 1 = bottom
  rightT: number;
  note: string;
}

const SLOPE_LINES: SlopeLine[] = [
  {
    id: "lgb",
    name: "LightGBM",
    colorVar: "var(--dv-accent)",
    leftT: 0.12,
    rightT: 0.88,
    note: "Leads under the random split.",
  },
  {
    id: "rf",
    name: "RandomForest",
    colorVar: "var(--dv-accent-2)",
    leftT: 0.88,
    rightT: 0.12,
    note: "Leads under the honest, attacker-machine holdout.",
  },
];

export interface SlopeReversalProps {
  className?: string;
}

/** The rank flip: two lines crossing between an easy split and the
 * honest one. Only 0.9002 and 0.6059 are real numbers here; they label
 * the axes, never a line endpoint, because no per-model score exists. */
export function SlopeReversal({ className = "" }: SlopeReversalProps) {
  const { ref, reveal, reduced } = useReveal();
  const [active, setActive] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  const W = 620;
  const H = 260;
  const padX = 96;
  const padTop = 46;
  const padBottom = 30;
  const x0 = padX;
  const x1 = W - padX;
  const plotH = H - padTop - padBottom;
  const yFor = (t: number) => padTop + t * plotH;

  const setActiveLine = (line: SlopeLine | null) => {
    setActive(line?.id ?? null);
    setAnnounce(line ? `${line.name}. ${line.note}` : "");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveLine(null);
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const idx = SLOPE_LINES.findIndex((l) => l.id === active);
      const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
      const next = idx === -1 ? 0 : (idx + dir + SLOPE_LINES.length) % SLOPE_LINES.length;
      setActiveLine(SLOPE_LINES[next]);
    }
  };

  return (
    <div
      ref={ref}
      className={`dv-slope ${className}`}
      role="img"
      aria-label="Rank reversal: pooled macro-F1 is 0.9002 under a random split but falls to 0.6059 under an attacker-machine holdout, and LightGBM and RandomForest swap first place between the two splits."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="dv-slope-svg" preserveAspectRatio="xMidYMid meet">
        <line x1={x0} y1={padTop} x2={x0} y2={H - padBottom} className="dv-slope-axis" />
        <line x1={x1} y1={padTop} x2={x1} y2={H - padBottom} className="dv-slope-axis" />

        <text x={x0} y={padTop - 24} textAnchor="middle" className="dv-slope-axislabel">
          Random split
        </text>
        <text x={x0} y={padTop - 8} textAnchor="middle" className="dv-slope-axisvalue dv-num">
          [ MACRO-F1 0.9002 ]
        </text>
        <text x={x1} y={padTop - 24} textAnchor="middle" className="dv-slope-axislabel">
          Attacker holdout
        </text>
        <text x={x1} y={padTop - 8} textAnchor="middle" className="dv-slope-axisvalue dv-num">
          [ MACRO-F1 0.6059 ]
        </text>

        {/* HUD crosshair marks at the axis corners */}
        {[x0, x1].flatMap((x) =>
          [padTop, H - padBottom].map((y) => (
            <text key={`${x}-${y}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="dv-crosshair-mark" aria-hidden="true">
              +
            </text>
          ))
        )}

        {SLOPE_LINES.map((line, i) => {
          const y0 = yFor(line.leftT);
          const y1v = yFor(line.rightT);
          const isActive = active === line.id;
          const dim = active !== null && !isActive;
          return (
            <g
              key={line.id}
              tabIndex={0}
              role="button"
              aria-label={`${line.name}: ${line.note}`}
              aria-pressed={isActive}
              className={`dv-slope-linegroup${dim ? " dv-dim" : ""}`}
              onFocus={() => setActiveLine(line)}
              onBlur={() => setActiveLine(null)}
              onMouseEnter={() => setActiveLine(line)}
              onMouseLeave={() => setActiveLine(null)}
              onKeyDown={onKeyDown}
            >
              <motion.path
                d={`M ${x0} ${y0} L ${x1} ${y1v}`}
                stroke={line.colorVar}
                className={`dv-slope-line${isActive ? " dv-active" : ""}`}
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={{ pathLength: reveal ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : i * 0.18, ease: "easeInOut" }}
              />
              <circle cx={x0} cy={y0} r={5} fill={line.colorVar} className="dv-slope-dot" />
              <circle cx={x1} cy={y1v} r={5} fill={line.colorVar} className="dv-slope-dot" />
              <text x={x0 - 12} y={y0} textAnchor="end" dominantBaseline="middle" className="dv-slope-name">
                {line.name}
              </text>
              <text x={x1 + 12} y={y1v} textAnchor="start" dominantBaseline="middle" className="dv-slope-name">
                {line.name}
              </text>
            </g>
          );
        })}
      </svg>
      <output aria-live="polite" className="dv-sr-only">
        {announce}
      </output>
    </div>
  );
}

/* ================================================================
   2. StocksArea
   ================================================================ */

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

export interface StocksAreaProps {
  className?: string;
}

/** The 13-point FAO series, drawn in on scroll, with a keyboard- and
 * pointer-accessible crosshair snapped to the real points. Not smoothed:
 * 1994 and 2002 tick up, and the line shows it. */
export function StocksArea({ className = "" }: StocksAreaProps) {
  const { ref, reveal, reduced } = useReveal();
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const W = 640;
  const H = 300;
  const padL = 46;
  const padR = 16;
  const padT = 20;
  const padB = 32;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const minYear = STOCKS[0][0];
  const maxYear = STOCKS[STOCKS.length - 1][0];
  const minV = 55;
  const maxV = 95;
  const xFor = (yr: number) => padL + ((yr - minYear) / (maxYear - minYear)) * plotW;
  const yFor = (v: number) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const linePath = STOCKS.map(([yr, v], i) => `${i === 0 ? "M" : "L"} ${xFor(yr)} ${yFor(v)}`).join(" ");
  const areaPath = `${linePath} L ${xFor(maxYear)} ${padT + plotH} L ${xFor(minYear)} ${padT + plotH} Z`;

  const nearestFromClientX = (clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const t = (clientX - rect.left) / rect.width;
    const vbX = t * W;
    let nearest = 0;
    let best = Infinity;
    STOCKS.forEach(([yr], i) => {
      const d = Math.abs(xFor(yr) - vbX);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    return nearest;
  };

  const onMove = (e: React.PointerEvent) => setActiveIdx(nearestFromClientX(e.clientX));
  const onLeave = () => setActiveIdx(null);

  const moveBy = (delta: number) =>
    setActiveIdx((cur) => {
      const base = cur === null ? 0 : cur;
      return Math.min(STOCKS.length - 1, Math.max(0, base + delta));
    });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveBy(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(STOCKS.length - 1);
    } else if (e.key === "Escape") {
      setActiveIdx(null);
    }
  };

  const active = activeIdx !== null ? STOCKS[activeIdx] : null;
  const valueText = active
    ? `${active[0]}: ${active[1].toFixed(1)}% within sustainable limits`
    : `${STOCKS[0][0]}: ${STOCKS[0][1].toFixed(1)}%`;

  return (
    <div ref={ref} className={`dv-stocks ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="dv-stocks-svg"
        preserveAspectRatio="xMidYMid meet"
        role="slider"
        tabIndex={0}
        aria-label="Share of world fish stocks within biologically sustainable limits, 1974 to 2021, falling from 90.0 percent to 62.3 percent, not in a straight line"
        aria-valuemin={0}
        aria-valuemax={STOCKS.length - 1}
        aria-valuenow={activeIdx ?? 0}
        aria-valuetext={valueText}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onKeyDown={onKeyDown}
      >
        <defs>
          <linearGradient id="dv-stocks-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--dv-accent)" stopOpacity="0.24" />
            <stop offset="100%" stopColor="var(--dv-accent)" stopOpacity="0" />
          </linearGradient>
          <filter id="dv-stocks-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[60, 70, 80, 90].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} className="dv-stocks-grid" />
            <text x={padL - 8} y={yFor(v)} textAnchor="end" dominantBaseline="middle" className="dv-stocks-tick dv-num">
              {v}%
            </text>
          </g>
        ))}

        <motion.path
          d={areaPath}
          fill="url(#dv-stocks-area)"
          initial={{ opacity: 0 }}
          animate={{ opacity: reveal ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.5 }}
        />

        <motion.path
          d={linePath}
          fill="none"
          className="dv-stocks-line"
          filter="url(#dv-stocks-glow)"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: reveal ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 1.5, ease: "easeInOut" }}
        />

        {STOCKS.map(([yr, v], i) => (
          <circle
            key={yr}
            cx={xFor(yr)}
            cy={yFor(v)}
            r={activeIdx === i ? 5 : 2.5}
            className={`dv-stocks-dot${activeIdx === i ? " dv-active" : ""}`}
          />
        ))}

        {active && (
          <g className="dv-stocks-crosshair" aria-hidden="true">
            <line x1={xFor(active[0])} x2={xFor(active[0])} y1={padT} y2={padT + plotH} />
          </g>
        )}

        {/* HUD crosshair marks at the plot corners */}
        {[padL, W - padR].flatMap((x) =>
          [padT, padT + plotH].map((y) => (
            <text key={`${x}-${y}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="dv-crosshair-mark" aria-hidden="true">
              +
            </text>
          ))
        )}
      </svg>

      <output className="dv-stocks-readout">
        {active ? (
          <>
            <data value={active[0]} className="dv-stocks-readout-year dv-num">
              {active[0]}
            </data>
            <data value={active[1]} className="dv-stocks-readout-value dv-num">
              {active[1].toFixed(1)}%
            </data>
          </>
        ) : (
          <span className="dv-stocks-readout-hint">Point at the line, or focus it and press arrow keys.</span>
        )}
      </output>
      <p aria-live="polite" className="dv-sr-only">
        {active ? valueText : ""}
      </p>
    </div>
  );
}

/* ================================================================
   3. HostGrid
   ================================================================ */

type HostStatus = "benign" | "caught" | "missed";

const HOST_TOTAL = 68;
const CAUGHT_IDX = [4, 11, 19, 27, 34, 42, 50, 58];
const MISSED_IDX = [63];
const HOST_STATUSES: HostStatus[] = (() => {
  const arr: HostStatus[] = Array(HOST_TOTAL).fill("benign");
  CAUGHT_IDX.forEach((i) => (arr[i] = "caught"));
  MISSED_IDX.forEach((i) => (arr[i] = "missed"));
  return arr;
})();

const HOST_COLUMNS = 8;

export interface HostGridProps {
  className?: string;
}

/** 68 hosts: 59 benign, 8 attacker machines caught, 1 missed. Matches
 * "8 of 9 caught, 0 false alarms across 59 benign hosts, 0.9853 accuracy." */
export function HostGrid({ className = "" }: HostGridProps) {
  const { ref, reveal, reduced } = useReveal();
  const [focusIdx, setFocusIdx] = useState(0);
  const [current, setCurrent] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const label = (i: number, status: HostStatus) =>
    status === "caught"
      ? `Host ${i + 1}: attacker machine, caught`
      : status === "missed"
        ? `Host ${i + 1}: attacker machine, missed`
        : `Host ${i + 1}: benign, no false alarm`;

  const focusCell = (i: number) => {
    const clamped = Math.min(HOST_TOTAL - 1, Math.max(0, i));
    setFocusIdx(clamped);
    cellRefs.current[clamped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusCell(focusIdx + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusCell(focusIdx - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusCell(focusIdx + HOST_COLUMNS);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusCell(focusIdx - HOST_COLUMNS);
        break;
      case "Home":
        e.preventDefault();
        focusCell(0);
        break;
      case "End":
        e.preventDefault();
        focusCell(HOST_TOTAL - 1);
        break;
      case "Escape":
        setCurrent(null);
        (document.activeElement as HTMLElement | null)?.blur();
        break;
      default:
        break;
    }
  };

  const currentStatus = current !== null ? HOST_STATUSES[current] : null;

  return (
    <div ref={ref} className={`dv-hostgrid ${className}`}>
      <div
        className="dv-hostgrid-grid"
        role="group"
        aria-label="68 monitored hosts: 59 benign with no false alarms, 8 of 9 attacker machines caught, 1 missed, 0.9853 binary accuracy"
        onKeyDown={onKeyDown}
      >
        {HOST_STATUSES.map((status, i) => (
          <motion.button
            key={i}
            type="button"
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            tabIndex={i === focusIdx ? 0 : -1}
            className={`dv-host-cell dv-host-${status}`}
            aria-label={label(i, status)}
            onFocus={() => {
              setFocusIdx(i);
              setCurrent(i);
            }}
            onBlur={() => setCurrent(null)}
            onMouseEnter={() => setCurrent(i)}
            onMouseLeave={() => setCurrent(null)}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.5 }}
            animate={{ opacity: reveal ? 1 : 0, scale: reveal ? 1 : 0.5 }}
            transition={{
              duration: reduced ? 0 : 0.35,
              delay: reduced ? 0 : Math.min(i, 40) * 0.012,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      <output className="dv-hostgrid-readout">
        {currentStatus ? (
          <span className={`dv-hostgrid-readout-text dv-host-readout-${currentStatus}`}>
            {label(current as number, currentStatus)}
          </span>
        ) : (
          <span className="dv-hostgrid-readout-hint">Point at or focus a host to read its status.</span>
        )}
      </output>
      <p aria-live="polite" className="dv-sr-only">
        {currentStatus ? label(current as number, currentStatus) : ""}
      </p>
    </div>
  );
}

/* ================================================================
   4. BigMetric
   ================================================================ */

export interface BigMetricProps {
  /** Target numeric value, e.g. 25.3 for "25.3%" or 1.86 for "1.86M". */
  value: number;
  /** Decimal places shown, default 0. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Show a leading "+" for positive values (for signed deltas). */
  signed?: boolean;
  /** Thousands separator, default off (most figures here read cleaner without). */
  grouping?: boolean;
  label: string;
  glow?: boolean;
  /** Count-up duration in ms, default 1400. */
  duration?: number;
  className?: string;
}

/** Reusable enormous animated number: counts up once it scrolls into
 * view, then settles. The workhorse for a minimal-text page. */
export function BigMetric({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  signed = false,
  grouping = false,
  label,
  glow = false,
  duration = 1400,
  className = "",
}: BigMetricProps) {
  const { ref, reveal, reduced } = useReveal("-15% 0px");
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!reveal) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reveal, reduced, value, duration]);

  const format = (n: number) => {
    const sign = signed && n > 0 ? "+" : "";
    return (
      sign +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      })
    );
  };

  return (
    <div ref={ref} className={`dv-bigmetric${glow ? " dv-glow" : ""} ${className}`} aria-label={`${label}: ${prefix}${format(value)}${suffix}`}>
      <data value={value} className="dv-bigmetric-value dv-num" aria-hidden="true">
        {prefix}
        {format(display)}
        {suffix}
      </data>
      <div className="dv-bigmetric-label">{label}</div>
    </div>
  );
}
