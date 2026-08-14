# Content sources

Every factual claim on the site and where it came from. The rule is that nothing goes on the
page unless it traces back to something here. If a future edit cannot find the source for a
sentence, cut the sentence.

The master records live outside this repository, in Kautum's job-search wiki at
`~/Documents/job applies/wiki/`. That wiki wins in any disagreement with this file.

## Identity and availability

From `wiki/profile/identity.md` in the job-search wiki, itself checked against his eVisa.

Full name Kautum Krishnan Panjalaraja. Based in London. Available full time from August 2026,
because his course finishes then and he is not in full-time education from that point. Right
to work in the UK without sponsorship until roughly 2029 under the Graduate Route. Email and
LinkedIn as listed on the site. The phone number exists in his records and is deliberately
kept off the page.

## The dissertation

From the archive at `/Volumes/kpk ssd/MSc Dissertation Archive - K25020148 (2026-08-11)/`,
specifically `ARCHIVE_README.md` and `K25020148/README.md`. Public at
github.com/kautum/msc-cyberattack-detection-llm.

Title: *Cyberattack Detection and Prediction in Network Activities Leveraging Large Language
Models*. King's College London, supervised by Prof. Hannah Cao, submitted 6 August 2026.
39-page report, 16 notebooks, 17 result files.

Figures used on the site:

- 0.9002 macro-F1 under a random split, 0.6059 under an attacker-machine holdout.
- The ranking between the two candidate detectors reverses between protocols. RandomForest is
  the locked detector.
- 109,203 flows, nine classes, 68 hosts, from the ToN_IoT captures.
- Host-level escalation catches 8 of 9 attacker machines with 0 false alarms across 59 benign
  hosts.
- LLMs tested in three roles across ten model families. DistilBERT last of ten. Qwen2.5,
  SmolLM2 and GLM-Edge all negative as generators.
- Predict-then-classify loses in 18 of 21 configurations.
- `01_verification_proof.ipynb` reproduces the headline figure to four decimal places.

Note for future edits: an earlier description of this project, still sitting in the job-search
wiki's `education.md`, describes it as benchmarking GPT and BERT on CICIoT2023. That framing
is wrong and was superseded. Do not reuse it.

## Work history

From `wiki/profile/experience.md`, backed by certificates.

Celcom Solutions, AI Intern, March to July 2025, Chennai. Built a retrieval chatbot in n8n
automating RFID-based employee monitoring reports, cutting manual reporting time by 60% once
adopted. Validated output across several document types before deployment. Small intern team
under a project manager.

Finstein Advizory Service, AI Intern, January 2025, Chennai. FastAI benchmarking of deep
learning architectures for a fintech product team, plus end-to-end exploratory analysis and
feature engineering on structured financial data. The legal entity name is spelled
"Advizory", which is not a typo.

Celcom Solutions, Trainee on the AI and ML programme, 2 November to 8 December 2023. A
machine learning proof-of-concept framework for software development decisions, comparing
regression, decision trees and neural networks on RMSE, R squared, precision, recall and F1.
Preceded by a separate software engineering traineeship, 1 September to 31 October 2023,
covering Java, collections, JDBC and SQL.

## Education

From `wiki/profile/education.md`, plus the module folders under `~/Documents/sem 1` and
`~/Documents/KCL sem 2` for the real module names.

MSc Data Science, King's College London, 2025 to 2026. Modules include machine learning, deep
learning and neural networks, big data technologies, data mining, database management,
statistics for finance, and data visualisation and storytelling.

BTech Computer Science, Vellore Institute of Technology, 2021 to 2025, AI and robotics
specialisation. CGPA 8.21 out of 10, a first class honours equivalent. Coursework included
cryptography and network security, compiler design, probability and statistics, and game
theory.

IELTS Academic 8.0 overall, with 9.0 in listening and 9.0 in reading. English fluent, Tamil
native. Andrew Ng's Machine Learning Specialization and fast.ai's Practical Deep Learning.

