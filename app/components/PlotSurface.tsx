"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The page drawn as a plotting canvas.
 *
 * Two parts. A faint grid across the whole viewport, and a numbered ruler down
 * the left edge that tracks scroll, so moving through the page reads as
 * travelling along an axis. The site is about measurement, so the furniture
 * of measurement is the honest decoration for it.
 *
 * The ruler is hidden below 1100px, where there is no margin to spare.
 */
export default function PlotSurface() {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 0 to 1000, the way an axis would be labelled rather than a percentage
  const reading = Math.round(progress * 1000);
  const ticks = [0, 200, 400, 600, 800, 1000];

  return (
    <>
      <div className="plot-grid" aria-hidden="true" />
      <div className="plot-axis" aria-hidden="true">
        <div className="plot-axis-line" />
        {ticks.map((t) => (
          <div className="plot-tick" key={t} style={{ top: `${t / 10}%` }}>
            <span className="plot-tick-label">{t}</span>
          </div>
        ))}
        <div className="plot-cursor" style={{ top: `${progress * 100}%` }}>
          <span className="plot-cursor-label">{reading}</span>
        </div>
      </div>
    </>
  );
}
