# Infographic prompts

Static generated imagery is **not** the container for statistics, citations,
boundaries, or charts. Use it only for conceptual orientation. Exact labels
and numbers are native HTML/SVG after generation.

Inspected: `docs/page-audit.md`, `src/content/figures.ts`,
`src/content/methodology.ts`, `data/source/output/pathways_reachable.csv`,
`data/source/output/CODEBOOK.md`, `src/styles.css`.

Pages that should **not** get generated art: technical appendix; any live D3
figure; QCEW tables; the leverage/placebo charts.

---

## 1. Home — regional evidence, not a product shot

### 1. RECOMMENDATION

Generate a static infographic illustration

Reason: the home needs an emotional and geographic entry that is not a
dashboard tile and not a fake map of exposure.

### 2. COMMUNICATION GOAL

This is evidence about work in a metropolitan region, not a city postcard and
not a corporate AI transformation.

### 3. VISUAL STRUCTURE

Wide editorial still: layered urban–river–industrial fabric of a mid-Atlantic
metro, read left to right from older commercial core to dispersed employment
sites. Crop-safe left third for native title overlay. No charts, no pins, no
legible street names.

### 4. COPY-READY IMAGE PROMPT

Editorial illustration of a mid-sized American metropolitan region seen as
layered fabric rather than a postcard skyline: a river bend, rail and highway
corridors, mixed warehouse and office districts, and residential neighborhoods
held in the same warm tonal range. Contemporary but not trendy, civic and
human, tactile paper and ink, restrained ochre and deep teal-grey on warm
off-white. Wide landscape 16:9, generous empty band in the left third for
later typesetting, high crop-safe margins. No text, numbers, labels, logos,
charts, maps with legends, UI, watermarks, people in business poses, robots,
glowing brains, or holograms.

### 5. NEGATIVE PROMPT

handshake, lightbulb, puzzle pieces, rocket, robot head, neon, glassmorphism,
isometric corporate campus, fake choropleth, compass rose, seal, logo, tiny
illegible captions, stock-photo team, dystopian empty streets, stigmatized
workers

### 6. NATIVE OVERLAY PLAN

- Title: source text required (current home title is the exposure-report title)
- Eyebrow: Richmond VA MSA (BLS 40060)
- Lede: existing home lede in `src/routes/index.tsx`
- Pin line: `src/lib/pin.ts`

### 7. ACCESSIBILITY

Decorative if the same title and lede sit in HTML. Alt empty or “Decorative
illustration of a metropolitan region.” Informational equivalent is the page
header.

### 8. RESPONSIVE CROPS

Desktop wide: full 16:9 behind header. Tablet: crop right. Mobile portrait:
crop to left third (empty band + partial fabric). Social: 1.91:1 from center.

### 9. CODE-RENDERED ALTERNATIVE

Editorial layout only; no chart. Native HTML header already carries the point.

---

## 2. Transition Map — orientation, not the 28 pairs

### 1. RECOMMENDATION

Build a code-rendered visualization instead

Reason: the evidence is 28 screened pairs with numeric replacement and zone
gap. A generated “network” would fake structure. Optional small illustration
may sit **above** the explorer as metaphor only.

If a static image is still wanted for the metaphor layer:

### 2. COMMUNICATION GOAL

From one job, only a few neighbouring jobs survived a screen; most neighbours
are missing.

### 3. VISUAL STRUCTURE

Transit-interchange metaphor: one platform (origin) and a handful of corridors,
some spanning, some broken. Native labels for occupation names sit outside the
image.

### 4. COPY-READY IMAGE PROMPT

Quiet editorial diagram-like illustration of a small rail interchange: one
central platform and several corridors, some complete, some ending in
unfinished spans, viewed from a slight elevated angle. Warm off-white paper,
near-black ink lines, one ochre highlight on the completed spans only. No
trains with logos, no readable signage, no network hairball, no people. Aspect
3:2, empty margins on all sides. Omit all text, numbers, labels, logos, charts,
maps, UI, and watermarks.

