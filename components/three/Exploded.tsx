"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { getStory, type Component } from "@/lib/store";
import { color } from "@/lib/tokens";
import { ANATOMY_ORIGIN } from "./geometry";

// Exploded view of a generic drillstring, laid along a gentle diagonal.
// Proportions are illustrative — no real dimensions or grades.

export const ANATOMY_DIR = new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(52)), -Math.cos(THREE.MathUtils.degToRad(52)), 0);
const PARTS: { id: Component; len: number; r: number; c: string }[] = [
  { id: "dp", len: 3.0, r: 0.085, c: color.dp },
  { id: "hwdp", len: 1.7, r: 0.12, c: color.hwdp },
  { id: "dc", len: 1.8, r: 0.17, c: color.dc },
  { id: "bit", len: 0.34, r: 0.22, c: color.bit },
];
const GAP = 0.6;
const TOTAL_EXPLODED = PARTS.reduce((s, p) => s + p.len, 0) + GAP * (PARTS.length - 1);

/** Centre of each part along the axis, exploded (gap) or assembled (gap 0). */
export function partCentre(id: Component, gap: number) {
  const total = PARTS.reduce((s, p) => s + p.len, 0) + gap * (PARTS.length - 1);
  let s = -total / 2;
  for (const p of PARTS) {
    if (p.id === id) return ANATOMY_ORIGIN.clone().add(ANATOMY_DIR.clone().multiplyScalar(s + p.len / 2));
    s += p.len + gap;
  }
  return ANATOMY_ORIGIN.clone();
}
export const EXPLODED_SPAN = TOTAL_EXPLODED;

const Q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), ANATOMY_DIR.clone().negate());

export function Exploded({ instant, clock }: { instant: boolean; clock: React.RefObject<{ t: number }> }) {
  const group = useRef<THREE.Group>(null);
  const parts = useRef<Record<string, THREE.Group | null>>({});
  const st = useRef({ o: 0, gap: 0 });
  const emph = useRef<Record<string, { e: number }>>({ dp: { e: 0 }, hwdp: { e: 0 }, dc: { e: 0 }, bit: { e: 0 } });

  useFrame((_, dt) => {
    const s = getStory();
    const on = s.scene === "anatomy";
    const a = st.current;
    if (instant) {
      a.o = on ? 1 : 0;
      a.gap = on ? GAP : 0;
    } else {
      easing.damp(a, "o", on ? 1 : 0, 0.3, dt);
      easing.damp(a, "gap", on ? GAP : 0, 0.5, dt);
    }
    const g = group.current;
    if (!g) return;
    g.visible = a.o > 0.01;
    if (!g.visible) return;
    for (const p of PARTS) {
      const node = parts.current[p.id];
      if (!node) continue;
      node.position.copy(partCentre(p.id, a.gap));
      const e = emph.current[p.id];
      const target = s.component === p.id ? 1 : 0;
      if (instant) e.e = target;
      else easing.damp(e, "e", target, 0.2, dt);
      node.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (!m || !("emissive" in m)) return;
        m.opacity = a.o * (0.72 + 0.28 * e.e);
        m.emissive.set(color.flow).multiplyScalar(0.06 + 0.3 * e.e);
      });
      node.scale.setScalar(1 + 0.05 * e.e);
    }
    // slow idle roll so the tool joints read as 3D
    g.children.forEach((c) => (c.rotation.y = instant ? 0.3 : clock.current.t * 0.2));
  });

  return (
    <group ref={group}>
      {PARTS.map((p) => (
        <group
          key={p.id}
          ref={(n) => {
            parts.current[p.id] = n;
          }}
          quaternion={Q}
        >
          <Part id={p.id} len={p.len} r={p.r} c={p.c} />
        </group>
      ))}
    </group>
  );
}

function Mat({ c, rough = 0.38 }: { c: string; rough?: number }) {
  return <meshStandardMaterial color={c} roughness={rough} metalness={0.25} transparent />;
}

function Part({ id, len, r, c }: { id: Component; len: number; r: number; c: string }) {
  if (id === "bit") {
    return (
      <group>
        <mesh position={[0, len * 0.2, 0]}>
          <cylinderGeometry args={[r * 0.7, r, len * 0.6, 20]} />
          <Mat c={c} />
        </mesh>
        <mesh position={[0, -len * 0.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[r, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat c={c} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * r * 0.62, -len * 0.33, Math.sin((i / 5) * Math.PI * 2) * r * 0.62]} rotation={[0, -(i / 5) * Math.PI * 2, 0]}>
            <boxGeometry args={[r * 0.75, 0.07, 0.05]} />
            <Mat c={color.muted} />
          </mesh>
        ))}
      </group>
    );
  }
  const joint = id === "dc" ? null : { r: r * 1.4, h: 0.2 };
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[r, r, len, 20]} />
        <Mat c={c} />
      </mesh>
      {joint && (
        <>
          <mesh position={[0, len / 2 - joint.h / 2, 0]}>
            <cylinderGeometry args={[joint.r, joint.r, joint.h, 20]} />
            <Mat c={c} rough={0.3} />
          </mesh>
          <mesh position={[0, -len / 2 + joint.h / 2, 0]}>
            <cylinderGeometry args={[joint.r, joint.r, joint.h, 20]} />
            <Mat c={c} rough={0.3} />
          </mesh>
        </>
      )}
      {id === "hwdp" && (
        <mesh>
          <cylinderGeometry args={[r * 1.3, r * 1.3, 0.26, 20]} />
          <Mat c={c} rough={0.3} />
        </mesh>
      )}
      {id === "dc" &&
        Array.from({ length: 3 }, (_, i) => (
          <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * r, -len * 0.3, Math.sin((i / 3) * Math.PI * 2) * r]} rotation={[0, -(i / 3) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.1, 0.42, 0.07]} />
            <Mat c={color.hwdp} />
          </mesh>
        ))}
    </group>
  );
}
