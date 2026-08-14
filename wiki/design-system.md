# Design system

The spec `app/globals.css` implements. Change this page and the code together.

## Colour and theme

**Light is the default, and the system preference is deliberately ignored.** A first-time
visitor gets light even if their OS is set to dark. The choice lives in `localStorage` under
`theme` and is applied by an inline script in the document head before first paint, so a
stored dark choice never flashes light. Dark is a real design, not an inversion.

The toggle sits in the nav and flips `data-theme` on `<html>`. Two things listen for that:
`Ambience.tsx`, which re-applies the chapter tint, and `RoughSvg` in `Sketch.tsx`, which has to
redraw completely because rough.js needs concrete colours and cannot read `var()`. Both use a
`MutationObserver` on the attribute rather than a media query.

The accents are pastels, but mid-tone: a hatched fill is thin lines with paper showing
through, so anything paler stops reading as a colour at all.

The accents are pigments rather than screen primaries: ochre `#e0a80c`, vermilion `#d9502a`,
ink blue `#1b5299`, sea green `#2f7d55`, plum `#6a4c93`, rose `#c0405c`. An earlier electric
set buzzed against warm paper and fell apart when drawn as a hatched fill. Dark mode uses
lighter versions of the same six.

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

Three faces, all self-hosted at build time by `next/font`.

**Bricolage Grotesque** for headings. Geist alone was clean but anonymous, and anonymous is
most of what makes a page look machine-made. **Geist** and **Geist Mono** for body copy and
figures. **Caveat** for margin notes, used two or three times on the whole page and never for
anything load-bearing: whatever a note says is also said in the prose beside it.

Body copy is 18px. Recruiters scan rather than read, so the whole scale runs larger than a
typical site, and the role is stated at heading size directly under the name rather than as a
small label.

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

## Shapes

Every accent used to be a circle, which is a large part of what made the page read as
generated. Chapter marks and background shapes are now drawn with rough.js and alternate
between circle, square, triangle, cross and arc, hatched rather than filled solid.

`HAND` in `Sketch.tsx` sets the shared hand at roughness 0.9 and bowing 0.8. An earlier
version ran 1.7 and 1.4 with 2px strokes, which is the difference between drawn and scribbled.
Charts use the same hand.

The old CSS discs, for reference, arrived as very large circles, `clamp(300px, 46vw, 620px)` in the hero.
They sit behind the text at `z-index: 0` with `mix-blend-mode: multiply` in light and `screen`
in dark, so they tint the ground rather than sitting on top of it. Content that must stay
above them takes `.relative`.

Discs marked `data-parallax` drift against the scroll. One rAF loop in `Ambience.tsx` handles
every one of them.

**Two traps worth knowing.**

A `<span>` is inline, so `width` and `height` are ignored on it. Any CSS-drawn mark therefore
needs `display: block`. This shipped visibly broken once.

A `<p>` cannot contain a `<div>`. The browser silently closes the paragraph, the server and
client markup then disagree, and React throws a hydration error at runtime with no visible
symptom. The drawn marks render as divs, so anything wrapping one has to be a div too. This
also shipped once, caught by reading the console rather than by looking at the page.

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
