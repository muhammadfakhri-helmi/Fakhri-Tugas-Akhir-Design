"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { getStory, type SceneId } from "@/lib/store";
import { color } from "@/lib/tokens";

// Cut-away block of strata behind the well plane, a surface grid and a
// simple rig silhouette. Purely illustrative.

const LAYERS = [0, -1.6, -3.9, -6.2, -9.1, -12.4, -16.5];
const X0 = -4.5, X1 = 11.5, Z0 = -4.2, Z1 = -0.45;

const EARTH_OPACITY: Record<SceneId, number> = {
  intro: 1, path: 1, anatomy: 0.25, forces: 1, criteria: 0.8,
  designs: 0.06, methods: 0.06, revision: 0.06, conclusion: 0.12, skills: 0.3,
};

export function Earth({ instant }: { instant: boolean }) {
  const group = useRef<THREE.Group>(null);
  const opacity = useRef({ v: 1 });

  const slabs = useMemo(
    () =>
      LAYERS.slice(0, -1).map((top, i) => {
        const bottom = LAYERS[i + 1];
        const h = top - bottom;
        return { y: (top + bottom) / 2, h, c: color.strata[i % color.strata.length] };
      }),
    [],
  );

  const sectionLines = useMemo(() => {
    // outline of the section plane (z = Z1) plus the layer boundaries on it
    const pts: number[] = [];
    const push = (a: [number, number, number], b: [number, number, number]) => pts.push(...a, ...b);
    push([X0, 0, Z1], [X1, 0, Z1]);
    push([X0, LAYERS[LAYERS.length - 1], Z1], [X1, LAYERS[LAYERS.length - 1], Z1]);
    push([X0, 0, Z1], [X0, LAYERS[LAYERS.length - 1], Z1]);
    push([X1, 0, Z1], [X1, LAYERS[LAYERS.length - 1], Z1]);
    LAYERS.slice(1, -1).forEach((y) => push([X0, y, Z1], [X1, y, Z1]));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    const target = EARTH_OPACITY[getStory().scene];
    if (instant) opacity.current.v = target;
    else easing.damp(opacity.current, "v", target, 0.45, dt);
    const g = group.current;
    if (!g) return;
    g.visible = opacity.current.v > 0.01;
    g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material & { opacity: number; userData: { base?: number } };
      if (!m || !("opacity" in m)) return;
      m.opacity = (m.userData.base ?? 1) * opacity.current.v;
    });
  });

  return (
    <group ref={group}>
      {slabs.map((s, i) => (
        <mesh key={i} position={[(X0 + X1) / 2, s.y, (Z0 + Z1) / 2]} renderOrder={-1}>
          <boxGeometry args={[X1 - X0, s.h - 0.02, Z1 - Z0]} />
          {/* no depth write: the block is backdrop and must never hide a well drawn inside it */}
          <meshStandardMaterial color={s.c} roughness={0.95} metalness={0} transparent depthWrite={false} userData={{ base: 0.92 }} />
        </mesh>
      ))}
      <lineSegments geometry={sectionLines} renderOrder={-1}>
        <lineBasicMaterial color={color.lineStrong} transparent depthWrite={false} userData={{ base: 0.9 }} />
      </lineSegments>
      {/* ground surface: a thin slab in front of the section, so the well reads as drilled from it */}
      <mesh position={[(X0 + X1) / 2, 0, (Z1 + 3.2) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[X1 - X0, 3.2 - Z1]} />
        <meshStandardMaterial color={color.lineStrong} roughness={0.9} transparent userData={{ base: 0.55 }} />
      </mesh>
      <Rig />
    </group>
  );
}

function Rig() {
  const legs = useMemo(() => {
    const top = new THREE.Vector3(0, 2.6, 0);
    return [
      [-0.55, -0.55],
      [0.55, -0.55],
      [0.55, 0.55],
      [-0.55, 0.55],
    ].map(([x, z]) => {
      const base = new THREE.Vector3(x, 0.25, z);
      const mid = base.clone().add(top).multiplyScalar(0.5);
      const len = base.distanceTo(top);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(base).normalize());
      return { mid, len, q };
    });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.6, 0.24, 1.6]} />
        <meshStandardMaterial color={color.lineStrong} roughness={0.7} transparent userData={{ base: 1 }} />
      </mesh>
      {legs.map((l, i) => (
        <mesh key={i} position={l.mid} quaternion={l.q}>
          <cylinderGeometry args={[0.03, 0.03, l.len, 6]} />
          <meshStandardMaterial color={color.muted} roughness={0.5} transparent userData={{ base: 1 }} />
        </mesh>
      ))}
    </group>
  );
}
