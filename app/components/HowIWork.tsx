"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import "../how-i-work.css";

/** Matches --ease-out in globals.css: a settle, never a bounce or overshoot. */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Scroll-in reveal for this section only. The rest of the site uses
 * Reveal.tsx (CSS + IntersectionObserver); this one is built on Motion
 * directly, gated on useReducedMotion(), because that is what was asked for
 * here rather than the site-wide helper.
 */
function RiseIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay / 1000, ease: EASE_OUT },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

const SCAN: { stat: string; label: string; colour: string }[] = [
  {
    stat: "0.90 → 0.61",
    label: "The macro-F1 once attacker machines the model had never seen replace random splits, and the ranking of models reverses with it.",
    colour: "--c1",
  },
  {
    stat: "3 for 3",
    label: "LLMs tested as classifier, synthetic data generator and next-packet predictor. Lost all three roles, reported all three.",
    colour: "--c2",
  },
  {
    stat: "1 week, solo",
    label: "Read a job posting as a content problem instead of a chatbot one, then built and shipped the product it actually described.",
    colour: "--c3",
  },
  {
    stat: "1 bypass, closed",
    label: "Found and fixed an authentication bypass in a codebase I had never opened before that week.",
    colour: "--c4",
  },
];

const EVIDENCE: { meta: string; title: string; body: string; colour: string }[] = [
  {
    meta: "MSc dissertation, submitted 6 August",
    title: "An evaluation flaw that flips the leaderboard",
    body: "Random train/test splits let intrusion-detection models fingerprint the attacker's machine instead of the attack, which is why the field's usual near-98% detection scores look so convincing. Testing on attacker machines the model had never seen drops the easy macro-F1 of 0.9002 to an honest pooled 0.6059, and reverses which model wins. I tested large language models in three separate roles, as classifier, as synthetic data generator and as next-packet predictor, and they lost all three. I reported that as a finding rather than leaving it out.",
    colour: "--c1",
  },
  {
    meta: "Google A2A Net Hackathon, one day",
    title: "Two agents, one banking conversation",
    body: "A two-agent customer service system built on Google's A2A protocol. Retrieval runs keyword search first across a 698-document knowledge base, and only pays for the more expensive embedding call when keyword search comes up short.",
    colour: "--c2",
  },
  {
    meta: "A job application, one week, solo",
    title: "Built the product the posting was actually describing",
    body: "A haircare brand advertised for a junior AI developer and described AI woven into paid content and product ranges. Everyone applying was going to build a chatbot; the brand already ran one. I built the campaign generator instead, and it is still live.",
    colour: "--c3",
  },
  {
    meta: "A codebase I had never opened",
    title: "Documented it, then closed an authentication bypass",
    body: "Forked a research tool built at King's, got it running from a clean clone, and wrote the documentation it was missing. The most serious defect I found and fixed was an authentication bypass: the framework registered every callback globally, so anyone who knew the component IDs could run the whole pipeline without logging in.",
    colour: "--c4",
  },
];

/**
 * Who and how, in one place. Renders content only, no outer <section> or
 * .wrap, so it can be dropped inside an existing section/wrap pair the same
 * way TechLogos and Filmstrip are.
 */
export default function HowIWork() {
  return (
    <div className="hiw-root">
      <RiseIn className="hiw-head">
        <p className="hiw-eyebrow">Who I am, and how I work</p>
        <h2>Analyst on the application. Scientist and engineer in practice.</h2>
        <p className="hiw-position">
          Data analyst is the role I am applying for, and I want it: the job is working out what
          a number really says and being able to defend the answer to someone who did not do the
          analysis. What I bring on top of it is how I got here. I came into this through machine
          learning and building AI systems, so I tend to ask what would have to be true for a
          result to hold, and then go and check.
        </p>
      </RiseIn>

      <div className="hiw-scan-grid">
        {SCAN.map((item, i) => (
          <RiseIn key={item.stat} delay={40 + i * 40} className="hiw-scan-item">
            <div className="hiw-scan-rule" style={{ background: `var(${item.colour})` }} />
            <p className="hiw-scan-number">{item.stat}</p>
            <p className="hiw-scan-label">{item.label}</p>
          </RiseIn>
        ))}
      </div>

      <RiseIn className="hiw-method">
        <h3>The method, not just the tool</h3>
        <p className="hiw-method-body">
          Before a model touches anything, I build it a structured knowledge base: what is true,
          where each fact came from, and which file to open when it is not sure. I keep one for my
          dissertation, one for my job search, and one for this site, and each one gets read
          before the model writes a line.
        </p>
        <p className="hiw-method-body">
          In practice that means Claude Code with a plugin set I have tuned myself, MCP servers
          for the tools I reach for often, and a written brief committed alongside the code, so
          that anyone joining the project, human or machine, starts from an accurate picture
          instead of guessing from whichever file they opened first.
        </p>
        <p className="hiw-method-line">
          Writing the code is rarely the slow part. Deciding what to build, checking whether the
          result is actually true, and being able to show your working are the slow parts.
        </p>
      </RiseIn>

      <RiseIn className="hiw-evidence">
        <h3>What that looks like when it is not a dashboard</h3>
        <div className="hiw-evidence-grid">
          {EVIDENCE.map((card) => (
            <div
              className="hiw-evidence-card"
              key={card.title}
              style={{ borderLeftColor: `var(${card.colour})` }}
            >
              <p className="hiw-evidence-meta">{card.meta}</p>
              <h3 className="hiw-evidence-title">{card.title}</h3>
              <p className="hiw-evidence-body">{card.body}</p>
            </div>
          ))}
        </div>
      </RiseIn>

      <RiseIn delay={40}>
        <p className="hiw-close">
          None of this makes me a senior data scientist. It is why analyst is the role I am
          applying for, and why the questions I ask once I am in the door will not stop at the
          dashboard.
        </p>
      </RiseIn>
    </div>
  );
}
