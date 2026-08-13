"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { RoughSVG } from "roughjs/bin/svg";
import { drawIn, HAND } from "../lib/sketch";

export type DrawFn = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => void;

/**
 * Draws with rough.js into a responsive SVG. Redraws on resize and on a
 * colour-scheme change (rough.js needs concrete colours, so the palette has
 * to be re-resolved), and animates the strokes in the first time it's seen.
 */
export function RoughSvg({
  height,
  draw,
  label,
  className = "",
}: {
  height: number;
  draw: DrawFn;
  label: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!host || !svg) return;

    let seen = false;

    const render = (animate: boolean) => {
      const w = host.clientWidth;
      if (!w) return;
      svg.setAttribute("viewBox", `0 0 ${w} ${height}`);
      svg.setAttribute("height", String(height));
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      draw(rough.svg(svg), svg, w, height);
      if (animate) drawIn(svg);
      else svg.querySelectorAll<SVGTextElement>("text").forEach((t) => (t.style.opacity = "1"));
    };

    // hold the drawing back until it scrolls into view, so the reveal lands
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen) {
          seen = true;
          hasAnimated.current = true;
          render(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(host);

    let frame = 0;
    const ro = new ResizeObserver(() => {
      if (!seen) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(false));
    });
    ro.observe(host);

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => seen && render(false);
    scheme.addEventListener("change", onScheme);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
      scheme.removeEventListener("change", onScheme);
    };
  }, [draw, height]);

  return (
    <div ref={hostRef} className={className}>
      <svg ref={svgRef} className="rough-svg" role="img" aria-label={label} />
    </div>
  );
}

/**
 * A hand-drawn border that tracks whatever box it's dropped into.
 * Absolutely positioned by CSS (.frame), so it measures its own rect.
 */
export function Frame({ seed = 1, radiusless = false }: { seed?: number; radiusless?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let animated = false;

    const render = (animate: boolean) => {
      const { width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const rc = rough.svg(svg);
      const ink = getComputedStyle(svg).color;
      const inset = 3;
      svg.appendChild(
        rc.rectangle(inset, inset, width - inset * 2, height - inset * 2, {
          ...HAND,
          stroke: ink,
          strokeWidth: radiusless ? 1.6 : 2,
          seed,
          fill: undefined,
        })
      );
      if (animate) drawIn(svg, 700, 90);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !animated) {
          animated = true;
          render(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(svg);

    let frame = 0;
    const ro = new ResizeObserver(() => {
      if (!animated) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(false));
    });
    ro.observe(svg);

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => animated && render(false);
    scheme.addEventListener("change", onScheme);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
      scheme.removeEventListener("change", onScheme);
    };
  }, [seed, radiusless]);

  return <svg ref={svgRef} className="frame" aria-hidden="true" preserveAspectRatio="none" />;
}
