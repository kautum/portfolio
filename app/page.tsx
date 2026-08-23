import Hero3D from "./components/Hero3D";
import TechLogos from "./components/TechLogos";
import {
  SlopeReversal,
  StocksArea,
  HostGrid,
  BigMetric,
} from "./components/DataViz";

/* Minimal text by design. Every section is a label, a figure and a way out
   to the real work. The detail lives in the repos, not on this page. */

const WORK = [
  {
    id: "01",
    label: "SQL",
    title: "1.86M UK housing sales",
    line: "DuckDB star schema. Joins, chained CTEs, window functions.",
    href: "https://github.com/kautum/uk-housing-sql",
    cta: "Queries and findings",
  },
  {
    id: "02",
    label: "Shipped",
    title: "md creative",
    line: "Read the brief as a content problem. Built it solo in a week.",
    href: "https://md-creative.vercel.app",
    cta: "Live product",
    shot: "/md-creative-shot.png",
  },
  {
    id: "03",
    label: "Research",
    title: "The evaluation leak",
    line: "The field was testing the easy way. The honest score is a third lower.",
    href: "https://github.com/kautum/msc-cyberattack-detection-llm",
    cta: "Report and notebooks",
  },
  {
    id: "04",
    label: "Visualisation",
    title: "The global seafood system",
    line: "13 datasets into one pipeline, built for a first-time reader.",
    href: "https://github.com/kautum/telling-stories-with-data",
    cta: "Figures and data",
  },
];

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* ---------------- hero ---------------- */}
      <Hero3D>
        <div className="container hero-copy">
          <p className="eyebrow">Data analyst / London</p>
          <h1 className="display-hero">
            KAUTUM
            <br />
            KRISHNAN
          </h1>
          <p className="text-body hero-line">
            SQL, Python, and a habit of checking.
          </p>
          <div className="cluster hero-actions">
            <a className="btn btn-primary" href="#work">
              See the work
            </a>
            <a
              className="btn btn-ghost"
              href="/kautum-krishnan-panjalaraja-cv.pdf"
              download
            >
              CV
            </a>
          </div>
        </div>
      </Hero3D>

      {/* ---------------- metrics ---------------- */}
      <section className="section" id="metrics" aria-label="Key figures">
        <div className="container">
          <div className="metric-row">
            <BigMetric value={1.86} decimals={2} suffix="M" label="Rows analysed in SQL" glow />
            <BigMetric value={0.61} decimals={2} label="Honest macro-F1, from 0.90" />
            <BigMetric value={8} label="Of 9 attackers caught, 0 false alarms" />
            <BigMetric value={25.3} decimals={1} suffix="%" label="New build price premium" />
          </div>
        </div>
      </section>

      {/* ---------------- work ---------------- */}
      <section className="section" id="work">
        <div className="container">
          <p className="eyebrow">[ Selected work ]</p>
          <div className="work-grid">
            {WORK.map((w) => (
              <article className="panel work-card" key={w.id}>
                <div className="work-head">
                  <span className="text-micro ink-subtle tabular-nums">{w.id}</span>
                  <span className="chip">{w.label}</span>
                </div>
                <h2 className="display-sm">{w.title}</h2>
                <p className="text-body-sm ink-muted">{w.line}</p>
                {w.shot ? (
                  <img
                    className="work-shot"
                    src={w.shot}
                    alt="The md creative generator running"
                    width={1600}
                    height={801}
                    loading="lazy"
                  />
                ) : null}
                <a
                  className="btn btn-secondary work-cta"
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {w.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- the charts ---------------- */}
      <section className="section" id="data">
        <div className="container">
          <p className="eyebrow">[ The finding ]</p>
          <h2 className="display-md">The winner changes when the test gets honest.</h2>
          <SlopeReversal />
          <div className="divider" />
          <SlopeCaptionless />
          <StocksArea />
          <div className="divider" />
          <HostGrid />
        </div>
      </section>

      {/* ---------------- stack ---------------- */}
      <section className="section" id="stack">
        <div className="container">
          <p className="eyebrow">[ Stack ]</p>
        </div>
        <TechLogos />
      </section>

      {/* ---------------- education ---------------- */}
      <section className="section" id="education">
        <div className="container">
          <p className="eyebrow">[ Trained ]</p>
          <dl className="edu-grid">
            <div className="panel edu-item">
              <dt className="display-sm">King&apos;s College London</dt>
              <dd className="text-meta ink-subtle">2025 &ndash; 2026</dd>
              <dd className="text-body-sm ink-muted">MSc Data Science</dd>
            </div>
            <div className="panel edu-item">
              <dt className="display-sm">Vellore Institute of Technology</dt>
              <dd className="text-meta ink-subtle">2021 &ndash; 2025</dd>
              <dd className="text-body-sm ink-muted">
                BTech Computer Science. CGPA 8.21 of 10.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------------- contact ---------------- */}
      <section className="section" id="contact">
        <div className="container">
          <p className="eyebrow">[ Contact ]</p>
          <h2 className="display-lg glow-text">Say hello.</h2>
          <p className="text-body ink-muted contact-line">
            Data analyst roles in London, available on course completion.
            Graduate Route right to work, no sponsorship needed.
          </p>
          <div className="cluster">
            <a className="btn btn-primary" href="mailto:kpkautum2643@gmail.com">
              kpkautum2643@gmail.com
            </a>
            <a
              className="btn btn-ghost"
              href="https://www.linkedin.com/in/kautum-krishnan-panjalaraja-4b81b4251/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn btn-ghost"
              href="https://github.com/kautum"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn btn-ghost"
              href="/kautum-krishnan-panjalaraja-cv.pdf"
              download
            >
              Download CV
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* Spacer so the two charts in the finding section are not glued together. */
function SlopeCaptionless() {
  return <div className="chart-gap" aria-hidden="true" />;
}
