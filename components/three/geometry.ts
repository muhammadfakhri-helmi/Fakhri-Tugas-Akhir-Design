import * as THREE from "three";
import type { DesignId, Force, SceneId, Segment } from "@/lib/store";

// Conceptual build-and-hold well path. Generic proportions, not a real survey.
// Scene units: y is up, the path departs toward +x in the z = 0 plane.

export const KOP_DEPTH = 4; // kick-off point below surface
export const BUILD_RADIUS = 7;
export const HOLD_ANGLE = THREE.MathUtils.degToRad(36);
export const HOLD_LENGTH = 8;

function pathPoints(samples = 160) {
  const vertical = KOP_DEPTH;
  const build = BUILD_RADIUS * HOLD_ANGLE;
  const total = vertical + build + HOLD_LENGTH;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const s = (i / samples) * total;
    if (s <= vertical) {
      pts.push(new THREE.Vector3(0, -s, 0));
    } else if (s <= vertical + build) {
      const a = (s - vertical) / BUILD_RADIUS;
      pts.push(new THREE.Vector3(BUILD_RADIUS - BUILD_RADIUS * Math.cos(a), -KOP_DEPTH - BUILD_RADIUS * Math.sin(a), 0));
    } else {
      const h = s - vertical - build;
      const ex = BUILD_RADIUS - BUILD_RADIUS * Math.cos(HOLD_ANGLE);
      const ey = -KOP_DEPTH - BUILD_RADIUS * Math.sin(HOLD_ANGLE);
      pts.push(new THREE.Vector3(ex + h * Math.sin(HOLD_ANGLE), ey - h * Math.cos(HOLD_ANGLE), 0));
    }
  }
  return { pts, fractions: { vertical: vertical / total, build: (vertical + build) / total } };
}

const built = pathPoints();
export const wellCurve = new THREE.CatmullRomCurve3(built.pts, false, "centripetal");
wellCurve.arcLengthDivisions = 400;

/** Path fraction where each segment ends. */
export const SEGMENT_RANGE: Record<Segment, [number, number]> = {
  vertical: [0, built.fractions.vertical],
  build: [built.fractions.vertical, built.fractions.build],
  hold: [built.fractions.build, 1],
};

/** A sub-range [a, b] of a parent curve, re-parameterised to 0..1. */
export class SubCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private parent: THREE.Curve<THREE.Vector3>,
    private a: number,
    private b: number,
    private offset = new THREE.Vector3(),
  ) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    return this.parent.getPointAt(this.a + (this.b - this.a) * t, target).add(this.offset);
  }
}

/** Unit vector toward the low side of the hole (perpendicular to the tangent, pointing down). */
export function lowSide(t: number, target = new THREE.Vector3()) {
  const tan = wellCurve.getTangentAt(t);
  target.set(tan.y, -tan.x, 0);
  if (target.y > 0) target.multiplyScalar(-1);
  if (target.lengthSq() < 1e-6) target.set(-1, 0, 0);
  return target.normalize();
}

// Conceptual string arrangement as path fractions (not real lengths).
export const STRING = {
  dpEnd: 0.7, // drillpipe: 0 .. dpEnd
  hwdpEnd: 0.86, // heavy-weight: dpEnd .. hwdpEnd
  bhaEnd: 0.982, // collars/BHA: hwdpEnd .. bhaEnd, bit after
};
/** Revised drillpipe/heavy-weight boundary. C needed a larger shift than B. */
export const REVISED_DP_END: Record<DesignId, number> = { A: 0.7, B: 0.76, C: 0.8 };

export const RADIUS = { hole: 0.21, dp: 0.055, hwdp: 0.078, dc: 0.108, bit: 0.16 };

/** Lateral positions of the three design copies (z). */
/** A sits left of B and C on screen in the comparison views. */
export const DESIGN_Z: Record<DesignId, number> = { A: 4, B: 0, C: -4 };

// ---------------------------------------------------------------------------
// Camera keyframes per scene: position + look-at target.
// ---------------------------------------------------------------------------

export type Shot = { pos: [number, number, number]; target: [number, number, number]; fov?: number };

export const ANATOMY_ORIGIN = new THREE.Vector3(-9, -7, 0);

export function shotFor(
  scene: SceneId,
  opts: { segment: Segment; design: DesignId; reviseTarget: DesignId; force: Force; mobile: boolean },
): Shot {
  const m = opts.mobile ? 1.35 : 1;
  switch (scene) {
    case "intro":
      return { pos: [9 * m, -1.5, 19 * m], target: [3, -6.8, 0] };
    case "path": {
      const mid = (SEGMENT_RANGE[opts.segment][0] + SEGMENT_RANGE[opts.segment][1]) / 2;
      const p = wellCurve.getPointAt(mid);
      return { pos: [p.x + 5 * m, p.y + 1.2, 11 * m], target: [p.x, p.y, 0] };
    }
    case "anatomy":
      return { pos: [ANATOMY_ORIGIN.x + 0.5, ANATOMY_ORIGIN.y + 1.5, 14 * m], target: [ANATOMY_ORIGIN.x, ANATOMY_ORIGIN.y - 0.2, 0] };
    case "forces": {
      if (opts.force === "buckling") {
        const p = wellCurve.getPointAt(0.9);
        return { pos: [p.x + 4 * m, p.y + 1.5, 7 * m], target: [p.x, p.y, 0] };
      }
      if (opts.force === "drag") {
        const p = wellCurve.getPointAt(0.62);
        return { pos: [p.x + 6 * m, p.y + 1.5, 11 * m], target: [p.x, p.y, 0] };
      }
      return { pos: [9 * m, -3, 19 * m], target: [3, -7.4, 0] };
    }
    case "criteria":
      return { pos: [10 * m, -2, 21 * m], target: [3, -7, 0] };
    case "designs": {
      const z = DESIGN_Z[opts.design] * 0.35 + 1.6;
      return { pos: [3 + 26 * m, -2.5, z + 9 * m], target: [3, -6.6, z] };
    }
    case "revision": {
      const z = DESIGN_Z[opts.reviseTarget];
      const p = wellCurve.getPointAt(0.6);
      return { pos: [p.x + 17 * m, p.y + 1, z + 8 * m], target: [p.x, p.y - 0.8, z] };
    }
    case "conclusion":
      return { pos: [3 + 27 * m, -2, 10.6 * m], target: [3, -6.8, 1.6] };
    case "skills":
      return { pos: [16 * m, -2, 22 * m], target: [3, -7, 0] };
    case "methods":
    default:
      return { pos: [10 * m, -2, 21 * m], target: [3, -7, 0] };
  }
}
