import Nav from "./components/Nav";
import Reveal from "./components/Reveal";
import { Frame } from "./components/Sketch";
import { HonestChart, ImpactChart, JourneyChart, Underline } from "./components/charts";

const STOPS: [string, string][] = [
  [
    "2021",
    "Started a BTech in computer science at VIT in Chennai, on the AI and robotics track. Finished on 8.21 out of 10.",
  ],
  [
    "2023",
    "Two back to back traineeships at Celcom. The first was Java and SQL. The second was the one that stuck: comparing regression, trees and neural networks on RMSE, R squared and F1.",
  ],
  [
    "Jan 2025",
    "A month at Finstein, benchmarking deep learning architectures for a fintech product team and cleaning up their structured financial data.",
  ],
  [
    "Jul 2025",
    "Back at Celcom for five months. Built the reporting chatbot that ended up saving the team most of a working day each week.",
  ],
  [
    "Sep 2025",
    "Moved to London for the MSc in Data Science at King's. First time living outside India.",
  ],
  [
    "Aug 2026",
    "Handed in the dissertation on 6 August. Everything on this page below that line is what I did with the year.",
  ],
];

export default function Home() {
  return (
    <>
      <Nav />
      <span id="top" />

      {/* ---------------- hero ---------------- */}
      <header className="hero">
        <div className="wrap">
          <Reveal>
            <span className="chapter">hello</span>
          </Reveal>

          <Reveal delay={80}>
            <div className="hero-title-wrap">
              <h1>I&apos;m Kautum.</h1>
              <Underline />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="hero-aside">
              <span className="hand-note">
                Kautum Krishnan Panjalaraja, technically. KP is fine.
              </span>
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="hero-lead">
              I&apos;m a data analyst. I work out what the data actually says, including the times
              that turns out to be less flattering than what everyone hoped it would say.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="facts">
              <span className="fact">London</span>
              <span className="fact">
                Free from <strong>August 2026</strong>
              </span>
              <span className="fact">
                <strong>No visa sponsorship</strong> needed until about 2029
              </span>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="btn-row">
              <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
                Say hello
              </a>
              <a
                className="btn"
                href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn"
                href="https://github.com/kautum"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------------- 1. the route ---------------- */}
      <section className="section section-alt" id="story">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter one</span>
            <h2>Chennai to London, in six dots.</h2>
            <p className="body">
              Every chart on this page is drawn in the browser, by hand, from numbers that are
              genuinely mine. It seemed a more honest way to introduce myself than a stock photo
              and a list of adjectives.
            </p>
            <p className="body">
              The short version: five years of computer science and internships in Chennai, then a
              year in London doing a masters in data science. The longer version is the rest of
              this page.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <JourneyChart />
          </Reveal>

          <div className="card-grid">
            {STOPS.map(([year, what], i) => (
              <Reveal key={year} delay={60 + i * 40} className="sketch-card">
                <Frame seed={i * 3 + 2} />
                <div className="sketch-card-inner">
                  <h3>{year}</h3>
                  <p>{what}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 2. the dissertation ---------------- */}
      <section className="section" id="finding">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter two</span>
            <h2>I spent a year finding out my field was marking its own homework.</h2>
            <p className="body">
              My dissertation started with a question that sounds dull and turned out not to be.
              Papers on detecting attacks in network traffic report accuracy somewhere around
              0.90. Should anyone believe that?
            </p>
            <p className="body">
              Here is the problem. These datasets are recorded in a lab, where a handful of
              machines play the attacker. If you shuffle all the traffic and split it at random,
              flows from the same attacking machine land on both sides of the split. The model
              never has to learn what an attack looks like. It only has to learn what that
              particular machine looks like, and it will happily do the easier thing.
            </p>
            <p className="body">
              So I rebuilt the test. I took the ToN_IoT captures, extracted 109,203 flows across
              nine classes and 68 hosts, and held out every flow from an entire attacking machine
              rather than shuffling. Same detector, same features, same everything else. Only the
              way the data was divided changed.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <HonestChart />
          </Reveal>

          <Reveal delay={80}>
            <p className="body">
              The score dropped by a third. Worse for anyone choosing a model, the ranking flipped:
              the detector that won under the easy split came last under the fair one. If you had
              picked your model the usual way, you would have picked the wrong one and never known.
            </p>
            <p className="body">
              I also went looking for a fix. Large language models were the obvious candidate, so I
              tried them in three separate jobs: classifying the traffic directly, generating extra
              training data, and predicting what packet comes next. Ten model families went into
              the comparison. DistilBERT finished last of the ten. The generation experiments, run
              with Qwen2.5, SmolLM2 and GLM-Edge, came back negative every time. The core
              experiment, predicting future packets and then classifying them, lost to simply
              classifying what you can already see in 18 of 21 configurations.
            </p>
            <p className="body">
              None of that is the result I wanted. All of it is in the report. There is a
              verification notebook that reloads the saved models, retrains the baseline live and
              reproduces the headline figure to four decimal places, because a claim like this one
              should be checkable by someone who does not trust me.
            </p>
            <p className="body">
              Two things did work. Aggregating the flow level verdicts up to whole devices caught
              eight of the nine attacking machines with no false alarms across 59 clean hosts. And
              a small Markov and LSTM forecaster predicted the next event well on real botnet
              captures, then failed on a different malware family, which is a limit worth reporting
              rather than a result worth hiding.
            </p>
            <p>
              <a
                className="link"
                href="https://github.com/kautum/msc-cyberattack-detection-llm"
                target="_blank"
                rel="noopener noreferrer"
              >
                The report, the notebooks and all seventeen result files
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- 3. work ---------------- */}
      <section className="section section-alt" id="work">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter three</span>
            <h2>Three jobs, and one afternoon I gave back to a team.</h2>
            <p className="body">
              At Celcom the employee monitoring reports were put together by hand, every single
              time. Someone would open the RFID logs, pull out what mattered and write it up. I
              built a retrieval chatbot in n8n that assembled them instead. Before anyone was
              allowed to rely on it, I checked its answers against several different document
              formats, because a reporting tool that is right most of the time is worse than no
              tool at all.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <ImpactChart />
          </Reveal>

          <div className="roles">
            <Reveal delay={60} className="role">
              <div className="role-when">Mar to Jul 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Celcom Solutions, Chennai</p>
                <ul>
                  <li>
                    Built a retrieval augmented chatbot in n8n that automated the RFID based
                    employee monitoring reports.
                  </li>
                  <li>Cut the manual reporting time by 60% once the team took it on.</li>
                  <li>
                    Tested the output against several document types before it went anywhere near
                    production.
                  </li>
                  <li>
                    Worked in a small intern team under a project manager, handling the prompt
                    design and the retrieval setup.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100} className="role">
              <div className="role-when">Jan 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Finstein Advizory Service, Chennai</p>
                <ul>
                  <li>
                    Benchmarked deep learning architectures with FastAI for a fintech product team.
                  </li>
                  <li>
                    Did the exploratory analysis and feature engineering on their structured
                    financial datasets, start to finish.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140} className="role">
              <div className="role-when">Nov to Dec 2023</div>
              <div>
                <h3>Trainee, AI and ML programme</h3>
                <p className="role-where">Celcom Solutions, Chennai</p>
                <ul>
                  <li>
                    Researched and wrote up a machine learning proof of concept for
                    software development decisions.
                  </li>
                  <li>
                    Compared regression, decision trees and neural networks on RMSE, R squared,
                    precision, recall and F1.
                  </li>
                  <li>
                    Preceded by a separate two month traineeship on the software engineering track,
                    covering Java, collections, JDBC and SQL.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 4. projects ---------------- */}
      <section className="section" id="projects">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter four</span>
            <h2>Things I made because I wanted to know something.</h2>
            <p className="body">
              Four of these were coursework or applications. One was a case study for a job I
              applied to. I have kept them here because in each one the interesting part was
              deciding what the actual question was, which is the part of analysis nobody sets as
              an exercise.
            </p>
          </Reveal>

          <Reveal delay={60} className="project">
            <Frame seed={17} />
            <div className="project-inner">
              <p className="project-kicker">a case study for a research analyst role</p>
              <h3>What happens to a stock when an index quietly drops it</h3>
              <dl className="qa">
                <dt>the question</dt>
                <dd>
                  Index funds have to hold whatever the index says they hold. So when the index
                  changes, they all have to trade, at the same time, whether they want to or not.
                  How much money is that, and can the market actually absorb it?
                </dd>
                <dt>what I did</dt>
                <dd>
                  Modelled the passive fund flows around a hundred stock US index from its
                  constituent list: price, shares outstanding and free float per name. I worked out
                  the assets tracking the index, the weight of individual names, and then walked
                  through the events that force a rebalance. A free float expansion. A stock split.
                  A deletion from the index entirely.
                </dd>
                <dt>what came out</dt>
                <dd>
                  Around 940 billion dollars of passive money sits against that index, which has to
                  move mechanically when the rules change. The deletion case was the interesting
                  one: unwinding that position would take roughly fourteen times the stock&apos;s
                  average daily volume, so it cannot be done on the day without moving the price.
                  Real index managers pre position ahead of the date, which is exactly why the
                  effect is predictable and gets traded against. Splits, by contrast, change
                  nothing, because the market cap does not move.
                </dd>
                <dt>what I wrote down that was less fun</dt>
                <dd>
                  A limitations section. The model treats the tracking percentage as fixed and
                  ignores the fact that different funds rebalance on different schedules, both of
                  which would soften the numbers in practice.
                </dd>
              </dl>
              <p className="stack">Python, pandas, Jupyter, index mechanics, February 2026</p>
            </div>
          </Reveal>

          <Reveal delay={80} className="project">
            <Frame seed={21} />
            <div className="project-inner">
              <p className="project-kicker">thirteen datasets, one story</p>
              <h3>What a fish dinner costs, beyond the price on the label</h3>
              <dl className="qa">
                <dt>the question</dt>
                <dd>
                  What does the global seafood system really cost, environmentally and in human
                  terms, and can you show that to somebody who has never opened a fisheries report?
                </dd>
                <dt>what I did</dt>
                <dd>
                  Pulled thirteen datasets from the FAO, Our World in Data, the Global Slavery Index
                  and the US Department of Labor into one cleaned pipeline. Then built six figures
                  that follow the chain from catch to plate: consumption and the rise of
                  aquaculture, bycatch rates by gear type, overfished stocks and ocean plastic,
                  employment and labour intensity, the emissions cost of different proteins.
                </dd>
                <dt>how I made the design decisions</dt>
                <dd>
                  Structured on Munzner&apos;s why, what and how framework, with Segel and
                  Heer&apos;s martini glass model for the narrative: I lead the reader through the
                  argument first, then hand over and let them explore. Every palette was checked for
                  colour blind safety. Where the data had holes I drew the holes rather than
                  interpolating over them.
                </dd>
                <dt>what came out</dt>
                <dd>
                  A visual essay, plus a Tableau workbook that lets you compare fish import volume
                  against labour intensity and slavery index ranking across the G20.
                </dd>
              </dl>
              <p className="stack">Python, pandas, NumPy, Matplotlib, Tableau</p>
              <div className="links">
                <a
                  className="link"
                  href="https://github.com/kautum/telling-stories-with-data"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code and dashboard
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="project">
            <Frame seed={34} />
            <div className="project-inner">
              <p className="project-kicker">the job application that built itself</p>
              <h3>They already had a chatbot, so I built the thing they actually asked for</h3>
              <dl className="qa">
                <dt>the question</dt>
                <dd>
                  A haircare brand advertised for a junior AI developer. The posting talked about AI
                  woven into paid content and product ranges recreated in generated environments.
                  Everyone applying was going to build a chatbot. The brand already ran one.
                </dd>
                <dt>what I did</dt>
                <dd>
                  Read it as a content problem instead and built a campaign generator, solo, in
                  under a week. Point it at one of their twelve real products and it writes the copy
                  in their voice, generates a lifestyle scene from the same campaign idea, and
                  composites the actual product into the scene at true relative scale, so a fifteen
                  pound spray does not come out the size of a hairdryer. Then it renders the result
                  inside working Instagram and TikTok mockups so the marketing team can see how it
                  would land.
                </dd>
                <dt>the decisions I would defend in an interview</dt>
                <dd>
                  Copy is generated before the image prompt, not in parallel, so the words and the
                  picture come from one concept. Running them at the same time would have been
                  faster and worse. Scene generation kept collapsing into bathrooms and spas, so I
                  added nine curated style categories, a banned word check and a targeted retry.
                  Image to image APIs were too expensive, so the compositing runs in the browser
                  with a flood fill background removal that survives gradient backgrounds. I picked
                  gpt-oss-120b over Llama 3.3 70B after comparing their copy side by side, not
                  because of the name.
                </dd>
                <dt>what I put in the README</dt>
                <dd>
                  The lighting between the product and the generated scene does not always match.
                  The free tier rate limits bite. Image generation is slow. All three are written
                  down, along with what a production version would need.
                </dd>
              </dl>
              <p className="stack">
                Next.js, TypeScript, Tailwind, Groq (gpt-oss-120b), browser canvas compositing,
                Vercel, entirely on free tiers
              </p>
              <div className="links">
                <a
                  className="link"
                  href="https://md-creative.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try it
                </a>
                <a
                  className="link"
                  href="https://github.com/kautum/md-creative"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code
                </a>
              </div>
            </div>
          </Reveal>

          <div className="card-grid">
            <Reveal delay={60} className="sketch-card">
              <Frame seed={41} />
              <div className="sketch-card-inner">
                <h3>Two agents, one bank</h3>
                <p>
                  A pair of agents handling banking customer service over Google&apos;s A2A
                  protocol, built in a day at their hackathon. Search runs keyword first across a
                  698 document knowledge base and only pays for the embedding call when keywords
                  come up short, which cut the latency on long tasks.{" "}
                  <a
                    className="link"
                    href="https://github.com/kautum/a2a-banking-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal delay={100} className="sketch-card">
              <Frame seed={47} />
              <div className="sketch-card-inner">
                <h3>Which model actually reads?</h3>
                <p>
                  The same retrieval pipeline built three times over, with the embeddings, chunking
                  and retrieval held constant and only the language model swapped. LLaMA stayed
                  closest to the retrieved text. SmolLM2 did well for its size but drifted from the
                  source on harder questions.{" "}
                  <a
                    className="link"
                    href="https://github.com/kautum/rag-chatbot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal delay={140} className="sketch-card">
              <Frame seed={53} />
              <div className="sketch-card-inner">
                <h3>Vision to voice</h3>
                <p>
                  My undergraduate capstone. A camera describes what it sees out loud, in English
                  and Tamil, for people who cannot see it. BLIP2 writes the caption, a fine tuned
                  model takes over when there is a person in frame, M2M100 translates. Written up
                  as an IEEE format paper with my supervisor.{" "}
                  <a
                    className="link"
                    href="https://github.com/kautum/vision-to-voice"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 5. skills ---------------- */}
      <section className="section section-alt" id="skills">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter five</span>
            <h2>What I reach for.</h2>
            <p className="body">
              Everything here has been used on something that shipped or got marked. If a tool is
              missing from this list it is because I have not used it properly yet, and I would
              rather tell you that at the start than halfway through an interview.
            </p>
          </Reveal>

          <div className="skill-groups">
            <Reveal delay={60} className="skill-group">
              <h4>Querying and languages</h4>
              <div className="chips">
                <span className="chip">SQL</span>
                <span className="chip">Python</span>
                <span className="chip">R</span>
                <span className="chip">Java</span>
                <span className="chip">C and C++</span>
                <span className="chip">TypeScript</span>
              </div>
            </Reveal>
            <Reveal delay={100} className="skill-group">
              <h4>Analysis and statistics</h4>
              <div className="chips">
                <span className="chip">Exploratory analysis</span>
                <span className="chip">Feature engineering</span>
                <span className="chip">Statistical modelling</span>
                <span className="chip">Quantitative analysis</span>
                <span className="chip">pandas</span>
                <span className="chip">NumPy</span>
                <span className="chip">Data wrangling</span>
              </div>
            </Reveal>
            <Reveal delay={140} className="skill-group">
              <h4>Showing people the answer</h4>
              <div className="chips">
                <span className="chip">Tableau</span>
                <span className="chip">Power BI</span>
                <span className="chip">Matplotlib</span>
                <span className="chip">Seaborn</span>
                <span className="chip">Plotly</span>
                <span className="chip">Narrative visualisation</span>
              </div>
            </Reveal>
            <Reveal delay={180} className="skill-group">
              <h4>Machine learning</h4>
              <div className="chips">
                <span className="chip">scikit-learn</span>
                <span className="chip">PyTorch</span>
                <span className="chip">FastAI</span>
                <span className="chip">HuggingFace</span>
                <span className="chip">Fine tuning</span>
                <span className="chip">Neural networks</span>
                <span className="chip">Computer vision</span>
              </div>
            </Reveal>
            <Reveal delay={220} className="skill-group">
              <h4>Language models and agents</h4>
              <div className="chips">
                <span className="chip">RAG pipelines</span>
                <span className="chip">LangChain</span>
                <span className="chip">Prompt engineering</span>
                <span className="chip">Embeddings</span>
                <span className="chip">Hybrid retrieval</span>
                <span className="chip">Google ADK</span>
                <span className="chip">Groq</span>
              </div>
            </Reveal>
            <Reveal delay={260} className="skill-group">
              <h4>The rest of the toolbox</h4>
              <div className="chips">
                <span className="chip">Git</span>
                <span className="chip">Jupyter</span>
                <span className="chip">Linux</span>
                <span className="chip">Docker</span>
                <span className="chip">FastAPI</span>
                <span className="chip">n8n</span>
                <span className="chip">Bloomberg Terminal</span>
                <span className="chip">Vercel</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 6. education ---------------- */}
      <section className="section" id="education">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter six</span>
            <h2>Where I was taught.</h2>
          </Reveal>

          <div className="card-grid">
            <Reveal delay={60} className="sketch-card">
              <Frame seed={61} />
              <div className="sketch-card-inner">
                <h3>MSc Data Science</h3>
                <p>
                  King&apos;s College London, 2025 to 2026. Machine learning, deep learning and
                  neural networks, big data technologies, data mining, database management,
                  statistics for finance, and the data visualisation and storytelling module that
                  produced the seafood project. Dissertation handed in August 2026.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="sketch-card">
              <Frame seed={67} />
              <div className="sketch-card-inner">
                <h3>BTech, Computer Science</h3>
                <p>
                  Vellore Institute of Technology, 2021 to 2025, on the AI and robotics track. CGPA
                  8.21 out of 10, which is a first class honours equivalent. Along the way:
                  cryptography and network security, compiler design, probability and statistics,
                  game theory, and the robotics modules that led to the capstone.
                </p>
              </div>
            </Reveal>
            <Reveal delay={140} className="sketch-card">
              <Frame seed={71} />
              <div className="sketch-card-inner">
                <h3>And on my own time</h3>
                <p>
                  Andrew Ng&apos;s Machine Learning Specialization and the fast.ai course on
                  practical deep learning. IELTS Academic 8.0 overall, with 9.0 in both listening
                  and reading. English fluent, Tamil native.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- contact ---------------- */}
      <section className="contact section-alt" id="contact">
        <div className="wrap">
          <Reveal>
            <span className="chapter">the end, sort of</span>
            <h2>If any of this sounds useful, say hello.</h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="lead">
              I&apos;m looking for data analyst roles in London. Free from August 2026, and I can
              work in the UK without sponsorship until around 2029.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="btn-row">
              <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
                kpkautum2643@gmail.com
              </a>
              <a
                className="btn"
                href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn"
                href="https://github.com/kautum"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>
            Drawn in the browser with rough.js. Every number here is one I can show you the working
            for.
          </p>
        </div>
      </footer>
    </>
  );
}
