"use client";

import { useEffect, useRef, useState } from "react";

const HANDLE = 46;
const PAD = 3;

export default function EvalInstrument() {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [honest, setHonest] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const handle = handleRef.current;
    if (!track || !handle) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let history: { x: number; t: number }[] = [];
    let isHonestNow = false;

    const maxX = () => track.getBoundingClientRect().width - HANDLE - PAD * 2;
    const leftX = () => 0;
    const rightX = () => maxX();

    const setHandleX = (x: number) => {
      handle.style.transform = `translateX(${x}px)`;
    };

    const getCurrentX = () => {
      const m = /translateX\(([-\d.]+)px\)/.exec(handle.style.transform);
      return m ? parseFloat(m[1]) : leftX();
    };

    const springTo = (target: number, initialVelocity: number) => {
      if (reduceMotion) {
        setHandleX(target);
        return;
      }
      const stiffness = 220;
      const dampingRatio = Math.abs(initialVelocity) > 400 ? 0.82 : 1.0;
      let x = getCurrentX();
      let v = initialVelocity || 0;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.032);
        last = now;
        const F = -stiffness * (x - target) - 2 * dampingRatio * Math.sqrt(stiffness) * v;
        v += F * dt;
        x += v * dt;
        setHandleX(x);
        if (Math.abs(x - target) > 0.5 || Math.abs(v) > 2) {
          requestAnimationFrame(frame);
        } else {
          setHandleX(target);
        }
      };
      requestAnimationFrame(frame);
    };

    const project = (velocity: number) => {
      const d = 0.998;
      return ((velocity / 1000) * d) / (1 - d);
    };

    const rubberband = (overshoot: number, dimension: number) => {
      const c = 0.55;
      return (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
    };

    const commit = (isHonestState: boolean) => {
      isHonestNow = isHonestState;
      setHonest(isHonestState);
    };

    const settle = (currentX: number, velocity: number) => {
      const projected = currentX + project(velocity);
      const mid = maxX() / 2;
      const nextHonest = projected > mid;
      commit(nextHonest);
      springTo(nextHonest ? rightX() : leftX(), velocity);
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add("grabbed");
      const rect = track.getBoundingClientRect();
      const raw = e.clientX - rect.left - HANDLE / 2;
      history = [{ x: raw, t: performance.now() }];
      setHandleX(Math.max(leftX(), Math.min(rightX(), raw)));
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const rect = track.getBoundingClientRect();
      const raw = e.clientX - rect.left - HANDLE / 2;
      let clamped;
      if (raw < leftX()) clamped = leftX() - rubberband(leftX() - raw, 40);
      else if (raw > rightX()) clamped = rightX() + rubberband(raw - rightX(), 40);
      else clamped = raw;
      setHandleX(clamped);
      history.push({ x: raw, t: performance.now() });
      if (history.length > 6) history.shift();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("grabbed");
      const last = history[history.length - 1] || { x: 0, t: performance.now() };
      const first = history[0] || last;
      const dt = (last.t - first.t) / 1000;
      const velocity = dt > 0 ? (last.x - first.x) / dt : 0;
      settle(last.x, velocity);
    };

    const onClick = () => {
      if (history.length > 1) return; // was a drag, handled by pointerup
      const next = !isHonestNow;
      commit(next);
      springTo(next ? rightX() : leftX(), 0);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowRight", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        const next = e.key === "ArrowLeft" ? false : e.key === "ArrowRight" ? true : !isHonestNow;
        commit(next);
        springTo(next ? rightX() : leftX(), 0);
      }
    };

    const onResize = () => setHandleX(isHonestNow ? rightX() : leftX());

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", onClick);
    track.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => setHandleX(leftX()));

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("click", onClick);
      track.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="instrument">
      <p className="instrument-label">Same detector, two honesty levels</p>
      <div className="instrument-readout">
        <span className={`readout-number state-${honest ? "honest" : "easy"}`}>
          {honest ? "0.6059" : "0.9002"}
        </span>
        <span className="readout-caption">
          {honest
            ? "Attacker-machine holdout — the honest number. Ranking between the two detectors flips here."
            : "Random split — the model has quietly seen this attacker's traffic before."}
        </span>
      </div>
      <div
        ref={trackRef}
        className="instrument-track"
        role="switch"
        aria-checked={honest}
        tabIndex={0}
        aria-label="Toggle evaluation protocol between random split and attacker-machine holdout"
      >
        <div ref={fillRef} className={`instrument-fill${honest ? " honest" : ""}`} />
        <div ref={handleRef} className={`instrument-handle${honest ? " honest" : ""}`} />
      </div>
      <div className="instrument-labels">
        <span>Random split</span>
        <span>Attacker-machine holdout</span>
      </div>
    </div>
  );
}
