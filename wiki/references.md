# References

Sites this design borrows from. Each entry records what the site actually does, measured
rather than remembered, and what was taken from it.

## rauno.me, the primary reference

Rauno Freiberg, interaction designer, previously at Vercel. Kautum picked this one.

Measured from the live site on 14 August 2026:

| Thing | Value |
|---|---|
| Ground | `rgb(237, 237, 237)` |
| Panels | white |
| Ink | `rgb(23, 23, 23)` |
| Secondary text | `rgb(111, 111, 111)` |
| Display size | 85px |
| Display weight | **400** |
| Label size | 14px, weight 400, grey |
| Accent | one saturated disc per panel, electric yellow then orange |

What the page does: vertical scrolling drives a **horizontal filmstrip** of white panels
across a grey ground. Each panel holds one enormous word or line. A tick-mark scrubber sits
fixed at the top centre showing where you are in the strip. A tiny grey label names the
section above each panel.

The important lesson, and the one that fixes the previous version of this site: **the display
type is weight 400, not bold.** Enormous type at regular weight reads as expensive. The same
size at weight 700 reads as shouting. Almost none of the perceived quality comes from
decoration.

What was taken: the grey ground with white panels, the huge regular-weight display type, the
tiny grey meta labels, one saturated accent per section, and the scrubber.

What was deliberately not taken: full horizontal navigation for the whole page. A recruiter
reading a CV needs to scan quickly, and a sideways-only page fights that. The filmstrip is
used for one section (projects) where browsing is the point.

## emilkowalski/skills, the motion discipline

Emil Kowalski, author of Sonner and Vaul. The repository is a set of skills for designers and
engineers. Two are used here.

`emil-design-eng` gives the animation decision framework. The rules that made it into the
code: use custom easing curves because the built-in CSS easings are too weak; use `ease-out`
for anything entering and never `ease-in`; keep UI animation under 300ms; put `scale(0.97)`
on `:active` so a control feels like it heard the press; gate hover behind
`@media (hover: hover) and (pointer: fine)` so a tap on a phone does not trigger it; prefer
CSS transitions over keyframes for anything a user can interrupt.

`apple-design` translates Apple's *Designing Fluid Interfaces* talk to the web. The rules that
made it into the code: track a drag 1:1 with the pointer and respect the grab offset; capture
the pointer so the drag survives leaving the element; project the resting position from
release velocity rather than snapping from the release point; rubber-band at boundaries
instead of stopping dead; hand the release velocity to the spring so there is no visible seam
between dragging and animating.

Both are applied to the projects filmstrip, which is the one genuinely interactive part of
the page.

## Sites reviewed and not chosen

- **jwilber.me/roughviz**: hand-drawn charts via rough.js. Built, shipped, then rejected.
  See [decisions.md](decisions.md).
- **pudding.cool**: data journalism, story cards, strong editorial voice.
- **visualcinnamon.com**: Nadieh Bremer. Neutral palette, large imagery, premium restraint.
- **wattenberger.com**: Amelia Wattenberger. Notable for how sparing the visuals are given
  she is a visualisation specialist.
- **maggieappleton.com**: the argument that hand-drawn can be sophisticated.
- **brittanychiang.com**, **paco.me**, **linear.app**: the dark studio register.

The common thread across all of them: restraint, confident typography, generous space, and
one accent used sparingly. None of them decorate.
