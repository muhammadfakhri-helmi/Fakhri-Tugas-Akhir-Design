"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Pause, Play, Menu, X } from "lucide-react";
import { chapters, meta, type ChapterId } from "@/data/story";
import { setStory, useStory, type SceneId } from "@/lib/store";

const sceneToChapter: Record<SceneId, ChapterId> = {
  intro: "question",
  path: "path",
  anatomy: "anatomy",
  forces: "forces",
  criteria: "forces",
  designs: "designs",
  methods: "methods",
  revision: "revision",
  conclusion: "conclusion",
  skills: "skills",
};

export function useActiveChapter() {
  return useStory((s) => sceneToChapter[s.scene]);
}

export function Header() {
  const paused = useStory((s) => s.paused);
  const active = useActiveChapter();
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const current = chapters.find((c) => c.id === active)!;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[60] -translate-y-20 rounded-md bg-flow px-3 py-2 text-sm font-medium text-bg focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1600px] items-center gap-4 px-4 sm:px-6">
          <a href="#question" className="flex min-w-0 items-center gap-3">
            <PathMark />
            <span className="truncate font-[family-name:var(--font-archivo)] text-[0.95rem] font-semibold tracking-tight [font-stretch:108%]">
              {meta.title}
            </span>
          </a>
          <p className="label ml-auto hidden text-muted md:block xl:hidden" aria-live="polite">
            <span className="nums text-flow">{current.n}</span> {current.short}
          </p>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setStory({ paused: !paused })}
            className="ml-auto inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink md:ml-0 xl:ml-auto"
          >
            {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            <span className="max-sm:sr-only">{paused ? "Play motion" : "Pause motion"}</span>
          </button>
          <button
            ref={menuBtn}
            type="button"
            aria-expanded={open}
            aria-controls="chapter-menu"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink xl:hidden"
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            <span className="max-sm:sr-only">Chapters</span>
          </button>
        </div>
        <motion.div aria-hidden="true" className="h-px origin-left bg-flow xl:hidden" style={{ scaleX: progress }} />
        {open && (
          <nav id="chapter-menu" aria-label="Chapters" className="border-t border-line bg-bg/95 px-4 pb-4 pt-2 xl:hidden">
            <ol className="grid gap-1 sm:grid-cols-3">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={c.id === active ? "true" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-3 ${c.id === active ? "bg-bg-2 text-ink" : "text-muted hover:text-ink"}`}
                  >
                    <span className="label nums text-flow">{c.n}</span>
                    {c.short}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </header>
      <PathRail />
    </>
  );
}

function PathMark() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true" className="shrink-0">
      <path d="M3 1 V9 A9 9 0 0 0 6 15 L12 21" fill="none" stroke="var(--flow)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Signature: the well path itself is the chapter rail. It fills as you read.
// ---------------------------------------------------------------------------

const RAIL = {
  d: "M 14 8 L 14 170 A 120 120 0 0 0 21.2 211 L 113.5 464.7",
  // arc-length positions of the nine chapters, 0..1
  stops: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.86, 1],
};

function railPoint(u: number) {
  // piecewise: vertical (162), arc (120 * 0.349 = 41.9), hold (270)
  const L1 = 162, L2 = 120 * 0.349, L3 = 270, L = L1 + L2 + L3;
  const s = u * L;
  if (s <= L1) return { x: 14, y: 8 + s };
  if (s <= L1 + L2) {
    const a = (s - L1) / 120;
    return { x: 134 - 120 * Math.cos(a), y: 170 + 120 * Math.sin(a) };
  }
  const h = s - L1 - L2;
  return { x: 21.2 + h * Math.sin(0.349), y: 211 + h * Math.cos(0.349) };
}

function PathRail() {
  const active = useActiveChapter();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 34, restDelta: 0.001 });
  return (
    <nav aria-label="Chapters" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <svg width="132" height="474" viewBox="0 0 132 474" className="overflow-visible" aria-hidden="true">
        <path d={RAIL.d} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <motion.path d={RAIL.d} fill="none" stroke="var(--flow)" strokeWidth="2.5" style={{ pathLength: fill }} />
      </svg>
      <ol>
        {chapters.map((c, i) => {
          const p = railPoint(RAIL.stops[i]);
          const on = c.id === active;
          return (
            <li key={c.id} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}>
              <a
                href={`#${c.id}`}
                aria-current={on ? "true" : undefined}
                aria-label={`${c.n} ${c.short}`}
                className="group relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full"
              >
                <span
                  className={`block rounded-full border-2 transition-all duration-300 ${
                    on ? "h-3.5 w-3.5 border-flow bg-flow" : "h-2.5 w-2.5 border-line-strong bg-bg group-hover:border-ink"
                  }`}
                />
                <span
                  className={`label pointer-events-none absolute left-8 whitespace-nowrap rounded bg-bg/85 px-1.5 py-0.5 transition-opacity duration-200 ${
                    on ? "text-ink opacity-100" : "text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  <span className="nums text-flow">{c.n}</span> {c.short}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
