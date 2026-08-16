# Richmond Workforce Transition — scaffold

A public-interest information site about workforce transition in the Richmond, Virginia region.

**This repository is currently a scaffold.** The interface, routes, design system, and content model
are in place. No research findings, statistics, employers, programs, or citations have been migrated.
Every demonstration value on the site is explicitly labeled as a placeholder.

## Stack

- React 19 + TypeScript
- Vite
- TanStack Start / TanStack Router (file-based routing under `src/routes/`)
- Tailwind CSS v4, configured through `src/styles.css` (no `tailwind.config.js`)
- `lucide-react` for icons

No visualization libraries are installed yet. The Cytoscape.js network and the MapLibre GL JS map are
represented by labeled stage placeholders inside `VisualizationFrame`.

## Routes

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Overview: hero, three entry panels, audience questions, featured research, source-integrity callout |
| `/transition-map` | `src/routes/transition-map.tsx` | Network stage (future Cytoscape.js), filters, legend, selected-role detail, table fallback |
| `/transition-capacity` | `src/routes/transition-capacity.tsx` | Thesis, six-stage progression, modular evidence sections, inert scenario controls |
| `/richmond-region` | `src/routes/richmond-region.tsx` | Regional overview, map stage (future MapLibre GL JS), key measures, locality comparison table |
| `/research` | `src/routes/research/index.tsx` | Research library with search + topic filter |
| `/research/:slug` | `src/routes/research/$slug.tsx` | Editorial story template |
| `/methodology` | `src/routes/methodology.tsx` | Definitions, source handling, limitations, source register |

Routing notes for migration:

- `src/routeTree.gen.ts` is generated. Never edit it.
- Dynamic segments use `$slug`, not `:slug`. Navigate with `<Link to="/research/$slug" params={{ slug }} />`.
- Every route defines its own `head()` with a distinct title, description, and Open Graph text.
  Add `og:image` only on leaf routes, never on `__root.tsx`.

## Design tokens

All colors, radii, and fonts are semantic tokens defined in `src/styles.css`:

- `--background` warm off-white, `--foreground` near-black ink, `--surface`, `--inset`
- `--primary` deep navy-teal (civic accent), `--highlight` warm ochre (secondary highlight)
- `--caution`, `--destructive`, `--border`, `--rule`, `--ring`, `--chart-1…5`
- Fonts: `--font-family-display` (Source Serif 4), `--font-family-sans` (Public Sans),
  `--font-family-mono` (IBM Plex Mono), each with system fallbacks. Web fonts are loaded via a
  `<link>` in `src/routes/__root.tsx` — never `@import` a remote stylesheet in `src/styles.css`.

Editorial utilities: `eyebrow`, `page-title`, `section-lead`, `label-sm`, `annotation`, `numeric`,
`rule-t`, `hatch`. Reduced motion is respected globally.

Do not hardcode color utilities (`text-white`, `bg-[#…]`) in components; use the tokens.

## Content model

Presentation and content are fully separated. Typed records live in `src/content/`:

| File | Contents |
| --- | --- |
| `src/content/types.ts` | `Provenance`, `Source`, `Limitation`, `Definition`, `Occupation`, `TransitionEdge`, `CapacityStage`, `RegionMeasure`, `Locality`, `ResearchStory` |
| `src/content/research.ts` | Placeholder research stories + source register, `getStory`, `getSources` |
| `src/content/transitions.ts` | Placeholder occupations, transition edges, legend bands |
| `src/content/capacity.ts` | Capacity stages (all values `null`), evidence sections, scenario controls |
| `src/content/region.ts` | Region measures, localities, regional limitations |
| `src/content/methodology.ts` | Definitions, limitations, source-handling rules |
| `src/config/site.ts` | Site name, tagline, primary navigation — **the only place to rename the project** |

Every placeholder record carries `isPlaceholder: true`. Migration should replace the data modules
(or swap them for JSON/CSV-derived/MDX/API loaders) while keeping the exported shapes, and set
`isPlaceholder: false` only for genuinely sourced content.

Suggested migration targets:

- Structured data → `src/content/*.ts` or a new `src/content/data/*.json` imported by those modules
- Long-form research prose → MDX or a CMS/API loader behind `getStory`
- Graph export for Cytoscape.js → `src/content/transitions.ts` (`occupations`, `transitions`)
- Geographic layers for MapLibre → `public/geo/` plus locality records in `src/content/region.ts`
- Images and downloadable files → `public/` (or `src/assets/` when imported by components)

## Component model

| Group | File | Components |
| --- | --- | --- |
| Site chrome | `src/components/site/SiteHeader.tsx`, `SiteFooter.tsx` | `SiteHeader` (with mobile nav), `SiteFooter` |
| Page structure | `src/components/page/PageHeader.tsx` | `PageHeader`, `ProseContainer`, `SectionIntro`, `PageSection` |
| Editorial | `src/components/editorial.tsx` | `PlaceholderBadge`, `KeyFinding`, `MetricCallout`, `EvidencePanel`, `ProgressionSteps`, `DefinitionCallout`, `LimitationNote` |
| Sources | `src/components/sources.tsx` | `SourceBadge`, `SourceList`, `DataProvenance` |
| Data & visuals | `src/components/data.tsx` | `VisualizationFrame`, `VisualizationStagePlaceholder`, `VisualizationLegend`, `FilterBar`, `FilterGroup`, `DataTable`, `EmptyState`, `LoadingState`, `ErrorState` |
| Research | `src/components/research.tsx` | `ResearchCard`, `RelatedResearch` |

`VisualizationFrame` is the contract for every future chart or map: it renders the title, geography,
unit, period, and source line, offers a "view data as table" toggle and an export slot, and appends a
`DataProvenance` disclosure. Real visualizations should be rendered as its `children`, with the table
fallback passed to `tableView`.

## Decisions the migration must preserve

1. **No unlabeled placeholders.** Anything not yet sourced shows `PlaceholderBadge` or
   "Not yet migrated".
2. **No fabricated numbers.** Capacity stages and region measures stay `null` until sourced.
3. **Provenance next to every figure.** Source, geography, unit, and period render near the value.
4. **Table fallback for every visualization**, plus the export affordance.
5. **Never encode meaning with color alone** — legends pair color with shape and label.
6. **No rankings, recommendations, causal claims, or eligibility determinations.**
7. **Frontend-only.** No auth, database, or admin surface in this project.
8. Site name and navigation change in `src/config/site.ts` only.

## Commands

```bash
bun install
bun run dev     # local development
bun run build   # production build
bun run lint    # eslint
```
