"use client";

import { useSyncExternalStore } from "react";

// One tiny external store shared by the HTML story and the 3D stage.
// The 3D scene reads it with getStory() inside useFrame (no re-renders);
// React components subscribe with useStory(selector).

export type SceneId =
  | "intro"
  | "path"
  | "anatomy"
  | "forces"
  | "criteria"
  | "designs"
  | "methods"
  | "revision"
  | "conclusion"
  | "skills";
export type Segment = "vertical" | "build" | "hold";
export type Component = "dp" | "hwdp" | "dc" | "bit";
export type Force = "tension" | "torque" | "drag" | "buckling";
export type DesignId = "A" | "B" | "C";

export type StoryState = {
  scene: SceneId;
  segment: Segment;
  component: Component;
  force: Force;
  design: DesignId;
  reviseTarget: "B" | "C";
  /** 0 = original arrangement, 1 = revised arrangement */
  revise: number;
  /** user pressed "Pause motion" */
  paused: boolean;
};

let state: StoryState = {
  scene: "intro",
  segment: "build",
  component: "dp",
  force: "tension",
  design: "A",
  reviseTarget: "B",
  revise: 0,
  paused: false,
};

const listeners = new Set<() => void>();

export function getStory() {
  return state;
}

export function setStory(patch: Partial<StoryState>) {
  let changed = false;
  for (const key in patch) {
    const k = key as keyof StoryState;
    if (patch[k] !== state[k]) changed = true;
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribeStory(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStory<T>(selector: (s: StoryState) => T): T {
  return useSyncExternalStore(
    subscribeStory,
    () => selector(state),
    () => selector(state),
  );
}
