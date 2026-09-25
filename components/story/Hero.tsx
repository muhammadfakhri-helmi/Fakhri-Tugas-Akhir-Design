"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { chapters, meta } from "@/data/story";
import { duration, ease, stagger } from "@/lib/motion";
import { Frame } from "./layout";

const QUESTION = "How do you know a drillstring can survive the path it must follow?".split(" ");

export function Hero() {
  return (
    <section
      id="question"
      data-scene="intro"
      aria-labelledby="question-title"
      className="relative flex min-h-[100svh] items-end pb-[8svh] pt-[calc(var(--header-h)+36svh)] md:items-center md:pt-[var(--header-h)] md:pb-0"
    >
      <Frame>
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: stagger.base, delayChildren: 0.15 } } }} className="max-w-[780px]">
          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.reveal } } }}
            className="label text-flow"
          >
            {meta.framing}
          </motion.p>
          <h1 id="question-title" className="display mt-5">
            {QUESTION.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { y: "105%" }, show: { y: 0, transition: { duration: 0.85, ease: ease.emphasized, delay: i * 0.035 } } }}
                >
                  {word}
                </motion.span>
                {i < QUESTION.length - 1 && " "}
              </span>
            ))}
          </h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } } }}
            className="prose-body mt-6 text-lg text-muted"
          >
            An interactive case study in drillstring design, mechanical loads, and validation — by {meta.author}.
          </motion.p>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } } }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#path"
              className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-flow px-5 font-medium text-bg transition-colors duration-200 hover:bg-[#7ad9e7]"
            >
              Explore the analysis
              <ArrowDown size={17} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
            <a href="#conclusion" className="inline-flex min-h-12 cursor-pointer items-center rounded-xl border border-line-strong px-5 text-ink transition-colors duration-200 hover:border-ink">
              Skip to the conclusion
            </a>
          </motion.div>
          <motion.nav
            aria-label="Chapter index"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.reveal } } }}
            className="mt-10 hidden md:block"
          >
            <ol className="flex flex-wrap gap-x-5 gap-y-2">
              {chapters.slice(1).map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="label inline-flex min-h-6 items-center gap-1.5 text-muted transition-colors duration-200 hover:text-ink">
                    <span className="nums text-flow">{c.n}</span>
                    {c.short}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        </motion.div>
      </Frame>
    </section>
  );
}
