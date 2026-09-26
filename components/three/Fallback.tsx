"use client";

import { useStory } from "@/lib/store";
import { useDict } from "@/lib/i18n";
import { color } from "@/lib/tokens";

// SVG section drawing of the same conceptual well: shown while the 3D chunk
// loads and whenever WebGL is unavailable. Follows the chapter state lightly.

const PATH = "M 300 90 L 300 250 A 280 280 0 0 0 353.5 414.6 L 682.5 867.6";

export function Fallback({ loading }: { loading: boolean }) {
  const t = useDict();
  const scene = useStory((s) => s.scene);
  const segment = useStory((s) => s.segment);
  const hl = scene === "path" ? segment : null;

  return (
    <div className="absolute inset-0 flex items-center justify-end overflow-hidden bg-bg max-md:items-start max-md:justify-center">
      <svg
        viewBox="0 0 1000 1000"
        className="h-[92vh] w-auto max-w-none opacity-90 md:mr-[4vw] max-md:mt-[8vh] max-md:h-[56vh]"
        role="img"
        aria-label={t.fallback.aria}
      >
        <defs>
          <pattern id="fb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color.line} strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="80" y="90" width="840" height="850" fill="url(#fb-grid)" opacity="0.6" />
        {[90, 210, 360, 520, 700, 940].map((y) => (
          <line key={y} x1="80" x2="920" y1={y} y2={y} stroke={color.lineStrong} strokeWidth="1.5" />
        ))}
        {/* rig */}
        <path d="M 270 90 L 300 20 L 330 90 Z" fill="none" stroke={color.muted} strokeWidth="3" />
        {/* hole */}
        <path d={PATH} fill="none" stroke={color.flow} strokeOpacity="0.18" strokeWidth="26" strokeLinecap="round" />
        {hl === "vertical" && <path d="M 300 90 L 300 250" stroke={color.flow} strokeOpacity="0.55" strokeWidth="30" strokeLinecap="round" />}
        {hl === "build" && <path d="M 300 250 A 280 280 0 0 0 353.5 414.6" fill="none" stroke={color.flow} strokeOpacity="0.55" strokeWidth="30" strokeLinecap="round" />}
        {hl === "hold" && <path d="M 353.5 414.6 L 682.5 867.6" stroke={color.flow} strokeOpacity="0.55" strokeWidth="30" strokeLinecap="round" />}
        {/* string */}
        <path d={PATH} fill="none" stroke={color.dp} strokeWidth="6" strokeDasharray="1 0" />
        <path d="M 524.7 650.2 L 609.1 766.2" stroke={color.hwdp} strokeWidth="9" />
        <path d="M 609.1 766.2 L 673.3 854.6" stroke={color.dc} strokeWidth="13" />
        <circle cx="682.5" cy="867.6" r="10" fill={color.bit} />
        <text x="330" y="245" fill={color.muted} fontFamily="var(--font-plex-mono)" fontSize="20" letterSpacing="2">
          {t.fallback.kickoff}
        </text>
        <text x="706" y="890" fill={color.muted} fontFamily="var(--font-plex-mono)" fontSize="20" letterSpacing="2">
          {t.fallback.target}
        </text>
      </svg>
      {loading && (
        <p className="label absolute bottom-6 right-6 text-faint max-md:bottom-auto max-md:right-4 max-md:top-20">{t.ui.loading3d}</p>
      )}
    </div>
  );
}
