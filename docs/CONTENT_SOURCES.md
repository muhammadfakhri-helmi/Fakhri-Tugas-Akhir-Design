# Content sources

The source is the author's private final-project report. It is **not** part of
this repository and is never linked.

What the site uses from it — qualitatively only:

| Site content | Report section |
| --- | --- |
| Three designs share length, weight and arrangement; only the drillpipe rating differs | Abstract, ch. 3 |
| Four checks: tension, torque, drag, critical buckling; 90 % working threshold | ch. 3 (method) |
| Design A meets all checks in both methods | ch. 4.1.1, ch. 5.1 |
| Design B / C status per check and per method | ch. 4.1.2, ch. 4.1.3 |
| Revision by shortening heavy-weight pipe and extending drillpipe; C needed a larger shift | ch. 4.2, ch. 5.1 |
| Torque close between methods, tension much further apart, and why | ch. 4.3, ch. 5.1 |
| Suggested next tests | ch. 5.2 |

Not used anywhere: well, field or company names; coordinates; depths; string
configurations, dimensions or grades; numeric results; figures, tables or
screenshots of the report or of the simulation software.

Everything visual — the well path, 3D models, force glyphs, curves, bar
positions, component proportions — is newly drawn and labelled
"Conceptual visualization — not operational data"
("Visualisasi konseptual — bukan data operasional" on the Indonesian page).

## Where the words live

- `data/i18n/en.ts` — English copy (source of truth for structure).
- `data/i18n/id.ts` — Bahasa Indonesia, type-checked against the English
  dictionary. Both languages state the same findings; neither adds a claim.
- `data/story.ts` — language-neutral statuses and conceptual geometry only.
