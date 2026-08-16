# Page audit — visual transformation

Audited 2026-08-16 on branch `visual-transformation`, which contains:

- Prompt 1 scaffold (`origin/main` at `21f7f7e`)
- Prompt 2 migration (`migrate-source-content` at `7686cf1`)

**Gap:** Lovable-synced `main` still has only the scaffold. Prompt 2 is not on `main`. This branch is cut from the migration, not from `origin/main`. Starting from `main` would lose the reports, tables, and figures; replacing them would invent research.

Pin: `hack4rva/richmond-ai-impact-analysis@b8728fc84b5ea8da12247d6f64fd8cd290598301`.

No thesis below is manufactured. Where the page has no finding, that is stated.

## Shared diagnosis

After Prompt 2 the site is a **faithful document dump inside Lovable chrome**. Reports render pinned markdown as HTML with live D3 figures at claiming sections. Overlay routes (`/transition-map`, `/transition-capacity`, `/richmond-region`) still read as reserved dashboards: empty calculator, Cytoscape placeholder, MapLibre placeholder.

What is missing is not more data. It is **narrative architecture**: 10-second point, 2-minute findings, 20-minute evidence — without rewriting the pinned prose.

Libraries already in the tree: D3 (scale/format/dsv) for the six source figures. Cytoscape, Observable Plot, MapLibre, and deck.gl are **not** installed.

---

## `/` — Overview

| Field | Finding |
| --- | --- |
| Primary audience | Working group, regional leaders, anyone arriving cold |
| Primary question | What evidence exists about AI-exposed work in this metro, and where do I start? |
| Thesis (supported) | 523 occupations covering 88.4% of metropolitan employment, joined from Anthropic observed-task exposure and BLS OEWS. Two of the most quotable numbers are labelled **not supportable**. |
| Supporting findings | Three published reports; pin `b8728fc84b5e`, synced 2026-07-31 |
| Essential evidence | Report cards; the not-supportable warning; analysis pin |
| Concepts to explain | MSA vs city; “not supportable”; exposure ≠ displacement |
| Visual form | Editorial layout. Optional conceptual infographic (not data). No chart required on the home. |
| Buried / confusing | Overlay-route cards (“Map, capacity, and region”) compete with the reports. Nav still says “Transition Map” as if a network existed. |
| Must remain visible | Not-supportable warning; MSA geography; pin; no employer/worker demonstrator as evidence |
| Need | Editorial restructuring. Not a new visualization library. |

**10 / 2 / 20**

- 10s: this is occupation-level evidence for the Richmond VA MSA, and some famous numbers fail their own tests.
- 2m: three reports, what each answers, which figures are live.
- 20m: not this page — the reports.

---

## `/research` — Library

| Field | Finding |
| --- | --- |
| Primary audience | Readers choosing a document |
| Primary question | Which report do I need? |
| Thesis | None beyond “these three documents are the evidence base.” |
| Supporting findings | Blurbs from `src/content/figures.ts` `REPORTS` (source copy) |
| Essential evidence | Titles, blurbs, live-figure counts |
| Visual form | Editorial list, not a card wall. Search/filter already exist and are useful. |
| Need | Hierarchy: lead with the two argumentative reports, appendix as companion. |

---

## `/research/ai-exposure-and-employment-change` (and `/report/…` redirect)

