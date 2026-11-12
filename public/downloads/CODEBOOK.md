# Codebook

Every file here is produced by the pipeline in `scripts/`. Nothing in this directory is
edited by hand, and rerunning the pipeline overwrites all of it.

Geography is the Richmond, VA metropolitan statistical area, BLS area code 40060, unless
stated otherwise. Occupation codes are Standard Occupational Classification (SOC) codes.
Employment counts are rounded to the nearest ten by BLS at source. Wages are annual, in
nominal dollars for the year of the release.

Two conventions carry through every file. Suppressed cells are empty rather than zero —
BLS withholds estimates that would disclose an individual establishment, and an empty
value means "not published," never "no employment." And **exposure is not employment
change**: a score describes where an occupation's tasks appear in model interactions, not
what happened to its jobs.

---

## richmond_exposure_2025.csv

The analytical base. One row per detailed occupation in the May 2025 release that carries
both an exposure score and a national comparator. 523 rows, covering 88.4% of
metropolitan employment.

| Column | Type | Description |
|:---|:---|:---|
| `occ_code` | string | SOC code, `NN-NNNN` |
| `bls_title` | string | Occupation title as published by BLS |
| `employment` | float | Richmond employment, May 2025 |
| `loc_quotient` | float | Location quotient against the national employment share; 1.0 means the metro employs this occupation at the national rate |
| `annual_mean` | float | Mean annual wage, Richmond |
| `title` | string | Occupation title as published in the exposure dataset |
| `observed_exposure` | float | Anthropic observed task exposure, 0 to 1 — the share of the occupation's tasks appearing in measured model interactions |
| `nat_employment` | int | National employment, May 2025 |
| `nat_annual_mean` | float | Mean annual wage, national |
| `group` | string | SOC major group name |
| `exposed_jobs` | float | `employment × observed_exposure`; an exposure-weighted job count, not a count of affected workers |
| `wage_bill` | float | `employment × annual_mean` |

A zero in `observed_exposure` means the occupation's tasks did not appear in the sampled
interactions. It reflects absence of evidence, not demonstrated absence of exposure; 411
of the 756 occupations in the source dataset score exactly zero.

## richmond_three_point.csv

The same occupations tracked across the three most recent releases, for occupations
present in all of May 2023, May 2024 and May 2025. 487 rows.

| Column | Type | Description |
|:---|:---|:---|
| `occ_code` | string | SOC code |
| `bls_title` | string | Occupation title |
| `emp_23`, `emp_24`, `emp_25` | float | Employment in each May release |
| `lq_23`, `lq_24`, `lq_25` | float | Location quotient in each release |
| `observed_exposure` | float | Exposure score, held constant across all three years |
| `pct` | float | Percentage change in employment, 2023 to 2025 |
| `g` | string | SOC major group prefix, first two digits of the code |

The exposure score is a single national constant applied to all three years. It is not a
time series, and no part of this analysis treats a change in exposure as observed.

**The three releases are not three independent observations.** Each OEWS estimate pools
six semiannual survey panels, and consecutive releases share four of those six. One
discrete event therefore propagates through three consecutive vintages, which is why
movement across all three adds less confidence than it appears to.

## richmond_panel_2010_2025.csv

Sixteen OEWS vintages assembled into one long panel, one row per occupation per year.
This is the file that supports historical comparison, including the pre-generative-AI
placebo windows.

| Column | Type | Description |
|:---|:---|:---|
| `vintage` | int | Survey year, 2010 through 2025; all are May reference periods |
| `soc_version` | string | SOC classification revision in force for that vintage |
| `area_title` | string | Metropolitan area name as published in that vintage |
| `occ_code` | string | SOC code |
| `occ_title` | string | Occupation title as published in that vintage |
| `o_group` | string | `total`, `major`, or `detailed` — filter to `detailed` for occupation-level work |
| `tot_emp` | float | Employment estimate |
| `emp_prse` | float | Relative standard error of the employment estimate, in percent |
| `loc_quotient` | float | Location quotient |
| `a_mean`, `a_median` | float | Mean and median annual wage |
| `mean_prse` | float | Relative standard error of the mean wage |
| `emp_suppressed` | string | Set when BLS withheld the estimate |
| `source_file` | string | The published file each row was read from |

