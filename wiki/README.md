# Portfolio wiki

Everything behind kautum-portfolio.vercel.app. Read this before changing the site, so the
next person (or the next session) does not re-litigate decisions that already cost three
rebuilds.

## Pages

- [references.md](references.md): the sites this design borrows from, what each one actually
  does, and which parts were taken.
- [design-system.md](design-system.md): the tokens, the type scale, and the motion rules.
  This is the spec the code follows.
- [content-sources.md](content-sources.md): every claim on the site and where it comes from.
  Nothing on the page is invented, and this is the proof.
- [decisions.md](decisions.md): the directions that were built and rejected, and why. Worth
  reading first if you are about to suggest a redesign.

## The state of it

Live at kautum-portfolio.vercel.app, deployed from `main` on Vercel under the `kpk` team.
Light is the default theme with a toggle in the nav. Seven chapters. Five charts, all drawn
live from the real datasets rather than exported as images. The page is server-rendered and
survives with JavaScript disabled: see the "Never crashing" section of
[design-system.md](design-system.md).

## The site in one paragraph

A single scrolling page introducing Kautum Krishnan Panjalaraja, a data analyst finishing an
MSc at King's College London, to recruiters. It is organised as six chapters: how he got
here, the dissertation finding, his jobs, how he works, his projects, his tools, his
education. The visual
language comes from rauno.me. The motion discipline comes from Emil Kowalski's design
engineering and Apple's fluid interfaces work. The writing follows the humanizer rules, which
in practice means no em dashes and no padding.
