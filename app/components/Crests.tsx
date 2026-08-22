"use client";

import type { RoughSVG } from "roughjs/bin/svg";
import { HAND, RoughSvg, token } from "./Sketch";

/* ==================================================================
   Part 1: hand-drawn institution crests.

   King's College London, VIT, Celcom and Finstein logos are
   trademarked with no public-domain source, so these are NOT
   reproductions of anyone's mark. Each is an original roughjs shape
   carrying a monogram in the site's own display face, drawn in the
   same hand as every chart and chapter mark on the page.
   ================================================================== */

const NS = "http://www.w3.org/2000/svg";

type CrestShape = "shield" | "hex" | "circle" | "diamond";

interface CrestSpec {
  /** Letters drawn inside the shape. */
  monogram: string;
  /** Full name, for the accessible label. */
  name: string;
  shape: CrestShape;
  colourVar: string;
  seed: number;
}

const CRESTS = {
  kcl: {
    monogram: "KCL",
    name: "King's College London",
    shape: "shield",
    colourVar: "--c3",
    seed: 21,
  },
  vit: {
    monogram: "VIT",
    name: "Vellore Institute of Technology",
    shape: "hex",
    colourVar: "--c1",
    seed: 33,
  },
  celcom: {
    monogram: "CS",
    name: "Celcom Solutions",
    shape: "circle",
    colourVar: "--c2",
    seed: 47,
  },
  finstein: {
    monogram: "FA",
    name: "Finstein Advizory Service",
    shape: "diamond",
    colourVar: "--c5",
    seed: 58,
  },
} satisfies Record<string, CrestSpec>;

export type Institution = keyof typeof CRESTS;

function shieldPoints(w: number, h: number, p: number): [number, number][] {
  return [
    [p, p],
    [w - p, p],
    [w - p, h * 0.56],
    [w / 2, h - p],
    [p, h * 0.56],
  ];
}

