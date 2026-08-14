"use client";

import { useEffect, useRef, useState } from "react";

const TICKS = 19;

/**
 * Fixed tick scrubber showing position in the page, after rauno.me. Discrete
 * ticks rather than a filled bar, so it reads as an instrument and not as a
 * loading state. Dragging or clicking it seeks.
 */
export default function Scrubber() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;

    const seek = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: t * max, behavior: dragging ? "auto" : "smooth" });
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      seek(e.clientX);
    };
    const onMove = (e: PointerEvent) => dragging && seek(e.clientX);
    const onUp = () => (dragging = false);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const active = Math.round(progress * (TICKS - 1));

  return (
    <div
      ref={ref}
      className="scrubber"
      role="slider"
      aria-label="Page position"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={-1}
    >
      {Array.from({ length: TICKS }, (_, i) =>
        i === active ? (
          <span key={i} className="tick-block" />
        ) : (
          <span
            key={i}
            className={`tick${Math.abs(i - active) === 1 ? " near" : ""}`}
          />
        )
      )}
    </div>
  );
}
