# Decisions

Four visual directions have been built for this site. Three were rejected. Read this before
proposing a fifth.

## 1. Project showcase, Apple palette. Rejected.

A single page of project case studies with a draggable evaluation toggle in the hero.

Kautum's response: *"this is not a portfolio at all, i meant u to build me a portfolio for my
job application, i shall give this portfolio, which is about me, to the recruiters."*

He was right. It had no introduction, no work history, no education, and no call to contact
him. It was an index of projects, not an introduction to a person.

**The lesson: a portfolio handed to recruiters is an about-me document first and a project
list second.**

## 2. Apple interface language. Rejected.

Rebuilt with the right content this time, in Apple's marketing-site register: white and
`#F5F5F7`, SF Pro, a 980px column, blue accent, scroll reveals.

Rejected because he wanted it to be fun, and gave jwilber.me/roughviz as the reference.

## 3. Hand-drawn sketchbook. Rejected.

Charts drawn in the browser with rough.js on warm paper, later beige. Six chapters, real
numbers, Fraunces and Caveat.

Kautum's response: *"make sure my portfolio dosent look like some child's scribbling."*

Also correct. The specific causes, worth naming so they are not repeated:

- rough.js `roughness: 1.7` and `bowing: 1.4` at `strokeWidth: 2`, which is a lot of wobble.
- Wobbly `border-radius` on every button, chip and badge, so nothing on the page had a
  straight edge.
- Caveat, a handwriting face, doing structural work as chapter labels rather than appearing
  once or twice as a genuine margin note.

Individually each was defensible. Together they read as juvenile.

**The lesson: decoration applied uniformly stops being a choice and becomes a texture.**

## 4. rauno.me language. Current.

Kautum picked rauno.me from a list of options after seeing the sites himself. Grey ground,
white panels, huge regular-weight type, tiny grey labels, one saturated disc per chapter, a
tick scrubber, and a draggable filmstrip for projects.

The content survived all four rebuilds essentially intact, which is worth noting. The writing
was never the problem.

## Standing constraints

These have held across every version and should keep holding.

- **Never invent a fact about Kautum.** Every claim traces to something in
  [content-sources.md](content-sources.md).
- **No em dashes anywhere in the copy.** Checked against the built HTML before deploying.
- **No phone number on the page.** The site is public and gets scraped. Email, LinkedIn and
  GitHub only.
- **Excel is not listed.** It is one of the most filtered terms for analyst roles, but it does
  not appear anywhere in Kautum's records, so it stays off until he confirms it.
- **Guard AI is not featured.** It is a team project and consent to publicise it is still
  pending.

## Operational notes

- Vercel enables SSO deployment protection by default, which 302-redirects the public URL to a
  login wall. Disabled with `vercel project protection disable kautum-portfolio --sso`.
- Deploying from a directory that is not linked to the project silently creates a second
  project named after the folder. Run `vercel link --project kautum-portfolio` first.
