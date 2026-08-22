"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/* ==================================================================
   Three figures from the dissertation on network intrusion detection
   under attacker-machine holdout, none of which the site has drawn
   before. Only two exact figures exist for the headline finding
   (0.9002 and 0.6059, both pooled macro-F1); no other number here is
   invented.
   ================================================================== */

const NS = "http://www.w3.org/2000/svg";

function text(
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
   1. RankFlip. The headline finding: the detector ranking reverses
   between an easy, leaky split and the honest attacker-machine
   holdout. Only 0.9002 and 0.6059 are real figures, and both are
   pooled scores, not per-model ones, so they label the axes rather
   than either line's endpoint. The two lines' heights are placed only
   to show which model leads on each side, nothing more is claimed.
   ------------------------------------------------------------------ */
const drawRankFlip = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#2a2733");
  const mute = token(svg, "--ink-mute", "#615b70");
  const lgb = token(svg, "--c2", "#f09a8b");
  const rf = token(svg, "--c3", "#92aee0");

  const padL = Math.min(112, w * 0.26);
  const padR = Math.min(112, w * 0.26);
  const padT = 40;
  const padB = 30;
  const xLeft = padL;
  const xRight = w - padR;
  const yTop = padT;
  const yBottom = h - padB;
  const plotH = yBottom - yTop;
  const yOf = (v: number) => yBottom - v * plotH;

  svg.appendChild(
    rc.line(xLeft, yTop, xLeft, yBottom, { ...HAND, stroke: ink, strokeWidth: 1.4, seed: 1 })
  );
  svg.appendChild(
    rc.line(xRight, yTop, xRight, yBottom, { ...HAND, stroke: ink, strokeWidth: 1.4, seed: 2 })
  );

  // axis titles, each carrying the one real number that belongs to it
  text(svg, xLeft, yTop - 24, "Random split", { fill: ink, size: 13, weight: 500 });
  text(svg, xLeft, yTop - 9, "pooled macro-F1 0.9002", { fill: mute, size: 11, mono: true });
  text(svg, xRight, yTop - 24, "Attacker holdout", { fill: ink, size: 13, weight: 500 });
  text(svg, xRight, yTop - 9, "pooled macro-F1 0.6059", { fill: mute, size: 11, mono: true });
  text(svg, xLeft, yBottom + 18, "0", { fill: mute, size: 10.5 });
  text(svg, xRight, yBottom + 18, "0", { fill: mute, size: 10.5 });

  // relative heights only: LightGBM leads on the easy split, RandomForest
  // leads on the honest one. No per-model figure is printed anywhere.
  const lgbLeftY = yOf(0.95);
  const lgbRightY = yOf(0.52);
  const rfLeftY = yOf(0.86);
  const rfRightY = yOf(0.67);

  svg.appendChild(
    rc.line(xLeft, lgbLeftY, xRight, lgbRightY, { ...HAND, stroke: lgb, strokeWidth: 2.6, seed: 21 })
  );
  svg.appendChild(
    rc.line(xLeft, rfLeftY, xRight, rfRightY, { ...HAND, stroke: rf, strokeWidth: 2.6, seed: 33 })
  );

  [
    [xLeft, lgbLeftY, lgb],
    [xRight, lgbRightY, lgb],
    [xLeft, rfLeftY, rf],
    [xRight, rfRightY, rf],
  ].forEach(([cx, cy, colour], i) => {
    svg.appendChild(
      rc.circle(cx as number, cy as number, 9, {
        ...HAND,
        stroke: colour as string,
        fill: colour as string,
        fillStyle: "solid",
        seed: 60 + i,
      })
    );
  });

  text(svg, xLeft - 14, lgbLeftY + 4, "LightGBM", { anchor: "end", fill: lgb, size: 12.5, weight: 500 });
  text(svg, xLeft - 14, rfLeftY + 4, "RandomForest", { anchor: "end", fill: rf, size: 12.5, weight: 500 });
  text(svg, xRight + 14, lgbRightY + 4, "LightGBM", { anchor: "start", fill: lgb, size: 12.5, weight: 500 });
  text(svg, xRight + 14, rfRightY + 4, "RandomForest", {
    anchor: "start",
    fill: rf,
    size: 12.5,
    weight: 500,
  });
};

