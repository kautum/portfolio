"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/**
 * The cover. One enormous word, edge to edge, with the dissertation's headline
 * result drawn straight through it: the honest score falling from 0.90 to 0.61
 * once the evaluation leak is closed.
 *
 * The type says what he is. The line through it says what he actually did.
 */

/* The drop, as it appears in the report: an easy plateau, then the fall to the
   honest number once whole attacker machines are held out. */
const CURVE = [0.9, 0.9, 0.89, 0.88, 0.86, 0.8, 0.72, 0.66, 0.62, 0.61, 0.61];

function drawDrop(rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) {
  const ink = token(svg, "--c2", "#f09a8b");
  const pad = 10;
  const top = 0.95;
  const bottom = 0.55;
  const x = (i: number) => pad + (i / (CURVE.length - 1)) * (w - pad * 2);
  const y = (v: number) => pad + ((top - v) / (top - bottom)) * (h - pad * 2);

  const points = CURVE.map((v, i) => [x(i), y(v)] as [number, number]);
  svg.appendChild(
    rc.curve(points, { ...HAND, stroke: ink, strokeWidth: 3, roughness: 1.1, seed: 71 })
  );

  // the two readings that matter, marked on the line
  svg.appendChild(
    rc.circle(x(0), y(CURVE[0]), 13, {
      ...HAND,
      stroke: ink,
      fill: ink,
      fillStyle: "solid",
      seed: 72,
    })
  );
  svg.appendChild(
    rc.circle(x(CURVE.length - 1), y(0.61), 13, {
      ...HAND,
      stroke: ink,
      fill: ink,
      fillStyle: "solid",
      seed: 73,
    })
  );
}

export default function Cover() {
  return (
    <section className="cover" aria-label="Cover">
      <div className="cover-inner">
        <p className="cover-eyebrow">Kautum Krishnan Panjalaraja</p>

        <div className="cover-word-wrap">
          <h1 className="cover-word">
            ANALYST
            <span className="cover-year">2026</span>
          </h1>
          <div className="cover-curve" aria-hidden="true">
            <RoughSvg height={260} draw={drawDrop} />
          </div>
        </div>

        <div className="cover-foot">
          <p className="cover-caption">
            <span className="cover-reading">0.90</span> reported,{" "}
            <span className="cover-reading">0.61</span> once the test stops leaking its
            own answer. My dissertation, and the habit the rest of this page is built on.
          </p>
          <ul className="cover-chips">
            <li>SQL</li>
            <li>Python</li>
            <li>Tableau</li>
            <li>Excel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
