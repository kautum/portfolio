"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

type FillStyle = "hachure" | "cross-hatch" | "zigzag";

/** One drawn bar, sized to its row so the label above it always lines up. */
function bar(value: number, max: number, colourVar: string, fill: FillStyle, seed: number) {
  return (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
    const ink = token(svg, "--ink", "#1f1d1a");
    const colour = token(svg, colourVar, "#e4572e");
    const barH = h - 8;

    // the full-scale outline, so a short bar still reads against something
    svg.appendChild(
      rc.rectangle(2, 4, w - 4, barH, {
        ...HAND,
        stroke: ink,
        strokeWidth: 1,
        roughness: 0.6,
        seed: seed + 50,
      })
    );
    svg.appendChild(
      rc.rectangle(2, 4, Math.max(10, (value / max) * (w - 4)), barH, {
        ...HAND,
        stroke: ink,
        fill: colour,
        fillStyle: fill,
        hachureGap: 5,
        fillWeight: 2.4,
        seed,
      })
    );
  };
}

type Row = {
  label: string;
  display: string;
  value: number;
  colourVar: string;
  fill: FillStyle;
  seed: number;
};

function Chart({
  rows,
  max,
  note,
  aside,
  label,
}: {
  rows: Row[];
  max: number;
  note: string;
  aside: string;
  label: string;
}) {
  return (
    <div className="chart" role="img" aria-label={label}>
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <div className="bar-head">
            <span className="meta">{r.label}</span>
            <span className="mono bar-value">{r.display}</span>
          </div>
          <RoughSvg height={40} draw={bar(r.value, max, r.colourVar, r.fill, r.seed)} />
        </div>
      ))}
      <p className="chart-note">
        <span className="hand-note">{aside}</span>
        {note}
      </p>
    </div>
  );
}

export function HonestChart() {
  return (
    <Chart
      label="The same detector scores 0.9002 macro-F1 under a random split and 0.6059 once entire attacker machines are held out of training."
      aside="the honest one is the short one"
      note="Macro-F1 on the same nine-class problem. Same detector, same features. Only the way the data was divided changed."
      max={1}
      rows={[
        {
          label: "Random split, what the field reports",
          display: "0.9002",
          value: 0.9002,
          colourVar: "--c3",
          fill: "hachure",
          seed: 3,
        },
        {
          label: "Attacker machines held out, what is true",
          display: "0.6059",
          value: 0.6059,
          colourVar: "--c2",
          fill: "cross-hatch",
          seed: 9,
        },
      ]}
    />
  );
}

export function ImpactChart() {
  return (
    <Chart
      label="Manual reporting time fell to 40 percent of its original level after the retrieval chatbot was adopted."
      aside="sixty per cent of the week, back"
      note="Relative time spent assembling the RFID monitoring reports at Celcom Solutions, before and after."
      max={100}
      rows={[
        {
          label: "Reporting by hand",
          display: "100%",
          value: 100,
          colourVar: "--c1",
          fill: "hachure",
          seed: 5,
        },
        {
          label: "After the chatbot shipped",
          display: "40%",
          value: 40,
          colourVar: "--c4",
          fill: "zigzag",
          seed: 11,
        },
      ]}
    />
  );
}
