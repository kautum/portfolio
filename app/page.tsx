import Nav from "./components/Nav";
import EvalInstrument from "./components/EvalInstrument";

export default function Home() {
  return (
    <>
      <Nav />
      <div id="top" />

      <div className="wrap">
        <header className="hero">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Kautum Krishnan Panjalaraja — Data Analyst</p>
              <h1 className="headline">I turn messy data into decisions people can act on.</h1>
              <p className="bio">
                MSc Data Science at King&apos;s College London. SQL and Python pipelines,
                statistically honest analysis, and dashboards that survive non-technical
                scrutiny — plus hands-on production LLM experience most analyst candidates
                can&apos;t show. Full UK right to work without sponsorship until approximately
                2029.
              </p>
              <div className="hero-links">
                <a className="pill primary" href="#work">
                  See the work
                </a>
                <a
                  className="pill"
                  href="https://github.com/kautum"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="pill"
                  href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <EvalInstrument />
          </div>
        </header>

        <section id="work">
          <h2 className="section-title">Selected work</h2>
          <p className="section-sub">
            Three projects, structured the way I approach any of them: what was actually being
            asked, what I did, and what turned out to be true — including the parts that
            weren&apos;t flattering.
          </p>

          <div className="cards">
            <div className="card">
              <p className="card-eyebrow">MSc dissertation · submitted 6 Aug 2026</p>
              <h3>The evaluation was lying about how good the model was</h3>
              <p>
                The question: do published IoT intrusion-detection numbers hold up under a fair
                test? I re-ran the standard random-split protocol against a stricter one —
                holding out entire attacker machines the model had never trained on. I also
                tested whether LLMs could close the gap; across three separate roles and ten
                model families, they lost every honest comparison.
              </p>
              <div className="stat-row">
                0.9002 → 0.6059 macro-F1 · 8/9 attacker machines caught, 0 false alarms across 59
                benign hosts
              </div>
              <a
                className="out"
                href="https://github.com/kautum/msc-cyberattack-detection-llm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report, code &amp; data →
              </a>
            </div>

            <div className="card">
              <p className="card-eyebrow">KCL coursework · Telling Stories with Data</p>
              <h3>What the price tag doesn&apos;t say about a fish dinner</h3>
              <p>
                Thirteen datasets from the FAO, Our World in Data, the Global Slavery Index and
                the US Department of Labor, cleaned into one pipeline and a six-figure visual
                narrative tracing global seafood from ocean to plate — consumption, bycatch,
                overfishing, and forced labour in the supply chain. Built on Munzner&apos;s
                Why/What/How framework, colour-blind-accessible throughout.
              </p>
              <div className="stat-row">
                13 datasets · 6 figures · interactive Tableau dashboard, G20 fish-import &amp;
                labour intensity
              </div>
              <a
                className="out"
                href="https://github.com/kautum/telling-stories-with-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code &amp; dashboard →
              </a>
            </div>

            <div className="card">
              <p className="card-eyebrow">Solo build · live product</p>
              <h3>The brand didn&apos;t need another chatbot</h3>
              <p>
                Applying for a Junior AI Developer role, I read the brief and realised the brand
                already ran a chatbot — what the JD was actually describing was a content
                pipeline. Built and shipped an AI campaign generator solo in a week: captions,
                hashtags, ad variants, and AI-generated lifestyle imagery sharing one creative
                concept with the copy.
              </p>
              <div className="stat-row">
                Next.js · TypeScript · Groq (gpt-oss-120b) · shipped in 7 days
              </div>
              <a
                className="out"
                href="https://md-creative.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo →
              </a>
            </div>
          </div>

          <div className="also-built">
            <div className="also-built-item">
              <a
                href="https://github.com/kautum/a2a-banking-agents"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="name">a2a-banking-agents</span>
                <p className="desc">
                  Two-agent banking system on Google&apos;s A2A protocol, hybrid BM25 + vector
                  retrieval. Built in one day at Google&apos;s A2A Net Hackathon.
                </p>
              </a>
            </div>
            <div className="also-built-item">
              <a
                href="https://github.com/kautum/rag-chatbot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="name">rag-chatbot</span>
                <p className="desc">
                  Same RAG pipeline, three LLMs swapped in and out, to see which one actually
                  stays grounded in the retrieved text.
                </p>
              </a>
            </div>
            <div className="also-built-item">
              <a
                href="https://github.com/kautum/vision-to-voice"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="name">vision-to-voice</span>
                <p className="desc">
                  Image-to-speech assistive system for visually impaired users, English and
                  Tamil. VIT capstone, IEEE-format paper.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section id="skills">
          <h2 className="section-title">Skills</h2>
          <p className="section-sub">What&apos;s actually behind the work above, not a wishlist.</p>
          <div className="skill-groups">
            <div className="skill-group">
              <h4>Analysis &amp; engineering</h4>
              <div className="chips">
                <span className="chip">SQL</span>
                <span className="chip">Python</span>
                <span className="chip">pandas</span>
                <span className="chip">NumPy</span>
              </div>
            </div>
            <div className="skill-group">
              <h4>Visualisation</h4>
              <div className="chips">
                <span className="chip">Tableau</span>
                <span className="chip">Power BI</span>
                <span className="chip">matplotlib</span>
              </div>
            </div>
            <div className="skill-group">
              <h4>Machine learning</h4>
              <div className="chips">
                <span className="chip">scikit-learn</span>
                <span className="chip">RandomForest</span>
                <span className="chip">evaluation methodology</span>
              </div>
            </div>
          </div>
        </section>

        <footer id="contact">
          <div className="foot-grid">
            <p>
              Kautum Krishnan Panjalaraja — MSc Data Science, King&apos;s College London. Full UK
              right to work without sponsorship until approximately 2029 (Graduate Route).
            </p>
            <div className="foot-links">
              <a href="mailto:kpkautum2643@gmail.com">Email</a>
              <a href="https://github.com/kautum" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