## Projects

**Passive index fund flows.** From `~/Documents/intropic case study/`, specifically
`KPK_CS-D/Modelling Study.ipynb` and the accompanying report. Written February 2026 as a case
study for Intropic's Research Analyst application. Models passive fund flows around a
hundred-stock US index from its constituent list. Roughly $940bn of tracked assets. An index
deletion would require around fourteen times the stock's average daily volume to unwind.
Splits do not move market cap and so do not trigger flows. Includes his own limitations
section covering the fixed tracking percentage and differing rebalance schedules.

⚠️ This was built on case materials Intropic supplied. If they treat those as confidential,
this section comes off the site. Flagged to Kautum and not yet resolved.

**Seafood system visualisation.** From `wiki/profile/projects.md` and
github.com/kautum/telling-stories-with-data. Thirteen datasets from the FAO, Our World in
Data, the Global Slavery Index and the US Department of Labor. Six figures plus a Tableau
workbook covering the G20. Structured on Munzner's why/what/how framework and Segel and
Heer's martini glass model, with colour-blind-safe encodings.

**md creative.** From `wiki/profile/md-creative-story.md` and `~/Documents/mdlondon/`. Live at
md-creative.vercel.app. Twelve real products. Copy generated before the image prompt so both
come from one concept. Scene generation collapsed to bathrooms and spas until nine curated
style categories, a banned-word check and a targeted retry were added. Browser-side
compositing with flood-fill background removal, chosen because image-to-image APIs were too
expensive. gpt-oss-120b picked over Llama 3.3 70B after a head-to-head comparison. Real-world
relative scale, so a £15 spray is not rendered the size of a £195 dryer. Limitations
documented in the README.

**A2A banking agents.** Two agents over Google's A2A protocol, built in a day at their
hackathon. Keyword-first search across a 698 document knowledge base, falling back to vector
search only when keywords come up short.

**RAG model comparison.** The same pipeline three times with only the language model swapped.
LLaMA stayed closest to the retrieved text. SmolLM2 performed well for its size but drifted
on harder questions.

**Vision to Voice.** Undergraduate capstone at VIT. BLIP2 captioning, a fine-tuned model for
frames containing people, M2M100 translation into Tamil, speech output. Written up as an
IEEE-format paper with his supervisor.

**Janus.** From `~/Documents/Janus KCL Job/janus-baseline/` and the public fork at
github.com/kautum/janus-baseline, branch `fix/bootable-and-secure-baseline`. A fork of
digisilk/janus-baseline, the app-analysis tool built by the DIGISILK project in the Department
of Digital Humanities at King's, funded by the ERC and led by Dr Elisa Oreglia. Kautum forked
it while applying for the junior developer role on it. Apache 2.0, same as upstream, and
`main` is left untouched so the two can be diffed.

He wrote the documentation the project lacked (five docs covering the project, architecture,
setup, data and known issues), plus a `CLAUDE.md` at the root so coding assistants start from
an accurate picture. He then fixed the app so it boots from a clean clone, and fixed a set of
defects including an authentication bypass, a path traversal in the upload handler, a race in
session tracking, leaked worker processes and an unauthenticated admin endpoint.

⚠️ **Deliberate framing decision.** The site says he "fixed the defects I found on the way,
including several that mattered for security" and links to the fork. It does **not** enumerate
the vulnerabilities on the portfolio itself. The detail is already public in his own repo,
where he wrote it respectfully, but leading with "I found security holes in this named research
group's tool" on a job-hunting page reads differently, and he may still want a reference from
that group. Keep it at the link.

## Skills

From the canonical table in `resume-src/master-resume.tex` in the job-search folder. The site
lists a subset, reordered so querying and analysis lead. Nothing is listed that does not
appear in that table. Excel is absent from the master table and therefore absent here.
