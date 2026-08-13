# Kautum Krishnan Panjalaraja — portfolio

Personal portfolio site. MSc Data Science, King's College London. Built for recruiters:
positioning, strengths, work experience, project case studies, skills, education, contact.

Live: https://kautum-portfolio.vercel.app

## Stack

Next.js (App Router), TypeScript, plain CSS. No UI kit and no animation library — the
motion here is small enough that a dependency would cost more than it saves.

## Design notes

The interface language follows Apple's own conventions: a 980px content column,
`#F5F5F7` alternating section grounds, SF Pro display type with tight negative tracking,
and `#0071E3` as the single accent. Both light and dark are defined through the same
token set in `app/globals.css`, so neither theme is an afterthought.

Motion follows a few rules worth keeping if this gets edited:

- Custom easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`), never the built-in CSS easings.
- Enter animations use `ease-out`. Nothing uses `ease-in`.
- Pressable things scale to `0.97` on `:active` so they feel like they heard the click.
- Hover effects are gated behind `@media (hover: hover) and (pointer: fine)` so touch
  devices don't trigger them on tap.
- `prefers-reduced-motion` removes movement but keeps opacity changes.

## The segmented control

`app/components/EvalInstrument.tsx` is the one genuinely interactive piece. It's an
iOS-style segmented control that can be dragged, not just clicked: the thumb tracks the
pointer 1:1, applies friction past the boundaries, and settles with a critically-damped
spring using the release velocity. It deliberately does not overshoot — a real segmented
control doesn't bounce.

It exists to make one number tangible: the same intrusion detector scores 0.9002 under the
evaluation protocol the field normally uses, and 0.6059 once whole attacker machines are
held out of training.

## Develop

```bash
npm install
npm run dev
```

## Content

Every fact on this site — dissertation figures, role dates, skills — comes from the
verified records in the `job applies` job-search wiki. Nothing is invented or rounded up.

To add a photo in place of the "KP" monogram, replace the `.avatar` block in
`app/page.tsx` with an `<img>` and drop the file in `public/`.
