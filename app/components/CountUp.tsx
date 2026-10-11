"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that runs from `from` to `to` the first time it scrolls into view.
 *
 * The server renders the final value, so the true figure is in the HTML with
 * JavaScript off and under reduced motion. The start value is only swapped in
 * while the number is still below the fold, so nobody sees it jump backwards.
 */
export default function CountUp({
  from = 0,
  to,
  decimals = 0,
  duration = 1400,
}: {
  from?: number;
  to: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already seen

    setValue(from);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - p) ** 3;
          setValue(from + (to - from) * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return (
    <span ref={ref} className="tabular">
      {value.toFixed(decimals)}
    </span>
  );
}
