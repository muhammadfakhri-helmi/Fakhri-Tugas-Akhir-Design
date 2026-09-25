"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { CONCEPT_LABEL, statusText, type Status } from "@/data/story";

/** Chapter heading block: number + short name as eyebrow, then the headline. */
export function ChapterHead({ n, name, title, id }: { n: string; name: string; title: string; id?: string }) {
  return (
    <motion.header variants={staggerParent()} initial="hidden" whileInView="show" viewport={inView}>
      <motion.p variants={fadeUp} className="label text-flow">
        <span className="nums">{n}</span> <span aria-hidden="true">·</span> {name}
      </motion.p>
      <motion.h2 id={id} variants={fadeUp} className="h2 mt-3">
        {title}
      </motion.h2>
    </motion.header>
  );
}

/** A narrative card that floats over the 3D stage. One card per scroll step. */
export function StepCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={`card p-5 sm:p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function ConceptNote({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "paper" }) {
  return (
    <p className={`label flex items-center gap-2 ${tone === "paper" ? "text-paper-muted" : "text-faint"} ${className}`}>
      <span aria-hidden="true" className={`inline-block h-2 w-2 rotate-45 border ${tone === "paper" ? "border-paper-muted" : "border-faint"}`} />
      {CONCEPT_LABEL}
    </p>
  );
}

const dot: Record<Status, string> = {
  pass: "bg-pass",
  review: "bg-review",
  exceed: "bg-exceed",
  unknown: "bg-unknown",
};
const ring: Record<Status, string> = {
  pass: "border-pass/60 text-pass",
  review: "border-review/60 text-review",
  exceed: "border-exceed/60 text-exceed",
  unknown: "border-unknown/60 text-muted",
};

/** Status never relies on colour alone: every chip carries its words. */
export function StatusChip({ status, label, small = false }: { status: Status; label?: string; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${ring[status]} ${small ? "px-2 py-0.5 text-[0.72rem]" : "px-3 py-1 text-sm"}`}>
      <StatusGlyph status={status} />
      {label ?? statusText[status]}
    </span>
  );
}

/** Shape + colour: circle = pass, triangle = review, cross = exceeds, dash = unknown. */
export function StatusGlyph({ status, size = 10 }: { status: Status; size?: number }) {
  const s = size;
  if (status === "pass") return <span aria-hidden="true" className={`inline-block rounded-full ${dot.pass}`} style={{ width: s, height: s }} />;
  if (status === "unknown") return <span aria-hidden="true" className="inline-block bg-unknown" style={{ width: s, height: 2 }} />;
  if (status === "review")
    return (
      <svg aria-hidden="true" width={s + 2} height={s + 2} viewBox="0 0 12 12">
        <path d="M6 1 L11 11 L1 11 Z" fill="var(--review)" />
      </svg>
    );
  return (
    <svg aria-hidden="true" width={s + 2} height={s + 2} viewBox="0 0 12 12">
      <path d="M2 2 L10 10 M10 2 L2 10" stroke="var(--exceed)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Segmented control built on radio semantics (arrow keys move, Tab leaves). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  tone = "dark",
}: {
  label: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  tone?: "dark" | "paper";
}) {
  const move = (dir: number) => {
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + dir + options.length) % options.length];
    onChange(next.value);
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-seg="${label}"][data-val="${next.value}"]`)?.focus();
    });
  };
  const paper = tone === "paper";
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex flex-wrap gap-1 rounded-xl border p-1 ${paper ? "border-paper-line bg-paper-2/60" : "border-line bg-bg-2/80"}`}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            data-seg={label}
            data-val={o.value}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(-1);
              }
            }}
            className={`relative min-h-11 cursor-pointer rounded-lg px-3.5 text-sm font-medium transition-colors duration-200 ${
              paper
                ? on
                  ? "text-paper"
                  : "text-paper-muted hover:text-paper-ink"
                : on
                  ? "text-bg"
                  : "text-muted hover:text-ink"
            }`}
          >
            {on && (
              <motion.span
                layoutId={`seg-${label}`}
                className={`absolute inset-0 rounded-lg ${paper ? "bg-paper-ink" : "bg-flow"}`}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
