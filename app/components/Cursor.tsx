"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor + magnetic buttons + card tilt/specular.
 *
 * One system, one delegated pointermove listener on the document (plus a
 * pointerleave for "left the window", and scroll/resize for rect
 * invalidation) — never a listener per card or per button. Everything that
 * runs every frame writes to `transform`/`opacity` (or a handful of cheap
 * paint-only properties: border-radius, background/border-color) through
 * refs, never through React state, so none of this re-renders the tree.
 *
 * Fully disabled — no listeners attached, DOM never marked active — on
 * any device without a fine pointer, and under prefers-reduced-motion.
 * Both conditions are watched live, not just read once on mount.
 */

type CuState = "default" | "link" | "card" | "button";

const CARD_SELECTOR = ".panel, .work-card, .edu-item";
const BUTTON_SELECTOR = ".btn, .btn-primary, .btn-secondary, .btn-ghost";
const LINK_SELECTOR = "a[href]";

// Must match .cu-shape's width/height in cursor.css — the button-hug scale
// (--cu-sx/--cu-sy) is computed relative to this base box.
const BASE_SIZE = 14;

// Spring constants for the elastic follow. Slightly underdamped (damping
// below the ~2*sqrt(stiffness) critical point) so it settles with a small
// overshoot instead of a dead linear ease — springy, not floaty.
const SPRING_STIFFNESS = 220;
const SPRING_DAMPING = 26;

// How far from a button's box (in px, measured to the nearest edge) the
// magnetic pull starts, and how strongly the follower / button lean
// toward each other at full strength (closest point before the direct
// hover/hug takes over).
const MAGNET_RADIUS = 70;
const MAGNET_FOLLOWER_PULL = 0.35;
const MAGNET_BUTTON_PULL = 0.22;
const BUTTON_OFFSET_EASE = 0.22;