function hexPoints(w: number, h: number, p: number): [number, number][] {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - p;
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

function diamondPoints(w: number, h: number, p: number): [number, number][] {
  return [
    [w / 2, p],
    [w - p, h / 2],
    [w / 2, h - p],
    [p, h / 2],
  ];
}

function monogramText(svg: SVGSVGElement, x: number, y: number, s: string, size: number, fill: string) {
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("text-anchor", "middle");
  t.setAttribute("font-size", String(size));
  t.setAttribute("font-weight", "600");
  t.setAttribute("letter-spacing", s.length > 2 ? "0.5" : "0.3");
  t.setAttribute("font-family", "var(--font-display), var(--font-geist-sans), sans-serif");
  t.setAttribute("fill", fill);
  t.textContent = s;
  svg.appendChild(t);
}

export function Crest({
  institution,
  size = 88,
  className = "",
}: {
  institution: Institution;
  size?: number;
  className?: string;
}) {
  const spec = CRESTS[institution];

  const draw = (rc: RoughSVG, svg: SVGSVGElement, w: number, h: number) => {
    const ink = token(svg, "--ink", "#1f1d1a");
    const colour = token(svg, spec.colourVar, "#e4572e");
    const p = Math.max(4, Math.min(w, h) * 0.07);
    const opts = {
      ...HAND,
      stroke: ink,
      strokeWidth: 1.7,
      fill: colour,
      fillStyle: "hachure" as const,
      hachureGap: 4.5,
      fillWeight: 1.9,
      seed: spec.seed,
    };

    if (spec.shape === "circle") {
      const r = Math.min(w, h) - p * 2;
      svg.appendChild(rc.circle(w / 2, h / 2, r, opts));
    } else {
      const pts =
        spec.shape === "shield"
          ? shieldPoints(w, h, p)
          : spec.shape === "hex"
            ? hexPoints(w, h, p)
            : diamondPoints(w, h, p);
      svg.appendChild(rc.polygon(pts, opts));
    }

    const fontSize = Math.min(w, h) * (spec.monogram.length > 2 ? 0.27 : 0.32);
    monogramText(svg, w / 2, h / 2 + fontSize * 0.34, spec.monogram, fontSize, ink);
  };

  return (
    <div className={`cr-crest ${className}`.trim()} style={{ width: size }}>
      <RoughSvg height={size} draw={draw} label={spec.name} className="cr-crest-canvas" />
    </div>
  );
}

/* ==================================================================
   Part 2: genuine CC0 credential marks.

   Path data copied verbatim from the Simple Icons project (CC0,
   simpleicons.org), one <path> per glyph on a 24x24 viewBox, in the
   same shape as TechLogos.tsx. Brand hex is applied via a CSS custom
   property; where that hex fails contrast against one of the two
   panel backgrounds, an `override` flag swaps it to `var(--ink)` in
   that theme only (see crests.css for the numbers).
   ================================================================== */

interface CredentialSpec {
  name: string;
  hex: string;
  d: string;
  override?: "light" | "dark";
}

const CREDENTIALS: Record<"claude" | "coursera" | "ieee" | "google", CredentialSpec> = {
  claude: {
    name: "Claude",
    hex: "#D97757",
    d: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  coursera: {
    name: "Coursera",
    hex: "#0056D2",
    override: "dark",
    d: "M11.374 23.977c-4.183-.21-8.006-2.626-9.959-6.347-2.097-3.858-1.871-8.864.732-12.454C4.748 1.338 9.497-.698 14.281.23c4.583.857 8.351 4.494 9.358 8.911 1.122 4.344-.423 9.173-3.925 12.04-2.289 1.953-5.295 2.956-8.34 2.797zm7.705-8.05a588.737 588.737 0 0 0-3.171-1.887c-.903 1.483-2.885 2.248-4.57 1.665-2.024-.639-3.394-2.987-2.488-5.134.801-2.009 2.79-2.707 4.357-2.464a4.19 4.19 0 0 1 2.623 1.669c1.077-.631 2.128-1.218 3.173-1.855-2.03-3.118-6.151-4.294-9.656-2.754-3.13 1.423-4.89 4.68-4.388 7.919.54 3.598 3.73 6.486 7.716 6.404a7.664 7.664 0 0 0 6.404-3.563z",
  },
  ieee: {
    name: "IEEE",
    hex: "#00629B",
    override: "dark",
    d: "M4.74 14.973h-.05v-.064h.04c.022 0 .051.002.051.03 0 .028-.015.034-.04.034zm.101-.03c0-.06-.04-.079-.109-.079h-.099v.265h.057v-.111h.027l.061.111h.068l-.069-.116c.036-.003.064-.02.064-.07zm-.11.243c-.098 0-.176-.076-.176-.19 0-.113.078-.188.176-.188.095 0 .177.075.177.188 0 .114-.082.19-.177.19zm-.247-.19c0 .156.116.247.247.247.13 0 .247-.09.247-.247a.238.238 0 0 0-.247-.246.239.239 0 0 0-.247.246zM3.35 12.61c-.02.374-.025.72-.052 1.096.148.013.315.026.473.003l-.047-1.046-.009-.05c-.12.005-.234.01-.365-.003zm-.926-1.051c-.182.091-.45.23-.421.48.04.136.187.224.304.28.647.286 1.506.295 2.19.083.168-.065.395-.16.426-.366-.002-.171-.183-.279-.313-.344v-.008a.575.575 0 0 1 .144-.039v-.004c-.228-.041-.45-.101-.671-.16.043.097.073.2.109.301.067-.021.135-.038.207-.047.117.045.284.11.3.256.014.137-.136.204-.23.26-.501.181-1.065.2-1.588.06-.144-.045-.353-.103-.37-.287.102-.242.367-.292.588-.351-.114-.073-.23-.138-.34-.22-.119.007-.227.059-.335.106zm1.107-1.46l-.064.208-.326.932c.082.008.183 0 .263.008v.008l-.048 1.054.008.01c.104.01.234.016.34-.002V12.3l-.042-1.022.006-.035.286-.004a46.727 46.727 0 0 1-.414-1.14zm-.15-.469c.239-.163.453.065.639.195.717.578 1.393 1.238 1.909 1.984.065.096.094.246.036.355-.134.223-.314.426-.485.633v.011c-.426.454-.876.92-1.363 1.305-.237.144-.455.46-.761.264a11.007 11.007 0 0 1-1.927-1.82c-.096-.149-.246-.271-.312-.44-.093-.23.112-.394.229-.566.576-.71 1.291-1.407 2.034-1.92zm.6-.678l-.266-.376c-.032-.02-.073-.052-.108-.062-.079-.034-.163.007-.227.056l-.48.624c-.769.953-1.68 1.843-2.673 2.525-.079.061-.195.121-.22.222-.026.091.022.166.078.223a13.061 13.061 0 0 1 2.234 1.94c.12.127.217.252.335.37.198.265.43.53.613.813.057.06.066.158.156.187.07.024.156.04.223 0l.066-.067a13.269 13.269 0 0 1 3.034-3.06c.117-.103.34-.142.343-.336a.308.308 0 0 0-.137-.226l-.02-.003c-.6-.408-1.159-.87-1.686-1.394l-.582-.609a16.595 16.595 0 0 1-.684-.827zm.039.672c.206.157.42.336.61.518l.034.02a10.122 10.122 0 0 1 1.405 1.592c.065.1.122.212.086.343-.133.332-.403.597-.639.887-.51.55-1.05 1.081-1.652 1.506-.122.086-.287.166-.433.097-.444-.232-.818-.613-1.207-.96-.45-.417-.902-.904-1.244-1.413a.417.417 0 0 1-.064-.253c.044-.176.165-.32.279-.469.403-.514.897-1.002 1.397-1.447.011-.012.032-.036.05-.047.215-.186.428-.35.652-.511.234-.182.529-.031.726.137zm15.942-.197H24v1.028h-2.569v1.094h2.364v1.028H21.43V13.7H24v1.028h-4.038zm-4.859 0h4.037v1.028h-2.57v1.094h2.363v1.028H16.57V13.7h2.569v1.028h-4.037zm-4.86 0h4.037v1.028h-2.57v1.094h2.365v1.028H11.71V13.7h2.57v1.028h-4.038zm-2.24 0h1.469v5.301H8.004Z",
  },
  google: {
    name: "Google",
    hex: "#4285F4",
    d: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  },
};

export type CredentialName = keyof typeof CREDENTIALS;

export function CredentialMark({
  name,
  size = 24,
  className = "",
}: {
  name: CredentialName;
  size?: number;
  className?: string;
}) {
  const item = CREDENTIALS[name];
  return (
    <svg
      className={`cr-credential ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={item.name}
      data-override={item.override}
      style={{ ["--cr-brand" as string]: item.hex }}
    >
      <title>{item.name}</title>
      <path d={item.d} />
    </svg>
  );
}