export function RankFlip() {
  return (
    <div className="chart">
      <p className="meta">Detector ranking, easy split versus honest holdout</p>
      <RoughSvg
        height={260}
        label="Slope chart. Pooled macro-F1 is 0.9002 under a random split and falls to 0.6059 once entire attacker machines are held out of training. LightGBM ranks ahead of RandomForest under the random split, but RandomForest ranks ahead of LightGBM under the attacker-machine holdout, so the two lines cross."
        draw={drawRankFlip}
      />
      <p className="chart-note">
        <span className="hand-note">the winner changes when the test gets honest</span>
        Under a random split, pooled macro-F1 reaches 0.9002 and LightGBM comes out on top. Once
        whole attacker machines are held out of training rather than just individual flows,
        pooled macro-F1 drops to 0.6059 and RandomForest comes out on top instead. The ranking
        reverses. RandomForest is the detector that was locked in.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   2. HostEscalation. Aggregating flow verdicts up to whole devices:
   59 benign hosts stay clean, 8 of 9 attacker machines are caught, 1
   is missed. Binary accuracy 0.9853.
   ------------------------------------------------------------------ */
const BENIGN_COUNT = 59;
const CAUGHT_COUNT = 8;
const MISSED_COUNT = 1;
const TOTAL_COUNT = BENIGN_COUNT + CAUGHT_COUNT + MISSED_COUNT;
const GRID_COLS = 10;

const drawHostEscalation = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const ink = token(svg, "--ink", "#2a2733");
  const clean = token(svg, "--c4", "#9cc7ac");
  const attacker = token(svg, "--c2", "#f09a8b");

  const padL = 8;
  const padT = 8;
  const padB = 8;
  const rows = Math.ceil(TOTAL_COUNT / GRID_COLS);
  const cellW = (w - padL * 2) / GRID_COLS;
  const cellH = (h - padT - padB) / rows;
  const r = Math.min(cellW, cellH) * 0.3;

  for (let i = 0; i < TOTAL_COUNT; i++) {
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    const cx = padL + col * cellW + cellW / 2;
    const cy = padT + row * cellH + cellH / 2;

    if (i < BENIGN_COUNT) {
      svg.appendChild(
        rc.circle(cx, cy, r * 2, {
          ...HAND,
          stroke: clean,
          fill: clean,
          fillStyle: "solid",
          roughness: 0.7,
          seed: 100 + i,
        })
      );
      continue;
    }

    const attackerIndex = i - BENIGN_COUNT;
    const caught = attackerIndex < CAUGHT_COUNT;
    svg.appendChild(
      rc.rectangle(cx - r, cy - r, r * 2, r * 2, {
        ...HAND,
        stroke: attacker,
        strokeWidth: caught ? 1.6 : 2.2,
        fill: caught ? attacker : "transparent",
        fillStyle: "solid",
        roughness: 0.9,
        seed: 200 + i,
      })
    );
  }
};

export function HostEscalation() {
  return (
    <div className="chart">
      <p className="meta">Host-level verdicts after aggregating flows up to devices</p>
      <RoughSvg
        height={210}
        label="Dot grid of 68 hosts. All 59 benign hosts, drawn as filled circles, are correctly left clean. Of 9 attacker machines, drawn as squares, 8 are caught and filled in and 1 is missed and shown as an outline only. Binary accuracy is 0.9853."
        draw={drawHostEscalation}
      />
      <div className="legend">
        <span className="legend-item">
          <i style={{ background: "var(--c4)" }} /> Benign host, correctly clean
        </span>
        <span className="legend-item">
          <i style={{ background: "var(--c2)" }} /> Attacker machine, caught
        </span>
        <span className="legend-item">
          <i style={{ background: "transparent", border: "2px solid var(--c2)" }} /> Attacker
          machine, missed
        </span>
      </div>
      <p className="chart-note">
        <span className="hand-note">one attacker still gets through</span>
        Rolling flow-level verdicts up to whole devices catches 8 of the 9 attacker machines
        with no false alarms across 59 benign hosts, binary accuracy 0.9853. Good, not perfect:
        one attacker machine still slips past.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   3. ForecastRecord. Predicting future packets, then classifying the
   forecast, was tested against classifying what is already observed.
   It lost in 18 of 21 configurations.
   ------------------------------------------------------------------ */
const FORECAST_COLS = 7;
const FORECAST_ROWS = 3;
const FORECAST_TOTAL = FORECAST_COLS * FORECAST_ROWS;
const WIN_CELLS = new Set([3, 10, 16]);

const drawForecastRecord = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
  const lose = token(svg, "--ink-mute", "#615b70");
  const win = token(svg, "--c4", "#9cc7ac");

  const pad = 10;
  const cellW = (w - pad * 2) / FORECAST_COLS;
  const cellH = (h - pad * 2) / FORECAST_ROWS;
  const s = Math.min(cellW, cellH) * 0.72;

  for (let i = 0; i < FORECAST_TOTAL; i++) {
    const row = Math.floor(i / FORECAST_COLS);
    const col = i % FORECAST_COLS;
    const x = pad + col * cellW + (cellW - s) / 2;
    const y = pad + row * cellH + (cellH - s) / 2;
    const isWin = WIN_CELLS.has(i);

    svg.appendChild(
      rc.rectangle(x, y, s, s, {
        ...HAND,
        stroke: isWin ? win : lose,
        strokeWidth: isWin ? 1.8 : 1.2,
        fill: isWin ? win : lose,
        fillStyle: isWin ? "solid" : "hachure",
        hachureGap: 4,
        fillWeight: 1.4,
        roughness: 0.8,
        seed: 300 + i,
      })
    );
  }
};

export function ForecastRecord() {
  return (
    <div className="chart">
      <p className="meta">Predict-then-classify versus classifying what is already observed</p>
      <RoughSvg
        height={150}
        label="Grid of 21 cells recording every configuration tested. 18 are losses, shown lightly hatched, and 3 are wins, shown filled in. Predicting future packets before classifying them lost to classifying observed traffic directly in 18 of 21 configurations."
        draw={drawForecastRecord}
      />
      <p className="chart-note">
        <span className="hand-note">forecasting first did not pay off</span>
        Predicting future packets and then classifying the forecast was tested against
        classifying the traffic already observed. It lost in 18 of 21 configurations. Reported
        here as it came out, a negative result rather than one left out of the write-up.
      </p>
    </div>
  );
}
