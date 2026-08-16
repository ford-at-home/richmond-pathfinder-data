# Methodology

The analysis joins Anthropic's occupation-level observed task exposure to BLS OEWS
employment by SOC code, producing exposure-weighted job counts and employment changes for
the Richmond metropolitan area. The full formal treatment is Section 1 of the main report
and Section B of the technical appendix; this page covers the construction, the metrics,
and the limits that any use of the data needs to carry.

## The join

| Input | What it supplies |
|:---|:---|
| Anthropic Economic Index | `observed_exposure` for 756 SOC occupations |
| BLS OEWS metro | Richmond employment, wages, location quotient, relative standard errors |
| BLS OEWS national | The benchmark employment share each local figure is compared against |
| O\*NET | Occupational adjacency and job zones, for the capacity analysis |

Anthropic published the full 756-occupation file, not only the ten occupations appearing
in the paper's figures. The full file is what this analysis uses.

The join is SOC-based and produces 523 matched occupations covering 88.4% of metropolitan
employment. The 75 unmatched occupations are published in `output/coverage_excluded.csv`
so the coverage claim can be audited rather than accepted.

## Core metrics

| Metric | Definition |
|:---|:---|
| Exposure-weighted jobs | `employment × observed_exposure`, summed |
| Mean exposure | exposure-weighted jobs ÷ employment |
| Concentration | occupations with exposure ≥ 0.25 **and** location quotient ≥ 1.10 |
| Richmond-specific shortfall | actual employment minus a counterfactual applying the national rate of share decline to the local 2023 share |

The 0.25 threshold is a chosen cut point, not a value Anthropic designates as meaningful.
`scripts/thresholds.py` reports how every headline moves across alternative cut points,
and the sensitivity table is published rather than summarized: the 0.25 and 0.30 cut
points select the same occupations, so the figure sits on a plateau rather than a knife
edge, while the wage separation holds at every threshold tested.

## What the exposure measure is

The share of an occupation's tasks appearing in measured interactions with one provider's
models. Three inputs are combined by Anthropic before publication: the O\*NET task
taxonomy, which establishes what tasks constitute each occupation; Anthropic's usage data,
which supplies the observed numerator; and the task-level capability estimates of Eloundou
et al. (2023).

It is a national constant. This analysis applies it identically to every year, and no part
of the work treats a change in exposure as observed.

## Limits that travel with any claim

These are not hedges. Each is a real constraint on what the data can support.

**Exposure is not displacement.** The measure captures where tasks are being delegated,
and some share of that is augmentation. "Exposed" is not a synonym for "at risk."

**The instrument is one provider's traffic.** Occupations rank high partly because that
provider's customers work in them. The 411 occupations scoring exactly zero hit a sampling
floor — tasks too rare in the data to clear a threshold — which is not a safety guarantee.
Published comparisons find exposure measures diverge substantially at the occupation
level, so the occupational rankings here are specific to this measure.

**OEWS is not a time series.** BLS states this explicitly. Two breaks sit inside the
Richmond panel: the metro lost Caroline County and gained King and Queen County between
the May 2023 and May 2024 vintages, and the pooled six-panel sample design means one
discrete event surfaces as three consecutive declining vintages. Monotonic movement is
therefore not evidence of a gradual process, and it dates the event earlier than the
release labels suggest.

**Report intervals, not points.** OEWS publishes `EMP_PRSE` for every metro cell. Median
relative standard error is around 9.6 and runs 10 to 21 on small occupations, so a bare
employment change is not yet a finding. The three headline declines are reported because
each is many times its own sampling error.

**No causal identification.** Office support has been shrinking since well before 2022.
Offshoring, ERP consolidation, interest rates, post-pandemic normalization and hybrid-work
restructuring are live alternatives, and the pre-2020 placebo windows show comparable
exposed-versus-rest gaps arising without AI.

**Employer mapping is inferred** from industry staffing patterns. No employer publishes an
occupational breakdown, so the employer section carries no implied precision.

Two structural limits deserve separate statement. Because exposure is a national constant,
it cannot by construction explain the portion of a local decline that exceeds the national
decline at the same score. And the measure is built from model traffic observed *after*
the employment change it is used to explain, which admits reverse causality: an occupation
can score high because its remaining staff absorbed departed colleagues' work.

## What the robustness battery returned

Run [`docs/robustness.md`](robustness.md) before making any exposure claim. Applied here it
moved the defensible claim substantially.

| Test | Result |
|:---|:---|
| Occupation-level exposure against percentage change | Pearson −0.023, Spearman −0.075 — no relationship |
| Group level, 22 major groups | Pearson −0.27, p = 0.22 — not significant |
| Propensity to decline, exposed against not | 50.0% vs 40.6%, Fisher p = 0.18 |
| Employment-weighted, exposure ≥ 0.25 against the rest | −4.4% vs +2.9% |
| The same, minus the two largest losses | −0.24% |
| Mirror screen | 15 exposed occupations rose (+6,230) against 13 that fell (−10,800) |
| Pre-generative-AI placebo, 2017–2019 | exposed-versus-rest gap of −5.08 points |

Exposure does not predict whether an occupation declines, and every aggregate framing
collapses to three occupations. Four of the ten high-exposure Group 43 occupations grew,
including general office clerks — the same 0.45 exposure, 10,890 jobs, and the largest
exposed clerical occupation after customer service representatives.

**The defensible claim** is that three named clerical occupations contracted sharply
against a growing metro, that the declines are statistically distinguishable from sampling
error, and that comparably exposed clerical work beside them did not contract. Not that
exposure predicts decline, and not that AI caused it.

## Two mistakes made building this

Recorded because both are easy to repeat.

**Truncation leaking into totals.** `df[mask].nlargest(25, col)` followed by `len()`
returns 25 regardless of the real count. Filter and aggregate first, truncate only for
display. This misreported a concentration set as 25 occupations when it was 37.

**Trusting a derivation because it was reproducible.** The national benchmark was first
reconstructed from location quotients as `national_share = local_share / LQ`. It was
reproducible from the pipeline and it was biased, because published quotients round to two
decimals and scaling by detail coverage assumes unmatched occupations match the matched
profile. The measured bulk file gave a different answer. Reproducible is not the same as
correct.

## Extending to another metropolitan area

1. Swap the CBSA code — Richmond is `40060`, or `0040060` in API series IDs — in
   `build_panel.py`, `fetch_2025.py` and `fetch_groups.py`.
2. Rerun `build_panel.py`. The bulk archives already hold every metro, so no new downloads
   are needed.
3. Rerun the rest of the pipeline unchanged; the join is SOC-based and metro-agnostic.
4. Confirm that metro's own county composition per vintage at
   `www.bls.gov/oes/{year}/may/msa_def.htm`. Many metros changed with the May 2024 release.
5. Rerun the robustness battery from scratch. Do not assume Richmond's leverage pattern
   holds — the point of the tests is that they are metro-specific.
6. Start a new record of figures. Do not inherit Richmond's numbers.
