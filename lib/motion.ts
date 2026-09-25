// Shared motion tokens. UI (motion/react) and 3D (useFrame) use the same curves.

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
};

export const duration = { micro: 0.18, ui: 0.32, reveal: 0.75, scene: 1.4 };
export const stagger = { tight: 0.05, base: 0.09, loose: 0.14 };
export const inView = { once: true, amount: 0.25 } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } },
};

export const staggerParent = (gap: number = stagger.base) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

/** Cubic-bezier evaluator so 3D easing matches CSS/motion curves. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (sx(t) - x) / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

export const ease3D = bezier(...ease.inOut);
