"use client";

import { motion } from "motion/react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { approach, designs, meta, nextTests, type Status } from "@/data/story";
import { ease, fadeUp, inView, staggerParent } from "@/lib/motion";
import { REVISED_DP_END, STRING } from "@/components/three/geometry";
import { setStory, useStory } from "@/lib/store";
import { CheckTable } from "./Designs";
import { Frame, Step } from "./layout";
import { ChapterHead, ConceptNote, Segmented, StatusChip, StepCard } from "./ui";

// ---------------------------------------------------------------------------
// 07 — Revision
// ---------------------------------------------------------------------------

export function RevisionChapter() {
  const target = useStory((s) => s.reviseTarget);
  const revise = useStory((s) => s.revise);
  const d = designs[target];
  const done = revise >= 0.999;
  const midway = revise > 0.02 && !done;
  const checks = done
    ? d.revised!.checks
    : midway
      ? (Object.fromEntries(Object.keys(d.checks).map((k) => [k, { hand: "unknown" as Status, sim: "unknown" as Status, note: "" }])) as typeof d.checks)
      : d.checks;
  const dpEnd = STRING.dpEnd + (REVISED_DP_END[target] - STRING.dpEnd) * revise;
  const parts = [
    { name: "Drillpipe", w: dpEnd, c: "var(--c-dp)" },
    { name: "Heavy-weight", w: STRING.hwdpEnd - dpEnd, c: "var(--c-hwdp)" },
    { name: "Collars · BHA", w: 1 - STRING.hwdpEnd, c: "var(--c-dc)" },
  ];

  return (
    <section id="revision" aria-labelledby="revision-title">
      <Step scene="revision" tall>
        <StepCard>
          <ChapterHead n="07" name="Revision" id="revision-title" title="When a design missed the criteria, I changed the arrangement and tested it again." />
          <p className="prose-body mt-4 text-muted">
            The limits of B and C could not change, so the load had to. Shortening the heavy-weight drillpipe and extending the drillpipe by the same
            length keeps the string&apos;s reach but hangs less weight below its weakest point, near the surface.
          </p>
          <p className="prose-body mt-3 text-muted">
            Heavy-weight pipe was the lever, not the collars: collars stiffen the bottom of the string; heavy-weight pipe is flexible weight. Less weight
            also means less push when running in, so drag and buckling were re-checked after every change.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Segmented
              label="Design to revise"
              value={target}
              onChange={(v: "B" | "C") => setStory({ reviseTarget: v, design: v, revise: 0 })}
              options={[
                { value: "B", label: "Design B" },
                { value: "C", label: "Design C" },
              ]}
            />
            {revise > 0 && (
              <button
                type="button"
                onClick={() => setStory({ revise: 0 })}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                <RotateCcw size={14} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          <label className="mt-5 block">
            <span className="flex justify-between text-sm">
              <span className={revise < 0.5 ? "text-ink" : "text-muted"}>As designed</span>
              <span className={revise >= 0.5 ? "text-ink" : "text-muted"}>Revised</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(revise * 100)}
              onChange={(e) => setStory({ revise: Number(e.target.value) / 100 })}
              className="slider mt-1 text-line-strong"
              aria-label={`Scrub the arrangement of design ${target} from as designed to revised`}
              aria-valuetext={done ? "Revised arrangement" : revise === 0 ? "As designed" : "Changing the arrangement"}
            />
          </label>

          {/* conceptual string composition */}
          <div className="mt-3" role="img" aria-label={`String composition of design ${target}: drillpipe section ${done ? "longer" : "as designed"}, heavy-weight section ${done ? "shorter" : "as designed"}`}>
            <div className="flex h-3 overflow-hidden rounded">
              {parts.map((p) => (
                <motion.div key={p.name} animate={{ flexGrow: p.w }} transition={{ duration: 0.2 }} style={{ flexBasis: 0, background: p.c }} />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-faint">
              <span>Surface · drillpipe</span>
              <span>heavy-weight</span>
              <span>BHA · bit</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3" aria-live="polite">
            <StatusChip status={done ? "pass" : midway ? "unknown" : "review"} label={done ? "Meets study criteria after revision" : midway ? "Re-evaluating both methods" : "Needs revision"} />
          </div>
          <div className="mt-3">
            <CheckTable checks={checks} caption={`Design ${target}: checks ${done ? "after" : "before"} revision`} />
          </div>
          {done && <p className="prose-body mt-3 text-sm text-muted">{d.revised!.summary}</p>}
          <ConceptNote className="mt-4" />
          <p className="mt-1 text-sm text-faint">A conceptual reconstruction of the study&apos;s conclusion — the real lengths changed are not shown.</p>
        </StepCard>
      </Step>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 08 — Conclusion
// ---------------------------------------------------------------------------

export function ConclusionChapter() {
  const rows = [
    { id: "A", label: "Recommended in the initial study", body: "Met all four checks in both methods." },
    { id: "B", label: "Meets study criteria after revision", body: "Heavy-weight section shortened, drillpipe extended." },
    { id: "C", label: "Meets study criteria after revision", body: "Needed a larger shift than B." },
  ];
  return (
    <section id="conclusion" aria-labelledby="conclusion-title">
      <Step scene="conclusion" tall>
        <StepCard>
          <ChapterHead n="08" name="Conclusion" id="conclusion-title" title="The outcome was not a single number. It was a reasoned design decision, checked through two methods." />
          <motion.ul variants={staggerParent(0.1)} initial="hidden" whileInView="show" viewport={inView} className="mt-6 divide-y divide-line border-y border-line">
            {rows.map((r) => (
              <motion.li key={r.id} variants={fadeUp} className="flex items-start gap-4 py-4">
                <span className="font-[family-name:var(--font-archivo)] text-3xl font-bold leading-none [font-stretch:115%]">{r.id}</span>
                <div>
                  <StatusChip status="pass" label={r.label} small />
                  <p className="mt-1.5 text-sm text-muted">{r.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <p className="prose-body mt-5 text-muted">
            Hand calculation and simulation did not always give the same number — close for torque, far apart for tension. The evaluation therefore never
            rested on one method alone.
          </p>
          <a
            href="#forces"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-ink transition-colors duration-200 hover:border-ink"
          >
            See the method
          </a>
          <div className="mt-7 border-t border-line pt-5">
            <h3 className="label text-flow">What I would test next</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {nextTests.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-faint" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </StepCard>
      </Step>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 09 — Approach
// ---------------------------------------------------------------------------

export function SkillsChapter() {
  return (
    <section id="skills" data-scene="skills" aria-labelledby="skills-title" className="relative min-h-[100svh] py-[14svh]">
      <Frame className="grid items-center gap-10 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="card p-5 sm:p-7">
          <ChapterHead n="09" name="Approach" id="skills-title" title="Test assumptions, compare evidence, and make the reasoning visible." />
          <p className="prose-body mt-4 text-muted">
            This research shaped how I approach engineering problems. The same six steps carry over to any design question where the answer has to be
            defended, not just calculated.
          </p>
        </div>
        <ProcessRing />
      </Frame>
    </section>
  );
}

function ProcessRing() {
  const n = approach.length;
  return (
    <motion.ol
      variants={staggerParent(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="relative grid gap-3 sm:grid-cols-2 lg:mx-auto lg:block lg:aspect-[4/5] lg:w-full lg:max-w-[520px]"
    >
      <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-[9%] hidden lg:block">
        <motion.circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--flow)"
          strokeWidth="0.35"
          strokeDasharray="0.8 1.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={inView}
          transition={{ duration: 1.6, ease: ease.inOut }}
        />
      </svg>
      {approach.map((a, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = 50 + Math.cos(ang) * 41;
        const y = 50 + Math.sin(ang) * 41;
        return (
          <motion.li
            key={a.step}
            variants={fadeUp}
            className="lg:absolute lg:w-[42%] lg:-translate-x-1/2 lg:-translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <a
              href={`#${a.chapter}`}
              className="card block p-4 transition-colors duration-200 hover:border-line-strong"
            >
              <span className="label nums text-flow">Step {i + 1}</span>
              <span className="mt-1 block font-medium text-ink">{a.step}</span>
              <span className="mt-0.5 block text-sm text-muted">{a.body}</span>
            </a>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <Frame className="grid gap-8 py-14 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-[62ch] space-y-3 text-sm text-muted">
          <p className="text-ink">
            {meta.title} — {meta.author}
          </p>
          <p>
            {meta.framing}. The study compared three drillstring designs for a build-and-hold well by load-mechanics hand calculation and by WellPlan®
            simulation, and revised the designs that missed the study criteria.
          </p>
          <p>
            The well path, 3D models, curves, bars and indicators on this page are original conceptual illustrations. Study outcomes are summarised from
            the project&apos;s own conclusions; no well data, report pages, tables, charts or software output are reproduced. WellPlan® is a trademark of its
            owner and is named only as the simulation tool used.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <a
            href="#question"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-ink transition-colors duration-200 hover:border-ink"
          >
            <ArrowUp size={16} aria-hidden="true" /> Back to top
          </a>
          <p className="label text-faint">Built with Next.js, React Three Fiber and Motion</p>
        </div>
      </Frame>
    </footer>
  );
}
