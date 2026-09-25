"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { getStory, type DesignId, type SceneId, type StoryState } from "@/lib/store";
import { color, statusColor } from "@/lib/tokens";
import { RADIUS, REVISED_DP_END, SEGMENT_RANGE, STRING, SubCurve, lowSide, wellCurve } from "./geometry";

// One conceptual well: borehole, drillstring (drillpipe / heavy-weight / BHA /
// bit), segment highlights, wall-contact patches and a status band near the
// surface where tension and torque peak. Three copies (A, B, C) are drawn,
// offset in z.

const RADIAL = 10;
const DP_MAX = 0.86; // drillpipe geometry spans 0..DP_MAX, revealed via drawRange
const DP_SEGS = 172;
const HW_MIN = 0.6; // heavy-weight geometry spans HW_MIN..hwdpEnd
const HW_SEGS = 52;
const BAND = [0.012, 0.28] as const;

function tube(a: number, b: number, r: number, segs: number, z: number, radial = RADIAL) {
  return new THREE.TubeGeometry(new SubCurve(wellCurve, a, b, new THREE.Vector3(0, 0, z)), segs, r, radial, false);
}

function isMain(id: DesignId) {
  return id === "B"; // the z = 0 copy is the single well shown before chapter 05
}

function wellOpacity(id: DesignId, s: StoryState): number {
  const multi: SceneId[] = ["designs", "revision", "conclusion", "skills", "criteria"];
  if (!multi.includes(s.scene)) return isMain(id) ? 1 : 0;
  if (s.scene === "criteria") return isMain(id) ? 1 : 0;
  if (s.scene === "designs") return s.design === id ? 1 : 0.32;
  if (s.scene === "revision") return s.reviseTarget === id ? 1 : 0.22;
  if (s.scene === "skills") return 0.28;
  return 1;
}

function dpEndFor(id: DesignId, s: StoryState): number {
  if (id === "A") return STRING.dpEnd;
  if (s.scene === "revision" && s.reviseTarget === id) return STRING.dpEnd + (REVISED_DP_END[id] - STRING.dpEnd) * s.revise;
  if (s.scene === "conclusion" || s.scene === "skills") return REVISED_DP_END[id];
  if (s.scene === "revision") return STRING.dpEnd; // the non-selected alternative stays as designed
  return STRING.dpEnd;
}

function bandColor(id: DesignId, s: StoryState): string | null {
  if (s.scene === "designs") return id === "A" ? statusColor.pass : statusColor.review;
  if (s.scene === "revision") {
    if (id === "A") return statusColor.pass;
    if (s.reviseTarget !== id) return statusColor.review;
    if (s.revise >= 0.999) return statusColor.pass;
    if (s.revise > 0.02) return statusColor.unknown;
    return statusColor.review;
  }
  if (s.scene === "conclusion" || s.scene === "skills") return statusColor.pass;
  return null;
}

