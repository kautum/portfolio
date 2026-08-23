"use client";

import ThemeToggle from "./ThemeToggle";

/* Order matches the page. Projects sits ahead of the dissertation because the
   analyst-shaped work should be what a recruiter reaches first. */
const LINKS = [
  { href: "#how", label: "How I work", secondary: true },
  { href: "#story", label: "Story", secondary: true },
  { href: "#projects", label: "Projects", secondary: false },
  { href: "#finding", label: "Research", secondary: true },
  { href: "#work", label: "Work", secondary: false },
  { href: "#skills", label: "Skills", secondary: true },
  { href: "#contact", label: "Contact", secondary: false },
];

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-name" href="#top">
          Kautum Krishnan Panjalaraja
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-secondary={l.secondary || undefined}>
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
