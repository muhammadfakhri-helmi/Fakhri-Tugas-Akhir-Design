// Language-neutral content data for the case study. All words live in
// data/i18n/en.ts and data/i18n/id.ts.
//
// Two kinds of content live here and are kept apart on purpose:
//  • FINDINGS — qualitative outcomes summarised from the final project's own
//    conclusions (which design met the study criteria, which needed revision,
//    where the two methods agreed or differed). `source` names the chapter of
//    the private report; the report itself is never published.
//  • CONCEPTUAL — geometry, proportions, curves and bar positions invented for
//    this page to explain the reasoning. They are not well data, not software
//    output, and are labelled "Conceptual visualization — not operational data".

import type { DesignId, Force } from "@/lib/store";

export const chapters = [
  { id: "question", n: "01" },
  { id: "path", n: "02" },
  { id: "anatomy", n: "03" },
  { id: "forces", n: "04" },
  { id: "designs", n: "05" },
  { id: "methods", n: "06" },
  { id: "revision", n: "07" },
  { id: "conclusion", n: "08" },
  { id: "skills", n: "09" },
] as const;
export type ChapterId = (typeof chapters)[number]["id"];

// ---------------------------------------------------------------------------
// FINDINGS (qualitative, from the report's results and conclusions)
// ---------------------------------------------------------------------------

export type Status = "pass" | "review" | "exceed" | "unknown";
export type MethodPair = { hand: Status; sim: Status };
export type Checks = Record<Force, MethodPair>;

export type DesignFinding = {
  overall: Status;
  checks: Checks;
  revised?: Checks;
  source: string;
};

const PASS: MethodPair = { hand: "pass", sim: "pass" };
const ALL_PASS: Checks = { tension: PASS, torque: PASS, drag: PASS, buckling: PASS };

export const designs: Record<DesignId, DesignFinding> = {
  A: {
    overall: "pass",
    checks: ALL_PASS,
    source: "Report ch. 4.1.1, ch. 5.1 (1)",
  },
  B: {
    overall: "review",
    checks: {
      tension: { hand: "pass", sim: "review" },
      torque: { hand: "review", sim: "exceed" },
      drag: PASS,
      buckling: PASS,
    },
    revised: ALL_PASS,
    source: "Report ch. 4.1.2, ch. 4.2.1, ch. 5.1 (2)",
  },
  C: {
    overall: "review",
    checks: {
      tension: { hand: "review", sim: "exceed" },
      torque: { hand: "exceed", sim: "exceed" },
      drag: PASS,
      buckling: PASS,
    },
    revised: ALL_PASS,
    source: "Report ch. 4.1.3, ch. 4.2.2, ch. 5.1 (2)",
  },
};

/** Chapter each step of the closing "approach" ring links back to. */
export const approachChapters: ChapterId[] = ["path", "forces", "designs", "methods", "revision", "conclusion"];

// ---------------------------------------------------------------------------
// CONCEPTUAL — illustrative only
// ---------------------------------------------------------------------------

/**
 * Conceptual load-vs-limit positions for the margin chart (0..1 of chart width).
 * The load is the same for all three designs (same weight and arrangement);
 * only the limit moves. Positions are chosen to reproduce the *qualitative*
 * status above, nothing more.
 */
export const marginConcept: Record<"tension" | "torque", { load: number; limit: Record<DesignId, number> }> = {
  tension: { load: 0.58, limit: { A: 0.92, B: 0.74, C: 0.62 } },
  torque: { load: 0.6, limit: { A: 0.95, B: 0.64, C: 0.54 } },
};

/**
 * Conceptual load-vs-depth curves for the method comparison.
 * depth: 0 = surface, 1 = bit. Returns an index 0..100 (not a unit).
 * Section boundaries of the conceptual string, used by the hand-calc steps.
 */
export const conceptSections = [0, 0.25, 0.5, 0.7, 0.86, 1];

function smoothSim(kind: "torque" | "tension", d: number) {
  if (kind === "torque") {
    // builds from bit torque toward surface; extra friction through the build
    const build = Math.min(1, Math.max(0, (0.5 - d) / 0.25));
    return 12 + 50 * Math.pow(1 - d, 1.05) + 6 * build + 1.2 * Math.sin(d * 40);
  }
  // weight below each point; bottom goes slightly compressive
  return -6 + 66 * Math.pow(1 - d, 1.15) + 1.4 * Math.sin(d * 33);
}

export function conceptCurve(kind: "torque" | "tension", method: "hand" | "sim", d: number) {
  if (method === "sim") return smoothSim(kind, d);
  // hand calculation: evaluated at section boundaries, straight between them
  const s = conceptSections;
  let i = 0;
  while (i < s.length - 2 && d > s[i + 1]) i++;
  const a = s[i], b = s[i + 1];
  const t = (d - a) / (b - a);
  const lift = kind === "torque" ? 1.07 : 1.3; // conceptual gap: small vs large
  const va = smoothSim(kind, a) * lift - (kind === "tension" ? 1 : 0);
  const vb = smoothSim(kind, b) * lift - (kind === "tension" ? 1 : 0);
  return va + (vb - va) * t;
}

export const conceptLimit = { torque: 82, tension: 88 };