export function Well({ id, z, instant }: { id: DesignId; z: number; instant: boolean }) {
  const group = useRef<THREE.Group>(null);
  const dpMesh = useRef<THREE.Mesh>(null);
  const hwMesh = useRef<THREE.Mesh>(null);
  const bandMat = useRef<THREE.MeshStandardMaterial>(null);
  const hwMat = useRef<THREE.MeshStandardMaterial>(null);
  const segMats = useRef<Record<string, THREE.MeshBasicMaterial | null>>({});
  const contactGroup = useRef<THREE.Group>(null);
  const anim = useRef({ opacity: isMain(id) ? 1 : 0, dpEnd: STRING.dpEnd, band: 0 });
  const bandTarget = useMemo(() => new THREE.Color(), []);

  const geo = useMemo(() => {
    const bitPos = wellCurve.getPointAt(1).add(new THREE.Vector3(0, 0, z));
    const bitDir = wellCurve.getTangentAt(1);
    return {
      hole: tube(0, 1, RADIUS.hole, 200, z, 14),
      dp: tube(0, DP_MAX, RADIUS.dp, DP_SEGS, z),
      hw: tube(HW_MIN, STRING.hwdpEnd, RADIUS.hwdp, HW_SEGS, z),
      dc: tube(STRING.hwdpEnd, STRING.bhaEnd, RADIUS.dc, 24, z),
      band: tube(BAND[0], BAND[1], RADIUS.dp * 1.9, 60, z),
      segs: (Object.keys(SEGMENT_RANGE) as (keyof typeof SEGMENT_RANGE)[]).map((k) => ({
        k,
        g: tube(SEGMENT_RANGE[k][0], SEGMENT_RANGE[k][1], RADIUS.hole * 1.12, 80, z, 16),
      })),
      bitPos,
      bitQuat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), bitDir),
      contacts: [0.36, 0.44, 0.52, 0.6, 0.69, 0.78, 0.87, 0.94].map((t) => {
        const n = lowSide(t);
        const p = wellCurve.getPointAt(t).add(n.clone().multiplyScalar(RADIUS.hole * 0.98)).add(new THREE.Vector3(0, 0, z));
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n.clone().negate());
        return { p, q, t };
      }),
    };
  }, [z]);

  useFrame((_, dt) => {
    const s = getStory();
    const a = anim.current;
    const targetOpacity = wellOpacity(id, s);
    const targetDp = dpEndFor(id, s);
    const bc = bandColor(id, s);
    if (instant) {
      a.opacity = targetOpacity;
      a.dpEnd = targetDp;
      a.band = bc ? 1 : 0;
    } else {
      easing.damp(a, "opacity", targetOpacity, 0.35, dt);
      easing.damp(a, "dpEnd", targetDp, 0.25, dt);
      easing.damp(a, "band", bc ? 1 : 0, 0.3, dt);
    }
    const g = group.current;
    if (!g) return;
    g.visible = a.opacity > 0.01;
    if (!g.visible) return;

    // drawRange reveals the drillpipe / heavy-weight boundary without rebuilding geometry
    const idxPerSeg = RADIAL * 6;
    const dpSegs = Math.round((a.dpEnd / DP_MAX) * DP_SEGS);
    dpMesh.current?.geometry.setDrawRange(0, dpSegs * idxPerSeg);
    const hwStart = Math.max(0, Math.round(((a.dpEnd - HW_MIN) / (STRING.hwdpEnd - HW_MIN)) * HW_SEGS));
    hwMesh.current?.geometry.setDrawRange(hwStart * idxPerSeg, (HW_SEGS - hwStart) * idxPerSeg);

    g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material & { userData: { base?: number; dynamic?: boolean } };
      if (!m || m.userData.dynamic) return;
      if ("opacity" in m) m.opacity = (m.userData.base ?? 1) * a.opacity;
    });

    // the heavy-weight section is the lever in chapter 07: make it glow
    if (hwMat.current) {
      const lever = s.scene === "revision" && s.reviseTarget === id ? 0.45 : 0;
      hwMat.current.emissive.set(color.flow).multiplyScalar(lever);
    }
    if (bandMat.current) {
      if (bc) bandTarget.set(bc);
      if (instant) bandMat.current.color.copy(bandTarget);
      else easing.dampC(bandMat.current.color, bandTarget, 0.25, dt);
      bandMat.current.emissive.copy(bandMat.current.color).multiplyScalar(0.55);
      bandMat.current.opacity = a.band * a.opacity * 0.9;
      bandMat.current.visible = bandMat.current.opacity > 0.01;
    }

    // segment highlight (chapter 02) — main well only
    const showSeg = isMain(id) && s.scene === "path";
    for (const k of Object.keys(segMats.current)) {
      const m = segMats.current[k];
      if (!m) continue;
      const on = showSeg && s.segment === k ? 0.34 : 0;
      m.opacity = instant ? on : THREE.MathUtils.damp(m.opacity, on, 6, dt);
      m.visible = m.opacity > 0.01;
    }
    // wall contact patches: chapter 02 (build/hold) and drag
    if (contactGroup.current) {
      const show = isMain(id) && ((s.scene === "path" && s.segment !== "vertical") || (s.scene === "forces" && s.force === "drag"));
      contactGroup.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const t = geo.contacts[i].t;
        const inSeg = s.scene === "path" ? t >= SEGMENT_RANGE[s.segment][0] - 0.02 && t <= SEGMENT_RANGE[s.segment][1] + 0.02 : true;
        const on = show && inSeg ? 0.9 : 0;
        m.opacity = instant ? on : THREE.MathUtils.damp(m.opacity, on, 6, dt);
        c.visible = m.opacity > 0.01;
      });
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geo.hole} renderOrder={2}>
        <meshStandardMaterial color={color.flow} transparent depthWrite={false} roughness={0.6} userData={{ base: 0.1 }} />
      </mesh>
      <mesh ref={dpMesh} geometry={geo.dp}>
        <meshStandardMaterial color={color.dp} roughness={0.35} metalness={0.25} transparent userData={{ base: 1 }} />
      </mesh>
      <mesh ref={hwMesh} geometry={geo.hw}>
        <meshStandardMaterial ref={hwMat} color={color.hwdp} roughness={0.4} metalness={0.25} transparent userData={{ base: 1 }} />
      </mesh>
      <mesh geometry={geo.dc}>
        <meshStandardMaterial color={color.dc} roughness={0.45} metalness={0.25} transparent userData={{ base: 1 }} />
      </mesh>
      <group position={geo.bitPos} quaternion={geo.bitQuat}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[RADIUS.bit, RADIUS.bit * 0.92, 0.14, 16]} />
          <meshStandardMaterial color={color.bit} roughness={0.35} metalness={0.25} transparent userData={{ base: 1 }} />
        </mesh>
        <mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[RADIUS.bit * 0.92, 0.12, 16]} />
          <meshStandardMaterial color={color.bit} roughness={0.35} metalness={0.25} transparent userData={{ base: 1 }} />
        </mesh>
      </group>
      <mesh geometry={geo.band} renderOrder={3}>
        <meshStandardMaterial ref={bandMat} color={color.review} transparent depthWrite={false} roughness={0.5} userData={{ dynamic: true }} />
      </mesh>
      {geo.segs.map(({ k, g }) => (
        <mesh key={k} geometry={g} renderOrder={4}>
          <meshBasicMaterial
            ref={(m) => {
              segMats.current[k] = m;
            }}
            color={color.flow}
            transparent
            opacity={0}
            depthWrite={false}
            userData={{ dynamic: true }}
          />
        </mesh>
      ))}
      <group ref={contactGroup}>
        {geo.contacts.map((c, i) => (
          <mesh key={i} position={c.p} quaternion={c.q} renderOrder={5}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 20]} />
            <meshBasicMaterial color={color.force} transparent opacity={0} depthWrite={false} userData={{ dynamic: true }} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
