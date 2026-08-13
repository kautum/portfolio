import Nav from "./components/Nav";
import Reveal from "./components/Reveal";
import EvalInstrument from "./components/EvalInstrument";

export default function Home() {
  return (
    <>
      <Nav />
      <span id="top" />

      {/* ---------------- hero ---------------- */}
      <header className="hero">
        <div className="wrap">
          <Reveal>
            <div className="avatar" aria-hidden="true">
              KP
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1>Kautum Krishnan Panjalaraja</h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="hero-role">
              Data Analyst. I turn messy data into decisions people can act on.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="hero-meta">
              <span className="badge">London, UK</span>
              <span className="badge">
                Available full-time from <strong>August 2026</strong>
              </span>
              <span className="badge">
                <strong>No sponsorship needed</strong> until ~2029
              </span>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="cta-row">
              <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
                Get in touch
              </a>
              <a
                className="btn btn-secondary"
                href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn btn-secondary"
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

      {/* ---------------- about ---------------- */}
      <section className="section section-alt" id="about">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">
              I care whether the answer is true, not whether it looks good on a slide.
            </h2>
          </Reveal>

          <div className="narrow">
            <Reveal delay={120}>
              <p className="lead">
                I&apos;m a data analyst finishing an MSc in Data Science at King&apos;s College
                London. I work in SQL and Python, build dashboards non-technical readers can
                actually use, and I check my own results hard before I report them.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="body">
                That last part sounds like a small thing. It turned out to be my entire
                dissertation. Published intrusion-detection models report scores around 0.90 —
                but the standard way of splitting the data lets a model see the same attacking
                machines during training and testing. It learns to recognise the machine, not
                the attack. When I rebuilt the test so entire machines were held out, the same
                detector scored 0.61, and the ranking between two competing models reversed.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="body">
                I reported the 0.61. Drag the control below to see the difference a fair test
                makes.
              </p>
            </Reveal>
          </div>

          <Reveal delay={280} className="narrow">
            <EvalInstrument />
          </Reveal>
        </div>
      </section>

      {/* ---------------- strengths ---------------- */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What I bring</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">Four things I&apos;d be relied on for.</h2>
          </Reveal>

          <div className="strengths">
            <Reveal delay={120} className="strength">
              <h3>Honest measurement</h3>
              <p>
                I test whether a result survives a fair evaluation before it goes in front of
                anyone. Given the choice between the flattering number and the true one, I
                publish the true one and explain the gap.
              </p>
            </Reveal>
            <Reveal delay={180} className="strength">
              <h3>Communicating to non-specialists</h3>
              <p>
                I built a six-figure visual narrative on the global seafood system for a general
                audience, designed against Munzner&apos;s Why/What/How framework and checked for
                colour-blind accessibility throughout.
              </p>
            </Reveal>
            <Reveal delay={240} className="strength">
              <h3>End-to-end data handling</h3>
              <p>
                Merging thirteen datasets from four public sources into one clean pipeline, and
                building a 109,203-flow analysis corpus out of raw network captures. The
                unglamorous part is most of the job.
              </p>
            </Reveal>
            <Reveal delay={300} className="strength">
              <h3>Reading the real question</h3>
              <p>
                Applying to a brand that already ran a chatbot, I didn&apos;t build another one. I
                read what the brief was actually describing — a content pipeline — built it solo
                in a week, and shipped it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- experience ---------------- */}
      <section className="section section-alt" id="work">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Experience</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">Where I&apos;ve worked.</h2>
          </Reveal>

          <div className="roles">
            <Reveal delay={120} className="role">
              <div className="role-when">Mar 2025 – Jul 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Celcom Solutions · Chennai, India</p>
                <ul>
                  <li>
                    Built a retrieval-augmented chatbot in n8n that automated RFID-based employee
                    monitoring reports.
                  </li>
                  <li>Cut manual reporting time by 60% once the team adopted it.</li>
                  <li>
                    Validated output accuracy across several document types before deployment.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={180} className="role">
              <div className="role-when">Jan 2025</div>
              <div>
                <h3>AI Intern</h3>
                <p className="role-where">Finstein Advizory Service · Chennai, India</p>
                <ul>
                  <li>
                    Benchmarked deep-learning architectures with FastAI for a fintech product
                    team.
                  </li>
                  <li>
                    Ran end-to-end exploratory analysis and feature engineering on structured
                    financial datasets.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={240} className="role">
              <div className="role-when">Nov 2023 – Dec 2023</div>
              <div>
                <h3>Trainee, AI &amp; ML Programme</h3>
                <p className="role-where">Celcom Solutions · Chennai, India</p>
                <ul>
                  <li>
                    Researched and documented a machine-learning proof-of-concept framework for
                    software-development decision-making.
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

      {/* ---------------- projects ---------------- */}
      <section className="section" id="projects">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Selected work</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">Three projects, and what actually came out of them.</h2>
          </Reveal>

          <div className="projects">
            <Reveal delay={120} className="project">
              <p className="project-tag">MSc dissertation · submitted 6 August 2026</p>
              <h3>The evaluation was inflating the score, not the model</h3>
              <dl className="qa">
                <dt>The question</dt>
                <dd>
                  Do published IoT intrusion-detection results hold up when the model is tested on
                  attackers it has genuinely never seen?
                </dd>
                <dt>What I did</dt>
                <dd>
                  Built a 109,203-flow corpus from raw network captures, then ran the same
                  detector under two protocols — the field&apos;s standard random split, and a
                  stricter one holding out entire attacker machines. I also tested whether large
                  language models could close the gap, in three separate roles across ten model
                  families.
                </dd>
                <dt>What came out</dt>
                <dd>
                  The score fell from 0.9002 to 0.6059, and the ranking between the two candidate
                  detectors reversed — the model that looked best under the easy test was worst
                  under the fair one. The language models lost every honest comparison, which I
                  reported rather than quietly dropped. A verification notebook reproduces the
                  headline figure to four decimal places.
                </dd>
              </dl>
              <div className="metrics">
                <div className="metric">
                  <span className="metric-value">0.90 → 0.61</span>
                  <span className="metric-label">macro-F1, fair test</span>
                </div>
                <div className="metric">
                  <span className="metric-value">8 of 9</span>
                  <span className="metric-label">attacker machines caught</span>
                </div>
                <div className="metric">
                  <span className="metric-value">0</span>
                  <span className="metric-label">false alarms on 59 hosts</span>
                </div>
              </div>
              <p className="stack">
                Python · scikit-learn · RandomForest · pandas · NumPy · PyTorch · HuggingFace
              </p>
              <div className="links">
                <a
                  className="link"
                  href="https://github.com/kautum/msc-cyberattack-detection-llm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report, code and results →
                </a>
              </div>
            </Reveal>

            <Reveal delay={160} className="project">
              <p className="project-tag">King&apos;s College London · data visualisation</p>
              <h3>What a fish dinner costs, beyond the price on the label</h3>
              <dl className="qa">
                <dt>The question</dt>
                <dd>
                  What does the global seafood system actually cost — environmentally and
                  socially — and can that be shown to someone who has never read a fisheries
                  report?
                </dd>
                <dt>What I did</dt>
                <dd>
                  Pulled thirteen datasets from the FAO, Our World in Data, the Global Slavery
                  Index and the US Department of Labor into one cleaned pipeline, and built a six
                  figure narrative tracing the chain from catch to plate. Structured on
                  Munzner&apos;s Why/What/How framework and Segel and Heer&apos;s martini-glass
                  model, with colour-blind-safe encodings and data gaps shown rather than hidden.
                </dd>
                <dt>What came out</dt>
                <dd>
                  A publishable visual story plus an interactive Tableau dashboard letting a
                  reader explore fish-import volume against labour intensity across the G20.
                </dd>
              </dl>
              <div className="metrics">
                <div className="metric">
                  <span className="metric-value">13</span>
                  <span className="metric-label">datasets merged</span>
                </div>
                <div className="metric">
                  <span className="metric-value">6</span>
                  <span className="metric-label">narrative figures</span>
                </div>
                <div className="metric">
                  <span className="metric-value">G20</span>
                  <span className="metric-label">interactive dashboard</span>
                </div>
              </div>
              <p className="stack">Python · pandas · NumPy · Matplotlib · Tableau</p>
              <div className="links">
                <a
                  className="link"
                  href="https://github.com/kautum/telling-stories-with-data"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code and dashboard →
                </a>
              </div>
            </Reveal>

            <Reveal delay={200} className="project">
              <p className="project-tag">Independent build · live product</p>
              <h3>The brand already had a chatbot, so I built what they actually needed</h3>
              <dl className="qa">
                <dt>The question</dt>
                <dd>
                  A job posting asked for AI woven into paid content and product ranges shown in
                  generated environments. Was that really a chatbot brief?
                </dd>
                <dt>What I did</dt>
                <dd>
                  Read the brief against what the brand already ran, concluded it described a
                  content pipeline rather than another assistant, and built one solo in a week:
                  campaign copy, hashtags, ad variants and generated lifestyle imagery all sharing
                  a single creative concept. Chose the generation model after a head-to-head
                  comparison rather than by reputation.
                </dd>
                <dt>What came out</dt>
                <dd>
                  A deployed product a brand could use as-is, submitted as the application
                  itself.
                </dd>
              </dl>
              <p className="stack">
                Next.js · TypeScript · Tailwind CSS · Groq (gpt-oss-120b) · Framer Motion · Vercel
              </p>
              <div className="links">
                <a
                  className="link"
                  href="https://md-creative.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo →
                </a>
                <a
                  className="link"
                  href="https://github.com/kautum/md-creative"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code →
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="more-grid">
              <a
                className="more-item"
                href="https://github.com/kautum/a2a-banking-agents"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>A2A Banking Agents</h4>
                <p>
                  Two agents handling banking customer service over Google&apos;s A2A protocol,
                  with hybrid keyword-and-vector retrieval over a 698-document knowledge base.
                  Built in a day at Google&apos;s A2A Net Hackathon.
                </p>
              </a>
              <a
                className="more-item"
                href="https://github.com/kautum/rag-chatbot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>RAG model comparison</h4>
                <p>
                  The same retrieval pipeline built three times with everything held constant
                  except the language model, to see which one actually stays grounded in the
                  retrieved text instead of drifting.
                </p>
              </a>
              <a
                className="more-item"
                href="https://github.com/kautum/vision-to-voice"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>Vision to Voice</h4>
                <p>
                  An assistive system describing surroundings aloud in English and Tamil for
                  visually impaired users. Undergraduate capstone, written up as an IEEE-format
                  paper with my supervisor.
                </p>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- skills ---------------- */}
      <section className="section section-alt" id="skills">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Technical skills</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">Tools I&apos;ve actually shipped something with.</h2>
          </Reveal>

          <div className="skills">
            <Reveal delay={120} className="skill-row">
              <h4>Languages and querying</h4>
              <div className="tags">
                <span className="tag">SQL</span>
                <span className="tag">Python</span>
                <span className="tag">R</span>
                <span className="tag">Java</span>
                <span className="tag">C/C++</span>
                <span className="tag">TypeScript</span>
              </div>
            </Reveal>
            <Reveal delay={160} className="skill-row">
              <h4>Data and statistics</h4>
              <div className="tags">
                <span className="tag">Exploratory data analysis</span>
                <span className="tag">Feature engineering</span>
                <span className="tag">Statistical modelling</span>
                <span className="tag">Quantitative analysis</span>
                <span className="tag">pandas</span>
                <span className="tag">NumPy</span>
                <span className="tag">Data wrangling</span>
              </div>
            </Reveal>
            <Reveal delay={200} className="skill-row">
              <h4>Visualisation and reporting</h4>
              <div className="tags">
                <span className="tag">Tableau</span>
                <span className="tag">Power BI</span>
                <span className="tag">Matplotlib</span>
                <span className="tag">Seaborn</span>
                <span className="tag">Plotly</span>
                <span className="tag">Narrative visualisation</span>
              </div>
            </Reveal>
            <Reveal delay={240} className="skill-row">
              <h4>Machine learning</h4>
              <div className="tags">
                <span className="tag">scikit-learn</span>
                <span className="tag">PyTorch</span>
                <span className="tag">FastAI</span>
                <span className="tag">HuggingFace Transformers</span>
                <span className="tag">Model fine-tuning</span>
                <span className="tag">Neural networks</span>
              </div>
            </Reveal>
            <Reveal delay={280} className="skill-row">
              <h4>LLMs and agentic systems</h4>
              <div className="tags">
                <span className="tag">RAG pipelines</span>
                <span className="tag">LangChain</span>
                <span className="tag">Prompt engineering</span>
                <span className="tag">Embeddings</span>
                <span className="tag">Hybrid retrieval (BM25 + vector + RRF)</span>
                <span className="tag">Google ADK</span>
                <span className="tag">Groq API</span>
              </div>
            </Reveal>
            <Reveal delay={320} className="skill-row">
              <h4>Tools and platforms</h4>
              <div className="tags">
                <span className="tag">Git</span>
                <span className="tag">Jupyter</span>
                <span className="tag">Google Colab</span>
                <span className="tag">Linux</span>
                <span className="tag">Docker</span>
                <span className="tag">FastAPI</span>
                <span className="tag">n8n</span>
                <span className="tag">Bloomberg Terminal</span>
                <span className="tag">Vercel</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- education ---------------- */}
      <section className="section" id="education">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Education</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="narrow">Where I trained.</h2>
          </Reveal>

          <div className="edu">
            <Reveal delay={120} className="edu-item">
              <h3>MSc Data Science</h3>
              <p className="edu-school">King&apos;s College London</p>
              <p className="edu-when">Sep 2025 – 2026 · London, UK</p>
              <p className="edu-detail">
                Machine Learning, Deep Learning, Neural Networks, Big Data Technologies, Data
                Visualisation and Storytelling, Statistics for Finance, Database Management, Data
                Warehousing and Mining. Dissertation submitted August 2026.
              </p>
            </Reveal>
            <Reveal delay={180} className="edu-item">
              <h3>BTech, Computer Science</h3>
              <p className="edu-school">
                Vellore Institute of Technology · AI &amp; Robotics specialisation
              </p>
              <p className="edu-when">2021 – 2025 · Chennai, India</p>
              <p className="edu-detail">
                CGPA 8.21 / 10.0, First Class Honours equivalent. Coursework in AI, machine
                learning, databases, probability and statistics, cryptography and network
                security, and software engineering.
              </p>
            </Reveal>
            <Reveal delay={240} className="edu-item">
              <h3>Also</h3>
              <p className="edu-school">Language and self-directed study</p>
              <p className="edu-when">&nbsp;</p>
              <p className="edu-detail">
                IELTS Academic 8.0 overall, C1 Advanced (Listening 9.0, Reading 9.0). Machine
                Learning Specialization with Andrew Ng, and fast.ai Practical Deep Learning.
                English fluent, Tamil native.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- contact ---------------- */}
      <section className="contact section-alt" id="contact">
        <div className="wrap">
          <Reveal>
            <h2>Let&apos;s talk.</h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="lead">
              I&apos;m looking for Data Analyst roles in London, available full-time from August
              2026, with the right to work in the UK without sponsorship until around 2029.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="contact-list">
              <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
                kpkautum2643@gmail.com
              </a>
              <a
                className="btn btn-secondary"
                href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn btn-secondary"
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
            Kautum Krishnan Panjalaraja · London, UK · MSc Data Science, King&apos;s College
            London
          </p>
        </div>
      </footer>
    </>
  );
}
