# Visual system — editorial civic data

Companion to `docs/page-audit.md`. This is the language for Prompt 3. It does
not authorize rewriting pinned reports or filling null measures.

## Effect

The site should read as an editorial data story: a reader sees the question and
the point in ten seconds, the findings in two minutes, and the evidence in
twenty. It should not read as a PDF in a layout, a dashboard of tiles, or a
consulting deck.

Lovable tokens already match the requested family: warm off-white
(`--background`), near-black ink (`--foreground`), civic navy-teal primary,
warm ochre highlight, Source Serif 4 / Public Sans / IBM Plex Mono. **Do not
replace the token file with a second palette.** Extend utilities; don’t invent
a parallel grey system for the chrome.

Source D3 figures keep scoped `.source-figure` tokens so claim encodings
(fill vs outline for employment direction; empty marks for unmeasured
exposure) are not restyled into a decorative ramp.

## Hierarchy before containers

Prefer, in order:

1. Typography (display title, section lead, body, annotation, numeric)
2. Rules and whitespace (`rule-t`, inset bands)
3. Definition callouts and metric callouts already in `src/components/editorial.tsx`
4. Full-width visual stages (`VisualizationFrame`)
5. Cards — only for choosing among documents, never for every paragraph

Do not add glassmorphism, icon clouds, or a card per finding.

## Three-depth layout (default)

Every information page uses this skeleton unless the audit says the page is
reference-only (appendix):

1. Eyebrow (geography or document type)
2. Title framed as the question the page can answer
3. One-sentence orientation from **existing** blurbs/codebook — not a new claim
4. “Why this matters” only when the source already states stakes; otherwise omit
5. Three to five key findings from the report’s own summary list
6. Primary visual (existing live figure, or origin-first pair view, or QCEW series)
7. Evidence sections
8. Full document / tables / methods
9. Sources, limitations, pin, last-updated (pin synced date)
10. Related research

Pinned markdown stays byte-identical. Restructuring wraps it; it does not edit
`data/source/reports/*.md`.

## Library routing

Choose the **smallest capable** tool. Do not stack libraries on one chart.

| Job | Tool | Why |
| --- | --- | --- |
| Existing six report figures | **Keep D3 React islands** | Bespoke encodings (gutter for zeros, jackknife, waffle of neighbours). Plot cannot replace them without changing meaning. |
| 28 screened pairs, origin-first | **Native SVG/HTML first**; Cytoscape.js only if pan/zoom/search on a graph is required | The CSV is a small directed list, not a metro network. No 0–1 distance field. |
| QCEW industry series | **Observable Plot** or native SVG | Tabular time series. Plot is the preferred new chart library. |
| MSA vs city / delineation | **HTML/SVG schematic** | No GeoJSON in repo. A basemap without occupation data is decoration. |
| Occupation × locality exposure | **Do not build** | U5. QCEW is industry × county-set. |
| Capacity funnel (workers → seats → funding) | **Do not fill** | Decision 6. Stages stay null. |
| GPU geo (deck.gl) | **Do not add** | No volume that requires it. |
| 3D, particles, autoplay, parallax | **Do not add** | No information. |

### If Cytoscape is approved for `/transition-map`

- Start focused on a selected origin, not all 28 edges at equal weight.
- Nodes: origin vs destination. Edges: published `tier` (Primary-Short / Primary-Long) and/or `zone_gap`, labelled in the legend.
- Do **not** encode `distance` (null) or color-only bands named near/moderate/far.
- Detail panel fields that exist: titles, SOC, origin loss, replacement %, zone gap, tier, destination employment and change, destination exposure.
- Detail panel fields that stay empty: transferableSkills, skillGaps, steps, local demand.
- Deterministic layout (cose-bilkent with seeded positions, or a layered dagre from origin).
- Table fallback remains the source of truth.
- Lazy-load the library. Destroy the instance on unmount. Respect `prefers-reduced-motion`.

### If MapLibre is approved for `/richmond-region`

Only after a **sourced** boundary file is added (Census TIGER or equivalent) with
provenance. Use it to show the MSA footprint and the 2023/24 county swap.
**Never** choropleth AI exposure or occupation counts by locality. Pair with
the QCEW table. If no boundary file is added, skip MapLibre.

## Visualization frame contract

Every data visual, including existing D3 figures once wrapped, must show:

- Declarative title
- Geography, period, unit, population
- Legend or direct labels (never color-only)
- Source and pin/synced date
- Limitation when the claim is Not supportable or Method
- Table or text alternative
- Empty / loading / error / partial states where data can be missing
- Keyboard operation where hover changes meaning
- A designed mobile layout (stack, not shrink)

Existing `VisualizationFrame` already carries provenance and table toggle.
Report `LiveFigure` uses source figure chrome (tier + lede). Keep both; don’t
duplicate frames around one chart.

## Motion

Filter and selection may use short opacity/position transitions.
`prefers-reduced-motion` already zeroes animation in `src/styles.css`. Graph
layouts must not rearrange on every visit (stable seed or stored positions).

## Copy

Do not rewrite findings to sound stronger. If overlay titles should become
questions (“Where can someone in this job go, among pairs the screen kept?”),
propose the wording in the implementation notes and keep the published sentence
next to it until approved.

Specialist terms already defined in `src/content/methodology.ts`: exposure,
adjacent, wage replacement, exposure-weighted jobs, mean exposure,
concentration. Surface those callouts near first use on overlay pages.

## Performance

- Lazy-load Cytoscape / Plot / MapLibre if added.
- Keep occupation JSON (~115 KB) on routes that need it; do not load it on home.
- ResizeObserver for any SVG that is not purely `viewBox` scaled.
- Measure before memoizing.

## Out of scope until a human decides

U1 employer/worker demos, U2 duplicate full report, U3 nav audience copy, U4
postings/seats, U5 locality exposure table.
