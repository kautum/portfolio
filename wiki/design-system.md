# Design system

The spec `app/globals.css` implements. Change this page and the code together.

## Colour

Light is the default. Dark is a real design, not an inversion.

**The ground is not fixed.** `Ambience.tsx` reads `data-tint` and `data-tint-dark` off each
section and writes `--ground`, so the page changes colour as you move between chapters. `body`
eases that change over 900ms. Nothing else in the palette moves, which keeps the shift feeling
like light changing rather than a theme swap.

Chapter grounds, light then dark: hero and contact `#efebe3` / `#17161a`, story `#e6ede2` /
`#161a17`, research `#e2e9f4` / `#15181f`, work `#f2e7dc` / `#1c1815`, projects `#eae4f3` /
`#1a171f`, skills `#f3edd6` / `#1c1a14`, education `#e5edec` / `#151a19`.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--ground` | set per chapter | set per chapter | page background |
| `--panel` | `#ffffff` | `#171717` | cards, panels |
| `--ink` | `#171717` | `#ededed` | body and display text |
| `--ink-mute` | `#6f6f6f` | `#8a8a8a` | labels, captions, secondary |
| `--rule` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.12)` | hairlines |

Six chapter accents, used as one saturated disc per chapter and nowhere else:

`--c1 #ffe800` yellow, `--c2 #ff5a00` orange, `--c3 #0047ff` blue, `--c4 #00b84d` green,
`--c5 #6e00ff` violet, `--c6 #ff2d55` pink.

They stay saturated in both themes. That is deliberate: a saturated disc on near-black is the
same gesture as on light grey, and desaturating it would make the page feel apologetic.

## Type

Geist and Geist Mono, from the `geist` npm package, self-hosted at build time by `next/font`.
Geist is Vercel's grotesque, which puts it in the same lineage as the primary reference.

The single most important rule on this page: **display type is weight 400.** Not 600, not 700.
Size carries the emphasis. This is the difference between expensive and loud.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero | `clamp(2.8rem, 8vw, 6rem)` | 400 | `-0.04em` |
| Chapter heading | `clamp(2rem, 5vw, 3.4rem)` | 400 | `-0.035em` |
| Panel heading | 1.35rem | 500 | `-0.02em` |
| Body | 16.5px | 400 | `-0.01em` |
| Meta label | 13px | 400 | `0.01em` |
| Numerals | Geist Mono, `tabular-nums` | 400 | |

Body copy stays under about 66 characters a line. Headings get `text-wrap: balance`.

## Motion

Two easing curves, both from the Emil Kowalski skill, because the CSS defaults are too weak:

```
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1)
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)
```

Rules the code follows:

- Entrances use `ease-out`. Nothing on the page uses `ease-in`.
- UI transitions stay under 300ms. Scroll reveals may run to 650ms because they are decorative
  rather than a response to input.
- Anything pressable takes `scale(0.97)` on `:active`.
- Hover effects sit behind `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion: reduce` removes movement and keeps opacity. Reduced motion still
  shows every chart and every panel, it just does not slide them.

## Discs

The accents arrive mostly as very large circles, `clamp(300px, 46vw, 620px)` in the hero.
They sit behind the text at `z-index: 0` with `mix-blend-mode: multiply` in light and `screen`
in dark, so they tint the ground rather than sitting on top of it. Content that must stay
above them takes `.relative`.

Discs marked `data-parallax` drift against the scroll. One rAF loop in `Ambience.tsx` handles
every one of them.

**A sizing trap worth knowing.** A `<span>` is inline, so `width` and `height` are ignored on
it. Every disc rule therefore sets `display: block`. This was shipped broken once.

## The three interactive pieces

**The scrubber.** Fixed at the top, a row of tick marks with one filled block showing scroll
position. Taken directly from rauno.me. It is not a progress bar: it is discrete ticks, which
reads as an instrument rather than a loading state. Pointer events on it seek the page.

**The scroll-driven strip.** rauno.me's signature move, used for the six career steps. The
section is made tall, a sticky viewport pins inside it, and progress through the tall section
maps to sideways travel. Below 861px, and under reduced motion, it falls back to an ordinary
swipeable snap row, because pinning the viewport on a phone makes a page feel broken.

⚠️ **`position: sticky` does not work inside an ancestor with `overflow: hidden`.** The first
version of this had `overflow: hidden` on every `.section` to clip the discs, which silently
stopped the pin from sticking. Only sections that actually contain a disc now take `.clip`.
`overflow-x: hidden` on `body` causes the same problem and was removed for the same reason.

**The projects filmstrip.** A horizontal strip you can drag. It follows the apple-design rules
properly rather than approximately:

- Tracks the pointer 1:1 and respects where you grabbed it.
- Captures the pointer, so the drag survives the cursor leaving the strip.
- Keeps a short position and time history to compute release velocity.
- Projects where the flick was heading using the exponential decay Apple ships,
  `current + (v/1000) * d / (1 - d)` with `d = 0.998`, rather than the physics-textbook form.
- Rubber-bands past the ends instead of stopping dead.
- Hands the release velocity to a spring so drag and animation do not visibly seam.

## Charts

Crisp, not hand-drawn. Thin hairlines, tabular numerals, generous space, one accent per chart.
The numbers are large enough to be the graphic. This replaced a rough.js implementation that
read as childish. See [decisions.md](decisions.md).

Every chart carries a `role="img"` and an `aria-label` stating the actual figures, and the same
figures appear in the surrounding prose, so nothing depends on seeing the drawing.
