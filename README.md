# Designing for Forces You Cannot See

An interactive 3D case study of my undergraduate final project in petroleum
engineering: three drillstring designs for a directional (build-and-hold) well,
checked for **tension, torque, drag and critical buckling** by load-mechanics
hand calculation and by WellPlan® simulation — then revised where they missed
the study criteria.

**Live site:** https://muhammadfakhri-helmi.github.io/Fakhri-Tugas-Akhir-Design/ (English) ·
https://muhammadfakhri-helmi.github.io/Fakhri-Tugas-Akhir-Design/id/ (Bahasa Indonesia)

> Undergraduate final project · Petroleum engineering · Muhammad Fakhri Helmi.
> Study outcomes are summarised from the project's own conclusions. The well
> path, 3D models, curves, bars and indicators are original conceptual
> illustrations — **not operational data**. No report pages, tables, charts,
> well data or software output are included in this repository.

## Story

1. **Question** — how do you know a drillstring can survive its path?
2. **Well path** — vertical, build and hold, and where the string meets the wall
3. **The string** — exploded view: drillpipe, heavy-weight pipe, collars/BHA, bit
4. **Four forces** — tension, torque, drag, buckling, then the four criteria
5. **Three designs** — same loads, different limits; per-check status by method
6. **Two methods** — hand calculation vs. simulation, and why they differ
7. **Revision** — shorten the heavy-weight section, extend the drillpipe, re-test
8. **Conclusion** — A recommended; B and C meet the criteria after revision
9. **Approach** — define, test, compare, validate, revise, explain

## Languages

The site is bilingual. Both pages are generated statically, each with the right
`<html lang>`:

- `/` — English (the default and the URL to share)
- `/id/` — Bahasa Indonesia

The **EN / ID** switch in the header (and footer) opens the other language at
the chapter being read. The choice is remembered in the browser, so a returning
reader who picked Bahasa Indonesia is taken from `/` to `/id/` before the page
paints. Drilling terms (tension, torque, drag, buckling, drillpipe, make-up
torque…) stay in English in the Indonesian text, as they do in the field.

All words live in `data/i18n/en.ts` and `data/i18n/id.ts`; the Indonesian
dictionary is type-checked against the English one, so a missing string fails
`npm run typecheck`. Unknown URLs get a bilingual 404 (`app/global-not-found.tsx`).

## Stack

Next.js (App Router, static export) · React · TypeScript · Tailwind CSS v4 ·
Motion (Framer Motion) · React Three Fiber · Three.js · @react-three/drei ·
lucide-react. Fonts: Archivo, IBM Plex Sans, IBM Plex Mono (SIL OFL) via
`next/font`.

## Run

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` writes the static site to `out/`. Quality gates:

```bash
npm run lint && npm run typecheck && npm run check
```

`npm run check` fails on raw documents (PDF, spreadsheets, Word files),
absolute local paths, private links, secrets, and — when a local, git-ignored
`.privacy-terms.local.txt` exists — any listed identifier. `npm run check:dist`
also scans `out/`.

## Structure

```
app/(english)/           root layout + page for "/"
app/(indonesian)/        root layout + page for "/id/"
app/shell.tsx            shared <html>, fonts, metadata for both languages
app/global-not-found.tsx bilingual 404
app/globals.css          design tokens
components/Site.tsx      the whole case study, rendered in one language
components/story/        header (EN/ID switch, path rail), chapters, shared UI
components/three/        Stage (lazy loader + labels), Scene, Earth, Well,
                         Forces, Exploded, geometry, labels, SVG fallback
data/i18n/en.ts, id.ts   every word on the page, per language
data/story.ts            study findings (qualitative statuses) and the
                         conceptual curves/positions — no words
lib/                     store (shared story state), i18n context, motion, colours
docs/                    design system and content-source notes
scripts/check.mjs        privacy / hygiene check
```

## 3D, motion and accessibility

- One fixed WebGL stage behind the story; each chapter step sets the scene and
  the camera eases to it. The Three.js chunk loads client-side only.
- The render loop stops while the paper section covers the stage; DPR ≤ 1.5
  with adaptive DPR; repeated force glyphs are instanced.
- Without WebGL, an SVG section drawing of the same well is shown. The story
  never depends on the 3D to be read.
- `prefers-reduced-motion` (and the **Pause motion** button) stops ambient
  motion; scenes jump to their final state.
- Keyboard: skip link, visible focus, radio-group controls with arrow keys,
  labelled sliders; status never relies on colour alone.

## Deploy (GitHub Pages)

`.github/workflows/deploy-pages.yml` runs lint, type-check and the privacy
check, builds with `BASE_PATH=/<repository>`, re-checks `out/`, and deploys
with the official Pages actions. Repository → Settings → Pages → Source:
GitHub Actions.

## License

Code: MIT. Case-study content summarises a personal academic project.