Three comparability warnings apply to any use of this panel across years.

**Geography changed.** The Richmond MSA was redelineated between the May 2023 and May
2024 releases: Caroline County left and King and Queen County entered. The affected
vintages differ by roughly 5,000 jobs, under 1% of metropolitan employment, and the shift
is near-constant across years — which is why it cannot account for an occupational
decline, but should still be disclosed in any level comparison.

**Classification changed.** `soc_version` records which revision applies. Occupations are
not continuous across SOC revisions; some are split, merged or renamed, and a code present
in both 2013 and 2025 does not always denote the same work.

**Coverage grew.** The number of occupations carrying a published estimate rises over the
series, so occupation counts are not comparable across distant years without matching.

Use `emp_prse` rather than treating estimates as exact. A change smaller than its own
sampling error is not a finding.

## coverage_excluded.csv

The 75 detailed occupations present in the May 2025 Richmond release but absent from the
analytical base, carrying 56,020 jobs. Published so the coverage claim can be audited
rather than taken on trust.

| Column | Type | Description |
|:---|:---|:---|
| `OCC_CODE` | string | SOC code |
| `OCC_TITLE` | string | Occupation title |
| `emp` | float | Richmond employment, May 2025 |

Occupations are excluded for lacking an exposure score or a national comparator, never for
scoring low. The exclusions are not neutral for the headline mean, though: the largest is
home health and personal care aides at 11,570 jobs, which would score at or near zero. If
every excluded job scored zero, mean metropolitan exposure would be 0.1241 rather than the
reported 0.1360. Treat that as the lower bound.

## qcew_fixed_geography.csv

Quarterly Census of Employment and Wages industry employment, aggregated over a fixed
county set so the series is comparable across the delineation change. QCEW counts jobs by
industry and has no occupational dimension, so it can corroborate direction but cannot
confirm an occupational claim.

| Column | Type | Description |
|:---|:---|:---|
| `naics` | int | NAICS industry code |
| `industry` | string | Industry title |
| `county_set` | string | `current_17` for the 2020-standards county set; `legacy_vs_current_YYYY` rows quantify the delineation difference |
| `emp_2019` … `emp_2025` | float | Annual average employment |
| `suppressed_county_year_cells` | float | Count of county-year cells BLS withheld within the aggregate; higher values mean a less reliable total |
| `emp_legacy`, `emp_current`, `difference` | float | Populated only on the delineation-comparison rows |

## Pathway and capacity tables

These support the transition capacity report and derive from O\*NET occupational
adjacency joined to the employment base. O\*NET terms apply — see
[`ATTRIBUTION.md`](../ATTRIBUTION.md).

| File | Contents |
|:---|:---|
| `displaced_occupations.csv` | The 33 declining exposed occupations, with employment lost |
| `destinations_screened.csv` | Candidate destination occupations and which screening conditions each passes |
| `pathways_reachable.csv` | Destination pairs surviving the O\*NET adjacency constraint |
| `binding_constraints.csv` | For each declining occupation, which condition blocks a transition |
| `non_adjacent_capacity.csv` | Capacity in occupations that qualify on wage and growth but are not adjacent |
| `trades_destinations.csv` | Skilled-trades destinations, with wage ratios against source roles |
| `decliners_vs_national.csv` | Richmond declines set against the national change for the same occupations |
| `national_gap_decomposition.csv` | Decomposition of the Richmond–national exposure difference |

## Text reports

The `.txt` files are human-readable transcripts of each analysis step, written alongside
the CSVs so an intermediate result can be inspected without rerunning anything.
`robustness.txt` is the most useful of them: it contains the full leave-one-out table,
the mirror screen, base rates, sampling-error tests, the sixteen-year baseline and the
placebo windows.