### 5. NEGATIVE PROMPT

subway map with station names, hairball graph, GPS pins, ladder, stepping-stone
clipart, glowing paths, 3D glossy terminals

### 6. NATIVE OVERLAY PLAN

- Occupation titles, SOC codes, replacement %, zone gap, tier — from
  `pathways_reachable.csv` only
- Legend for whatever encoding the code viz uses
- Caveat: a pair is not a recommendation
- Source: pathways_reachable.csv, pin

### 7. ACCESSIBILITY

If used, decorative. Informational equivalent is the pair table.

### 8. RESPONSIVE CROPS

Desktop: 3:2 above the explorer. Tablet/mobile: omit the image; keep the table.

### 9. CODE-RENDERED ALTERNATIVE

Origin-first list plus optional Cytoscape/SVG of the 28 edges. Table fallback
required.

---

## 3. Transition Capacity — bottleneck, not a funnel of missing inputs

### 1. RECOMMENDATION

Generate a static infographic illustration **and** keep DestinationScarcity as
the evidence graphic.

Reason: the published idea is “capacity exists, reach does not.” A reservoir
and blocked channels can carry that metaphor. The waffle/neighbour counts must
stay in code.

### 2. COMMUNICATION GOAL

Good jobs were created; almost none sit next to the work that disappeared.

### 3. VISUAL STRUCTURE

Reservoir (durable hiring) with channels toward a smaller basin (displaced
clerical work); most channels silted or gated. Native numbers overlay the
gaps, not the image.

### 4. COPY-READY IMAGE PROMPT

Editorial illustration of a wide calm reservoir feeding several narrow
irrigation channels toward a lower basin; most channels are silted, gated, or
broken, a few remain open. Topographic, tactile, ink and wash on warm paper,
deep teal-grey water, ochre only on the open channels. No pipes with gauges, no
corporate infographic icons, no numbers. Landscape 16:9, quiet sky area in the
upper fifth for a title overlay. Omit all text, numbers, labels, logos, charts,
maps, UI, and watermarks.

### 5. NEGATIVE PROMPT

funnel chart, pipeline infographic, valve wheels with dials, dollar signs,
factory clipart, workers as droplets, fake percentages in the water

### 6. NATIVE OVERLAY PLAN

- Figure title and lede from `FIGURES.pathways` (source copy)
- Counts from DestinationScarcity / binding_constraints.json
- Report summary items (verbatim)
- Note that openings, seats, and funding are **not** in the source (U4)

### 7. ACCESSIBILITY

Informational only if caption states the metaphor. Equivalent text: the
pathways lede and the numbered summary. Alt: “Conceptual illustration of a
reservoir with mostly blocked channels; data are in the figure and table
below.”

### 8. RESPONSIVE CROPS

Desktop: full-width band. Mobile: crop to the gated channels; keep HTML
findings first.

### 9. CODE-RENDERED ALTERNATIVE

Existing DestinationScarcity D3 waffle. Do not replace it with this image.

---

## 4. Richmond Region — code, not a generated map

### 1. RECOMMENDATION

Build a code-rendered visualization instead

Reason: geography here is a **definition** (MSA 40060, county swap) and an
industry series. Generated maps invent boundaries and labels. No locality
exposure layer exists (U5).

### 9. CODE-RENDERED ALTERNATIVE

HTML/SVG schematic of the delineation change (Caroline out, King and Queen in)
plus Observable Plot or table for `qcew_fixed_geography.csv`. MapLibre only
with a sourced TIGER file and no exposure choropleth.

---

## 5. Exposure report and methodology

### 1. RECOMMENDATION

Use editorial layout only; no new visual needed

Reason: six live figures plus static analysis PNGs already carry the argument.
Methodology is definitions and limits. Generated art would compete with
evidence.
