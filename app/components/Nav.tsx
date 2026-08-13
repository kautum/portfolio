"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#story", label: "Story", optional: false },
  { href: "#finding", label: "Research", optional: true },
  { href: "#work", label: "Work", optional: false },
  { href: "#projects", label: "Projects", optional: false },
  { href: "#skills", label: "Skills", optional: true },
  { href: "#contact", label: "Contact", optional: false },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="nav-name" href="#top">
          Kautum Krishnan
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-optional={l.optional || undefined}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
