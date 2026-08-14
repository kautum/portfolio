const NS = "http://www.w3.org/2000/svg";

/** Resolve a CSS custom property to a concrete colour, since rough.js cannot read var(). */
export function token(el: Element, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

type TextOpts = {
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  hand?: boolean;
  weight?: number;
  rotate?: number;
  opacity?: number;
};

export function text(
  svg: SVGSVGElement,
  x: number,
  y: number,
  content: string,
  opts: TextOpts = {}
) {
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("text-anchor", opts.anchor ?? "middle");
  t.setAttribute("font-size", String(opts.size ?? 14));
  t.setAttribute("fill", opts.fill ?? "currentColor");
  t.setAttribute("font-weight", String(opts.weight ?? 400));
  if (opts.opacity !== undefined) t.setAttribute("opacity", String(opts.opacity));
  t.setAttribute(
    "font-family",
    opts.hand ? "var(--font-hand), cursive" : "var(--font-body), sans-serif"
  );
  if (opts.rotate) t.setAttribute("transform", `rotate(${opts.rotate} ${x} ${y})`);
  t.textContent = content;
  svg.appendChild(t);
  return t;
}

/**
 * Make the sketch look drawn rather than rendered: every stroked path is
 * dashed out, then transitioned back to zero offset in sequence.
 */
export function drawIn(svg: SVGSVGElement, duration = 620, stagger = 45) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paths = Array.from(svg.querySelectorAll("path"));

  if (reduce) {
    svg.querySelectorAll<SVGTextElement>("text").forEach((t) => (t.style.opacity = "1"));
    return;
  }

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
    p.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.23,1,0.32,1) ${
      i * stagger
    }ms`;
  });

  const texts = Array.from(svg.querySelectorAll<SVGTextElement>("text"));
  texts.forEach((t, i) => {
    t.style.opacity = "0";
    t.style.transition = `opacity 420ms ease-out ${paths.length * stagger * 0.5 + i * 60}ms`;
  });

  requestAnimationFrame(() => {
    paths.forEach((p) => (p.style.strokeDashoffset = "0"));
    texts.forEach((t) => (t.style.opacity = "1"));
  });
}

/** Shared rough.js look, so every drawing on the page reads as one hand. */
export const HAND = {
  roughness: 1.7,
  bowing: 1.4,
  strokeWidth: 2,
} as const;
