"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PAD = 3;

const STATES = [
  {
    value: "0.9002",
    label:
      "Random split. Flows from the same attacker machines land in both training and test data, so the model can recognise the machine instead of the attack.",
  },
  {
    value: "0.6059",
    label:
      "Whole attacker machines held out of training. The honest number, and the point where the ranking between the two detectors reverses.",
  },
];

/**
 * iOS-style segmented control. Draggable, not just clickable: the thumb tracks
 * the pointer 1:1, then settles with a critically-damped spring. No bounce —
 * a real segmented control doesn't overshoot, so neither does this one.
 */
export default function EvalInstrument() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);

  const slot = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return (track.getBoundingClientRect().width - PAD * 2) / 2;
  }, []);

  const positionFor = useCallback((i: number) => i * slot(), [slot]);

  const setX = (x: number) => {
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateX(${x}px)`;
    }
  };

  const currentX = () => {
    const m = /translateX\(([-\d.]+)px\)/.exec(thumbRef.current?.style.transform ?? "");
    return m ? parseFloat(m[1]) : 0;
  };

  const select = useCallback((i: number) => {
    if (indexRef.current === i) return;
    indexRef.current = i;
    setSwapping(true);
    setIndex(i);
    window.setTimeout(() => setSwapping(false), 200);
  }, []);

  const springTo = useCallback((target: number, velocity: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setX(target);
      return;
    }

    const stiffness = 260;
    const damping = 2 * Math.sqrt(stiffness); // critically damped, no overshoot
    let x = currentX();
    let v = velocity;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      v += (-stiffness * (x - target) - damping * v) * dt;
      x += v * dt;
      setX(x);
      if (Math.abs(x - target) > 0.4 || Math.abs(v) > 3) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setX(target);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let dragging = false;
    let activePointer: number | null = null;
    let history: { x: number; t: number }[] = [];
    let moved = false;

    const clampWithFriction = (raw: number) => {
      const max = slot();
      if (raw < 0) return raw * 0.28;
      if (raw > max) return max + (raw - max) * 0.28;
      return raw;
    };

    const localX = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      return clientX - rect.left - PAD - slot() / 2;
    };

    const onDown = (e: PointerEvent) => {
      if (dragging) return; // ignore extra touch points
      dragging = true;
      moved = false;
      activePointer = e.pointerId;
      track.setPointerCapture(e.pointerId);
      history = [{ x: localX(e.clientX), t: performance.now() }];
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointer) return;
      const raw = localX(e.clientX);
      if (Math.abs(raw - history[0].x) > 4) moved = true;
      setX(clampWithFriction(raw));
      history.push({ x: raw, t: performance.now() });
      if (history.length > 6) history.shift();

      // live preview: flip the label as the thumb crosses the midpoint
      const midpoint = slot() / 2;
      select(raw > midpoint ? 1 : 0);
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointer) return;
      dragging = false;
      activePointer = null;

      const last = history[history.length - 1];
      const first = history[0];
      const dt = (last.t - first.t) / 1000;
      const velocity = dt > 0 ? (last.x - first.x) / dt : 0;

      // a tap toggles; a drag lands where the gesture was heading
      let next: number;
      if (!moved) {
        next = indexRef.current === 0 ? 1 : 0;
      } else {
        const projected = last.x + (velocity / 1000) * 0.998 / (1 - 0.998);
        next = projected > slot() / 2 ? 1 : 0;
      }

      select(next);
      springTo(positionFor(next), velocity);
    };

    const onKey = (e: KeyboardEvent) => {
      const keys = ["ArrowLeft", "ArrowRight", "Enter", " "];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const next =
        e.key === "ArrowLeft" ? 0 : e.key === "ArrowRight" ? 1 : indexRef.current === 0 ? 1 : 0;
      select(next);
      springTo(positionFor(next), 0);
    };

    const onResize = () => setX(positionFor(indexRef.current));

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    // size the thumb and place it without animating on first paint
    const thumb = thumbRef.current;
    if (thumb) {
      thumb.style.width = `${slot()}px`;
      setX(positionFor(indexRef.current));
    }
    const sizeThumb = () => {
      if (thumbRef.current) thumbRef.current.style.width = `${slot()}px`;
    };
    window.addEventListener("resize", sizeThumb);

    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", sizeThumb);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [positionFor, select, slot, springTo]);

  const state = STATES[index];

  return (
    <div className="instrument">
      <p className="instrument-caption">The same detector, measured two ways</p>

      <p className={`readout ${index === 1 ? "honest" : "easy"}${swapping ? " swapping" : ""}`}>
        {state.value}
      </p>
      <p className={`readout-label${swapping ? " swapping" : ""}`}>{state.label}</p>

      <div
        ref={trackRef}
        className="segmented"
        role="switch"
        aria-checked={index === 1}
        aria-label="Evaluation protocol: random split or attacker-machine holdout"
        tabIndex={0}
      >
        <div ref={thumbRef} className="segmented-thumb" aria-hidden="true" />
        <span className={`segmented-option${index === 0 ? " active" : ""}`}>Random split</span>
        <span className={`segmented-option${index === 1 ? " active" : ""}`}>
          Attacker-machine holdout
        </span>
      </div>

      <p className="instrument-hint">Drag it. Macro-F1 on the same nine-class problem.</p>
    </div>
  );
}
