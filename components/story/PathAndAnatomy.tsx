"use client";

import { AnimatePresence, motion } from "motion/react";
import { components, segments } from "@/data/story";
import { duration, ease } from "@/lib/motion";
import { setStory, useStory, type Component, type Segment } from "@/lib/store";
import { Step } from "./layout";
import { ChapterHead, ConceptNote, Segmented, StepCard } from "./ui";

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.ui, ease: ease.out } },
  exit: { opacity: 0, y: -6, transition: { duration: duration.micro } },
};

export function PathChapter() {
  const segment = useStory((s) => s.segment);
  return (
    <section id="path" aria-labelledby="path-title">
      <Step scene="path">
        <StepCard>
          <ChapterHead n="02" name="Well path" id="path-title" title="A directional path changes how the string moves, contacts the wellbore, and carries load." />
          <p className="prose-body mt-4 text-muted">
            The study well follows a build-and-hold profile: drilled straight down, turned at a kick-off point, then held at a steady angle to reach a
            target offset from the rig.
          </p>
          <div className="mt-6">
            <Segmented
              label="Section of the well path"
              value={segment}
              onChange={(v: Segment) => setStory({ segment: v })}
              options={(Object.keys(segments) as Segment[]).map((k) => ({ value: k, label: segments[k].name }))}
            />
          </div>
          <div className="mt-4 min-h-[5.5rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={segment} {...swap} className="prose-body">
                <strong className="font-semibold text-ink">{segments[segment].name}.</strong>{" "}
                <span className="text-muted">{segments[segment].body}</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <ConceptNote className="mt-5" />
          <p className="mt-2 text-sm text-faint">Generic geometry — not the study well&apos;s coordinates or survey.</p>
        </StepCard>
      </Step>
    </section>
  );
}

export function AnatomyChapter() {
  const component = useStory((s) => s.component);
  const order: Component[] = ["dp", "hwdp", "dc", "bit"];
  return (
    <section id="anatomy" aria-labelledby="anatomy-title">
      <Step scene="anatomy">
        <StepCard>
          <ChapterHead n="03" name="The string" id="anatomy-title" title="Every section contributes weight, strength, and a different response to load." />
          <div role="radiogroup" aria-label="Drillstring component" className="mt-6 grid grid-cols-2 gap-2">
            {order.map((id, i) => {
              const on = component === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  data-comp={id}
                  onClick={() => setStory({ component: id })}
                  onKeyDown={(e) => {
                    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
                    if (!dir) return;
                    e.preventDefault();
                    const next = order[(i + dir + order.length) % order.length];
                    setStory({ component: next });
                    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-comp="${next}"]`)?.focus());
                  }}
                  className={`min-h-16 cursor-pointer rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-200 ${
                    on ? "border-flow bg-flow/10" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: `var(--c-${id})` }} />
                    <span className="font-medium text-ink">{components[id].name}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{components[id].role}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 min-h-[7.5rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={component} {...swap} className="prose-body text-muted">
                {components[component].body}
              </motion.p>
            </AnimatePresence>
          </div>
          <ConceptNote className="mt-4" />
          <p className="mt-2 text-sm text-faint">Illustrative proportions — no real dimensions or grades.</p>
        </StepCard>
      </Step>
    </section>
  );
}
