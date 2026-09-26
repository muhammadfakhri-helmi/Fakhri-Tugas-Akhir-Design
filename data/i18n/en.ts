// English copy. The Indonesian dictionary (id.ts) must match this shape —
// TypeScript enforces it through the `Dict` type.
//
// Findings are qualitative summaries of the final project's own conclusions;
// everything numeric or visual on the page is conceptual (see data/story.ts).

import type { Component, DesignId, Force, Segment } from "@/lib/store";
import type { ChapterId } from "@/data/story";

type ForceText = { name: string; lead: string; body: string; check: string };

export const en = {
  htmlLang: "en",
  ogLocale: "en_US",

  meta: {
    title: "Designing for Forces You Cannot See",
    pageTitle: "Designing for Forces You Cannot See — Drillstring Design Case Study",
    description:
      "An interactive case study of an undergraduate final project: three drillstring designs for a directional well, checked for tension, torque, drag and buckling by hand calculation and by simulation, then revised.",
    ogDescription: "Drillstring design on a directional well — loads, two methods of analysis, and a revised design.",
    author: "Muhammad Fakhri Helmi",
    framing: "Undergraduate final project · Petroleum engineering",
  },

  ui: {
    skip: "Skip to content",
    pause: "Pause motion",
    play: "Play motion",
    chapters: "Chapters",
    chapterIndex: "Chapter index",
    language: "Language",
    concept: "Conceptual visualization — not operational data",
    loading3d: "Loading 3D view…",
    backToTop: "Back to top",
    builtWith: "Built with Next.js, React Three Fiber and Motion",
  },

  chapters: {
    question: "Question",
    path: "Well path",
    anatomy: "The string",
    forces: "Four forces",
    designs: "Three designs",
    methods: "Two methods",
    revision: "Revision",
    conclusion: "Conclusion",
    skills: "Approach",
  } satisfies Record<ChapterId, string>,

  hero: {
    question: "How do you know a drillstring can survive the path it must follow?",
    sub: (author: string) => `An interactive case study in drillstring design, mechanical loads, and validation — by ${author}.`,
    explore: "Explore the analysis",
    skip: "Skip to the conclusion",
  },

  path: {
    title: "A directional path changes how the string moves, contacts the wellbore, and carries load.",
    intro:
      "The study well follows a build-and-hold profile: drilled straight down, turned at a kick-off point, then held at a steady angle to reach a target offset from the rig.",
    groupLabel: "Section of the well path",
    segments: {
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
    } satisfies Record<Segment, { name: string; body: string }>,
    note: "Generic geometry — not the study well's coordinates or survey.",
  },

  anatomy: {
    title: "Every section contributes weight, strength, and a different response to load.",
    groupLabel: "Drillstring component",
    components: {
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
    } satisfies Record<Component, { name: string; role: string; body: string }>,
    note: "Illustrative proportions — no real dimensions or grades.",
  },

  forces: {
    title: "A viable design has to be checked against more than one force.",
    intro: "The same string, on the same path, is loaded four different ways. Scroll through them, or jump to one.",
    controlLabel: (name: string) => `Force (${name} step)`,
    check: "Check",
    bucklingNote: "Conceptual shape — not a physical simulation.",
    criteriaTitle: "Four forces become four criteria.",
    criteriaBody: "Each design had to pass every check, while drilling and while tripping in and out of the hole.",
    items: {
      tension: {
        name: "Tension",
        lead: "Each point holds up everything hanging below it.",
        body: "Tension is highest near the surface, where the whole string hangs from the rig. Pulling out of the hole adds friction on top of the weight.",
        check: "Working load stays below 90 % of the pipe's rated strength — the study's safety threshold.",
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
    } satisfies Record<Force, ForceText>,
  },

  status: {
    pass: "Meets study criteria",
    review: "Needs review",
    exceed: "Exceeds a limit",
    unknown: "Being re-evaluated",
    needsRevision: "Needs revision",
    meetsAfterRevision: "Meets study criteria after revision",
    reevaluating: "Re-evaluating both methods",
  },

  designs: {
    title: "Three alternatives. The same well path. A different safety margin.",
    intro:
      "The three strings share the same length, weight and arrangement. Only the drillpipe's strength rating differs — so the loads stay the same while the limits move.",
    groupLabel: "Design alternative",
    designLabel: (d: DesignId) => `Design ${d}`,
    summary: {
      A: "Held all four loads with margin in both methods. Recommended in the initial study.",
      B: "Same loads as A, lower drillpipe rating. Torque was the problem, and pulling out needed attention.",
      C: "The lowest drillpipe rating. Torque exceeded the limit in both methods; tension was tight.",
    } satisfies Record<DesignId, string>,
    notes: {
      A: {
        tension: "Below the 90 % threshold in both methods.",
        torque: "Well below make-up torque in both methods.",
        drag: "Enough weight to run in; overpull margin sufficient to pull out.",
        buckling: "Very small tendency to buckle.",
      },
      B: {
        tension: "Hand calculation: within limits. Simulation: pulling out flagged against the 90 % threshold.",
        torque: "Hand calculation: above the 90 % threshold, below make-up torque. Simulation: above make-up torque.",
        drag: "Unchanged from A — same weight and arrangement.",
        buckling: "Very small tendency to buckle.",
      },
      C: {
        tension: "Hand calculation: above the 90 % threshold. Simulation: pulling out flagged as a failure risk.",
        torque: "Above make-up torque in both methods.",
        drag: "Unchanged from A — same weight and arrangement.",
        buckling: "Very small tendency to buckle.",
      },
    } satisfies Record<DesignId, Record<Force, string>>,
    table: {
      check: "Check",
      hand: "Hand calc.",
      sim: "Simulation",
      caption: (d: DesignId) => `Design ${d}: result of each check by hand calculation and by simulation`,
    },
    margin: {
      caption: "Same load, different limit. The bar is the load; the tick is the design's limit, the shaded zone is above the 90 % threshold.",
      method: "hand calculation",
      aria: (name: string, status: string) => `${name}: ${status} (conceptual)`,
    },
    statusNote: "Statuses summarise the study's conclusions; bar positions are illustrative.",
    whyLink: (d: DesignId) => `Why do the two methods disagree on ${d}?`,
  },

  methods: {
    title: "Calculation is a starting point. Comparison reveals what needs a closer look.",
    intro:
      "Every design was checked twice: by hand, with load-mechanics equations applied section by section, and with WellPlan® simulation along the whole path. The trends agreed across all three designs. The numbers did not always.",
    kindLabel: "Load compared",
    depthLabel: "Follow the depth — surface to bit",
    depthValue: (p: number) => `${p} percent of the way from surface to bit`,
    chartHand: "Mechanical analysis",
    chartSim: "Software simulation",
    subHand: "section by section",
    subSim: "step by step",
    axis: {
      surface: "Surface",
      bit: "Bit",
      depth: "Depth ↓",
      index: (kind: string) => `${kind} (index) →`,
      limit: "Design limit",
    },
    readout: {
      at: "At this depth — hand calculation",
      sim: "simulation",
      diff: "difference",
    },
    curvesNote: "Curves are drawn to explain the two approaches; they are not the study's results or WellPlan® output.",
    showedTitle: "What the comparison showed",
    torqueFinding: "Torque: hand calculation landed close to the simulation.",
    tensionFinding: "Tension: the gap between the two methods was much larger.",
    reasonLabel: (i: number) => `Reason ${i}`,
    takeaway: "Takeaway",
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
    nextQuestion: "So the question became: what should change?",
  },

  revision: {
    title: "When a design missed the criteria, I changed the arrangement and tested it again.",
    p1: "The limits of B and C could not change, so the load had to. Shortening the heavy-weight drillpipe and extending the drillpipe by the same length keeps the string's reach but hangs less weight below its weakest point, near the surface.",
    p2: "Heavy-weight pipe was the lever, not the collars: collars stiffen the bottom of the string; heavy-weight pipe is flexible weight. Less weight also means less push when running in, so drag and buckling were re-checked after every change.",
    groupLabel: "Design to revise",
    reset: "Reset",
    asDesigned: "As designed",
    revised: "Revised",
    sliderLabel: (d: DesignId) => `Scrub the arrangement of design ${d} from as designed to revised`,
    valueRevised: "Revised arrangement",
    valueAsDesigned: "As designed",
    valueChanging: "Changing the arrangement",
    compositionAria: (d: DesignId, done: boolean) =>
      `String composition of design ${d}: drillpipe section ${done ? "longer" : "as designed"}, heavy-weight section ${done ? "shorter" : "as designed"}`,
    bar: { surface: "Surface · drillpipe", hwdp: "heavy-weight", bha: "BHA · bit" },
    caption: (d: DesignId, done: boolean) => `Design ${d}: checks ${done ? "after" : "before"} revision`,
    revisedSummary: {
      B: "After shortening the heavy-weight section, torque and tension dropped in both methods.",
      C: "Needed a larger shift than B. After it, both methods showed torque and tension within limits.",
    },
    revisedNotes: {
      B: {
        tension: "Lower in both methods after the change.",
        torque: "Back under make-up torque in both methods.",
        drag: "Re-checked: no new drag problem.",
        buckling: "Re-checked: no buckling.",
      },
      C: {
        tension: "Below the threshold in both methods.",
        torque: "Under make-up torque in both methods.",
        drag: "Re-checked: running in still has enough weight.",
        buckling: "Re-checked: no buckling.",
      },
    } satisfies Record<"B" | "C", Record<Force, string>>,
    note: "A conceptual reconstruction of the study's conclusion — the real lengths changed are not shown.",
  },

  conclusion: {
    title: "The outcome was not a single number. It was a reasoned design decision, checked through two methods.",
    rows: {
      A: { label: "Recommended in the initial study", body: "Met all four checks in both methods." },
      B: { label: "Meets study criteria after revision", body: "Heavy-weight section shortened, drillpipe extended." },
      C: { label: "Meets study criteria after revision", body: "Needed a larger shift than B." },
    } satisfies Record<DesignId, { label: string; body: string }>,
    body: "Hand calculation and simulation did not always give the same number — close for torque, far apart for tension. The evaluation therefore never rested on one method alone.",
    seeMethod: "See the method",
    nextTitle: "What I would test next",
    nextTests: [
      "Compare against actual drilling records from the well.",
      "Run a sensitivity study on component lengths and operating loads.",
      "Add checks for other effects such as vibration.",
      "Cross-check with a second simulation tool.",
    ],
  },

  skills: {
    title: "Test assumptions, compare evidence, and make the reasoning visible.",
    body: "This research shaped how I approach engineering problems. The same six steps carry over to any design question where the answer has to be defended, not just calculated.",
    stepLabel: (i: number) => `Step ${i}`,
    steps: [
      { step: "Define inputs", body: "Well path, rig limits and string arrangement." },
      { step: "Test loads", body: "Tension, torque, drag and buckling." },
      { step: "Compare alternatives", body: "Three designs against one set of criteria." },
      { step: "Validate results", body: "Hand calculation checked against simulation." },
      { step: "Revise design", body: "Change the arrangement, then test again." },
      { step: "Explain decision", body: "A recommendation with its reasoning visible." },
    ],
  },

  footer: {
    summary:
      "The study compared three drillstring designs for a build-and-hold well by load-mechanics hand calculation and by WellPlan® simulation, and revised the designs that missed the study criteria.",
    disclaimer:
      "The well path, 3D models, curves, bars and indicators on this page are original conceptual illustrations. Study outcomes are summarised from the project's own conclusions; no well data, report pages, tables, charts or software output are reproduced. WellPlan® is a trademark of its owner and is named only as the simulation tool used.",
  },

  labels3d: {
    rig: "Rig · surface",
    kop: "Kick-off point",
    vertical: "Vertical",
    build: "Build",
    hold: "Hold",
    contact: "Wall contact · low side",
    target: "Target",
    dp: "Drillpipe",
    hwdp: "Heavy-weight",
    dc: "Collars · BHA",
    bit: "Bit",
    tensionTop: "Highest tension · near surface",
    torqueTop: "Torque builds toward surface",
    neutral: "Neutral point",
    compression: "Compression · buckling check",
    trip: "Trip in / trip out",
    design: (d: DesignId) => `Design ${d}`,
    recommended: "A · recommended",
    afterRevision: (d: DesignId) => `${d} · after revision`,
    revised: (d: DesignId) => `${d} · revised`,
    asDesigned: (d: DesignId) => `${d} · as designed`,
    margin: "Highest load · thinnest margin",
    hwSection: "Heavy-weight section",
    collarsUnchanged: "Collars unchanged",
  },

  fallback: {
    aria: "Section drawing of a build-and-hold well path with a drillstring inside it",
    kickoff: "KICK-OFF",
    target: "TARGET",
  },
};

export type Dict = typeof en;
