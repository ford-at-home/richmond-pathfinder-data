# Migration inventory

Copied 2026-08-16 into `ford-at-home/richmond-pathfinder-data` from the Astro site
`richmond-ai-impact-site`, which presents the pinned analysis
`hack4rva/richmond-ai-impact-analysis@b8728fc84b5ea8da12247d6f64fd8cd290598301`.

The Cursor workspace this task started in was `career-transition-map` (Nuxt demo).
That product is a different site. It is **not** the source of this migration.
See `MIGRATION_NOTES.md`.

## Source

| Item | Value |
| --- | --- |
| Framework | Astro 7 + React 19 islands |
| Rendering | Static HTML for prose; interactive charts hydrate |
| Build | `npm run build` (sync pin → reshape tables → astro check → astro build) |
| Package manager | npm (`package-lock.json`), Node ≥ 22.12 |
| Data pin | `analysis.lock.json` — SHA-256 of 57 synced files |
| Geography | Richmond VA MSA, BLS area 40060. Not Richmond city. |

### Source routes

| Path | What it is |
| --- | --- |
| `/` | Home: three reports + employer/worker demonstrator, with the demonstrator labelled not-evidence |
| `/report/ai-exposure-and-employment-change` | Full report, live figures in claiming sections |
| `/report/transition-capacity` | Full report, pathways figure in section 5 |
| `/report/technical-appendix` | Full occupation-level tables |
| `/employer` | Concept demonstrator over a fictional employer. Four provenance tags. |
| `/worker` | Same engine, worker owner. Simulated roster. |

### Source datasets (published analysis)

All under `vendor/analysis/output/` in the source; copied to `data/source/output/` here.

| File | Format | Role |
| --- | --- | --- |
| `richmond_exposure_2025.csv` | CSV, 523 rows | Analytical base: employment, wage, LQ, observed_exposure |
| `richmond_three_point.csv` | CSV, 487 rows | May 2023–2025 employment |
| `richmond_panel_2010_2025.csv` | CSV | Historical panel / placebo windows |
| `pathways_reachable.csv` | CSV | Screened origin→destination pairs |
| `binding_constraints.csv` | CSV | Neighbour screening failures |
| `destinations_screened.csv` | CSV | Destination screen |
| `displaced_occupations.csv` | CSV | Occupations that lost employment |
| `qcew_fixed_geography.csv` | CSV | QCEW industry employment, current 17-county set vs legacy |
| `coverage_excluded.csv` | CSV | Occupations in the metro not in the 523-row join |
| `decliners_vs_national.csv` | CSV | Richmond vs national change |
| `national_gap_decomposition.csv` | CSV | National gap parts |
| `non_adjacent_capacity.csv` | CSV | Capacity outside adjacency |
| `trades_destinations.csv` | CSV | Trades destinations |
| `findings.txt` and other `*.txt` | text | Pipeline summaries, not edited |

### Source interactive figures

| Id | Component | Claim tier | Placement |
| --- | --- | --- | --- |
| landscape | `OccupationExplorer.tsx` | Method | exposure report §2 |
| leverage | `LeverageJackknife.tsx` | Not supportable | exposure report §3 |
| history | `Trajectory.tsx` | Defensible | exposure report §8 |
| placebo | `PlaceboWindows.tsx` | Not supportable | exposure report §8 |
| wages | `WagePremium.tsx` | Defensible | exposure report §5 |
| pathways | `DestinationScarcity.tsx` | Defensible | capacity report §5 |

Static PNGs `fig1`–`fig10`, `fig15`, `fig16` sit in the markdown; the site rewrites `](figures/` to `/figures/`.

### Source interactions

- Occupation explorer: group filter, hover/select occupation, movement encoding
- Jackknife: hover occupations that compose the aggregate
- Trajectory: select among named declining occupations
- Placebo: compare windows including pre-generative-AI
- Wage premium: cut-point series
- Destination scarcity: select origin; waffle of neighbours
- Employer demo: `?company=&step=` and `?instant=1`
- Worker demo: persona from simulated roster
- Report TOC deep links `#anchor`

