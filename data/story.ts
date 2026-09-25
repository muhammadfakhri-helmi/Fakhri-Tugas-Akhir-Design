// Single content source for the case study.
//
// Two kinds of content live here and are kept apart on purpose:
//  • FINDINGS — qualitative outcomes summarised from the final project's own
//    conclusions (which design met the study criteria, which needed revision,
//    where the two methods agreed or differed). `source` names the chapter of
//    the private report; the report itself is never published.
//  • CONCEPTUAL — geometry, proportions, curves and bar positions invented for
//    this page to explain the reasoning. They are not well data, not software
//    output, and are labelled "Conceptual visualization — not operational data".

import type { Component, DesignId, Force, Segment } from "@/lib/store";

export const CONCEPT_LABEL = "Conceptual visualization — not operational data";

export const meta = {
  title: "Designing for Forces You Cannot See",
  author: "Muhammad Fakhri Helmi",
  framing: "Undergraduate final project · Petroleum engineering",
};

export const chapters = [
  { id: "question", n: "01", short: "Question" },
  { id: "path", n: "02", short: "Well path" },
  { id: "anatomy", n: "03", short: "The string" },
  { id: "forces", n: "04", short: "Four forces" },
  { id: "designs", n: "05", short: "Three designs" },
  { id: "methods", n: "06", short: "Two methods" },
  { id: "revision", n: "07", short: "Revision" },
  { id: "conclusion", n: "08", short: "Conclusion" },
  { id: "skills", n: "09", short: "Approach" },
] as const;
export type ChapterId = (typeof chapters)[number]["id"];

export const segments: Record<Segment, { name: string; body: string }> = {
  vertical: {
    name: "Vertical",
    body: "The string hangs almost freely. Its own weight, pulling straight down, is most of the load.",
  },
  build: {
    name: "Build",
    body: "The hole starts to curve. The string is pressed against the wall, so contact and friction begin to add torque and drag.",
  },
  hold: {
    name: "Hold",
    body: "The angle is held steady to reach the target. Part of the string's weight now lies on the low side of the hole instead of hanging from above.",
  },
};

export const components: Record<Component, { name: string; role: string; body: string }> = {
  dp: {
    name: "Drillpipe",
    role: "Carries the load, transmits rotation",
    body: "The longest section. Every joint holds up everything below it and passes rotation down from the rig. In this study, its strength rating was the only thing that differed between the three designs.",
  },
  hwdp: {
    name: "Heavy-weight drillpipe",
    role: "Flexible weight, transition",
    body: "Heavier than drillpipe, more flexible than collars. It adds weight without stiffening the bottom of the string — which made it the part to adjust when a design needed revision.",
  },
  dc: {
    name: "Drill collars & BHA",
    role: "Weight on bit, stiffness",
    body: "Thick, stiff and heavy. They put weight on the bit and keep the compressed lower string from bending. Downhole tools such as the motor, measurement tools and stabilizer sit here too.",
  },
  bit: {
    name: "Bit",
    role: "Cuts the rock",
    body: "Everything above it exists to deliver weight and rotation to this point.",
  },
};

export const forces: Record<Force, { name: string; lead: string; body: string; check: string }> = {
  tension: {
    name: "Tension",
    lead: "Each point holds up everything hanging below it.",
    body: "Tension is highest near the surface, where the whole string hangs from the rig. Pulling out of the hole adds friction on top of the weight.",
    check: "Working load stays below 90 % of the pipe's rated strength — the study's safety threshold.",
  },
  torque: {
    name: "Torque",
    lead: "Rotation has to overcome friction along the path.",
    body: "Wherever the string touches the wall, rotation loses some of its torque to friction. The rig must supply the sum of it, so torque builds toward the surface.",
    check: "Peak torque stays below the make-up torque of the pipe connections.",
  },
  drag: {
    name: "Drag",
    lead: "Wall contact resists every trip in and out.",
    body: "Running in, the string's own weight must push through the resistance. Pulling out, the rig must overcome it — within the overpull margin it has available.",
    check: "Running in: available weight beats drag. Pulling out: required pull stays within the overpull margin.",
  },
  buckling: {
    name: "Buckling",
    lead: "The lower string is pushed into compression.",
    body: "Weight on bit puts the bottom of the string in compression. Beyond a critical load, pipe can bend into a sinusoidal or helical shape inside the hole.",
    check: "Compression stays below the critical buckling load.",
  },
};

// ---------------------------------------------------------------------------
// FINDINGS (qualitative, from the report's results and conclusions)
// ---------------------------------------------------------------------------

export type Status = "pass" | "review" | "exceed" | "unknown";
export const statusText: Record<Status, string> = {
  pass: "Meets study criteria",
  review: "Needs review",
  exceed: "Exceeds a limit",
  unknown: "Being re-evaluated",
};

