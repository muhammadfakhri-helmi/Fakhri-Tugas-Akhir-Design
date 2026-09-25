"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { getStory, subscribeStory } from "@/lib/store";
import { color } from "@/lib/tokens";
import { DESIGN_Z, shotFor } from "./geometry";
import { Earth } from "./Earth";
import { Well } from "./Well";
import { Forces } from "./Forces";
import { Exploded } from "./Exploded";
import { LABELS, anchorFor } from "./labels";

export type SceneProps = {
  /** prefers-reduced-motion: jump between states, no ambient motion */
  reduced: boolean;
  /** stage is covered (e.g. by the paper section) — stop rendering */
  active: boolean;
  labelLayer: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
};

export default function Scene({ reduced, active, labelLayer, onReady }: SceneProps) {
  const frameloop = !active ? "never" : reduced ? "demand" : "always";
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 38, near: 0.1, far: 120, position: [7, 3.5, 17] }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(color.bg);
        scene.fog = new THREE.Fog(color.bg, 22, 46);
        onReady();
      }}
      aria-hidden
    >
      <AdaptiveDpr pixelated />
      <PerformanceMonitor />
      <hemisphereLight args={["#cfe2ff", "#0a1322", 0.75]} />
      <directionalLight position={[8, 12, 10]} intensity={1.5} />
      <directionalLight position={[-10, -4, 6]} intensity={0.35} color="#7fb6d6" />
      <World reduced={reduced} labelLayer={labelLayer} />
    </Canvas>
  );
}

function World({ reduced, labelLayer }: { reduced: boolean; labelLayer: SceneProps["labelLayer"] }) {
  const clock = useRef({ t: 0 });
  const invalidate = useThree((s) => s.invalidate);

  // Re-render on story changes when the loop is on demand.
  useEffect(() => subscribeStory(() => invalidate()), [invalidate]);

  useFrame((_, dt) => {
    const s = getStory();
    if (!reduced && !s.paused) clock.current.t += Math.min(dt, 0.05);
  });

  return (
    <>
      <CameraRig reduced={reduced} />
      <Earth instant={reduced} />
      {(["A", "B", "C"] as const).map((d) => (
        <Well key={d} id={d} z={DESIGN_Z[d]} instant={reduced} />
      ))}
      <Forces instant={reduced} clock={clock} />
      <Exploded instant={reduced} clock={clock} />
      <LabelProjector layer={labelLayer} reduced={reduced} />
    </>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, size, invalidate } = useThree();
  const look = useRef(new THREE.Vector3(2.2, -5.5, 0));
  const goal = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3() });
  const first = useRef(true);

  // Put the subject beside the narrative: right half on wide screens,
  // upper part on phones. The narrative column never covers the model.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width, h = size.height;
    if (w >= 1024) cam.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else if (w >= 700) cam.setViewOffset(w, h, -w * 0.12, 0, w, h);
    else cam.setViewOffset(w, h, 0, h * 0.2, w, h);
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);

  useFrame((state, dt) => {
    const s = getStory();
    const mobile = size.width < 700;
    const shot = shotFor(s.scene, { segment: s.segment, design: s.design, reviseTarget: s.reviseTarget, force: s.force, mobile });
    const { pos: goalPos, target: goalTarget } = goal.current;
    goalPos.set(...shot.pos);
    goalTarget.set(...shot.target);
    // gentle drift in the closing scene
    if (s.scene === "skills" && !reduced && !s.paused) {
      const a = state.clock.elapsedTime * 0.08;
      goalPos.x += Math.sin(a) * 3;
      goalPos.z += Math.cos(a) * 1.5;
    }
    if (reduced || first.current) {
      camera.position.copy(goalPos);
      look.current.copy(goalTarget);
      first.current = false;
    } else {
      easing.damp3(camera.position, goalPos, 0.55, dt);
      easing.damp3(look.current, goalTarget, 0.5, dt);
      if (camera.position.distanceToSquared(goalPos) > 1e-4 || look.current.distanceToSquared(goalTarget) > 1e-4) invalidate();
    }
    camera.lookAt(look.current);
  });
  return null;
}

function LabelProjector({ layer, reduced }: { layer: SceneProps["labelLayer"]; reduced: boolean }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const nodes = useRef<HTMLElement[] | null>(null);
  const shown = useRef<Record<string, number>>({});

  useFrame((_, dt) => {
    const el = layer.current;
    if (!el) return;
    if (!nodes.current || nodes.current.length !== LABELS.length) {
      nodes.current = LABELS.map((l) => el.querySelector<HTMLElement>(`[data-label="${l.id}"]`)!).filter(Boolean);
    }
    const s = getStory();
    LABELS.forEach((def, i) => {
      const node = nodes.current![i];
      if (!node) return;
      const want = def.show(s) ? 1 : 0;
      const cur = shown.current[def.id] ?? 0;
      const next = reduced ? want : THREE.MathUtils.damp(cur, want, 8, dt);
      shown.current[def.id] = Math.abs(next - want) < 0.01 ? want : next;
      anchorFor(def, s, v).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const behind = v.z > 1;
      // phones: the story card owns the lower half of the screen
      const underCard = size.width < 700 && y > size.height * 0.5;
      const o = behind || underCard ? 0 : shown.current[def.id];
      node.style.opacity = String(o);
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (typeof def.text === "function") {
        const t = def.text(s);
        if (node.firstChild?.textContent !== t && node.firstChild) node.firstChild.textContent = t;
      }
      if (def.tone === "status") {
        const d = def.id.slice(2);
        node.dataset.status = labelStatus(d, s);
      }
    });
  });
  return null;
}

function labelStatus(d: string, s: ReturnType<typeof getStory>) {
  if (s.scene === "conclusion") return "pass";
  if (d === "A") return "pass";
  if (s.scene === "revision" && s.reviseTarget === d) return s.revise >= 0.999 ? "pass" : s.revise > 0.02 ? "unknown" : "review";
  return "review";
}
