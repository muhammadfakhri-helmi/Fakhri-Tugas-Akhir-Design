"use client";

import { useEffect } from "react";
import { setStory, type Force, type SceneId } from "@/lib/store";

// Watches every [data-scene] step. The step that crosses the middle of the
// viewport drives the 3D stage. Steps may also carry data-force.

export function SceneTracker() {
  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const patch: Parameters<typeof setStory>[0] = { scene: el.dataset.scene as SceneId };
          if (el.dataset.force) patch.force = el.dataset.force as Force;
          setStory(patch);
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
