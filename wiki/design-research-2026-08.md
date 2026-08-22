# Design research: making it overpowering without making it loud

Written 2026-08-22, after Kautum asked for the confidence of bklit.com, kokonutui.com,
motion.dev, manus.im and gireeshkumarreddy/Project1, translated into this site's pastel,
minimal, hand-drawn world.

The brief in his words: "extremely confident, punchy as hell, overpowering", but in
"my minimalistic background, shapes and colors", pastel mandatory, and the charts should
navigate. "When someone sees my website, they must be feeling overwhelmed."

## 1. What actually makes those sites feel confident

I screenshotted them rather than reading their marketing copy, because the effect is visual.
Three devices do nearly all the work, and none of them is decoration.

### Device 1: the page is drawn as a measurement surface (bklit.com)
This is the strongest idea of the five references and the most useful one here.

Bklit's landing page is not a page with a chart on it. **The page itself is a plotting
canvas.** A faint grid runs edge to edge, dots mark the intersections, and a **numbered ruler
runs down the left edge (100, 200, 300, 400, 500, 600)**, so the viewport reads as a set of
coordinates. Diagonal hatch fills drop into occasional grid cells. Content is then placed
*on* that surface, aligned to its lines.

Why it lands: it says "this is a measurement instrument" before you read a word.

⭐ **Why it belongs here specifically**: this site's whole existing metaphor is graph paper
and hand-drawn ink, and the owner is a data analyst. Bklit arrives at the same idea from a
dark technical direction. Executed in pastel with roughjs strokes, it is not a copy, it is
the same idea in this site's own accent. **We already have hachure fills.** We already have
a paper ground. The grid and the ruler are the missing half.

### Device 2: type that makes a statement, in two tones (kokonutui.com)
"Components humans browse." in white, then "Agents ship." in mid grey, directly underneath,
both enormous, both ending in a full stop.

Two mechanisms:
- **Scale**: the headline occupies a third of the viewport. Confidence is mostly size and
  the nerve to leave the rest empty.
- **Two-tone**: the second clause drops to a muted colour. It reads as one thought with a
  quiet half, and it costs a single CSS variable.

The chapter headings here are already written as declarations ("I spent a year finding out my
field was marking its own homework."). They are just not *sized* like declarations.

### Device 3: monospace as a texture, not a code block
Both sites use mono all-caps with wide letter-spacing for eyebrows and labels
(`DESIGN ENGINEERED DATA VISUALIZATION COMPONENTS_`, complete with a trailing cursor
underscore), and mono chips for technical tokens. It reads as precision and instrumentation.

This site loads GeistMono already and barely uses it.

### What to take from the other three
- **motion.dev**: the engine, now installed. Its real lesson is *orchestration*: stagger and
  sequence beat individual effects. Ten things arriving in a considered order feels authored;
  ten things arriving at once feels like a page loading.
- **manus.im**: restraint. Generous whitespace, few elements, nothing competing. It is the
  counterweight that stops the above turning into noise.
- **gireeshkumarreddy/Project1**: scroll-driven rather than time-driven motion, and its stated
  rule, "no bouncing, no overshooting, only measured motion". Also Lenis, now installed.

## 2. The synthesis

> **The site becomes a measurement surface, and the reader's scroll is the axis.**

Everything else hangs off that one sentence. It is the honest version of "overwhelming": the
page is not shouting, it is *instrumented*, and it is instrumented about the one thing he
actually does.

## 3. The four options, and how they connect

They are not alternatives. They are four layers of one idea, and they compose.

### Option A: the plotting surface (the ground)
- A pastel graph grid across the whole page, with dots at intersections.
- ⭐ A **numbered ruler down the left edge that tracks scroll position**, so scrolling reads
  as travelling along an axis. Chapter marks sit on it as ticks.
- Occasional grid cells carry a hachure fill, tying the background to the charts.
- Section rules align to grid lines so the composition looks plotted, not stacked.

Risk: a grid behind body text hurts readability. Mitigation: the grid fades to near nothing
behind prose blocks and is strongest in the open space between chapters.

### Option B: the type system (the voice)
- Chapter headings scaled up hard, with the second clause in `--ink-mute`.
- Mono all-caps eyebrows with letter-spacing and a trailing cursor underscore.
- Mono chips for tools and technical tokens.

Cheapest layer, largest confidence gain per line of CSS.

### Option C: charts that navigate (his specific ask)
"The charts navigating highly good" is the request that separates this from a reskin.
- **Crosshair readout on hover**: move across a chart and a pastel crosshair follows, with
  the value and year printed at the axes. This is the single most "instrument-like" thing we
  can add, and it makes his data explorable rather than decorative.
- **Scroll-scrubbing**: the seafood area chart advances through time as you scroll past it,
  so the 90 to 62 per cent decline *happens* while you read the sentence describing it.
- **A chart spine**: a persistent slim sparkline in the margin showing position in the page.
- Click a data point to jump to the paragraph that explains it.

### Option D: the motion layer (the finish)
- Numbers count up when their chart enters view (0.90 ticking down to 0.61 is the whole
  dissertation argument in one animation).
- Staggered grid cells filling in behind a section as it arrives.
- Magnetic hover on links and buttons.
- Everything scroll-driven, spring-eased, no overshoot, all of it off under
  `prefers-reduced-motion`.

### How they connect
A is the ground the page is drawn on. B is what is written on it. C makes it an instrument
rather than a poster. D is how it all arrives. Build order is A, B, D, C: the first three are
mostly CSS and cheap, C is real interaction work and should sit on a finished surface.

## 4. The constraint that governs all of it

Pastel and minimal are not in tension with overwhelming, but they do change the mechanism.
Dark sites get impact from contrast. A pastel site cannot, so its impact has to come from
**scale, space, alignment and motion**. That means:

- Go **bigger** on type than feels comfortable, and leave more empty space, not less.
- One saturated accent per screen at most. The pastels are the field; a single stronger
  coral or lilac is the note.
- Density is the enemy. Overwhelming comes from a few enormous confident moves, not many
  small ones.
- ⚠️ **Contrast floor stays 4.5:1 for body text.** Pastel backgrounds, never pastel body text.
  A site nobody can read is not confident, it is broken.
- ⚠️ Hachure fills are thin lines with the ground showing through, so accents cannot go
  paler than mid-tone or the charts stop reading. This is a documented limit in globals.css.

## 5. What we deliberately do not do
- **No Tailwind, no shadcn.** KokonutUI requires both. Converting 1000 lines of working
  bespoke CSS to adopt a component library is a large regression risk for components we would
  restyle beyond recognition anyway. Take the ideas, not the dependency.
- **No Bklit chart components.** The roughjs hand-drawn charts are the most distinctive thing
  on the site. Replacing them with a generic library would trade character for polish.
  Animate and instrument what is here instead.
- **No dark-mode-only design.** Both themes ship, both get the same care.
