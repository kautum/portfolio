"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import Safe from "./Safe";
import type { RoughSVG } from "roughjs/bin/svg";

/**
 * Shared hand. Roughness sits at 0.9 rather than the 1.7 an earlier version
 * used: enough wobble to read as drawn, not enough to read as scribbled.
 */
export const HAND = { roughness: 0.9, bowing: 0.8, strokeWidth: 1.8 } as const;

export function token(el: Element, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** Dash every stroked path out, then draw it back in sequence. */
export function drawIn(svg: SVGSVGElement, duration = 620, stagger = 55) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const paths = Array.from(svg.querySelectorAll("path"));
  paths.forEach((p, i) => {
    let len = 0;
    try {
      len = p.getTotalLength();
    } catch {
      return;
    }
    if (!len) return;
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.23,1,0.32,1) ${i * stagger}ms`;
  });
  requestAnimationFrame(() => paths.forEach((p) => (p.style.strokeDashoffset = "0")));
}

type DrawFn = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => void;

/** Responsive rough.js canvas. Redraws on resize and on a theme change. */
function RoughSvgInner({
  height,
  draw,
  label = "",
  className = "",
  animate = true,
}: {
  height: number;
  draw: DrawFn;
  label?: string;
  className?: string;
  animate?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!host || !svg) return;
    let seen = false;

    const render = (withAnimation: boolean) => {
      const w = host.clientWidth;
      if (!w) return;
      svg.setAttribute("viewBox", `0 0 ${w} ${height}`);
      svg.setAttribute("height", String(height));
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      try {
        draw(rough.svg(svg), svg, w, height);
        if (withAnimation) drawIn(svg);
      } catch (err) {
        // a drawing is decoration; the prose beside it carries the same facts
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        // eslint-disable-next-line no-console
        console.warn("Skipped a drawing that failed to render:", err);
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
          seen = true;
          render(animate);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(host);

    let frame = 0;
    const ro = new ResizeObserver(() => {
      if (!seen) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(false));
    });
    ro.observe(host);

    // rough.js needs concrete colours, so a theme change means a full redraw
    const themeWatcher = new MutationObserver(() => seen && render(false));
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      io.disconnect();
      ro.disconnect();
      themeWatcher.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [draw, height, animate]);

  return (
    <div ref={hostRef} className={className}>
      <svg
        ref={svgRef}
        className="rough-svg"
        role={label ? "img" : "presentation"}
        aria-label={label || undefined}
      />
    </div>
  );
}

/**
 * Public wrapper. Every drawing on the site renders through this, so this one
 * boundary keeps a failed chart from taking the page down with it.
 */
export function RoughSvg(props: Parameters<typeof RoughSvgInner>[0]) {
  return (
    <Safe fallback={null}>
      <RoughSvgInner {...props} />
    </Safe>
  );
}

/* ------------------------------------------------------------------
   Chapter marks. Five different shapes rather than five circles,
   because a page where every accent is the same primitive reads as
   generated rather than drawn.
   ------------------------------------------------------------------ */
export type MarkShape = "circle" | "square" | "triangle" | "cross" | "arc";

export function Mark({
  shape,
  colour,
  size = 30,
  className = "",
}: {
  shape: MarkShape;
  colour: string;
  size?: number;
  className?: string;
}) {
  const draw: DrawFn = (rc, svg, w, h) => {
    const c = token(svg, colour, "#e4572e");
    const opts = { ...HAND, stroke: c, fill: c, fillStyle: "solid" as const, seed: 12 };
    const p = 3;
    const s = Math.min(w, h) - p * 2;
    if (shape === "circle") svg.appendChild(rc.circle(w / 2, h / 2, s, opts));
    if (shape === "square") svg.appendChild(rc.rectangle(p, p, s, s, opts));
    if (shape === "triangle")
      svg.appendChild(
        rc.polygon(
          [
            [w / 2, p],
            [w - p, h - p],
            [p, h - p],
          ],
          opts
        )
      );
    if (shape === "cross") {
      const o = { ...HAND, stroke: c, strokeWidth: 3, seed: 12 };
      svg.appendChild(rc.line(p, p, w - p, h - p, o));
      svg.appendChild(rc.line(w - p, p, p, h - p, o));
    }
    if (shape === "arc")
      svg.appendChild(
        rc.arc(w / 2, h - p, s * 1.6, s * 1.6, Math.PI, 2 * Math.PI, true, {
          ...HAND,
          stroke: c,
          fill: c,
          fillStyle: "solid",
          seed: 12,
        })
      );
  };

  return <RoughSvg height={size} draw={draw} className={`mark ${className}`} />;
}

/* ------------------------------------------------------------------
   The large background shape per section. Also varied.
   ------------------------------------------------------------------ */
export function BigShape({
  shape,
  colour,
  className = "",
}: {
  shape: MarkShape;
  colour: string;
  className?: string;
}) {
  const draw: DrawFn = (rc, svg, w, h) => {
    const c = token(svg, colour, "#e4572e");
    const opts = {
      ...HAND,
      stroke: c,
      strokeWidth: 2.4,
      fill: c,
      fillStyle: "hachure" as const,
      hachureGap: 9,
      fillWeight: 2.2,
      seed: 5,
    };
    const p = 8;
    const s = Math.min(w, h) - p * 2;
    if (shape === "circle") svg.appendChild(rc.circle(w / 2, h / 2, s, opts));
    if (shape === "square")
      svg.appendChild(rc.rectangle((w - s) / 2, (h - s) / 2, s, s, { ...opts, hachureAngle: -30 }));
    if (shape === "triangle")
      svg.appendChild(
        rc.polygon(
          [
            [w / 2, p],
            [w - p, h - p],
            [p, h - p],
          ],
          { ...opts, hachureAngle: 20 }
        )
      );
    if (shape === "arc")
      svg.appendChild(
        rc.arc(w / 2, h - p, s * 1.5, s * 1.5, Math.PI, 2 * Math.PI, true, {
          ...opts,
          hachureAngle: 70,
        })
      );
    if (shape === "cross") {
      const o = { ...HAND, stroke: c, strokeWidth: 14, seed: 5 };
      svg.appendChild(rc.line(p, p, w - p, h - p, o));
      svg.appendChild(rc.line(w - p, p, p, h - p, o));
    }
  };

  return <RoughSvg height={420} draw={draw} className={`bigshape ${className}`} />;
}
