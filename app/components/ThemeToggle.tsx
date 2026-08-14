"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light is the default, not the system preference. The stored choice is
 * applied by an inline script in the document head before first paint, so
 * this component only has to read what is already there.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "light";
    setTheme(current);
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private browsing, or storage disabled. The toggle still works for
      // this visit, it just will not be remembered.
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={flip}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Dark mode"
      title={theme === "light" ? "Switch to dark" : "Switch to light"}
    >
      <span className="theme-knob" />
      <span className="theme-label">{theme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
