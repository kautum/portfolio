"use client";

/**
 * Last line of defence. If something throws that no local boundary caught,
 * this replaces the page rather than leaving a white screen. It carries the
 * contact details, because the one job this site absolutely has to do is tell
 * a recruiter who Kautum is and how to reach him.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="wrap" style={{ paddingTop: 90, paddingBottom: 90, maxWidth: 640 }}>
      <p className="meta">Something on this page broke</p>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)", marginBottom: 20 }}>
        Kautum Krishnan Panjalaraja
      </h1>
      <p className="lead" style={{ marginBottom: 28 }}>
        Data analyst in London. Available from August 2026, with the right to work in the UK
        without sponsorship until around 2029.
      </p>
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
        <button className="btn" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