No search query params on the reports. No map library. No Cytoscape.

### Source SEO

Per-page `<title>` and `<meta name="description">`. No Open Graph image. No JSON-LD.
Favicon: `public/favicon.svg`.

## Target (before migration)

| Item | Value |
| --- | --- |
| Framework | React 19 + TypeScript + Vite 8 |
| Router | TanStack Start / TanStack Router, file routes in `src/routes/` |
| Styling | Tailwind CSS v4, semantic tokens in `src/styles.css` |
| Package manager | bun (`bun.lock`) |
| Commands | `bun run dev`, `bun run build`, `bun run lint` |
| Tests | none in scaffold |
| Visualizations | `VisualizationFrame` placeholders (Cytoscape / MapLibre not installed) |

### Target routes (scaffold)

`/`, `/transition-map`, `/transition-capacity`, `/richmond-region`, `/research`, `/research/$slug`, `/methodology`

All content modules were `isPlaceholder: true`.

## Route and content crosswalk

| Source path | Target path | Content owner | Data dependencies | Interactive behavior | Provenance | Status | Verification notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `src/routes/index.tsx` | report blurbs, lock pin | none | analysis pin in footer | in progress | Must keep “demonstrator is not evidence” if those links appear |
| `/report/ai-exposure-and-employment-change` | `/research/ai-exposure-and-employment-change` plus redirect from `/report/...` | `data/source/reports/…md`, `src/lib/reports.ts` | markdown pin, figure placement | six live figures | hash-pinned markdown, never edited | in progress | Byte-identical source file |
| `/report/transition-capacity` | `/research/transition-capacity` plus `/transition-capacity` as a reading of the same report | same | markdown pin, pathways figure | DestinationScarcity | same | in progress | Do not invent a six-stage calculator the source does not run |
| `/report/technical-appendix` | `/research/technical-appendix` | same | markdown + generated tables | none | same | in progress | |
| `/employer` | none yet | `src/demo/**` in source | simulated companies + measured occupations | multi-step flow, query params | four-tier tags | **unresolved** | See notes. Simulated employer. |
| `/worker` | none yet | `src/demo/worker/**` | simulated roster | persona flow | four-tier tags | **unresolved** | See notes. |
| *(no Cytoscape map)* | `/transition-map` | `pathways_reachable.csv`, `richmond_exposure_2025.csv` | table of screened pairs | filter by origin | codebook + findings | in progress | Source has no network graph. Table is the source behavior. |
| *(no MapLibre map)* | `/richmond-region` | `qcew_fixed_geography.csv`, codebook geography | MSA definition, QCEW industry series | none | MSA 40060; county change 2023/24 | in progress | No per-locality occupation table in the source. Do not invent localities. |
| *(methodology.md in vendor)* | `/methodology` | `data/source/docs/methodology.md` | join, metrics, limits | none | vendor docs | in progress | Copy wording, do not paraphrase metrics |
| n/a | `/research` | index of the three reports | REPORTS blurbs | search/filter scaffold | | in progress | Replace placeholder stories |

## Broken, duplicate, or ambiguous

- Source `dist/` is a build artifact. Not copied.
- Source `src/data/generated/companies.json` and `employees.json` are **simulated**. Not copied into the UI data path.
- Target scaffold “capacity stages” (exposed workers → seats → funding → gap) is a **different model** than the published transition-capacity report. Filling those numeric fields would invent a calculation. Left null / labelled not in the source.
- Target “hiring demand / postings” measure has **no source file**. Left null.
- `career-transition-map` 523-occupation `workforce.json` is a separate rules engine (5%–100% wage lift, exposure bands). Not mixed into this site.
- Interactive figure CSS in the source lives in `src/styles/report.css` and `tokens.css`. Porting charts without those tokens will change appearance; this task does not redesign, so source chart CSS is copied as a scoped stylesheet rather than rewritten in Tailwind.
