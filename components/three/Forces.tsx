"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { getStory, type Force } from "@/lib/store";
import { color } from "@/lib/tokens";
import { RADIUS, STRING, lowSide, wellCurve } from "./geometry";

// Four force read-outs on the main well. Directions and relative sizes are
// conceptual: they show *where* each load acts and *which way*, not how much.

const UP = new THREE.Vector3(0, 1, 0);
const NEUTRAL = 0.84; // conceptual neutral point: tension above, compression below

type Clock = React.RefObject<{ t: number }>;

function useFade(force: Force, instant: boolean) {
  const v = useRef({ o: 0 });
  return (dt: number) => {
    const s = getStory();
    const on = s.scene === "forces" && s.force === force ? 1 : 0;
    if (instant) v.current.o = on;
    else easing.damp(v.current, "o", on, 0.25, dt);
    return v.current.o;
  };
}

export function Forces({ instant, clock }: { instant: boolean; clock: Clock }) {
  return (
    <group>
      <Tension instant={instant} clock={clock} />
      <Torque instant={instant} clock={clock} />
      <Drag instant={instant} clock={clock} />
      <Buckling instant={instant} clock={clock} />
    </group>
  );
}

function Tension({ instant, clock }: { instant: boolean; clock: Clock }) {
  const N = 22;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const fade = useFade("tension", instant);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), d: new THREE.Vector3(), s: new THREE.Vector3() }), []);
  useFrame((_, dt) => {
    const o = fade(dt);
    if (!mesh.current || !mat.current) return;
    mesh.current.visible = o > 0.01;
    mat.current.opacity = o;
    if (!mesh.current.visible) return;
    for (let i = 0; i < N; i++) {
      // travel upward along the string (toward the rig)
      const u = (((i / N - clock.current.t * 0.035) % 1) + 1) % 1;
      const t = 0.02 + u * 0.95;
      wellCurve.getPointAt(t, tmp.p);
      wellCurve.getTangentAt(t, tmp.d);
      const compressive = t > NEUTRAL;
      if (!compressive) tmp.d.negate();
      tmp.q.setFromUnitVectors(UP, tmp.d);
      const k = compressive ? 0.45 : 0.35 + 1.15 * Math.pow(1 - t / NEUTRAL, 0.9);
      tmp.s.setScalar(k);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      mesh.current.setMatrixAt(i, tmp.m);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} renderOrder={6}>
      <coneGeometry args={[0.13, 0.34, 12]} />
      <meshStandardMaterial ref={mat} color={color.force} emissive={color.force} emissiveIntensity={0.35} transparent depthWrite={false} />
    </instancedMesh>
  );
}

