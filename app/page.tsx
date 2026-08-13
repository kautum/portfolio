import Nav from "./components/Nav";
import Reveal from "./components/Reveal";
import { Frame } from "./components/Sketch";
import { HonestChart, ImpactChart, JourneyChart, Underline } from "./components/charts";

const STOPS = [
  ["2021", "Started a BTech in computer science at VIT, Chennai. Specialised in AI and robotics."],
  ["2023", "First taste of the job: an AI and ML traineeship, comparing models on real metrics."],
  ["Jan 2025", "Finstein. Benchmarked deep-learning architectures for a fintech product team."],
  ["Jul 2025", "Celcom. Shipped a chatbot that gave a team 60% of its reporting time back."],
  ["Sep 2025", "Moved to London and started the MSc in Data Science at King's College London."],
  ["Aug 2026", "Submitted the dissertation. Now looking for the next thing."],
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
            <span className="chapter">hello —</span>
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
              I&apos;m a data analyst. I work out what the data actually says, including when
              that&apos;s less flattering than what everyone hoped it would say.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="facts">
              <span className="fact">London</span>
              <span className="fact">
                Free from <strong>August 2026</strong>
              </span>
              <span className="fact">
                <strong>No visa sponsorship</strong> needed until ~2029
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
              Every chart on this page is drawn by hand, in the browser, from numbers that are
              genuinely mine. It seemed a more honest way to introduce myself than a stock photo.
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

      {/* ---------------- 2. the finding ---------------- */}
      <section className="section" id="finding">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="chapter">chapter two</span>
            <h2>I spent a year discovering my field was marking its own homework.</h2>
            <p className="body">
              My dissertation asked a boring-sounding question: do published intrusion-detection
              scores survive a fair test? Everyone reports numbers around 0.90. But the standard
              way of splitting the data lets the same attacking machines appear in both training
              and testing, so the model can learn to recognise the machine rather than the
              attack.
            </p>
            <p className="body">
              I rebuilt the test so entire machines were held out. Here is what happened to the
              very same detector.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <HonestChart />
          </Reveal>

          <Reveal delay={80}>
            <p className="body">
              The score fell by a third, and the ranking between the two candidate detectors
              reversed — the one that looked best under the easy test was the worst under the fair
              one. I also tried large language models in three different roles to close the gap.
              They lost every honest comparison, so that is what I wrote down.
            </p>
            <p className="body">
              This is the part of the job I actually care about. Anyone can produce a number.
              Knowing whether to trust it is the harder and more useful skill.
            </p>
            <p>
              <a
                className="link"
                href="https://github.com/kautum/msc-cyberattack-detection-llm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the whole thing, code and all
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
              At Celcom the monitoring reports were assembled by hand, every time. I built a
              retrieval chatbot in n8n that pulled them together instead, and checked it against
              several document types before letting anyone rely on it.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <ImpactChart />
          </Reveal>

          <div className="roles">
            <Reveal delay={60} className="role">
              <div className="role-when">Mar – Jul 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Celcom Solutions · Chennai</p>
                <ul>
                  <li>
                    Built a retrieval-augmented chatbot in n8n that automated RFID-based employee
                    monitoring reports.
                  </li>
                  <li>Cut manual reporting time by 60% once the team adopted it.</li>
                  <li>Validated accuracy across several document types before deployment.</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100} className="role">
              <div className="role-when">Jan 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Finstein Advizory Service · Chennai</p>
                <ul>
                  <li>Benchmarked deep-learning architectures with FastAI for a fintech team.</li>
                  <li>
                    Ran end-to-end exploratory analysis and feature engineering on structured
                    financial data.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140} className="role">
              <div className="role-when">Nov – Dec 2023</div>
              <div>
                <h3>Trainee, AI &amp; ML Programme</h3>
                <p className="role-where">Celcom Solutions · Chennai</p>
                <ul>
                  <li>
                    Researched a machine-learning proof-of-concept framework for
                    software-development decisions.
                  </li>
                  <li>
                    Compared regression, decision trees and neural networks on RMSE, R²,
                    precision/recall and F1.
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
          </Reveal>

          <Reveal delay={60} className="project">
            <Frame seed={21} />
            <div className="project-inner">
              <p className="project-kicker">a story told in thirteen datasets</p>
              <h3>What a fish dinner costs, beyond the price on the label</h3>
              <dl className="qa">
                <dt>the question</dt>
                <dd>
                  What does the global seafood system really cost, environmentally and socially,
                  and can you show that to someone who has never read a fisheries report?
                </dd>
                <dt>what I did</dt>
                <dd>
                  Pulled thirteen datasets from the FAO, Our World in Data, the Global Slavery
                  Index and the US Department of Labor into one cleaned pipeline, then built a six
                  figure narrative tracing the chain from catch to plate. Colour-blind-safe
                  throughout, with the gaps in the data shown rather than quietly smoothed over.
                </dd>
                <dt>what came out</dt>
                <dd>
                  A visual story plus an interactive Tableau dashboard comparing fish imports
                  against labour intensity across the G20.
                </dd>
              </dl>
              <p className="stack">Python · pandas · NumPy · Matplotlib · Tableau</p>
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

          <Reveal delay={80} className="project">
            <Frame seed={34} />
            <div className="project-inner">
              <p className="project-kicker">the job application that built itself</p>
              <h3>They already had a chatbot, so I built what they actually needed</h3>
              <dl className="qa">
                <dt>the question</dt>
                <dd>
                  A posting asked for AI woven into paid content, with product ranges shown in
                  generated environments. Was that really a chatbot brief?
                </dd>
                <dt>what I did</dt>
                <dd>
                  Decided it described a content pipeline, not another assistant, and built one
                  solo in a week: campaign copy, hashtags, ad variants and generated imagery all
                  sharing one creative concept. Picked the generation model by testing two head to
                  head rather than by reputation.
                </dd>
                <dt>what came out</dt>
                <dd>A deployed product, submitted as the application itself.</dd>
              </dl>
              <p className="stack">Next.js · TypeScript · Groq (gpt-oss-120b) · Vercel</p>
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
                  protocol, with hybrid keyword and vector search across 698 documents. Built in a
                  day at Google&apos;s hackathon.{" "}
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
                  The same retrieval pipeline built three times, everything held constant except
                  the language model, to see which one stays grounded in the text instead of
                  drifting.{" "}
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
                  A system that describes what a camera sees, out loud, in English and Tamil, for
                  visually impaired users. My undergraduate capstone, written up as an IEEE-format
                  paper.{" "}
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
              Only things I have actually shipped something with. No wishlist entries.
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
                <span className="chip">C/C++</span>
                <span className="chip">TypeScript</span>
              </div>
            </Reveal>
            <Reveal delay={100} className="skill-group">
              <h4>Analysis and statistics</h4>
              <div className="chips">
                <span className="chip">Exploratory analysis</span>
                <span className="chip">Feature engineering</span>
                <span className="chip">Statistical modelling</span>
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
                <span className="chip">Fine-tuning</span>
                <span className="chip">Neural networks</span>
              </div>
            </Reveal>
            <Reveal delay={220} className="skill-group">
              <h4>LLMs and agents</h4>
              <div className="chips">
                <span className="chip">RAG pipelines</span>
                <span className="chip">LangChain</span>
                <span className="chip">Prompt engineering</span>
                <span className="chip">Embeddings</span>
                <span className="chip">Hybrid retrieval</span>
                <span className="chip">Google ADK</span>
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
                  King&apos;s College London, 2025–2026. Machine learning, deep learning, big data,
                  data visualisation and storytelling, statistics for finance, databases, data
                  warehousing and mining. Dissertation submitted August 2026.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="sketch-card">
              <Frame seed={67} />
              <div className="sketch-card-inner">
                <h3>BTech, Computer Science</h3>
                <p>
                  Vellore Institute of Technology, 2021–2025, specialising in AI and robotics.
                  CGPA 8.21 out of 10, first class honours equivalent.
                </p>
              </div>
            </Reveal>
            <Reveal delay={140} className="sketch-card">
              <Frame seed={71} />
              <div className="sketch-card-inner">
                <h3>And on my own time</h3>
                <p>
                  Andrew Ng&apos;s Machine Learning Specialization and fast.ai&apos;s Practical
                  Deep Learning. IELTS Academic 8.0 overall, C1 Advanced. English fluent, Tamil
                  native.
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
              I&apos;m after data analyst roles in London, free from August 2026, and I can work in
              the UK without sponsorship until around 2029.
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
            Drawn in the browser with rough.js. Every number on this page is one I can show you
            the working for.
          </p>
        </div>
      </footer>
    </>
  );
}
