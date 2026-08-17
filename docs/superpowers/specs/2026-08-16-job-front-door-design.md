# Job front door — design

Date: 2026-08-16
Repo: `richmond-pathfinder-data` (Lovable / TanStack Start)
Status: approved direction — B now, C after B ships

## Problem

The public site currently opens as a research library (six equal nav peers). The product is one question: given a Greater Richmond job, is AI already in that work, and if so, which nearby jobs pay more and use AI less.

The Career Transition Map Nuxt app already answers that from generated `workforce.json`. That app is frozen. Do not edit it. Do not delete it. Pathfinder becomes the public surface.

## Sequence

- **B (this spec’s implementation):** copy a slim slice of the generated occupation+route file into Pathfinder. Home is the exposed-job map (39 origins, four families). Job page shows exposure and destinations.
- **C (later, separate plan):** move `scripts/build-workforce.mjs` into Pathfinder so the copy from Nuxt goes away. Do not start C during B.

## In-scope origins (not all 523)

The front door is **not** a lookup of every regional job. It is the jobs the Anthropic exposure report actually concentrates on.

The published finding: four major occupational groups hold **75.6%** of Richmond’s measured exposure while employing 33.8% of covered workers (`data/source/reports/ai-exposure-and-employment-change.md` §2; appendix table C). There are only 22 groups in that table, so “top 25–50 families” cannot mean 25–50 major groups. The 25–50 range is the **occupation count inside those families**, using the report’s own exposed cut.

**An origin is in scope if and only if:**

1. Its analysis `group` is one of:
   - Office & Administrative Support
   - Sales
   - Business & Financial
   - Computer & Mathematical
2. Its Anthropic observed-task exposure is **≥ 0.25** (appendix table D’s cut; 73.7% of metropolitan exposure sits in occupations at or above this line)

That is **39 jobs** on the current pin (11 office, 7 sales, 7 business/financial, 14 computer). 36 of them have at least one engine destination. The three without (`13-1151` Training and Development Specialists, `13-2052` Personal Financial Advisors, `13-2054` Financial Risk Specialists) still appear; they get the empty-route paragraph, not a 404.

**Not in search, not listed as origins:** the other 484 occupations, including No-signal healthcare roles, transportation, and exposed jobs outside the four families (teachers, paralegals, medical records, curators). Those jobs may still appear as **destinations**. A destination row does not have to be an origin. Linking through to `/job/$soc` for an out-of-scope code shows title, exposure, and “This job is a destination on the map, not one of the 39 starting jobs” — no further hop list.

Do not invent a separate “top 50 by exposure mass” ranking. Ranking all 523 by `employment × exposure` pulls in Cashiers and General and Operations Managers, which the report does not treat as exposed. The four-family list plus ≥ 0.25 is the report’s ranking.

## Out of scope (B and C)

- Editing or deleting the Nuxt Career Transition Map
- Employer vs worker doors, resume paste, LLM extract, hiring reverse-index, cyber credential ladder
- Stay-in-role “higher margin with AI skills” (no sourced measure)
- Filling the capacity funnel, inventing occupation × locality rows, MapLibre
- Rewriting pinned analysis markdown
- Showing the 28-pair `pathways_reachable.csv` table as the front-door map

## Two graphs, one public ruleset

| Graph | What it is | Where it lives after B |
|---|---|---|
| **Front-door routes** | O\*NET-related jobs that pay 5–100% more and are meaningfully less exposed. Unmeasured destinations (exposure exactly 0) are barred. | Copied slice of CTM `workforce.json` |
| **Analysis pairs** | 28 rows / 17 origins that survived the capacity report’s declining-origin screen | `/transition-map`, linked from Evidence only |

The front door uses the first graph only, and only for the 39 in-scope origins. A 28-pair row whose origin is outside the four families (example: Paralegals) is not on the front door. The analysis page may still show it, labelled as the published screen.

Origin **inclusion** uses the report cut **0.25**. Destination **safety** and the High badge still use the generator’s **0.30** (`EXPOSED_AT`) and `SAFE_BELOW = 0.10`. Research charts keep `EXPOSURE_THRESHOLD = 0.25`. Do not merge these into one number.

