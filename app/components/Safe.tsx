"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps a decorative failure decorative.
 *
 * The drawn charts are the riskiest thing on this page: rough.js, SVG
 * measurement APIs and getComputedStyle all behave differently across
 * browsers, and an uncaught throw inside one of them would blank the entire
 * document. This is a CV. It has to survive a browser it has never met.
 *
 * Anything wrapped here falls back to the prose it was illustrating, which is
 * already on the page, so nothing is lost but the picture.
 */
export default class Safe extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("A drawing failed and was skipped:", error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
