# Richmond Workforce Transition — Scaffold Plan

A navigable shell and design foundation for a civic workforce-transition information site. No invented statistics, findings, employers, programs, or citations: every demonstration value is explicitly labeled as placeholder.

## Routing note

This project runs on TanStack Start's file-based router (not React Router). Routes are files under `src/routes/`; the URL structure requested is unchanged, with `/research/:slug` implemented as `/research/$slug`.

## Routes

- `/` — Overview (hero, three entry panels, "Start with the question you have", featured research, methodology callout)
- `/transition-map` — intro + "how to read this", large visualization stage placeholder for a future Cytoscape.js network, filter/legend/selected-role rails, accessible table fallback
- `/transition-capacity` — thesis, progression (exposed workers → destinations → openings → training seats → funding → remaining gap), modular evidence sections, inert scenario-control shell
- `/richmond-region` — regional overview, large map stage placeholder for future MapLibre GL JS, key measures, locality comparison table fallback, limitations
- `/research` — filter/search scaffolding + research cards (title, one-sentence finding, topic, date, source count, reading time)
- `/research/$slug` — editorial story template: header, one-sentence thesis, key findings, visual evidence stage, scannable sections, source/provenance panel, limitations, related research
- `/methodology` — definitions, limitations, source handling, provenance policy

Each route gets its own `head()` with a distinct title/description/og tags.

## Design system

Defined in `src/styles.css` as semantic tokens (oklch), no hardcoded colors in components:

- Warm off-white page background, near-black ink text
- One civic primary accent (deep navy-teal) and one secondary highlight (warm ochre), plus muted rule/border tones
- Editorial serif display face + humanist sans body face loaded via `<link>` in the root route, with system fallbacks
- Thin rules, inset panels, small caps eyebrow labels, restrained spacing scale; cards only where they create a real information boundary
- No gradients, glass, blobs, or stock illustration
- Motion limited to state changes, gated behind `prefers-reduced-motion`
- Consistent styles for: eyebrow, page title, section lead, metric callout, legend, citation, note, warning, definition, methodology disclosure

## Components (`src/components/`)

Layout: `SiteHeader` (+ mobile nav), `SiteFooter`, `PageHeader`, `SectionIntro`, `ProseContainer`.

Content: `KeyFinding`, `MetricCallout`, `EvidencePanel`, `ProgressionSteps`, `DefinitionCallout`, `SourceList`, `SourceBadge`, `LimitationNote`, `ResearchCard`, `RelatedResearch`, `PlaceholderBadge`.

Data/visual: `VisualizationFrame` (title, unit, geography, date, source line, plus a "view data as table" toggle affordance), `VisualizationLegend`, `FilterBar`, `DataTable`, `EmptyState`, `LoadingState`, `ErrorState`, `DataProvenance` disclosure.

## Content and data model

Typed placeholder modules kept fully separate from presentation, ready for migration:

- `src/config/site.ts` — site name, tagline, nav entries (single place to rename the project)
- `src/content/types.ts` — `ResearchStory`, `Source`, `Occupation`, `TransitionEdge`, `RegionMeasure`, `Locality`, `CapacityStage`
- `src/content/research.ts`, `transitions.ts`, `region.ts`, `capacity.ts`, `methodology.ts` — placeholder records only, each flagged `isPlaceholder: true`
- `src/content/README.md` and root `README.md` — route structure, tokens, content model, component model, and where migrated JSON/CSV/MDX and assets should land

## Accessibility and trust

Semantic landmarks and heading order, visible focus rings, full keyboard nav, WCAG 2.2 AA contrast on the token palette, never color-only encoding (shape/label pairing in legends), reserved source/date/geography/unit slots around every visualization frame, and no causal claims or recommendations in placeholder copy.

## Dependencies

No new packages. Cytoscape.js and MapLibre are represented by labeled stage placeholders only.

## Verification

Build, typecheck, and lint; walk every route at desktop and mobile widths in a headless browser, capture screenshots, and fix layout/console/type issues before reporting results.