## Data for B

Source file (read-only): `../career-transition-map/app/data/workforce.json` (override with `CAREER_TRANSITION_MAP`). Generated 2026-08-15. ~594 KB.

Pin script writes a **slim** JSON plus a lock file:

- Keep: `meta`; **39 origin** occupations (`soc`, `title`, `group`, `exposure`, `employment`, `wage`, `zone`, `aligned`, `adjacent`); programs referenced by any `programIds`
- Destination fields kept: `soc`, `title`, `group`, `tier`, `wage`, `exposure`, `wageGain`, `zone`, `build`, `programIds`, `leadProgramId`, `timeBand`, `timeSource`, `openDoor`
- Drop: the other 484 occupations as origins; `description`, `tasks`, `trend`, `carries`, `familyExposure`, unused programs, `funding`, `gaps`, `aiPrograms`, `groups`
- Out-of-scope destination pages read title/exposure from existing `occupations.json` (already 523 rows). Do not duplicate them into the workforce slice.

The pin **fails** (no write) if:

- the source file is missing
- in-scope origin count ≠ 39 (recompute from occupations.json with the two rules above; if the underlying pin changes, the test changes with it — do not hardcode a different list by hand)
- any origin is outside the four families or has exposure `< 0.25`
- any origin `soc` disagrees on `exposure` with `src/content/data/occupations.json` (exact)
- any destination has `exposure === 0`

Provenance is a `workforce.lock.json` (source path, generated date, sha256) and a short note in `vendor/` or `data/workforce/PROVENANCE.md`. Same pattern as `analysis.lock.json`.

## Product rules on the front door

Copied in substance from the Nuxt product rules; the UI must still obey them.

1. Never rank, score, or grade a person.
2. Gap lists are arithmetic (O\*NET skill levels), not a judgement of the reader.
3. Exposure of exactly `0` is **No signal**, never “0%”, never “safe”, never a destination.
4. “No next job” is not “at risk.” The model only offers moves that pay 5–100% more and are meaningfully less exposed.
5. Same-or-lower job zone renders as “Same preparation level”, never “no schooling needed.”
6. Published courses appear only when `programIds` is non-empty. Absence is omitted, not “none needed.”
7. Headings stay under 48 characters and avoid source vocabulary: occupation, credential, feeder, adjacency, provenance, cohort. Say job, course, next jobs.

## Information architecture

Primary nav (exactly two items):

1. **Find a job** → `/`
2. **Evidence** → `/research`

Existing routes keep their URLs. They are not deleted. They are reached from Evidence (and leftover bookmarks), not as equal doors.

| URL | After B |
|---|---|
| `/` | Job search (replaces reports-first home) |
| `/job/$soc` | One job: exposure + next jobs |
| `/research` | Reports library; also links to map / capacity / region / methodology |
| `/research/$slug`, `/report/$slug` | Unchanged |
| `/transition-map` | 28-pair analysis explorer (Evidence) |
| `/transition-capacity` | Unchanged (Evidence) |
| `/richmond-region` | Unchanged (Evidence) |
| `/methodology` | Unchanged (Evidence) |

Unknown `$soc` → 404.

## Screen 1 — home

One sentence (ELI18), then the 39 jobs, grouped by the four families:

> These are the Greater Richmond jobs where people already use AI a lot. Pick one to see nearby jobs that pay more and use AI less.

- Default view: four family headings, jobs under each, ordered by exposed-jobs (`employment × exposure`) descending. 39 rows is one screen; do not paginate.
- Search filters that list (same ranking as Nuxt `searchOccupations`, but only over the 39). Query shorter than 2 characters shows the full grouped list, not an empty result.
- Each row: title, percent (all 39 have a measured exposure > 0). No No-signal badge on this screen — those jobs are not here.
- Autofocus the input.
- One quiet line: `Four job families hold three-quarters of the region’s measured AI use. This list is those families, at the report’s 25% exposure cut. It is not every job in Richmond.`
- No industry picker, no employer name, no paste box, no 523-job browse.

## Screen 2 — `/job/$soc`

**Tier 1 (always visible)**