function Torque({ instant, clock }: { instant: boolean; clock: Clock }) {
  const stations = [0.06, 0.2, 0.34, 0.48, 0.62, 0.76];
  const groups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const fade = useFade("torque", instant);
  const frames = useMemo(
    () =>
      stations.map((t) => {
        const p = wellCurve.getPointAt(t);
        const tan = wellCurve.getTangentAt(t);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
        return { p, q, r: 0.3 + 0.4 * (1 - t) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useFrame((_, dt) => {
    const o = fade(dt);
    mats.current.forEach((m) => (m.opacity = o));
    groups.current.forEach((g, i) => {
      if (!g) return;
      g.visible = o > 0.01;
      const spin = g.children[0] as THREE.Group;
      spin.rotation.z = -clock.current.t * 1.2 - i * 0.6;
    });
  });
  const reg = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };
  return (
    <group>
      {frames.map((f, i) => (
        <group
          key={i}
          ref={(g) => {
            groups.current[i] = g;
          }}
          position={f.p}
          quaternion={f.q}
        >
          <group>
            <mesh renderOrder={6}>
              <torusGeometry args={[f.r, 0.03, 8, 48, Math.PI * 1.45]} />
              <meshStandardMaterial ref={reg} color={color.force} emissive={color.force} emissiveIntensity={0.35} transparent depthWrite={false} />
            </mesh>
            <mesh position={[f.r * Math.cos(Math.PI * 1.45), f.r * Math.sin(Math.PI * 1.45), 0]} rotation={[0, 0, Math.PI * 1.45]} renderOrder={6}>
              <coneGeometry args={[0.085, 0.22, 10]} />
              <meshStandardMaterial ref={reg} color={color.force} emissive={color.force} emissiveIntensity={0.35} transparent depthWrite={false} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function Drag({ instant, clock }: { instant: boolean; clock: Clock }) {
  const N = 16;
  const markers = useRef<THREE.InstancedMesh>(null);
  const arrows = useRef<THREE.InstancedMesh>(null);
  const mats = useRef<THREE.Material[]>([]);
  const fade = useFade("drag", instant);
  const contacts = useMemo(() => [0.4, 0.52, 0.64, 0.76, 0.88].map((t) => ({ t, n: lowSide(t) })), []);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), d: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1) }), []);
  useFrame((_, dt) => {
    const o = fade(dt);
    mats.current.forEach((m) => ((m as THREE.MeshStandardMaterial).opacity = o));
    if (!markers.current || !arrows.current) return;
    markers.current.visible = arrows.current.visible = o > 0.01;
    if (o <= 0.01) return;
    // alternate pulling out (moving up) and running in (moving down)
    const phase = Math.sin(clock.current.t * 0.45);
    const dir = phase >= 0 ? -1 : 1; // -1: pulling out (toward surface)
    for (let i = 0; i < N; i++) {
      const u = (((i / N + dir * clock.current.t * 0.03) % 1) + 1) % 1;
      const t = 0.02 + u * (STRING.bhaEnd - 0.03);
      wellCurve.getPointAt(t, tmp.p);
      wellCurve.getTangentAt(t, tmp.d);
      tmp.q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tmp.d);
      tmp.s.setScalar(1);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      markers.current.setMatrixAt(i, tmp.m);
    }
    markers.current.instanceMatrix.needsUpdate = true;
    contacts.forEach((c, i) => {
      wellCurve.getPointAt(c.t, tmp.p).add(c.n.clone().multiplyScalar(RADIUS.hole + 0.16));
      wellCurve.getTangentAt(c.t, tmp.d);
      // drag opposes motion
      if (dir === 1) tmp.d.negate();
      tmp.q.setFromUnitVectors(UP, tmp.d);
      tmp.s.setScalar(1);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      arrows.current!.setMatrixAt(i, tmp.m);
    });
    arrows.current.instanceMatrix.needsUpdate = true;
  });
  const reg = (m: THREE.Material | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };
  return (
    <group>
      <instancedMesh ref={markers} args={[undefined, undefined, N]} renderOrder={6}>
        <torusGeometry args={[RADIUS.dp * 1.9, 0.014, 6, 20]} />
        <meshStandardMaterial ref={reg} color={color.flow} emissive={color.flow} emissiveIntensity={0.6} transparent depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={arrows} args={[undefined, undefined, contacts.length]} renderOrder={6}>
        <coneGeometry args={[0.07, 0.3, 10]} />
        <meshStandardMaterial ref={reg} color={color.force} emissive={color.force} emissiveIntensity={0.35} transparent depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

class HelixAround extends THREE.Curve<THREE.Vector3> {
  constructor(private a: number, private b: number, private turns: number, private amp: number) {
    super();
  }
  getPoint(u: number, target = new THREE.Vector3()) {
    const t = this.a + (this.b - this.a) * u;
    const p = wellCurve.getPointAt(t);
    const tan = wellCurve.getTangentAt(t);
    const n = lowSide(t);
    const bi = new THREE.Vector3().crossVectors(tan, n).normalize();
    const ang = u * this.turns * Math.PI * 2;
    // amplitude grows toward the bit, where compression is largest
    const r = this.amp * Math.pow(u, 0.7);
    return target.copy(p).add(n.multiplyScalar(Math.cos(ang) * r)).add(bi.multiplyScalar(Math.sin(ang) * r));
  }
}

function Buckling({ instant, clock }: { instant: boolean; clock: Clock }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const zone = useRef<THREE.MeshBasicMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const fade = useFade("buckling", instant);
  const geo = useMemo(() => {
    const helix = new THREE.TubeGeometry(new HelixAround(NEUTRAL, STRING.bhaEnd, 5, RADIUS.hole * 0.62), 160, 0.03, 6, false);
    const p = wellCurve.getPointAt(NEUTRAL);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), wellCurve.getTangentAt(NEUTRAL));
    return { helix, p, q };
  }, []);
  useFrame((_, dt) => {
    const o = fade(dt);
    if (mat.current) {
      mat.current.opacity = o * (0.55 + 0.35 * Math.sin(clock.current.t * 1.6));
      mat.current.visible = o > 0.01;
    }
    if (zone.current) {
      zone.current.opacity = o * 0.18;
      zone.current.visible = o > 0.01;
    }
    if (ring.current) ring.current.visible = o > 0.01;
  });
  return (
    <group>
      <mesh geometry={geo.helix} renderOrder={6}>
        <meshStandardMaterial ref={mat} color={color.force} emissive={color.force} emissiveIntensity={0.35} transparent depthWrite={false} />
      </mesh>
      <mesh position={geo.p} quaternion={geo.q} ref={ring} renderOrder={6}>
        <torusGeometry args={[RADIUS.hole * 1.25, 0.016, 6, 40]} />
        <meshBasicMaterial ref={zone} color={color.force} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