| Field | Finding |
| --- | --- |
| Primary audience | Working group; anyone quoting regional AI-employment numbers |
| Primary question | Where does AI-exposed work sit, and what happened to employment in it between May 2023 and May 2025? |
| Thesis (from source blurb, not rewritten) | Where AI-exposed work sits in the Richmond economy, what happened to employment in it between May 2023 and May 2025, and which of those movements survive a robustness battery. |
| Supporting findings | Report’s own six numbered summary items (verbatim in `keyFindings`) |
| Essential evidence | Occupation explorer (Method); leverage jackknife (**Not supportable**, 4.37%); wage premium (Defensible); placebo (**Not supportable**); trajectories (Defensible); static PNG figures in the markdown |
| Concepts | Exposure; sampling error / *z*; zero = unmeasured; OEWS not a time series; delineation change |
| Visual form | **Keep existing D3 islands.** They already sit at the claim. Do not replace them with Plot or Cytoscape. Recompose the **page chrome** so Summary of findings is the 2-minute layer, then the document. |
| Buried | Thesis is the report title; the 10-second point is inside section 1 of a long HTML document. TOC is a PDF contents list. |
| Must remain visible | Claim tiers on live figures; 4.37% Not supportable; zeros as absence; geography MSA 40060 |
| Need | Combination: editorial restructuring **around** the pinned HTML, not a rewrite of it. |

**Gap:** none for a thesis. The summary exists. The page does not **surface** it before the full document.

---

## `/research/transition-capacity` (full document)

| Field | Finding |
| --- | --- |
| Primary audience | Working group designing a pilot |
| Primary question | Do occupations that contracted have adjacent, durable, better-paid destinations here? |
| Thesis (source blurb) | Whether contracted occupations have adjacent, durable, better-paid destinations, and what the region would have to build where they do not. |
| Supporting findings | Report’s numbered summary (verbatim). Headline relation: capacity exists, reach does not. |
| Essential evidence | DestinationScarcity (Defensible); binding constraints; pathways table |
| Concepts | Adjacent ≠ easy; wage replacement; job zone; exposure vs loss |
| Visual form | Keep DestinationScarcity. Page chrome should lead with the published summary, then the document. |
| Must remain visible | Adjacency is transferable skill, not likelihood; 8% reachable for displaced clerical (report’s figure — do not round or restyle into a stronger claim) |

---

## `/research/technical-appendix`

| Field | Finding |
| --- | --- |
| Primary audience | Auditors, replicators |
| Primary question | Can I check the numbers? |
| Thesis | None. It is a companion of generated tables. |
| Visual form | Tables. Do not infographic this page. Widen the measure; keep pin and source table. |
| Need | Editorial: treat as a reference, not a story. Sticky section nav. Horizontal tables already exist. |

---

## `/transition-map`

| Field | Finding |
| --- | --- |
| Primary audience | Someone asking “from this occupation, what destinations survived the screen?” |
| Primary question | Which origin→destination pairs survived adjacency, growth, pay, and exposure screens? |
| Thesis (supported by the CSV, not a slogan) | 28 screened pairs. A pair is in the table because it survived the capacity report’s screen — not because a network scored it. |
| Supporting findings | Published columns: `tier`, `replacement`, `zone_gap`, origin loss |
| Essential evidence | `pathways_reachable.csv` (28 rows) |
| Concepts | Adjacent; wage replacement; job-zone gap. **Not in the file:** transferable skill lists, skill gaps, 0–1 distance, local demand, “show me the path” beyond one hop |
| Data suited to | Small directed graph **or** origin-centered list. Not a metro-wide hairball. |
| Buried | The actual table is behind “view as table.” The stage is a Cytoscape placeholder that says the source had none. |
| Must remain visible | A pair is not a recommendation; skill lists stay empty; distance stays null |
| Need | Interactive visualization of **existing edges**, origin-first, plus table fallback. |

**Do not manufacture:** transition distance as a 0–1 score; skill-gap lists; multi-hop paths not in the CSV.

**Cytoscape vs smaller tool:** 28 edges, roughly two dozen nodes. Cytoscape can layout an origin-focused neighborhood. Native SVG/HTML can do the same with less weight. See `docs/visual-system.md`. Either way, encode **zone_gap** and **replacement**, which exist, not a fictional distance band.

---

## `/transition-capacity` (overlay route)

