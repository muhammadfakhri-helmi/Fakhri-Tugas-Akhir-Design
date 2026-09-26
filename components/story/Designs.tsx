"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { designs, marginConcept, type Checks, type Status } from "@/data/story";
import { useDict } from "@/lib/i18n";
import { duration, ease } from "@/lib/motion";
import { setStory, useStory, type DesignId, type Force } from "@/lib/store";
import { Step } from "./layout";
import { ChapterHead, ConceptNote, Segmented, StatusChip, StatusGlyph, StepCard } from "./ui";

const ORDER: Force[] = ["tension", "torque", "drag", "buckling"];

export function CheckTable({ checks, notes, caption }: { checks: Checks; notes?: Record<Force, string>; caption: string }) {
  const t = useDict();
  return (
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="label text-faint">
          <th scope="col" className="py-2 pr-2 text-left font-normal">{t.designs.table.check}</th>
          <th scope="col" className="px-2 py-2 text-left font-normal">{t.designs.table.hand}</th>
          <th scope="col" className="py-2 pl-2 text-left font-normal">{t.designs.table.sim}</th>
        </tr>
      </thead>
      <tbody>
        {ORDER.map((f) => (
          <tr key={f} className="border-t border-line align-top" title={notes?.[f]}>
            <th scope="row" className="py-2.5 pr-2 text-left font-medium text-ink">
              {t.forces.items[f].name}
            </th>
            <td className="px-2 py-2.5">
              <Cell s={checks[f].hand} />
            </td>
            <td className="py-2.5 pl-2">
              <Cell s={checks[f].sim} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cell({ s }: { s: Status }) {
  const t = useDict();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={s}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0, transition: { duration: duration.ui, ease: ease.out } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
        className="inline-flex items-center gap-2 text-muted"
      >
        <StatusGlyph status={s} />
        {t.status[s]}
      </motion.span>
    </AnimatePresence>
  );
}

/** Conceptual load-vs-limit bars: the load stays put, the limit moves. */
function MarginChart({ design }: { design: DesignId }) {
  const t = useDict();
  const rows: ("tension" | "torque")[] = ["tension", "torque"];
  return (
    <figure className="mt-5">
      <figcaption className="text-sm text-muted">{t.designs.margin.caption}</figcaption>
      <div className="mt-3 space-y-3">
        {rows.map((r) => {
          const { load, limit } = marginConcept[r];
          const lim = limit[design];
          const threshold = lim * 0.9;
          const status: Status = load > lim ? "exceed" : load > threshold ? "review" : "pass";
          const barColor = status === "pass" ? "var(--pass)" : status === "review" ? "var(--review)" : "var(--exceed)";
          const name = t.forces.items[r].name;
          return (
            <div key={r}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-ink">{name}</span>
                <span className="label text-faint">{t.designs.margin.method}</span>
              </div>
              <div className="relative mt-1.5 h-5 rounded bg-bg-2" role="img" aria-label={t.designs.margin.aria(name, t.status[status])}>
                <motion.div
                  className="absolute inset-y-0 rounded-r"
                  style={{ background: "repeating-linear-gradient(135deg, rgba(240,178,74,.16) 0 4px, transparent 4px 8px)" }}
                  animate={{ left: `${threshold * 100}%`, width: `${(lim - threshold) * 100}%` }}
                  transition={{ duration: 0.6, ease: ease.out }}
                />
                <motion.div
                  className="absolute inset-y-1 left-0 rounded-sm"
                  animate={{ width: `${load * 100}%`, backgroundColor: barColor }}
                  transition={{ duration: 0.6, ease: ease.out }}
                />
                <motion.div
                  className="absolute -inset-y-1 w-0.5 bg-force"
                  animate={{ left: `${lim * 100}%` }}
                  transition={{ duration: 0.6, ease: ease.out }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export function DesignsChapter() {
  const t = useDict();
  const design = useStory((s) => s.design);
  const d = designs[design];
  const choose = (v: DesignId) => setStory(v === "A" ? { design: v } : { design: v, reviseTarget: v, revise: 0 });
  return (
    <section id="designs" aria-labelledby="designs-title">
      <Step scene="designs" tall>
        <StepCard>
          <ChapterHead n="05" name={t.chapters.designs} id="designs-title" title={t.designs.title} />
          <p className="prose-body mt-4 text-muted">{t.designs.intro}</p>
          <div className="mt-6">
            <Segmented
              label={t.designs.groupLabel}
              value={design}
              onChange={choose}
              options={(["A", "B", "C"] as DesignId[]).map((k) => ({ value: k, label: t.designs.designLabel(k) }))}
            />
          </div>
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={design}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: duration.ui, ease: ease.out } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="mt-5"
              >
                <StatusChip status={d.overall} label={d.overall === "pass" ? t.status.pass : t.status.needsRevision} />
                <p className="prose-body mt-3 text-muted">{t.designs.summary[design]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4">
            <CheckTable checks={d.checks} notes={t.designs.notes[design]} caption={t.designs.table.caption(design)} />
          </div>
          <MarginChart design={design} />
          <ConceptNote className="mt-4" />
          <p className="mt-1 text-sm text-faint">{t.designs.statusNote}</p>
          {design !== "A" && (
            <a href="#methods" className="mt-5 inline-block py-2.5 font-medium text-flow hover:underline">
              {t.designs.whyLink(design)}
              <ArrowRight size={16} aria-hidden="true" className="ml-1.5 inline align-[-3px]" />
            </a>
          )}
        </StepCard>
      </Step>
    </section>
  );
}