export type MethodPair = { hand: Status; sim: Status; note: string };

export type DesignFinding = {
  id: DesignId;
  summary: string;
  overall: Status;
  checks: Record<Force, MethodPair>;
  revised?: { summary: string; checks: Record<Force, MethodPair> };
  source: string;
};

const allPass = (note: string): MethodPair => ({ hand: "pass", sim: "pass", note });

export const designs: Record<DesignId, DesignFinding> = {
  A: {
    id: "A",
    summary: "Held all four loads with margin in both methods. Recommended in the initial study.",
    overall: "pass",
    checks: {
      tension: allPass("Below the 90 % threshold in both methods."),
      torque: allPass("Well below make-up torque in both methods."),
      drag: allPass("Enough weight to run in; overpull margin sufficient to pull out."),
      buckling: allPass("Very small tendency to buckle."),
    },
    source: "Report ch. 4.1.1, ch. 5.1 (1)",
  },
  B: {
    id: "B",
    summary: "Same loads as A, lower drillpipe rating. Torque was the problem, and pulling out needed attention.",
    overall: "review",
    checks: {
      tension: { hand: "pass", sim: "review", note: "Hand calculation: within limits. Simulation: pulling out flagged against the 90 % threshold." },
      torque: { hand: "review", sim: "exceed", note: "Hand calculation: above the 90 % threshold, below make-up torque. Simulation: above make-up torque." },
      drag: allPass("Unchanged from A — same weight and arrangement."),
      buckling: allPass("Very small tendency to buckle."),
    },
    revised: {
      summary: "After shortening the heavy-weight section, torque and tension dropped in both methods.",
      checks: {
        tension: allPass("Lower in both methods after the change."),
        torque: allPass("Back under make-up torque in both methods."),
        drag: allPass("Re-checked: no new drag problem."),
        buckling: allPass("Re-checked: no buckling."),
      },
    },
    source: "Report ch. 4.1.2, ch. 4.2.1, ch. 5.1 (2)",
  },
  C: {
    id: "C",
    summary: "The lowest drillpipe rating. Torque exceeded the limit in both methods; tension was tight.",
    overall: "review",
    checks: {
      tension: { hand: "review", sim: "exceed", note: "Hand calculation: above the 90 % threshold. Simulation: pulling out flagged as a failure risk." },
      torque: { hand: "exceed", sim: "exceed", note: "Above make-up torque in both methods." },
      drag: allPass("Unchanged from A — same weight and arrangement."),
      buckling: allPass("Very small tendency to buckle."),
    },
    revised: {
      summary: "Needed a larger shift than B. After it, both methods showed torque and tension within limits.",
      checks: {
        tension: allPass("Below the threshold in both methods."),
        torque: allPass("Under make-up torque in both methods."),
        drag: allPass("Re-checked: running in still has enough weight."),
        buckling: allPass("Re-checked: no buckling."),
      },
    },
    source: "Report ch. 4.1.3, ch. 4.2.2, ch. 5.1 (2)",
  },
};

export const methodFindings = {
  agreement: "The trends agreed across all three designs.",
  torque: "Torque: hand calculation landed close to the simulation.",
  tension: "Tension: the gap between the two methods was much larger.",
  reasons: [
    {
      title: "Sections vs. steps",
      body: "The hand calculation works section by section, using each component's length. The simulation steps through the well in small depth increments.",
    },
    {
      title: "How the path is read",
      body: "By hand, angle changes were taken in whole degrees and azimuth was left out. The simulation reads the path more precisely, azimuth included.",
    },
    {
      title: "What it means",
      body: "Hand calculation is a sound first read for torque. For tension, the simulation is needed before trusting the number.",
    },
  ],
  designB:
    "For Design B the two methods even disagreed on the verdict — usable but not recommended by hand, not usable in simulation. Both still pointed to the same action: do not run it as-is.",
  source: "Report ch. 4.3, ch. 5.1 (3)",
};

export const nextTests = [
  "Compare against actual drilling records from the well.",
  "Run a sensitivity study on component lengths and operating loads.",
  "Add checks for other effects such as vibration.",
  "Cross-check with a second simulation tool.",
];

export const approach = [
  { step: "Define inputs", body: "Well path, rig limits and string arrangement.", chapter: "path" },
  { step: "Test loads", body: "Tension, torque, drag and buckling.", chapter: "forces" },
  { step: "Compare alternatives", body: "Three designs against one set of criteria.", chapter: "designs" },
  { step: "Validate results", body: "Hand calculation checked against simulation.", chapter: "methods" },
  { step: "Revise design", body: "Change the arrangement, then test again.", chapter: "revision" },
  { step: "Explain decision", body: "A recommendation with its reasoning visible.", chapter: "conclusion" },
] as const;

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
