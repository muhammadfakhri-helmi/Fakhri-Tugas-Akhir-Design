# Design system

**Visual thesis:** make invisible downhole forces legible.

**Signature:** the well path is the thread of the page. The chapter rail on the
left is a well trajectory that fills as you read, and the same path runs
through every 3D scene.

## Colour

| Token | Hex | Meaning |
| --- | --- | --- |
| `--bg` | `#0a1322` | navy drafting ground |
| `--panel` / `--line` | `#0f1c30` / `#22334e` | cards, rules |
| `--ink` / `--muted` | `#e8edf4` / `#9aa9be` | text |
| `--paper` | `#ece7da` | drawing paper (method comparison band) |
| `--flow` | `#4fcbdd` | operation / flow, interactive focus |
| `--pass` | `#5ecb8f` | meets study criteria |
| `--review` | `#f0b24a` | needs review |
| `--exceed` | `#e8695e` | exceeds a limit |
| `--unknown` | `#7a8699` | not yet known / being re-evaluated |
| `--force` | `#f4efe2` | force vectors (drafting-white annotations) |

Status is always paired with a shape and words: circle = pass, triangle =
review, cross = exceeds, dash = unknown.

## Type

- **Archivo** (variable width, 104–112 %) — headlines, engineering-nameplate feel.
- **IBM Plex Sans** — reading text.
- **IBM Plex Mono** — technical labels only (uppercase, tracked).
- Fluid scale in `app/globals.css` (`--step-display`, `--step-h2`, …); tabular
  numerals for figures.

## Motion

Shared tokens in `lib/motion.ts` (`ease.out`, `ease.inOut`, durations,
staggers). UI uses Motion; the 3D camera and objects damp toward the state of
the current chapter. Hero headline: word-by-word mask reveal. Charts draw in
with `pathLength`. Reduced motion and the Pause button stop ambient movement.

## Layout

Narrative cards on the left (≤ 520 px), subject on the right via a camera view
offset. On phones the subject sits in the upper part of the screen and cards
scroll over the lower part. Chapter 06 switches to a full-width paper band.