// Card tilt ceiling, in degrees each way — subtle, not a novelty flip.
const TILT_MAX_DEG = 6;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Wires up the whole system. Returns a cleanup that undoes everything it touched. */
function activate(root: HTMLDivElement, shape: HTMLDivElement, label: HTMLSpanElement) {
  let raf = 0;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let posX = pointerX;
  let posY = pointerY;
  let velX = 0;
  let velY = 0;
  let initialized = false;

  let state: CuState = "default";
  let activeCard: { el: HTMLElement; rect: DOMRect } | null = null;
  let activeButton: { el: HTMLElement; rect: DOMRect } | null = null;

  let buttonRects: { el: HTMLElement; rect: DOMRect }[] = [];
  let buttonRectsDirty = true;

  let pulledButton: HTMLElement | null = null;
  let buttonOffsetX = 0;
  let buttonOffsetY = 0;

  let rectRefreshScheduled = false;

  const setState = (next: CuState) => {
    if (state === next) return;
    state = next;
    shape.dataset.state = next;
    label.dataset.state = next;
  };

  const resetTilt = (el: HTMLElement) => {
    el.style.setProperty("--cu-rx", "0deg");
    el.style.setProperty("--cu-ry", "0deg");
    el.style.setProperty("--cu-glow", "0");
  };

  const refreshButtonRects = () => {
    buttonRectsDirty = false;
    buttonRects = Array.from(document.querySelectorAll<HTMLElement>(BUTTON_SELECTOR)).map((el) => ({
      el,
      rect: el.getBoundingClientRect(),
    }));
  };

  const scheduleRectRefresh = () => {
    buttonRectsDirty = true;
    if (rectRefreshScheduled) return;
    rectRefreshScheduled = true;
    requestAnimationFrame(() => {
      rectRefreshScheduled = false;
      if (activeCard) activeCard.rect = activeCard.el.getBoundingClientRect();
      if (activeButton) activeButton.rect = activeButton.el.getBoundingClientRect();
    });
  };

  const releasePulledButton = () => {
    pulledButton = null;
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!initialized) {
      initialized = true;
      posX = pointerX;
      posY = pointerY;
      root.dataset.ready = "true";
    }

    const target = event.target as Element | null;
    const btnEl = target?.closest?.(BUTTON_SELECTOR) as HTMLElement | null;
    const cardEl = !btnEl ? (target?.closest?.(CARD_SELECTOR) as HTMLElement | null) : null;
    const linkEl = !btnEl && !cardEl ? (target?.closest?.(LINK_SELECTOR) as HTMLElement | null) : null;

    if (btnEl) {
      if (!activeButton || activeButton.el !== btnEl) {
        activeButton = { el: btnEl, rect: btnEl.getBoundingClientRect() };
      }
      setState("button");
    } else {
      activeButton = null;
    }

    if (cardEl) {
      if (!activeCard || activeCard.el !== cardEl) {
        if (activeCard) resetTilt(activeCard.el);
        activeCard = { el: cardEl, rect: cardEl.getBoundingClientRect() };
      }
    } else if (activeCard) {
      resetTilt(activeCard.el);
      activeCard = null;
    }

    if (!btnEl) setState(cardEl ? "card" : linkEl ? "link" : "default");
  };

  const onPointerLeave = () => {
    setState("default");
    if (activeCard) resetTilt(activeCard.el);
    activeCard = null;
    activeButton = null;
    releasePulledButton();
  };

  const tick = () => {
    if (buttonRectsDirty) refreshButtonRects();

    // ---- magnetism: who is the follower/button drawn toward? ----
    let magnetCx = 0;
    let magnetCy = 0;
    let magnetStrength = 0;
    let magnetEl: HTMLElement | null = null;

    if (activeButton) {
      const r = activeButton.rect;
      magnetCx = r.left + r.width / 2;
      magnetCy = r.top + r.height / 2;
      magnetStrength = 1;
      magnetEl = activeButton.el;
    } else {
      let bestDist = MAGNET_RADIUS;
      for (const { el, rect } of buttonRects) {
        const nx = Math.max(rect.left, Math.min(pointerX, rect.right));
        const ny = Math.max(rect.top, Math.min(pointerY, rect.bottom));
        const dist = Math.hypot(pointerX - nx, pointerY - ny);
        if (dist < bestDist) {
          bestDist = dist;
          magnetCx = rect.left + rect.width / 2;
          magnetCy = rect.top + rect.height / 2;
          magnetStrength = 1 - dist / MAGNET_RADIUS;
          magnetEl = el;
        }
      }
    }

    // Button itself leans toward the pointer, eased, released when out of range.
    if (magnetEl && magnetStrength > 0) {
      if (pulledButton && pulledButton !== magnetEl) {
        pulledButton.style.transform = "";
      }
      pulledButton = magnetEl;
      const pull = state === "button" ? MAGNET_BUTTON_PULL : MAGNET_BUTTON_PULL * magnetStrength;
      const targetBx = (pointerX - magnetCx) * pull;
      const targetBy = (pointerY - magnetCy) * pull;
      buttonOffsetX += (targetBx - buttonOffsetX) * BUTTON_OFFSET_EASE;
      buttonOffsetY += (targetBy - buttonOffsetY) * BUTTON_OFFSET_EASE;
      pulledButton.style.transform = `translate(${buttonOffsetX.toFixed(2)}px, ${buttonOffsetY.toFixed(2)}px)`;
    } else if (pulledButton) {
      buttonOffsetX *= 1 - BUTTON_OFFSET_EASE;
      buttonOffsetY *= 1 - BUTTON_OFFSET_EASE;
      if (Math.abs(buttonOffsetX) < 0.05 && Math.abs(buttonOffsetY) < 0.05) {
        pulledButton.style.transform = "";
        releasePulledButton();
      } else {
        pulledButton.style.transform = `translate(${buttonOffsetX.toFixed(2)}px, ${buttonOffsetY.toFixed(2)}px)`;
      }
    }

    // Follower spring target: the raw pointer, pulled toward a nearby/hovered button.
    let targetX = pointerX;
    let targetY = pointerY;
    if (magnetEl && magnetStrength > 0) {
      const pull = state === "button" ? 1 : magnetStrength * MAGNET_FOLLOWER_PULL;
      targetX = pointerX + (magnetCx - pointerX) * pull;
      targetY = pointerY + (magnetCy - pointerY) * pull;
    }

    // ---- elastic spring integration (fixed dt for stable feel) ----
    const dt = 1 / 60;
    const ax = (targetX - posX) * SPRING_STIFFNESS - velX * SPRING_DAMPING;
    const ay = (targetY - posY) * SPRING_STIFFNESS - velY * SPRING_DAMPING;
    velX += ax * dt;
    velY += ay * dt;
    posX += velX * dt;
    posY += velY * dt;

    root.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0)`;

    if (state === "button" && activeButton) {
      const r = activeButton.rect;
      shape.style.setProperty("--cu-sx", (r.width / BASE_SIZE).toFixed(2));
      shape.style.setProperty("--cu-sy", (r.height / BASE_SIZE).toFixed(2));
    }

    if (activeCard) {
      const r = activeCard.rect;
      const px = clamp01((pointerX - r.left) / r.width);
      const py = clamp01((pointerY - r.top) / r.height);
      const el = activeCard.el;
      el.style.setProperty("--cu-rx", `${((0.5 - py) * TILT_MAX_DEG * 2).toFixed(2)}deg`);
      el.style.setProperty("--cu-ry", `${((px - 0.5) * TILT_MAX_DEG * 2).toFixed(2)}deg`);
      el.style.setProperty("--cu-mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--cu-my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--cu-glow", "1");
    }

    raf = requestAnimationFrame(tick);
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("scroll", scheduleRectRefresh, { passive: true });
  window.addEventListener("resize", scheduleRectRefresh);
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("scroll", scheduleRectRefresh);
    window.removeEventListener("resize", scheduleRectRefresh);
    if (activeCard) resetTilt(activeCard.el);
    if (pulledButton) pulledButton.style.transform = "";
    root.removeAttribute("data-ready");
    shape.style.removeProperty("--cu-sx");
    shape.style.removeProperty("--cu-sy");
  };
}

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let deactivate: (() => void) | null = null;

    const evaluate = () => {
      const shouldRun = fine.matches && !still.matches;
      if (shouldRun && !deactivate) {
        deactivate = activate(rootRef.current!, shapeRef.current!, labelRef.current!);
        document.documentElement.classList.add("cu-active");
      } else if (!shouldRun && deactivate) {
        deactivate();
        deactivate = null;
        document.documentElement.classList.remove("cu-active");
      }
    };

    evaluate();
    fine.addEventListener("change", evaluate);
    still.addEventListener("change", evaluate);

    return () => {
      fine.removeEventListener("change", evaluate);
      still.removeEventListener("change", evaluate);
      if (deactivate) {
        deactivate();
        document.documentElement.classList.remove("cu-active");
      }
    };
  }, []);

  return (
    <div className="cu-root" ref={rootRef} aria-hidden="true">
      <div className="cu-shape" ref={shapeRef} data-state="default" />
      <span className="cu-label" ref={labelRef} data-state="default">
        View
      </span>
    </div>
  );
}