- Job title (O\*NET/BLS title, not paraphrased)
- Band + one sentence from `BAND_MEANING` (exact strings below)
- Percentage of tasks only when `hasSignal`
- If any `aligned` or `adjacent` rows exist: one list, “Next jobs that pay more and use AI less.” Flatten family split; optional quiet “same family” / “different family” on the row is allowed, not a second door.
- Sort: relatedness tier (`Primary-Short`, `Primary-Long`, `Supplemental`), then wage gain descending.

**Tier 2 (on the same page, not another route)**

- Per destination: pay (and gain), destination exposure band, job zone / time band if present, skill names in `build` (names only, not 0–7 scores), published course name if `leadProgramId` resolves.

**Tier 3**

- One collapsed “Where these numbers come from” using `meta` (exposure, wages, related work, training). Limits: skill ratings are national averages; relatedness is national; pay is a regional midpoint; courses must be checked with the provider.

**Empty routes (in-scope origin, zero destinations)** — exact substance, including the three known empties:

> This map only lists a next job that pays 5–100% more and is meaningfully less exposed. No such neighbour is in the data. That usually means this job is already near the top of its ladder, or that the only safer, better-paid related work is a second career. It does not mean the job is at risk.

**Out-of-scope `/job/$soc`** (a destination that is not one of the 39): title, percent if measured, No-signal copy if exposure is 0, and “This job is a destination on the map, not one of the 39 starting jobs.” No hop list.

**No 523 browse.** Nurses, truckers, and other No-signal jobs are not searchable origins.

## Exposure bands (front door)

Cut points are the generator’s, not a design choice:

- `EXPOSED_AT = 0.30`
- `SAFE_BELOW = 0.10`

| Band | Test | Meaning (verbatim) |
|---|---|---|
| No signal | `value == null \|\| value === 0` | This job is not in the data at all. That means nobody measured it — not that AI leaves the work alone. |
| Low | `> 0` and `< 0.10` | People rarely use AI for this kind of work. |
| Medium | `>= 0.10` and `< 0.30` | People use AI for some of this work. |
| High | `>= 0.30` | People already use AI for a lot of this work. |

Front-door origin counts on the current file: **39 jobs, 4 families, 36 with destinations.** The 248 No-signal occupations are out of scope, not shown as “safe.” Research pages still use all 523.

## Visual

Instrument Editorial already on the chrome: paper/ink, one orange signal, Inter Tight / Newsreader / IBM Plex Mono, radius 0, no shadow. Do not add a second palette. Do not restyle D3 research figures.

Home and job pages use existing `PageHeader` / `ProseContainer`. Search is an always-visible field plus a list, not a modal (`cmdk` CommandDialog is the wrong pattern here).

Narrow viewports (320 / 390): one column; do not truncate the job title on the result row.

## Testing (B)

Vitest, node environment, `tests/**/*.test.ts`. No new dependencies. No e2e harness in this repo.

Must pin:

- exactly 39 origins; every one is in the four families and has exposure ≥ 0.25
- exposure join with `occupations.json` is exact
- `Registered Nurses` and other out-of-scope titles are not in `searchOccupations`
- `searchOccupations('customer')` returns Customer Service Representatives; `searchOccupations('nurse')` does not return Registered Nurses; queries shorter than 2 characters return `[]` (the home page shows all 39 grouped in that case)
- no destination with `exposure === 0`; no destination more exposed or lower-paid than its origin
- 36 of 39 origins have at least one route; the three empty SOCs are the ones named above
- `primaryNav` is exactly Find a job (`/`) and Evidence (`/research`)
- `EXPOSURE_THRESHOLD === 0.25` still used by research movement/leverage code
- empty-route copy exists as a module string the job page imports

## Success

A first-time reader sees four named families and a short list of jobs, picks one they recognise, and sees a next job that pays more and uses AI less — without wandering 523 titles or a research library.

## C (later)

Replace the pin-from-Nuxt script with a generator in this repo that reads Pathfinder’s pinned 523 occupations, vendored O\*NET skills + related occupations, and the regional course catalog. Output the same 39-origin JSON shape B already renders. Filter origins with the same four-family + ≥ 0.25 rule. Do not emit the other 484 as starting jobs.

Do not start C until B is on `main` and the job page is the thing people open.
