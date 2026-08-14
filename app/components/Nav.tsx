"use client";

import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#story", label: "Story", secondary: true },
  { href: "#finding", label: "Research", secondary: true },
  { href: "#work", label: "Work", secondary: false },
  { href: "#projects", label: "Projects", secondary: false },
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
