"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  label: string;
  value: number;
  display: string;
  accent: string;
  caption?: string;
};

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

/**
 * Horizontal bars with the figure set large enough to be the graphic itself.
 * Bars grow from zero once the chart is in view. Every number here also appears
 * in the surrounding prose, so nothing depends on seeing the drawing.
 */
export function Bars({
  rows,
  max = 1,
  note,
  label,
}: {
  rows: Row[];
  max?: number;
  note?: string;
  label: string;
}) {
  const { ref, seen } = useInView<HTMLDivElement>();

  return (
    <div className="chart" ref={ref} role="img" aria-label={label}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ marginBottom: i === rows.length - 1 ? 0 : 28 }}>
          <div className="bar-head">
            <span className="meta" style={{ margin: 0 }}>
              {r.label}
            </span>
            <span className="mono bar-value">{r.display}</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: seen ? `${(r.value / max) * 100}%` : 0,
                background: r.accent,
                transitionDelay: `${i * 110}ms`,
              }}
            />
          </div>
          {r.caption ? (
            <p className="meta" style={{ margin: "8px 0 0" }}>
              {r.caption}
            </p>
          ) : null}
        </div>
      ))}
      {note ? <p className="chart-note">{note}</p> : null}
    </div>
  );
}

export function HonestChart() {
  return (
    <Bars
      label="The same detector scores 0.9002 macro-F1 under a random split and 0.6059 once entire attacker machines are held out of training."
      rows={[
        {
          label: "Random split",
          value: 0.9002,
          display: "0.9002",
          accent: "var(--c3)",
          caption: "What the field reports",
        },
        {
          label: "Attacker machines held out",
          value: 0.6059,
          display: "0.6059",
          accent: "var(--c2)",
          caption: "What is actually true",
        },
      ]}
      note="Macro-F1 on the same nine-class problem. Same detector, same features. Only the way the data was divided changed."
    />
  );
}

export function ImpactChart() {
  return (
    <Bars
      label="Manual reporting time fell to 40 percent of its original level after the retrieval chatbot was adopted."
      rows={[
        { label: "Reporting by hand", value: 100, display: "100%", accent: "var(--c1)" },
        {
          label: "After the chatbot shipped",
          value: 40,
          display: "40%",
          accent: "var(--c4)",
          caption: "Sixty per cent of the time back",
        },
      ]}
      max={100}
      note="Relative time spent assembling the RFID monitoring reports at Celcom Solutions, before and after."
    />
  );
}

const STOPS = ["2021", "2023", "Jan 25", "Jul 25", "Sep 25", "Aug 26"];

export function Timeline() {
  const { ref, seen } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="timeline"
      role="img"
      aria-label="Timeline of six steps from 2021 to August 2026."
    >
      <div className="timeline-rail">
        <div className={`timeline-fill${seen ? " in" : ""}`} />
      </div>
      <div className="timeline-stops">
        {STOPS.map((s, i) => (
          <div key={s} className="timeline-stop">
            <span
              className={`disc disc-sm${seen ? " in" : ""}`}
              style={{
                background: i === STOPS.length - 1 ? "var(--c2)" : "var(--ink)",
                transitionDelay: `${300 + i * 90}ms`,
              }}
            />
            <p className="meta">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
