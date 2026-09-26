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

## Two languages

Indonesian copy runs about 15–25 % longer than English, so layouts are checked
in both languages at 1440 px and 390 px:

- The hero headline wraps naturally (word-by-word reveal, no forced lines); the
  hero camera keeps the well path clear of the longer Indonesian title.
- Units stay glued to their numbers with a no-break space (`90 %`).
- 3D labels are kept short in both languages so neighbouring tags never touch.
- The EN / ID switch is a two-segment control; the current language is plain
  text marked `aria-current`, the other is a link named in its own language
  ("English", "Bahasa Indonesia").
