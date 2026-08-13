"use client";

import { useEffect, useState } from "react";

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
          <a href="#about">About</a>
          <a href="#work" data-optional>
            Experience
          </a>
          <a href="#projects">Projects</a>
          <a href="#skills" data-optional>
            Skills
          </a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
