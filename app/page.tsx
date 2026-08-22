import Nav from "./components/Nav";
import HowIWork from "./components/HowIWork";
import { Crest, CredentialMark } from "./components/Crests";
import TechLogos from "./components/TechLogos";
import { RankFlip } from "./components/dissertation";
import Scrubber from "./components/Scrubber";
import Reveal from "./components/Reveal";
import Ambience from "./components/Ambience";
import Filmstrip from "./components/Filmstrip";
import ScrollStrip from "./components/ScrollStrip";
import { HonestChart, ImpactChart } from "./components/charts";
import { GearChart, StocksChart } from "./components/seafood";
import { LondonChart } from "./components/london";
import { BigShape, Mark, type MarkShape } from "./components/Sketch";

const STOPS: { year: string; text: string; colour: string; shape: MarkShape }[] = [
  {
    year: "2021",
    shape: "circle",
    colour: "--c1",
    text: "Started a BTech in computer science at VIT in Chennai, on the AI and robotics track. Finished on 8.21 out of 10.",
  },
  {
    year: "2023",
    shape: "square",
    colour: "--c2",
    text: "Two traineeships at Celcom, back to back. The first was Java and SQL. The second was the one that stuck: comparing regression, trees and neural networks on real metrics.",
  },
  {
    year: "Jan 2025",
    shape: "triangle",
    colour: "--c3",
    text: "A month at Finstein, benchmarking deep learning architectures for a fintech product team and cleaning up their structured financial data.",
  },
  {
    year: "Jul 2025",
    shape: "arc",
    colour: "--c4",
    text: "Back at Celcom for five months. Built the reporting chatbot that ended up saving the team most of a working day each week.",
  },
  {
    year: "Sep 2025",
    shape: "cross",
    colour: "--c5",
    text: "Moved to London for the MSc in Data Science at King's. First time living outside India.",
  },
  {
    year: "Aug 2026",
    shape: "circle",
    colour: "--c6",
    text: "Handed in the dissertation on 6 August. Everything after this point is what I did with the year.",
  },
];

