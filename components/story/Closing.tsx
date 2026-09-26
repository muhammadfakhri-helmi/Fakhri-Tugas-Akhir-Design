"use client";

import { motion } from "motion/react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { approachChapters, designs, type Checks } from "@/data/story";
import { useDict } from "@/lib/i18n";
import { ease, fadeUp, inView, staggerParent } from "@/lib/motion";
import { REVISED_DP_END, STRING } from "@/components/three/geometry";
import { setStory, useStory, type DesignId } from "@/lib/store";
import { CheckTable } from "./Designs";
import { LangSwitch } from "./Header";
import { Frame, Step } from "./layout";
import { ChapterHead, ConceptNote, Segmented, StatusChip, StepCard } from "./ui";

// ---------------------------------------------------------------------------
// 07 — Revision
// ---------------------------------------------------------------------------

const UNKNOWN: Checks = {
  tension: { hand: "unknown", sim: "unknown" },
  torque: { hand: "unknown", sim: "unknown" },
  drag: { hand: "unknown", sim: "unknown" },
  buckling: { hand: "unknown", sim: "unknown" },
};

export function RevisionChapter() {
  const t = useDict();
  const r = t.revision;
  const target = useStory((s) => s.reviseTarget);
  const revise = useStory((s) => s.revise);
  const d = designs[target];
  const done = revise >= 0.999;
  const midway = revise > 0.02 && !done;
  const checks = done ? d.revised! : midway ? UNKNOWN : d.checks;
  const notes = done ? r.revisedNotes[target] : midway ? undefined : t.designs.notes[target];
  const dpEnd = STRING.dpEnd + (REVISED_DP_END[target] - STRING.dpEnd) * revise;
  const parts = [
    { key: "dp", w: dpEnd, c: "var(--c-dp)" },
    { key: "hwdp", w: STRING.hwdpEnd - dpEnd, c: "var(--c-hwdp)" },
    { key: "bha", w: 1 - STRING.hwdpEnd, c: "var(--c-dc)" },
  ];

  return (
    <section id="revision" aria-labelledby="revision-title">
      <Step scene="revision" tall>
        <StepCard>
          <ChapterHead n="07" name={t.chapters.revision} id="revision-title" title={r.title} />
          <p className="prose-body mt-4 text-muted">{r.p1}</p>
          <p className="prose-body mt-3 text-muted">{r.p2}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Segmented
              label={r.groupLabel}
              value={target}
              onChange={(v: "B" | "C") => setStory({ reviseTarget: v, design: v, revise: 0 })}
              options={(["B", "C"] as const).map((k) => ({ value: k, label: t.designs.designLabel(k) }))}
            />
            {revise > 0 && (
              <button
                type="button"
                onClick={() => setStory({ revise: 0 })}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                <RotateCcw size={14} aria-hidden="true" /> {r.reset}
              </button>
            )}
          </div>

          <label className="mt-5 block">
            <span className="flex justify-between text-sm">
              <span className={revise < 0.5 ? "text-ink" : "text-muted"}>{r.asDesigned}</span>
              <span className={revise >= 0.5 ? "text-ink" : "text-muted"}>{r.revised}</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(revise * 100)}
              onChange={(e) => setStory({ revise: Number(e.target.value) / 100 })}
              className="slider mt-1 text-line-strong"
              aria-label={r.sliderLabel(target)}
              aria-valuetext={done ? r.valueRevised : revise === 0 ? r.valueAsDesigned : r.valueChanging}
            />
          </label>

          {/* conceptual string composition */}
          <div className="mt-3" role="img" aria-label={r.compositionAria(target, done)}>
            <div className="flex h-3 overflow-hidden rounded">
              {parts.map((p) => (
                <motion.div key={p.key} animate={{ flexGrow: p.w }} transition={{ duration: 0.2 }} style={{ flexBasis: 0, background: p.c }} />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-faint">
              <span>{r.bar.surface}</span>
              <span>{r.bar.hwdp}</span>
              <span>{r.bar.bha}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3" aria-live="polite">
            <StatusChip
              status={done ? "pass" : midway ? "unknown" : "review"}
              label={done ? t.status.meetsAfterRevision : midway ? t.status.reevaluating : t.status.needsRevision}
            />
          </div>
          <div className="mt-3">
            <CheckTable checks={checks} notes={notes} caption={r.caption(target, done)} />
          </div>
          {done && <p className="prose-body mt-3 text-sm text-muted">{r.revisedSummary[target]}</p>}
          <ConceptNote className="mt-4" />
          <p className="mt-1 text-sm text-faint">{r.note}</p>
        </StepCard>
      </Step>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 08 — Conclusion
// ---------------------------------------------------------------------------

export function ConclusionChapter() {
  const t = useDict();
  const c = t.conclusion;
  return (
    <section id="conclusion" aria-labelledby="conclusion-title">
      <Step scene="conclusion" tall>
        <StepCard>
          <ChapterHead n="08" name={t.chapters.conclusion} id="conclusion-title" title={c.title} />
          <motion.ul variants={staggerParent(0.1)} initial="hidden" whileInView="show" viewport={inView} className="mt-6 divide-y divide-line border-y border-line">
            {(["A", "B", "C"] as DesignId[]).map((id) => (
              <motion.li key={id} variants={fadeUp} className="flex items-start gap-4 py-4">
                <span className="font-[family-name:var(--font-archivo)] text-3xl font-bold leading-none [font-stretch:115%]">{id}</span>
                <div>
                  <StatusChip status="pass" label={c.rows[id].label} small />
                  <p className="mt-1.5 text-sm text-muted">{c.rows[id].body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <p className="prose-body mt-5 text-muted">{c.body}</p>
          <a
            href="#forces"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-ink transition-colors duration-200 hover:border-ink"
          >
            {c.seeMethod}
          </a>
          <div className="mt-7 border-t border-line pt-5">
            <h3 className="label text-flow">{c.nextTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {c.nextTests.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-faint" />
                  {item}
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
  const t = useDict();
  return (
    <section id="skills" data-scene="skills" aria-labelledby="skills-title" className="relative min-h-[100svh] py-[14svh]">
      <Frame className="grid items-center gap-10 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="card p-5 sm:p-7">
          <ChapterHead n="09" name={t.chapters.skills} id="skills-title" title={t.skills.title} />
          <p className="prose-body mt-4 text-muted">{t.skills.body}</p>
        </div>
        <ProcessRing />
      </Frame>
    </section>
  );
}

function ProcessRing() {
  const t = useDict();
  const steps = t.skills.steps;
  const n = steps.length;
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
      {steps.map((a, i) => {
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
            <a href={`#${approachChapters[i]}`} className="card block p-4 transition-colors duration-200 hover:border-line-strong">
              <span className="label nums text-flow">{t.skills.stepLabel(i + 1)}</span>
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
  const t = useDict();
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <Frame className="grid gap-8 py-14 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-[62ch] space-y-3 text-sm text-muted">
          <p className="text-ink">
            {t.meta.title} — {t.meta.author}
          </p>
          <p>
            {t.meta.framing}. {t.footer.summary}
          </p>
          <p>{t.footer.disclaimer}</p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <a
            href="#question"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-ink transition-colors duration-200 hover:border-ink"
          >
            <ArrowUp size={16} aria-hidden="true" /> {t.ui.backToTop}
          </a>
          <LangSwitch />
          <p className="label text-faint">{t.ui.builtWith}</p>
        </div>
      </Frame>
    </footer>
  );
}
