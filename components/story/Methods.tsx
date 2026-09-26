"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { conceptCurve, conceptLimit, conceptSections } from "@/data/story";
import { useDict } from "@/lib/i18n";
import { ease, fadeUp, inView, staggerParent } from "@/lib/motion";
import { Frame } from "./layout";
import { ConceptNote, Segmented } from "./ui";

type Kind = "torque" | "tension";
type Method = "hand" | "sim";

// Two chart sizes: a compact viewBox on phones keeps the text legible.
type Size = { W: number; H: number };
const WIDE: Size = { W: 520, H: 330 };
const COMPACT: Size = { W: 340, H: 300 };
const PAD = { l: 74, r: 18, t: 36, b: 22 };
const scales = ({ W, H }: Size) => ({
  X: (v: number) => PAD.l + ((v + 10) / 110) * (W - PAD.l - PAD.r), // index -10..100
  Y: (d: number) => PAD.t + d * (H - PAD.t - PAD.b),
});

const narrowQuery = "(max-width: 640px)";
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(narrowQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
function useCompact() {
  return useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches, () => false);
}

function curvePath(kind: Kind, method: Method, size: Size) {
  const { X, Y } = scales(size);
  const pts = method === "sim" ? Array.from({ length: 121 }, (_, i) => i / 120) : conceptSections;
  return pts.map((d, i) => `${i ? "L" : "M"} ${X(conceptCurve(kind, method, d)).toFixed(1)} ${Y(d).toFixed(1)}`).join(" ");
}

function MethodChart({ kind, method, depth, title }: { kind: Kind; method: Method; depth: number; title: string }) {
  const t = useDict();
  const axis = t.methods.axis;
  const titleId = useId();
  const size = useCompact() ? COMPACT : WIDE;
  const { W, H } = size;
  const { X, Y } = scales(size);
  const d = useMemo(() => curvePath(kind, method, size), [kind, method, size]);
  const v = conceptCurve(kind, method, depth);
  const lim = conceptLimit[kind];
  return (
    <figure className="rounded-2xl border border-paper-line bg-paper/80 p-4">
      <figcaption id={titleId} className="flex items-baseline justify-between gap-3">
        <span className="h3 text-paper-ink">{title}</span>
        <span className="label text-paper-muted">{method === "hand" ? t.methods.subHand : t.methods.subSim}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-labelledby={titleId} aria-describedby="methods-readout">
        {/* axes */}
        <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="var(--paper-muted)" strokeWidth="1" />
        <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t} y2={PAD.t} stroke="var(--paper-muted)" strokeWidth="1" />
        <text x={PAD.l - 8} y={PAD.t + 4} textAnchor="end" className="fill-[var(--paper-muted)] text-[11px]">{axis.surface}</text>
        <text x={PAD.l - 8} y={H - PAD.b} textAnchor="end" className="fill-[var(--paper-muted)] text-[11px]">{axis.bit}</text>
        <text x={W - PAD.r} y={PAD.t - 9} textAnchor="end" className="fill-[var(--paper-muted)] text-[11px]">
          {axis.index(t.forces.items[kind].name)}
        </text>
        <text x={PAD.l - 44} y={(PAD.t + H - PAD.b) / 2} transform={`rotate(-90 ${PAD.l - 44} ${(PAD.t + H - PAD.b) / 2})`} textAnchor="middle" className="fill-[var(--paper-muted)] text-[11px]">
          {axis.depth}
        </text>
        {/* hand-calc section boundaries */}
        {conceptSections.slice(1, -1).map((s) => (
          <line key={s} x1={PAD.l} x2={W - PAD.r} y1={Y(s)} y2={Y(s)} stroke="var(--paper-line)" strokeDasharray="2 4" />
        ))}
        {/* design limit — same place on both charts */}
        <line x1={X(lim)} x2={X(lim)} y1={PAD.t} y2={H - PAD.b} stroke="var(--exceed)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={X(lim) - 5} y={H - PAD.b - 8} textAnchor="end" className="fill-[var(--exceed)] text-[11px] font-medium">{axis.limit}</text>
        {/* curve */}
        <motion.path
          key={`${kind}-${method}`}
          d={d}
          fill="none"
          stroke="var(--paper-ink)"
          strokeWidth={method === "hand" ? 2.4 : 2}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: ease.out }}
        />
        {method === "hand" &&
          conceptSections.map((s) => <rect key={s} x={X(conceptCurve(kind, "hand", s)) - 3} y={Y(s) - 3} width="6" height="6" fill="var(--paper-ink)" />)}
        {/* depth marker */}
        <line x1={PAD.l} x2={W - PAD.r} y1={Y(depth)} y2={Y(depth)} stroke="var(--flow)" strokeWidth="1.5" />
        <circle cx={X(v)} cy={Y(depth)} r="5.5" fill="var(--paper)" stroke="#1d8a9c" strokeWidth="2.5" />
        <text x={Math.min(X(v) + 10, W - PAD.r - 30)} y={Y(depth) - 8} className="nums fill-[var(--paper-ink)] text-[12px] font-semibold">
          {v.toFixed(0)}
        </text>
      </svg>
    </figure>
  );
}

