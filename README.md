# Kautum Krishnan Panjalaraja — portfolio

A data analyst's story, told in charts he drew himself.

Live: https://kautum-portfolio.vercel.app

## The idea

Most portfolios open with a stock photo. This one opens with a hand-drawn timeline, because
the person it belongs to analyses data for a living. Every chart on the page is generated in
the browser with [rough.js](https://roughjs.com) — the same engine behind
[roughViz](https://www.jwilber.me/roughviz/) — from numbers that are genuinely his:

- **The dissertation finding.** The same intrusion detector scores 0.9002 macro-F1 under the
  evaluation protocol the field normally uses, and 0.6059 once whole attacker machines are
  held out of training.
- **Celcom.** Manual reporting time fell 60% after the retrieval chatbot shipped.
- **The route here.** Six dots, Chennai 2021 to London 2026.

## Stack

Next.js (App Router), TypeScript, rough.js, plain CSS. Fonts are Fraunces, Karla and Caveat,
self-hosted at build time by `next/font` so there's no third-party request at runtime.

## How the drawing works

`app/components/Sketch.tsx` is the engine. `RoughSvg` renders a draw callback into a
responsive SVG; `Frame` draws a sketched border that tracks whatever box it's dropped into.
Both redraw on resize and on a colour-scheme change, since rough.js needs concrete colours
and can't read `var(--token)`.

The charts don't just appear. `drawIn()` in `app/lib/sketch.ts` dashes out every stroked
path, then transitions the offset back to zero in sequence, so each chart looks like it's
being sketched as you scroll to it. Labels fade in behind the strokes.

## Motion rules worth keeping

The playful surface sits on strict motion discipline — this is the part that keeps it from
feeling like clip art:

- Custom easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`), never the weak built-in ones.
- Entrances use `ease-out`. Nothing uses `ease-in`.
- Buttons physically depress: the drop shadow collapses and the button moves into it.
- Hover effects sit behind `@media (hover: hover) and (pointer: fine)` so a tap on a phone
  doesn't trigger them.
- `prefers-reduced-motion` skips the sketching animation entirely and renders the final
  state — reduced motion should still show the charts, just without the movement.

Charts also differ by **texture** as well as colour (hachure vs cross-hatch vs zigzag), so
they stay readable without relying on hue.

## Develop

```bash
npm install
npm run dev
```

## Content

Every fact — dissertation figures, role dates, grades, skills — comes from the verified
records in the `job applies` job-search wiki. Nothing is invented or rounded up.
