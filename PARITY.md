# Parity report

Migration of `richmond-ai-impact-site` into `ford-at-home/richmond-pathfinder-data`
on branch `migrate-source-content`. Pin:
`hack4rva/richmond-ai-impact-analysis@b8728fc84b5ea8da12247d6f64fd8cd290598301`.

This is not a claim of pixel-perfect visual identity. The Lovable chrome
(header, footer, type) is kept. Report bodies and interactive figures use the
source documents and source chart components.

## Complete

| Route | Status |
| --- | --- |
| `/` | Source home copy: three reports, pin, no demonstrator presented as evidence |
| `/research` | Three published reports; placeholder stories removed |
| `/research/ai-exposure-and-employment-change` | Full pinned markdown + live figures in §§2, 3, 5, 8 |
| `/research/transition-capacity` | Full pinned markdown + pathways figure in §5 |
| `/research/technical-appendix` | Full pinned markdown and tables |
| `/report/$slug` | Redirects to `/research/$slug` |
| `/transition-map` | `pathways_reachable.csv` table (28 pairs). Cytoscape slot labelled not in the source |
| `/transition-capacity` | Published summary + pathways figure; six-stage calculator empty |
| `/richmond-region` | MSA 40060, join coverage 523 / 88.4%, QCEW 17-county series. No invented localities |
| `/methodology` | Pinned `methodology.md` and `robustness.md`, plus verbatim definition cards |

## Intentionally different from the source site

- Lovable navigation, fonts, and page chrome instead of the Astro unstyled wireframe.
- Reports live at `/research/$slug`; `/report/$slug` redirects.
- Employer and worker demonstrators are **not** on this site (U1).
- `/transition-capacity` is not a second full copy of the report (U2 interim).
- No Cytoscape network and no MapLibre map: the source had neither.
- Chart CSS is scoped under `.source-figure` / `.source-report` so it cannot
  flatten the Lovable shell (`border-radius: 0 !important` was stripped).

## Unresolved (do not fill without a human)

See `MIGRATION_NOTES.md` U1–U5.

## Verification run 2026-08-16

Commands, from `/Users/williamprior/Development/GitHub/richmond-pathfinder-data`:

```
bun run lint       # 0 errors; 6 pre-existing react-refresh warnings in src/components/ui/*
bun run typecheck  # tsc --noEmit, clean
bun run test       # vitest, 20 passed
bun run build      # vite + nitro, succeeded
node scripts/build-data.mjs
                   # 523 occupations; every published figure recomputed and matched
```

Tests cover: `movement()` z-threshold 1.96; 523 occupations; 28 pathway rows;
report `##` split and figure placement; 4.37% and placebo labelled Not
supportable; geography string is MSA 40060; pin `b8728fc84b5e`; no placeholder
research stories; capacity stages remain null; localities array empty.

## Not verified in a browser this pass

- Route-by-route screenshot comparison against the Astro site
- Keyboard-only walkthrough of the occupation explorer
- Chrome at 390 / 768 / 1280 / 1600
- Console on each route after hydration

Those remain follow-up. Do not treat a green build as visual parity.
