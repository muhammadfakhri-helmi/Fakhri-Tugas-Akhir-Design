import * as THREE from "three";
import type { StoryState } from "@/lib/store";
import type { Dict } from "@/data/i18n/en";
import { DESIGN_Z, SEGMENT_RANGE, STRING, wellCurve } from "./geometry";
import { partCentre } from "./Exploded";

// Screen labels for the 3D stage. They are projected from 3D anchors every
// frame and written straight to DOM nodes (no React re-render). They repeat
// what the narrative already says, so they are aria-hidden.

export type LabelText = Dict["labels3d"];

export type LabelDef = {
  id: string;
  anchor: () => THREE.Vector3;
  show: (s: StoryState) => boolean;
  text: (s: StoryState, L: LabelText) => string;
  tone?: "default" | "flow" | "status";
};

const at = (t: number, z = 0) => wellCurve.getPointAt(t).add(new THREE.Vector3(0, 0, z));
const mid = (r: [number, number]) => (r[0] + r[1]) / 2;
const designScenes = ["designs", "revision", "conclusion"];

export const LABELS: LabelDef[] = [
  { id: "rig", anchor: () => new THREE.Vector3(0, 2.8, 0), show: (s) => s.scene === "intro", text: (_, L) => L.rig },
  { id: "kop", anchor: () => at(SEGMENT_RANGE.build[0]), show: (s) => s.scene === "path", text: (_, L) => L.kop },
  { id: "seg-v", anchor: () => at(mid(SEGMENT_RANGE.vertical) - 0.06), show: (s) => s.scene === "path" && s.segment === "vertical", text: (_, L) => L.vertical, tone: "flow" },
  { id: "seg-b", anchor: () => at(mid(SEGMENT_RANGE.build)), show: (s) => s.scene === "path" && s.segment === "build", text: (_, L) => L.build, tone: "flow" },
  { id: "seg-h", anchor: () => at(mid(SEGMENT_RANGE.hold)), show: (s) => s.scene === "path" && s.segment === "hold", text: (_, L) => L.hold, tone: "flow" },
  { id: "contact", anchor: () => at(0.6).add(new THREE.Vector3(-0.5, -0.4, 0)), show: (s) => (s.scene === "path" && s.segment !== "vertical") || (s.scene === "forces" && s.force === "drag"), text: (_, L) => L.contact },
  { id: "target", anchor: () => at(1).add(new THREE.Vector3(0, -0.5, 0)), show: (s) => s.scene === "intro", text: (_, L) => L.target },

  { id: "p-dp", anchor: () => partCentre("dp", 0.6).add(new THREE.Vector3(0, 0.55, 0)), show: (s) => s.scene === "anatomy", text: (_, L) => L.dp },
  { id: "p-hwdp", anchor: () => partCentre("hwdp", 0.6).add(new THREE.Vector3(0, 0.6, 0)), show: (s) => s.scene === "anatomy", text: (_, L) => L.hwdp },
  { id: "p-dc", anchor: () => partCentre("dc", 0.6).add(new THREE.Vector3(0, 0.7, 0)), show: (s) => s.scene === "anatomy", text: (_, L) => L.dc },
  { id: "p-bit", anchor: () => partCentre("bit", 0.6).add(new THREE.Vector3(0, 0.6, 0)), show: (s) => s.scene === "anatomy", text: (_, L) => L.bit },

  { id: "f-top", anchor: () => at(0.05).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && (s.force === "tension" || s.force === "torque"), text: (s, L) => (s.force === "tension" ? L.tensionTop : L.torqueTop) },
  { id: "f-neutral", anchor: () => at(0.84).add(new THREE.Vector3(0.7, 0.3, 0)), show: (s) => s.scene === "forces" && (s.force === "tension" || s.force === "buckling"), text: (_, L) => L.neutral },
  { id: "f-comp", anchor: () => at(0.95).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && s.force === "buckling", text: (_, L) => L.compression },
  { id: "f-trip", anchor: () => at(0.2).add(new THREE.Vector3(0.9, 0, 0)), show: (s) => s.scene === "forces" && s.force === "drag", text: (_, L) => L.trip, tone: "flow" },

  ...(["A", "B", "C"] as const).map<LabelDef>((d) => ({
    id: `d-${d}`,
    anchor: () => new THREE.Vector3(0, 0.9, DESIGN_Z[d]),
    show: (s) => designScenes.includes(s.scene),
    text: (s, L) => {
      if (s.scene === "conclusion") return d === "A" ? L.recommended : L.afterRevision(d);
      if (s.scene === "revision" && s.reviseTarget === d) return s.revise >= 0.999 ? L.revised(d) : L.asDesigned(d);
      return L.design(d);
    },
    tone: "status",
  })),
  { id: "margin", anchor: () => at(0.12, 0).add(new THREE.Vector3(1, 0.2, 0)), show: (s) => s.scene === "designs", text: (_, L) => L.margin, tone: "status" },
  { id: "r-hw", anchor: () => at(0.8).add(new THREE.Vector3(0.8, 0.25, 0)), show: (s) => s.scene === "revision", text: (_, L) => L.hwSection },
  { id: "r-bha", anchor: () => at((STRING.hwdpEnd + STRING.bhaEnd) / 2).add(new THREE.Vector3(0.8, 0, 0)), show: (s) => s.scene === "revision", text: (_, L) => L.collarsUnchanged },
];

/** Some anchors depend on the selected design (z offset). */
export function anchorFor(def: LabelDef, s: StoryState, out: THREE.Vector3) {
  out.copy(def.anchor());
  if (def.id === "r-hw" || def.id === "r-bha") out.z += DESIGN_Z[s.reviseTarget];
  if (def.id === "margin") out.z += DESIGN_Z[s.design];
  return out;
}
