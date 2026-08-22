"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * Scroll-triggered reveal. Fires once, then stops watching, because
 * content that re-animates every time it scrolls past is distracting.
 *
 * The motion is a critically damped spring: it glides in and settles without
 * overshooting. Bounce reads as decoration on a page that is mostly prose.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -60px 0px",
  });
  const reduceMotion = useReducedMotion();

  // motion.create returns a new component type each call, so memoise it or
  // every render remounts the subtree.
  const Motion = useMemo(
    () => motion.create(Tag as React.ElementType),
    [Tag]
  );

  if (reduceMotion) {
    return (
      <Tag ref={ref} className={className || undefined} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Motion
      ref={ref}
      className={className || undefined}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        type: "spring",
        stiffness: 88,
        damping: 20,
        mass: 0.9,
        delay: delay / 1000,
      }}
      {...rest}
    >
      {children}
    </Motion>
  );
}