export function MethodsChapter() {
  const t = useDict();
  const m = t.methods;
  const [kind, setKind] = useState<Kind>("torque");
  const [depth, setDepth] = useState(0.12);
  const hand = conceptCurve(kind, "hand", depth);
  const sim = conceptCurve(kind, "sim", depth);
  const gap = Math.abs(hand - sim) / Math.max(1, Math.abs(sim));

  return (
    <section id="methods" data-scene="methods" aria-labelledby="methods-title" className="paper-grid relative z-10 py-24 text-paper-ink md:py-32">
      <Frame>
        <motion.div variants={staggerParent()} initial="hidden" whileInView="show" viewport={inView} className="max-w-[760px]">
          <motion.p variants={fadeUp} className="label text-[#1b6f7d]">
            <span className="nums">06</span> · {t.chapters.methods}
          </motion.p>
          <motion.h2 variants={fadeUp} id="methods-title" className="h2 mt-3">
            {m.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="prose-body mt-5 text-paper-muted">
            {m.intro}
          </motion.p>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-5">
          <Segmented
            label={m.kindLabel}
            tone="paper"
            value={kind}
            onChange={setKind}
            options={[
              { value: "torque", label: t.forces.items.torque.name },
              { value: "tension", label: t.forces.items.tension.name },
            ]}
          />
          <label className="block w-full max-w-sm text-paper-ink">
            <span className="label text-paper-muted">{m.depthLabel}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(depth * 100)}
              onChange={(e) => setDepth(Number(e.target.value) / 100)}
              className="slider on-paper mt-1 text-paper-ink"
              aria-valuetext={m.depthValue(Math.round(depth * 100))}
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MethodChart kind={kind} method="hand" depth={depth} title={m.chartHand} />
          <MethodChart kind={kind} method="sim" depth={depth} title={m.chartSim} />
        </div>

        <p id="methods-readout" className="nums mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-paper-muted" aria-live="polite">
          <span>
            {m.readout.at} <strong className="text-paper-ink">{hand.toFixed(0)}</strong>
          </span>
          <span>
            {m.readout.sim} <strong className="text-paper-ink">{sim.toFixed(0)}</strong>
          </span>
          <span>
            {m.readout.diff} <strong className="text-paper-ink">{(gap * 100).toFixed(0)} %</strong>
          </span>
        </p>
        <ConceptNote tone="paper" className="mt-3" />
        <p className="mt-1 text-sm text-paper-muted">{m.curvesNote}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="h3">{m.showedTitle}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f8f5b]" />
                <span>{m.torqueFinding}</span>
              </li>
              <li className="flex gap-3">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="mt-1.5 shrink-0">
                  <path d="M6 1 L11 11 L1 11 Z" fill="#b87a14" />
                </svg>
                <span>{m.tensionFinding}</span>
              </li>
            </ul>
            <p className="prose-body mt-6 border-l-2 border-paper-ink pl-4 text-paper-muted">{m.designB}</p>
          </div>
          <motion.ol variants={staggerParent(0.1)} initial="hidden" whileInView="show" viewport={inView} className="grid gap-4 sm:grid-cols-3">
            {m.reasons.map((r, i) => (
              <motion.li key={r.title} variants={fadeUp} className="rounded-2xl border border-paper-line bg-paper p-5">
                <p className="label nums text-paper-muted">{i < 2 ? m.reasonLabel(i + 1) : m.takeaway}</p>
                <p className="mt-2 font-semibold">{r.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper-muted">{r.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
        <p className="h3 mt-14 max-w-[720px]">{m.nextQuestion}</p>
      </Frame>
    </section>
  );
}
