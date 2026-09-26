"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore } from "react";
import { getStory, useStory } from "@/lib/store";
import { useDict } from "@/lib/i18n";
import { LABELS } from "./labels";
import { Fallback } from "./Fallback";

// Fixed full-viewport 3D stage behind the story. The Three.js chunk loads on
// the client only; until it is ready (or without WebGL) an SVG drawing of the
// same well path is shown, so the story never waits for 3D.

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}
const reducedSub = subscribeMedia("(prefers-reduced-motion: reduce)");
export function useReducedMotionPref() {
  return useSyncExternalStore(
    reducedSub,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

let webglCache: boolean | null = null;
function hasWebGL() {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noop = () => () => {};

export function Stage() {
  const t = useDict();
  const reduced = useReducedMotionPref();
  const webgl = useSyncExternalStore(noop, hasWebGL, () => null);
  const scene = useStory((s) => s.scene);
  const [ready, setReady] = useState(false);
  const labelLayer = useRef<HTMLDivElement>(null);
  const active = scene !== "methods";

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {webgl && <Scene reduced={reduced} active={active} labelLayer={labelLayer} labelText={t.labels3d} onReady={() => setReady(true)} />}
      {(!webgl || !ready) && <Fallback loading={webgl === true || webgl === null} />}
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden">
        {webgl &&
          LABELS.map((l) => (
            <div
              key={l.id}
              data-label={l.id}
              data-tone={l.tone ?? "default"}
              className="stage-label absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <span>{l.text(getStory(), t.labels3d)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
