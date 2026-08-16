# Migration notes

Decisions, unresolved items, and follow-up. Written during the 2026-08-16
migration of `richmond-ai-impact-site` into `ford-at-home/richmond-pathfinder-data`.

## Decisions already made (do not reverse without a human)

1. **Source is the Astro analysis site, not the Nuxt Career Transition Map.**
   The Lovable scaffold’s routes (Transition Map, Transition Capacity, Richmond
   Region, Research, Methodology) match the analysis site’s reports and tables.
   `career-transition-map` is a password-gated prototype with a different rules
   engine. Mixing the two would change the meaning of every figure.

2. **Reports stay byte-identical.** The three markdown files are pinned by
   SHA-256 in `data/source/analysis.lock.json`. The site splits them on `##`
   and places figures by section number. It does not edit the files.

3. **Geography is the Richmond VA MSA (BLS 40060), not the City of Richmond.**
   OEWS vintages change county composition between May 2023 and May 2024
   (lost Caroline, gained King and Queen). QCEW tables hold a 17-county
   current set for comparison. Do not substitute city for region.

4. **A zero exposure score is absence of measurement, not safety.** 411 of 756
   occupations in the Anthropic file score exactly 0.0000. Do not render that
   as a low value or average it in as a zero.

5. **The 4.37% aggregate and the placebo screen are labelled Not supportable
   by the analysis itself.** The UI must keep those labels.

6. **Do not fill the scaffold’s six-stage capacity calculator.** The published
   transition-capacity report does not compute
   exposed-workers → openings → seats → funding → remaining-gap. Putting
   numbers in those slots would invent a model. Stage values stay empty until
   a human decides that chain exists in the source.

7. **Do not invent a Cytoscape network or a MapLibre choropleth.** The source
   has neither. The transition map’s source behavior is the screened
   origin→destination table (`pathways_reachable.csv`) plus the occupation
   explorer scatter. The region page’s source behavior is MSA definition +
   QCEW fixed-geography industry series. Placeholders for future libraries
   may remain, labelled as not in the source.

8. **Employer and worker demonstrators are not migrated in this pass.**
   They run on invented employers and a simulated roster. The source itself
   says “The demonstrator is not evidence.” Putting them on this civic site
   without an explicit product decision would change the intended audience
   and mix simulated headcount with measured occupations. Recorded as
   unresolved rather than ported.

9. **No aesthetic redesign.** Chart components keep their source CSS, scoped,
   rather than being rewritten in the Lovable visual language.

## Unresolved — stop and ask before filling

| ID | Question | Why it matters |
| --- | --- | --- |
| U1 | Should `/employer` and `/worker` exist here at all, even with the four-tier provenance tags? | Changes intended audience and mixes simulated entities into a sourced-only scaffold. |
| U2 | Should `/transition-capacity` be the full report (same as `/research/transition-capacity`) or a shorter briefing that only quotes published findings? | Duplicate routes vs a paraphrase risk. |
| U3 | The scaffold nav asks “where can I find people…” (employer) and “if my occupation changes…” (worker). Keep that framing, or match the source home which leads with the reports? | Audience / claims. |
| U4 | Hiring-demand / job-postings and training-seat counts have no file in the source. Leave null forever, or wait for a new dataset? | Inventing them would be a new analysis. |
| U5 | Per-locality comparison table: QCEW in the source is industry × county-set, not occupation × locality. A city/county table of AI exposure cannot be built from these files. | Substituting Richmond city for the MSA. |

## Follow-up

- Port Playwright coverage for figure interaction (source `tests/report.spec.ts`).
- Wire `scripts/build-data.mjs` so JSON in `src/content/data/` regenerates from `data/source/output/` inside this repo.
- Add `/report/$slug` redirects once the research routes render.
- If U1 is yes, copy the demo as a clearly labelled sandbox with `isPlaceholder`/`simulated` on every invented record — never on the occupation figures.
