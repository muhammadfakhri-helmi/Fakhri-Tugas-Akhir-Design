import * as THREE from "three";
import type { StoryState } from "@/lib/store";
import { DESIGN_Z, SEGMENT_RANGE, STRING, wellCurve } from "./geometry";
import { partCentre } from "./Exploded";

// Screen labels for the 3D stage. They are projected from 3D anchors every
// frame and written straight to DOM nodes (no React re-render). They repeat
// what the narrative already says, so they are aria-hidden.

export type LabelDef = {
  id: string;
  anchor: () => THREE.Vector3;
  show: (s: StoryState) => boolean;
  text: string | ((s: StoryState) => string);
  tone?: "default" | "flow" | "status";
};

const at = (t: number, z = 0) => wellCurve.getPointAt(t).add(new THREE.Vector3(0, 0, z));
const mid = (r: [number, number]) => (r[0] + r[1]) / 2;
const designScenes = ["designs", "revision", "conclusion"];

export const LABELS: LabelDef[] = [
  { id: "rig", anchor: () => new THREE.Vector3(0, 2.8, 0), show: (s) => s.scene === "intro", text: "Rig · surface" },
  { id: "kop", anchor: () => at(SEGMENT_RANGE.build[0]), show: (s) => s.scene === "intro" || s.scene === "path", text: "Kick-off point" },
  { id: "seg-v", anchor: () => at(mid(SEGMENT_RANGE.vertical) - 0.06), show: (s) => s.scene === "path" && s.segment === "vertical", text: "Vertical", tone: "flow" },
  { id: "seg-b", anchor: () => at(mid(SEGMENT_RANGE.build)), show: (s) => s.scene === "path" && s.segment === "build", text: "Build", tone: "flow" },
  { id: "seg-h", anchor: () => at(mid(SEGMENT_RANGE.hold)), show: (s) => s.scene === "path" && s.segment === "hold", text: "Hold", tone: "flow" },
  { id: "contact", anchor: () => at(0.6).add(new THREE.Vector3(-0.5, -0.4, 0)), show: (s) => (s.scene === "path" && s.segment !== "vertical") || (s.scene === "forces" && s.force === "drag"), text: "Wall contact · low side" },
  { id: "target", anchor: () => at(1).add(new THREE.Vector3(0, -0.5, 0)), show: (s) => s.scene === "intro", text: "Target" },

  { id: "p-dp", anchor: () => partCentre("dp", 0.6).add(new THREE.Vector3(0, 0.55, 0)), show: (s) => s.scene === "anatomy", text: "Drillpipe" },
  { id: "p-hwdp", anchor: () => partCentre("hwdp", 0.6).add(new THREE.Vector3(0, 0.6, 0)), show: (s) => s.scene === "anatomy", text: "Heavy-weight" },
  { id: "p-dc", anchor: () => partCentre("dc", 0.6).add(new THREE.Vector3(0, 0.7, 0)), show: (s) => s.scene === "anatomy", text: "Collars · BHA" },
  { id: "p-bit", anchor: () => partCentre("bit", 0.6).add(new THREE.Vector3(0, 0.6, 0)), show: (s) => s.scene === "anatomy", text: "Bit" },

  { id: "f-top", anchor: () => at(0.05).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && (s.force === "tension" || s.force === "torque"), text: (s) => (s.force === "tension" ? "Highest tension · near surface" : "Torque builds toward surface") },
  { id: "f-neutral", anchor: () => at(0.84).add(new THREE.Vector3(0.7, 0.3, 0)), show: (s) => s.scene === "forces" && (s.force === "tension" || s.force === "buckling"), text: "Neutral point" },
  { id: "f-comp", anchor: () => at(0.95).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && s.force === "buckling", text: "Compression · buckling check" },
  { id: "f-trip", anchor: () => at(0.2).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && s.force === "drag", text: "Trip in / trip out", tone: "flow" },

  ...(["A", "B", "C"] as const).map<LabelDef>((d) => ({
    id: `d-${d}`,
    anchor: () => new THREE.Vector3(0, 0.9, DESIGN_Z[d]),
    show: (s) => designScenes.includes(s.scene),
    text: (s) => {
      if (s.scene === "conclusion") return d === "A" ? "A · recommended" : `${d} · after revision`;
      if (s.scene === "revision" && s.reviseTarget === d) return s.revise >= 0.999 ? `${d} · revised` : `${d} · as designed`;
      return `Design ${d}`;
    },
    tone: "status",
  })),
  { id: "margin", anchor: () => at(0.12, 0).add(new THREE.Vector3(1, 0.2, 0)), show: (s) => s.scene === "designs", text: "Highest load · thinnest margin", tone: "status" },
  { id: "r-hw", anchor: () => at(0.8).add(new THREE.Vector3(0.8, 0.25, 0)), show: (s) => s.scene === "revision", text: "Heavy-weight section" },
  { id: "r-bha", anchor: () => at((STRING.hwdpEnd + STRING.bhaEnd) / 2).add(new THREE.Vector3(0.8, 0, 0)), show: (s) => s.scene === "revision", text: "Collars unchanged" },
];

/** Some anchors depend on the selected design (z offset). */
export function anchorFor(def: LabelDef, s: StoryState, out: THREE.Vector3) {
  out.copy(def.anchor());
  if (def.id === "r-hw" || def.id === "r-bha") out.z += DESIGN_Z[s.reviseTarget];
  if (def.id === "margin") out.z += DESIGN_Z[s.design];
  return out;
}