function ChapterMark({ n, colour, shape }: { n: string; colour: string; shape: MarkShape }) {
  return (
    <div className="chapter-mark">
      <Mark shape={shape} colour={colour} />
      <p className="meta">{n}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Ambience />
      <Scrubber />
      <Nav />
      <span id="top" />

      {/* ---------------- hero ---------------- */}
      <header className="hero" data-tint="#faf6ef" data-tint-dark="#1b1917">
        <div className="bigshape-wrap" data-parallax="0.05" aria-hidden="true">
          <BigShape shape="circle" colour="--c2" />
        </div>
        <div className="wrap relative">
          <Reveal>
            <div className="hero-role">
              <Mark shape="circle" colour="--c3" />
              <p className="meta" style={{ margin: 0 }}>
                Data analyst, London
              </p>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h1>Kautum Krishnan Panjalaraja</h1>
          </Reveal>

          <Reveal delay={110}>
            <p className="hero-title-role">
              <strong>Data analyst</strong>
              <span className="hand-note">SQL, Python, and a habit of checking</span>
            </p>
          </Reveal>

          <Reveal delay={140}>
            <p className="lead">
              I work out what the data <span className="pop">actually</span> says, including the
              times that turns out to be less flattering than what everyone hoped it would say.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="facts">
              <div className="fact">
                <p className="fact-label">Available</p>
                <p className="fact-value">On course completion</p>
              </div>
              <div className="fact">
                <p className="fact-label">Right to work</p>
                <p className="fact-value">Graduate Route, no sponsorship needed</p>
              </div>
              <div className="fact">
                <p className="fact-label">Studying</p>
                <p className="fact-value">MSc Data Science, King&apos;s College London</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="btn-row">
              <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
                Get in touch
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

      {/* ---------------- who I am, and how I work ---------------- */}
      <section className="section" id="how" data-tint="#faf3dc" data-tint-dark="#201d16">
        <div className="wrap relative">
          <HowIWork />
        </div>
      </section>

      {/* ---------------- 1. story ---------------- */}
      <section className="section" id="story" data-tint="#e9f1e7" data-tint-dark="#181b17">
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter one" colour="--c4" shape="square" />
            <h2>Chennai to London, in six steps.</h2>
            <p className="body">
              Five years of computer science and internships in Chennai, then a year in London
              doing a masters. The six steps run sideways. Scroll on, or swipe them.
            </p>
          </Reveal>
        </div>

        <ScrollStrip count={STOPS.length}>
          {STOPS.map((s) => (
            <article className="sstrip-panel" key={s.year}>
              <div>
                <Mark shape={s.shape} colour={s.colour} size={128} className="sstrip-dot" />
                <p className="year">{s.year}</p>
              </div>
              <p>{s.text}</p>
            </article>
          ))}
        </ScrollStrip>
      </section>

      {/* ---------------- 2. the finding ---------------- */}
      <section className="section clip" id="finding" data-tint="#e7eef8" data-tint-dark="#171a20">
        <div className="bigshape-wrap" data-parallax="0.07" aria-hidden="true">
          <BigShape shape="triangle" colour="--c3" />
        </div>
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter two" colour="--c3" shape="triangle" />
            <h2>
              I spent a year finding out my field was marking its{" "}
              <span className="pop" style={{ ["--pop" as string]: "var(--c1)" }}>
                own homework
              </span>
              .
            </h2>
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
              rather than shuffling.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <HonestChart />
          </Reveal>

          <Reveal delay={60}>
            <p className="body">
              The score dropped by a third. Worse for anyone choosing a model, the ranking
              flipped: the detector that won under the easy split came last under the fair one.
              If you had picked your model the usual way, you would have picked the wrong one and
              never known.
            </p>

            <RankFlip />
            <p className="body">
              I also went looking for a fix. Large language models were the obvious candidate, so
              I tried them in three separate jobs: classifying the traffic directly, generating
              extra training data, and predicting what packet comes next. Ten model families went
              into the comparison. DistilBERT finished last of the ten. The generation
              experiments, run with Qwen2.5, SmolLM2 and GLM-Edge, came back negative every time.
              The core experiment, predicting future packets and then classifying them, lost to
              simply classifying what you can already see in 18 of 21 configurations.
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
              captures, then failed on a different malware family, which is a limit worth
              reporting rather than a result worth hiding.
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
      <section className="section" id="work" data-tint="#fbecdf" data-tint-dark="#201b16">
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter three" colour="--c2" shape="arc" />
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

          <div>
            <Reveal delay={40} className="role">
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

            <Reveal delay={80} className="role">
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

            <Reveal delay={120} className="role">
              <div className="role-when">Nov to Dec 2023</div>
              <div>
                <h3>Trainee, AI and ML programme</h3>
                <p className="role-where">Celcom Solutions, Chennai</p>
                <ul>
                  <li>
                    Researched and wrote up a machine learning proof of concept for software
                    development decisions.
                  </li>
                  <li>
                    Compared regression, decision trees and neural networks on RMSE, R squared,
                    precision, recall and F1.
                  </li>
                  <li>
                    Preceded by a separate two month traineeship on the software engineering
                    track, covering Java, collections, JDBC and SQL.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ---------------- 5. projects ---------------- */}
      <section className="section" id="projects" data-tint="#f0e9f6" data-tint-dark="#1d1922">
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter five" colour="--c5" shape="cross" />
            <h2>Things I made because I wanted to know something.</h2>
            <p className="body">
              In each of these the interesting part was deciding what the actual question was,
              which is the part of analysis nobody sets as an exercise.
            </p>
          </Reveal>

          <Reveal delay={40}>
            <div className="feature">
              <p className="meta">Thirteen datasets, one story</p>
              <h3>What a fish dinner costs, beyond the price on the label</h3>
              <p className="body">
                My individual coursework for the data visualisation and storytelling module at
                King&apos;s, written up as an IEEE-format paper. Thirteen datasets from the FAO,
                Our World in Data, the Global Slavery Index and the US Department of Labor, pulled
                into one cleaned pipeline and built into a six-stage narrative: demand, then how
                the fish is caught, then what that does to the sea, then who gets hurt, then who
                pays for it, then what else we could eat. Two figures from the middle of that
                argument are redrawn here, live, from the same data.
              </p>

              <div className="feature-charts">
                <StocksChart />
                <GearChart />
              </div>

              <p className="body">
                Structured on Munzner&apos;s why, what and how framework, with Segel and
                Heer&apos;s martini glass model: I lead the reader through the argument first,
                then hand over and let them explore. Every palette was checked against
                ColorBrewer for colour blind safety. Each figure records the alternative encoding
                I tried and rejected, and why: a Sankey for the gear flows looked striking but hid
                absolute magnitude, and a choropleth for labour abuses would have made countries
                with no data look clean. The paper also carries a section on what the data cannot
                show, since FAO statistics exclude most illegal catch and labour figures count
                only documented cases.
              </p>
              <p className="stack">Python, pandas, NumPy, Matplotlib, Tableau</p>
              <div className="links">
                <a
                  className="link"
                  href="https://github.com/kautum/telling-stories-with-data"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  All six figures, the datasets and the dashboard
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={50}>
            <div className="feature">
              <p className="meta">Group coursework, same module</p>
              <h3>Do London&apos;s parks actually make it more livable?</h3>
              <p className="body">
                Four datasets merged across all 33 boroughs, then plotted in five dimensions at
                once: park access on one axis, flood risk on the other, obesity in the size of
                each marker and air pollution in its colour, with a composite livability index
                fitted over the top.
              </p>

              <LondonChart />

              <p className="body">
                The honest answer is a qualified yes. Livability does improve with park access,
                but the fit is modest and the headline relationship people expect is not there at
                all: flood risk tracks the river, not the parks. Central boroughs with the best
                green access still carry the worst air. Writing that up as "parks help, but they
                do not buy you out of geography" was more useful than a cleaner claim would have
                been.
              </p>
              <p className="stack">Python, pandas, Matplotlib, ColorBrewer palettes</p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <Filmstrip>
              <article className="card">
                <p className="meta">A case study for a research analyst role</p>
                <h3>What happens to a stock when an index quietly drops it</h3>
                <dl>
                  <dt>the question</dt>
                  <dd>
                    Index funds have to hold whatever the index says they hold. So when the index
                    changes, they all have to trade, at the same time, whether they want to or
                    not. How much money is that, and can the market absorb it?
                  </dd>
                  <dt>what I did</dt>
                  <dd>
                    Modelled the passive fund flows around a hundred stock US index from its
                    constituent list: price, shares outstanding and free float per name. Worked
                    out the assets tracking the index, the weight of individual names, then walked
                    through the events that force a rebalance. A free float expansion. A stock
                    split. A deletion from the index entirely.
                  </dd>
                  <dt>what came out</dt>
                  <dd>
                    Around 940 billion dollars of passive money sits against that index and has to
                    move mechanically when the rules change. Unwinding a deleted name would take
                    roughly fourteen times its average daily volume, so it cannot be done on the
                    day without moving the price. Splits change nothing, because market cap does
                    not move.
                  </dd>
                  <dt>the less fun part</dt>
                  <dd>
                    A limitations section. The model treats the tracking percentage as fixed and
                    ignores that different funds rebalance on different schedules.
                  </dd>
                </dl>
                <p className="stack">Python, pandas, Jupyter, February 2026</p>
              </article>


              <article className="card">
                <p className="meta">The job application that built itself</p>
                <h3>They already had a chatbot, so I built the thing they actually asked for</h3>
                <dl>
                  <dt>the question</dt>
                  <dd>
                    A haircare brand advertised for a junior AI developer. The posting talked
                    about AI woven into paid content and product ranges recreated in generated
                    environments. Everyone applying was going to build a chatbot. The brand
                    already ran one.
                  </dd>
                  <dt>what I did</dt>
                  <dd>
                    Read it as a content problem and built a campaign generator, solo, in under a
                    week. Point it at one of their twelve real products and it writes the copy in
                    their voice, generates a lifestyle scene from the same campaign idea, and
                    composites the product in at true relative scale, so a fifteen pound spray
                    does not come out the size of a hairdryer.
                  </dd>
                  <dt>decisions I would defend</dt>
                  <dd>
                    Copy is generated before the image prompt, not in parallel, so words and
                    picture come from one concept. Scene generation kept collapsing into bathrooms
                    and spas, so I added nine style categories, a banned word check and a targeted
                    retry. Image to image APIs were too expensive, so compositing runs in the
                    browser. I picked gpt-oss-120b over Llama 3.3 70B after comparing their copy
                    side by side.
                  </dd>
                </dl>
                <figure className="shot">
                  {/* A real screenshot of the running product, not a mockup. */}
                  <img
                    src="/md-creative-shot.png"
                    alt="The md creative generator running: a Social Content Generator heading, a
                         product picker, and the mdlondon range laid out as cards."
                    width={1600}
                    height={801}
                    loading="lazy"
                  />
                  <figcaption>md-creative.vercel.app, running now</figcaption>
                </figure>
                <p className="stack">Next.js, TypeScript, Groq, Vercel, all on free tiers</p>
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
              </article>

              <article className="card">
                <p className="meta">A codebase I had never seen before</p>
                <h3>Reading someone else&apos;s research tool properly</h3>
                <dl>
                  <dt>the question</dt>
                  <dd>
                    Janus is an app analysis tool built at King&apos;s by the DIGISILK project,
                    by a rotating cast of students rather than a standing engineering team. I
                    applied for the developer role on it. What is the useful thing to do when you
                    do not know the team&apos;s roadmap?
                  </dd>
                  <dt>what I did</dt>
                  <dd>
                    Read the code, got it running, and wrote the guide it was missing: what the
                    project is, how a request moves through it, how to set it up if you do not
                    consider yourself a programmer, and every defect I found with file
                    references. I spent more time on the documentation than on the code.
                  </dd>
                  <dt>what came out</dt>
                  <dd>
                    It boots from a clean clone now, and the defects I found are fixed. The
                    serious one was authentication. Checking login when the page renders looks
                    like access control but is not: the framework registers every callback
                    globally, so anyone who knew the component IDs, which the framework itself
                    lists, could run the analysis pipeline and the file upload without ever
                    logging in. I put the guard on the single endpoint every callback passes
                    through, so one added next year is covered too. Also a path traversal in the
                    upload handler, a race in session tracking that broke the site for everyone,
                    and a worker pool that leaked on a malformed file. Upstream&apos;s branch is
                    untouched so the two can be diffed, and I committed a brief at the root that
                    coding assistants read automatically.
                  </dd>
                </dl>
                <p className="stack">Python, Dash, Androguard, Apache 2.0, same as upstream</p>
                <div className="links">
                  <a
                    className="link"
                    href="https://github.com/kautum/janus-baseline/tree/fix/bootable-and-secure-baseline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The fork and its docs
                  </a>
                </div>
              </article>

              <article className="card">
                <p className="meta">1.86 million sales, all of it in SQL</p>
                <h3>What UK house prices actually did, asked in SQL</h3>
                <dl>
                  <dt>the question</dt>
                  <dd>
                    Every other project here is Python. SQL is the first thing an analyst gets tested on, so it needed a piece of work of its
                    own.
                  </dd>
                  <dt>what I did</dt>
                  <dd>
                    Loaded every Land Registry Price Paid sale for 2024 and 2025, 1.86 million of
                    them, plus the official House Price Index, into a DuckDB star schema. Six
                    questions, and every analytical step is a query: joins, chained CTEs, window
                    functions, moving averages, medians. Python only downloads the files and runs
                    the SQL.
                  </dd>
                  <dt>what came out</dt>
                  <dd>
                    New builds carry a 25.3% premium. March 2025 saw 123,129 sales before the
                    stamp duty change, then April collapsed to 33,803, and splitting England from
                    Wales shows the tax caused it, since Wales sets its own thresholds. The tidy assumption
                    that cash buyers cluster at the top does not survive contact with the data:
                    the correlation is -0.092, which is nothing.
                  </dd>
                  <dt>the less fun part</dt>
                  <dd>
                    A limitations section, and a script that re-checks all 76 numbers in the
                    README against the query output. It caught two of my own errors.
                  </dd>
                </dl>
                <p className="stack">DuckDB, SQL, Python, open government data</p>
                <div className="links">
                  <a
                    className="link"
                    href="https://github.com/kautum/uk-housing-sql"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The queries and the findings
                  </a>
                </div>
              </article>

              <article className="card">
                <p className="meta">Three more, briefly</p>
                <h3>Agents, retrieval and a camera that talks</h3>
                <dl>
                  <dt>a2a banking agents</dt>
                  <dd>
                    Two agents handling banking customer service over Google&apos;s A2A protocol,
                    built in a day at their hackathon. Search runs keyword first across 698
                    documents and only pays for the embedding call when keywords come up short.
                  </dd>
                  <dt>rag model comparison</dt>
                  <dd>
                    The same pipeline three times, everything constant except the language model.
                    LLaMA stayed closest to the retrieved text. SmolLM2 did well for its size but
                    drifted on harder questions.
                  </dd>
                  <dt>vision to voice</dt>
                  <dd>
                    My undergraduate capstone. A camera describes what it sees out loud, in
                    English and Tamil, for people who cannot see it. Written up as an IEEE format
                    paper with my supervisor.
                  </dd>
                </dl>
                <div className="links">
                  <a
                    className="link"
                    href="https://github.com/kautum"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    All of it on GitHub
                  </a>
                </div>
              </article>
            </Filmstrip>
          </Reveal>

          <Reveal delay={40}>
            <div className="strip-hint">
              <Mark shape="cross" colour="--c5" size={18} />
              <span>Throw it sideways for the rest</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- 6. skills ---------------- */}
      <section className="section" id="skills" data-tint="#faf3dc" data-tint-dark="#201d16">
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter six" colour="--c1" shape="circle" />
            <h2>What I reach for.</h2>
            <p className="body">
              Everything here has been used on something that shipped or got marked. If a tool is
              missing it is because I have not used it properly yet, and I would rather say so at
              the start than halfway through an interview.
            </p>
          </Reveal>

          <TechLogos />

          <div className="skills">
            {[
              ["Querying and languages", ["SQL", "Python", "R", "Java", "C and C++", "TypeScript"]],
              [
                "Analysis and statistics",
                [
                  "Exploratory analysis",
                  "Feature engineering",
                  "Statistical modelling",
                  "pandas",
                  "NumPy",
                  "Data wrangling",
                ],
              ],
              [
                "Showing people the answer",
                ["Tableau", "Matplotlib", "Seaborn", "Plotly", "Narrative visualisation"],
              ],
              [
                "Machine learning",
                ["scikit-learn", "PyTorch", "FastAI", "HuggingFace", "Fine tuning", "Computer vision"],
              ],
              [
                "Language models and agents",
                [
                  "RAG pipelines",
                  "LangChain",
                  "Prompt engineering",
                  "Embeddings",
                  "Hybrid retrieval",
                  "Google ADK",
                ],
              ],
              [
                "The rest of the toolbox",
                ["Git", "Jupyter", "Linux", "Docker", "FastAPI", "n8n", "Bloomberg Terminal"],
              ],
            ].map(([group, items], i) => (
              <Reveal key={group as string} delay={40 + i * 40} className="skill">
                <h4>{group as string}</h4>
                <ul>
                  {(items as string[]).map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7. education ---------------- */}
      <section className="section" id="education" data-tint="#e6f1ef" data-tint-dark="#171c1a">
        <div className="wrap relative">
          <Reveal className="section-head">
            <ChapterMark n="Chapter seven" colour="--c4" shape="triangle" />
            <h2>Where I was taught.</h2>
          </Reveal>

          <div className="panel-grid">
            <Reveal delay={40} className="panel">
              <Crest institution="kcl" />
              <p className="meta">2025 to 2026, London</p>
              <h3>MSc Data Science</h3>
              <p className="panel-body">
                King&apos;s College London. Machine learning, deep learning and neural networks,
                big data technologies, data mining, database management, statistics for finance,
                and the data visualisation and storytelling module that produced the seafood
                project. Dissertation handed in August 2026.
              </p>
            </Reveal>
            <Reveal delay={80} className="panel">
              <Crest institution="vit" />
              <p className="meta">2021 to 2025, Chennai</p>
              <h3>BTech, Computer Science</h3>
              <p className="panel-body">
                Vellore Institute of Technology, on the AI and robotics track. CGPA 8.21 out of
                10, a first class honours equivalent. Along the way: cryptography and network
                security, compiler design, probability and statistics, and game theory.
              </p>
            </Reveal>
            <Reveal delay={120} className="panel">
              <CredentialMark name="coursera" size={40} />
              <p className="meta">On my own time</p>
              <h3>Courses and languages</h3>
              <p className="panel-body">
                Andrew Ng&apos;s Machine Learning Specialization and the fast.ai course on
                practical deep learning. IELTS Academic 8.0 overall, with 9.0 in both listening
                and reading. English fluent, Tamil native.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- contact ---------------- */}
      <section className="contact clip" id="contact" data-tint="#faf6ef" data-tint-dark="#1b1917">
        <div className="bigshape-wrap" data-parallax="0.06" aria-hidden="true">
          <BigShape shape="arc" colour="--c6" />
        </div>
        <div className="wrap relative">
          <Reveal>
            <ChapterMark n="The end, sort of" colour="--c6" shape="arc" />
            <h2>If any of this sounds useful, say hello.</h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="lead" style={{ marginBottom: 32 }}>
              I am looking for data analyst roles in London, available on course completion. I
              have Graduate Route right to work in the UK, so no sponsorship is needed.
            </p>
          </Reveal>
          <Reveal delay={110}>
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
              <a className="btn" href="/kautum-krishnan-panjalaraja-cv.pdf" download>
                Download CV
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>
            Every number on this page is one I can show you the working for. Built with Next.js.
          </p>
        </div>
      </footer>
    </>
  );
}
