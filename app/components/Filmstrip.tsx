"use client";

import { useEffect, useRef } from "react";

/** How far the pointer must travel before this counts as a drag, in pixels. */
const THRESHOLD = 6;

/**
 * Draggable horizontal strip. Follows the apple-design rules: 1:1 tracking with
 * the grab offset respected, momentum projected from release velocity,
 * rubber-banding past the ends, and the release velocity handed to the spring
 * so drag and animation do not visibly seam.
 *
 * One important detail. Pointer capture is taken only once the pointer has
 * moved past THRESHOLD, never on pointerdown. Capturing immediately retargets
 * the browser's synthesised click to the capturing element, which silently
 * breaks every link inside the strip: the click lands on the container instead
 * of the anchor. Waiting for real movement means a press that never moves stays
 * an ordinary click and the links work.
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
    let pressed = false;
    let dragging = false;
    let suppressClick = false;
    let pointerId: number | null = null;
    let startX = 0;
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
      if (pressed) return; // ignore extra touch points mid-gesture
      cancelAnimationFrame(raf);
      pressed = true;
      dragging = false;
      suppressClick = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      grabOffset = e.clientX - x;
      history = [{ x: e.clientX, t: performance.now() }];
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;

      if (!dragging) {
        if (Math.abs(e.clientX - startX) < THRESHOLD) return;
        dragging = true;
        suppressClick = true;
        outer.setPointerCapture(e.pointerId);
      }

      x = clamped(e.clientX - grabOffset);
      paint();
      history.push({ x: e.clientX, t: performance.now() });
      if (history.length > 6) history.shift();
    };

    const onUp = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;
      pressed = false;
      pointerId = null;

      // never moved, so this was a click and the browser should handle it
      if (!dragging) return;
      dragging = false;

      const last = history[history.length - 1];
      const first = history[0];
      const dt = (last.t - first.t) / 1000;
      const velocity = dt > 0 ? (last.x - first.x) / dt : 0;

      // Apple's exponential decay, not the physics-textbook v^2 / 2a form
      const d = 0.998;
      const projected = x + ((velocity / 1000) * d) / (1 - d);
      spring(Math.min(0, Math.max(minX(), projected)), velocity);
    };

    // stop a drag that finishes over a link from opening it
    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    const onResize = () => {
      x = Math.min(0, Math.max(minX(), x));
      paint();
    };

    outer.addEventListener("pointerdown", onDown);
    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerup", onUp);
    outer.addEventListener("pointercancel", onUp);
    outer.addEventListener("click", onClick, true);
    window.addEventListener("resize", onResize);
    paint();

    return () => {
      outer.removeEventListener("pointerdown", onDown);
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerup", onUp);
      outer.removeEventListener("pointercancel", onUp);
      outer.removeEventListener("click", onClick, true);
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
