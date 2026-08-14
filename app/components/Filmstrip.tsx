"use client";

import { useEffect, useRef } from "react";

/**
 * Draggable horizontal strip. Follows the apple-design rules properly rather
 * than approximately: 1:1 tracking with the grab offset respected, pointer
 * capture so the drag survives leaving the element, momentum projected from
 * release velocity, rubber-banding past the ends, and the release velocity
 * handed to the spring so drag and animation do not visibly seam.
 */
export default function Filmstrip({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let grabOffset = 0;
    let history: { x: number; t: number }[] = [];
    let raf = 0;

    const minX = () => Math.min(0, outer.clientWidth - track.scrollWidth);

    const paint = () => {
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const rubberband = (overshoot: number, dimension: number) => {
      const c = 0.55;
      return (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
    };

    const clamped = (raw: number) => {
      const lo = minX();
      if (raw > 0) return rubberband(raw, outer.clientWidth);
      if (raw < lo) return lo - rubberband(lo - raw, outer.clientWidth);
      return raw;
    };

    const spring = (target: number, velocity: number) => {
      cancelAnimationFrame(raf);
      if (reduce) {
        x = target;
        paint();
        return;
      }
      const stiffness = 180;
      const damping = 2 * Math.sqrt(stiffness);
      let v = velocity;
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.032);
        last = now;
        v += (-stiffness * (x - target) - damping * v) * dt;
        x += v * dt;
        paint();
        if (Math.abs(x - target) > 0.4 || Math.abs(v) > 4) {
          raf = requestAnimationFrame(step);
        } else {
          x = target;
          paint();
        }
      };
      raf = requestAnimationFrame(step);
    };

    const onDown = (e: PointerEvent) => {
      if (dragging) return; // ignore extra touch points mid-drag
      cancelAnimationFrame(raf);
      dragging = true;
      pointerId = e.pointerId;
      outer.setPointerCapture(e.pointerId);
      grabOffset = e.clientX - x;
      history = [{ x: e.clientX, t: performance.now() }];
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      x = clamped(e.clientX - grabOffset);
      paint();
      history.push({ x: e.clientX, t: performance.now() });
      if (history.length > 6) history.shift();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;

      const last = history[history.length - 1];
      const first = history[0];
      const dt = (last.t - first.t) / 1000;
      const velocity = dt > 0 ? (last.x - first.x) / dt : 0;

      // Apple's exponential decay, not the physics-textbook v^2 / 2a form
      const d = 0.998;
      const projected = x + ((velocity / 1000) * d) / (1 - d);
      const target = Math.min(0, Math.max(minX(), projected));
      spring(target, velocity);
    };

    const onResize = () => {
      x = Math.min(0, Math.max(minX(), x));
      paint();
    };

    outer.addEventListener("pointerdown", onDown);
    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerup", onUp);
    outer.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    paint();

    return () => {
      outer.removeEventListener("pointerdown", onDown);
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerup", onUp);
      outer.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={outerRef} className="strip-outer">
      <div ref={trackRef} className="strip-track">
        {children}
      </div>
    </div>
  );
}
