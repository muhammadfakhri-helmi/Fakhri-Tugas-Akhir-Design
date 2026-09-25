"use client";

import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { forces } from "@/data/story";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { setStory, useStory, type Force } from "@/lib/store";
import { Frame, Step } from "./layout";
import { ChapterHead, ConceptNote, Segmented, StepCard } from "./ui";

const ORDER: Force[] = ["tension", "torque", "drag", "buckling"];

export function ForceGlyph({ force, size = 28 }: { force: Force; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      {force === "tension" && (
        <>
          <path d="M14 25 V4" {...common} />
          <path d="M9 9 L14 4 L19 9" {...common} />
          <path d="M9 16 L14 11 L19 16" {...common} opacity="0.55" />
        </>
      )}
      {force === "torque" && (
        <>
          <path d="M14 4 V24" {...common} opacity="0.45" />
          <path d="M6 14 A8 5 0 1 0 14 9" {...common} />
          <path d="M11 6.5 L14 9 L11 11.5" {...common} />
        </>
      )}
      {force === "drag" && (
        <>
          <path d="M5 22 L23 22" {...common} opacity="0.45" />
          <rect x="9" y="12" width="10" height="7" rx="1.5" {...common} />
          <path d="M22 9 H13 M16 6 L13 9 L16 12" {...common} transform="rotate(180 17.5 9)" />
        </>
      )}
      {force === "buckling" && (
        <>
          <path d="M14 3 C 7 8, 21 12, 14 16 S 7 22, 14 25" {...common} />
          <path d="M10 3 H18 M10 25 H18" {...common} opacity="0.55" />
        </>
      )}
    </svg>
  );
}

function ForceControls({ at }: { at: Force }) {
  const paused = useStory((s) => s.paused);
  const choose = (f: Force) => {
    setStory({ force: f });
    document.getElementById(`force-${f}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented label={`Force (${forces[at].name} step)`} value={at} onChange={choose} options={ORDER.map((f) => ({ value: f, label: forces[f].name }))} />
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setStory({ paused: !paused })}
        className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
      >
        {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        {paused ? "Play" : "Pause"} motion
      </button>
    </div>
  );
}

export function ForcesChapter() {

  return (
    <section id="forces" aria-labelledby="forces-title" className="relative">
      <Step scene="forces" force="tension">
        <StepCard>
          <ChapterHead n="04" name="Four forces" id="forces-title" title="A viable design has to be checked against more than one force." />
          <p className="prose-body mt-4 text-muted">
            The same string, on the same path, is loaded four different ways. Scroll through them, or jump to one.
          </p>
          <div className="mt-5">
            <ForceControls at="tension" />
          </div>
          <ForceBody f="tension" />
        </StepCard>
      </Step>
      {ORDER.slice(1).map((f) => (
        <Step key={f} scene="forces" force={f}>
          <StepCard>
            <ForceControls at={f} />
            <ForceBody f={f} />
          </StepCard>
        </Step>
      ))}

      <div data-scene="criteria" className="flex min-h-[100svh] items-end pb-[6svh] pt-[calc(var(--header-h)+30svh)] md:items-center md:py-[14svh]">
        <Frame>
          <div className="card w-full max-w-[640px] p-5 sm:p-7">
            <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="h3">
              Four forces become four criteria.
            </motion.h3>
            <p className="prose-body mt-2 text-muted">Each design had to pass every check, while drilling and while tripping in and out of the hole.</p>
            <motion.ol variants={staggerParent(0.1)} initial="hidden" whileInView="show" viewport={inView} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ORDER.map((f) => (
                <motion.li key={f} variants={fadeUp} className="rounded-xl border border-line bg-bg-2/70 p-4">
                  <span className="text-force">
                    <ForceGlyph force={f} />
                  </span>
                  <p className="mt-2 font-medium text-ink">{forces[f].name}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{forces[f].check}</p>
                </motion.li>
              ))}
            </motion.ol>
            <ConceptNote className="mt-5" />
          </div>
        </Frame>
      </div>
    </section>
  );
}

function ForceBody({ f }: { f: Force }) {
  const d = forces[f];
  return (
    <div id={`force-${f}`} className="mt-5 border-t border-line pt-5">
      <div className="flex items-center gap-3 text-force">
        <ForceGlyph force={f} />
        <h3 className="h3 text-ink">{d.name}</h3>
      </div>
      <p className="mt-3 font-medium text-ink">{d.lead}</p>
      <p className="prose-body mt-2 text-muted">{d.body}</p>
      <p className="mt-4 rounded-lg border border-line bg-bg-2/70 px-3.5 py-2.5 text-sm">
        <span className="label mr-2 text-flow">Check</span>
        {d.check}
      </p>
      {f === "buckling" && <p className="mt-3 text-sm text-faint">Conceptual shape — not a physical simulation.</p>}
    </div>
  );
}