| Field | Finding |
| --- | --- |
| Primary audience | Same as the capacity report, arriving via nav |
| Primary question | Same as `/research/transition-capacity` |
| Thesis | Same published summary. Interim decision 10: this route **quotes** the summary and hosts the pathways figure; it is not a second full copy (U2). |
| Supporting findings | Verbatim numbered items from the report |
| Essential evidence | `LiveFigure id="pathways"` |
| Buried / confusing | Empty six-stage calculator, empty demand/seats panels, inert scenario controls **follow** the findings and imply a model the source does not run. That is the opposite of a visible reasoning chain. |
| Must remain visible | Calculator values null; U4 (no openings/seats file); adjacency definition |
| Need | Editorial restructuring: published chain is **loss → neighbour screen → viable destinations → wage-replacement test**. Do not fill exposed→openings→seats→funding. Demote or remove the empty funnel from the 2-minute layer. |

Prompt 3’s example chain is **not supported** by the current data (migration decision 6, U4). The page must not imply it.

---

## `/richmond-region`

| Field | Finding |
| --- | --- |
| Primary audience | Anyone who might confuse city and MSA |
| Primary question | What geography and which regional series does this analysis use? |
| Thesis (codebook) | Geography is the Richmond, VA MSA, BLS 40060, unless stated otherwise. Not the City of Richmond. 523 occupations, 88.4% of metro employment. QCEW current 17-county set is constant geography for industry series. |
| Supporting findings | Delineation: Caroline left, King and Queen entered, May 2023→2024. QCEW total 667,860 (2025 annual average, labelled as QCEW not OEWS). |
| Essential evidence | `qcew_fixed_geography.csv`; codebook; methodology limits |
| Concepts | MSA vs city; OEWS vs QCEW; suppression ≠ zero; QCEW has no occupation dimension |
| Visual form | Comparison table and industry time series. **Not** an exposure choropleth (U5). MapLibre only if we add a **sourced** MSA/county boundary file and use it to explain delineation — not to plot occupation exposure. No such GeoJSON is in this repository. |
| Buried | The MapLibre placeholder occupies the visual stage; the QCEW table is the actual evidence. |
| Need | Editorial + Observable Plot or native SVG for QCEW series. Optional schematic of county-set change. No locality AI-exposure map. |

---

## `/methodology`

| Field | Finding |
| --- | --- |
| Primary audience | Anyone about to quote a number |
| Primary question | What can these data support, and what can they not? |
| Thesis | The defensible claim is three named clerical occupations contracted against a growing metro, distinguishable from sampling error; comparably exposed clerical work beside them did not. Not that exposure predicts decline, and not that AI caused it. (Pinned methodology, not paraphrased here as a rewrite.) |
| Essential evidence | Full `methodology.md` and `robustness.md` HTML |
| Buried | Definition cards repeat terms that also appear in the full documents. Robustness table is below a long paste. |
| Need | Editorial: 10-second defensible claim + definition strip; 2-minute limits; 20-minute full documents in a readable column. Do not paraphrase metrics. |

---

## Routes not on this site

| Source path | Status |
| --- | --- |
| `/employer`, `/worker` | Unresolved U1. Simulated. Not audited as visual targets. |

---

## Classification summary

| Page | Restructuring | Keep D3 | New code viz | Static infographic | Heavy geo/graph lib |
| --- | --- | --- | --- | --- | --- |
| `/` | Yes | — | No | Optional conceptual | No |
| `/research` | Light | — | No | No | No |
| Exposure report | Yes (chrome) | Yes | No | No (data already charted) | No |
| Capacity report | Yes (chrome) | Yes (pathways) | No | Optional conceptual | No |
| Appendix | Light | — | No | No | No |
| `/transition-map` | Yes | — | Yes, origin-first pairs | Optional orientation | Cytoscape only if chosen over SVG |
| `/transition-capacity` | Yes (demote empty chain) | Yes | Plot optional for published counts | Optional bottleneck metaphor | No funnel of nulls |
| `/richmond-region` | Yes | — | Plot/SVG for QCEW | No fake map | MapLibre only with sourced boundaries, no choropleth |
| `/methodology` | Yes | — | No | No | No |
