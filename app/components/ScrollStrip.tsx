"use client";

import { useEffect, useRef } from "react";

/**
 * rauno.me's signature move: vertical scrolling drives a horizontal strip.
 * The section is made tall, a sticky viewport pins inside it, and progress
 * through the tall section is mapped to sideways travel.
 *
 * On narrow screens and under reduced motion this drops back to an ordinary
 * horizontal scroller, because pinning the viewport on a phone is a good way
 * to make a page feel broken.
 */
export default function ScrollStrip({
  children,
  count,
}: {
  children: React.ReactNode;
  count: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const wide = window.matchMedia("(min-width: 861px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let enabled = false;

    const measure = () => {
      enabled = wide.matches && !reduce.matches;
      if (!enabled) {
        section.style.height = "";
        track.style.transform = "";
        return;
      }
      // one screen of scroll per panel feels roughly right
      const travel = Math.max(0, track.scrollWidth - window.innerWidth + 48);
      section.style.height = `${window.innerHeight + travel}px`;
    };

    const frame = () => {
      if (enabled) {
        const r = section.getBoundingClientRect();
        const travel = Math.max(0, track.scrollWidth - window.innerWidth + 48);
        const progress = Math.min(1, Math.max(0, -r.top / (section.offsetHeight - window.innerHeight)));
        track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    measure();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);
    reduce.addEventListener("change", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", measure);
      reduce.removeEventListener("change", measure);
    };
  }, [count]);

  return (
    <div ref={sectionRef} className="sstrip">
      <div className="sstrip-pin">
        <div ref={trackRef} className="sstrip-track">
          {children}
        </div>
      </div>
    </div>
  );
}
