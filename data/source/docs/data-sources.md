# Data sources and retrieval

Every input to this analysis is public. Two of them are too large to commit sensibly, so
this page gives the exact retrieval steps, along with the traps that cost real time when
this pipeline was built.

## BLS will serve a script that identifies itself

BLS blocks anonymous bots, not scripts. Send a `User-Agent` naming the project with a
contact address and both `www.bls.gov` and `download.bls.gov` return 200 to plain `curl`.
Impersonating a browser fails — a full Chrome user agent with a referer header gets 403,
because the policy is about identification rather than about looking human.

```bash
UA="richmond-ai-impact-analysis/1.0 (civic research; contact tech@aireadyrva.com)"

# One vintage, ~39 MB, about two seconds
curl -sL -A "$UA" -o oesm25ma.zip \
  "https://www.bls.gov/oes/special-requests/oesm25ma.zip"
```

Naming convention: `oesm{YY}ma` metro, `oesm{YY}nat` national, `oesm{YY}in` industry.

### OEWS metro vintages, 2010–2025

`scripts/build_panel.py` expects each vintage unzipped into `data/oesm{YY}ma/`. Every
vintage back to May 2010 downloads the same way.

```bash
for YY in 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25; do
  curl -sL -A "$UA" -o "oesm${YY}ma.zip" \
    "https://www.bls.gov/oes/special-requests/oesm${YY}ma.zip"
  unzip -q -o "oesm${YY}ma.zip" -d "data/oesm${YY}ma"
done
```

Archive layout differs by era. The 2014–2022 zips contain a nested folder of the same
name, so flatten them. The 2010–2013 releases unzip flat and split the metro file across
three `.xls` workbooks by state range, such as `MSA_M2013_dl_3_OH_WY.xls`; read all parts
and concatenate. Legacy `.xls` requires `xlrd`, which is not a pandas dependency.

### QCEW county files

Keyless, CSV only — the `.json` variant returns 404.

```bash
curl -sL -A "$UA" -o "data/qcew/counties/51760_2025.csv" \
  "https://data.bls.gov/cew/data/api/2025/a/area/51760.csv"
```

`scripts/qcew_geography.py` aggregates the seventeen counties of the current metropolitan
definition, which holds geography constant across the delineation change.

## The BLS API is not a route to OEWS history

The public API holds only the latest OEWS vintage. Requesting 2024 alongside 2025 returns
`No Data Available for Series … Year: 2024`. OEWS is not a time series in the API, and
historical vintages must come from the bulk archives above.

Where a genuine time series is needed, switch surveys. CES metro series are longitudinal
and unsuppressed: twenty years of Richmond total nonfarm employment comes back in a single
call to `SMU51400600000000001` with `"annualaverage": true`. CES has no occupational
dimension, so the division of labour is CES to establish whether the metro changed course,
OEWS to say which occupations moved.

Suppressed cells return the string `"-"` from the API and `**`, `*`, `#` or `~` in bulk
files. Coerce them to null and keep a separate flag: a suppressed cell and a genuine
decline are indistinguishable once both become `NaN`, and occupations entering or leaving
the publication universe will otherwise register as employment change.

## Comparability across vintages

BLS states plainly that OEWS is not designed as a time series. Assembling one is
defensible only if what changes underneath it is recorded. Three things change.

**Geography.** Richmond, CBSA 40060, lost Caroline County and gained King and Queen County
between the May 2023 and May 2024 vintages, because OEWS stayed on the OMB 17-01
delineation through May 2023 and adopted 23-01 with May 2024. Comparing the OMB bulletins
to each other misses this — compare what each *vintage* used. Per-vintage county
composition is published at `www.bls.gov/oes/{year}/may/msa_def.htm` for 2016 onward;
earlier years need the Census delineation files.

**Classification.** May 2010 is SOC 2000, May 2011 through May 2018 is SOC 2010, and May
2019 onward is SOC 2018. Two revision boundaries sit inside a 2010–2025 panel.

**Sample structure.** Each estimate pools six semiannual panels, rotating two out per
year. A single step change therefore appears as three consecutive declining vintages.
Monotonic movement across three vintages is the *expected* signature of one discrete
event rather than evidence of a sustained process, and it dates the event earlier than the
release labels suggest. This is why the analysis rests on sampling-error magnitude rather
than on vintage count.

## Sampling error is not optional

`EMP_PRSE` is published in every vintage. Metro occupation cells are noisy — median
relative standard error around 9.6, and 10 to 21 for small occupations. Any cross-vintage
change reported without an interval is not yet a finding. The panel carries `EMP_PRSE` and
`MEAN_PRSE` through to the published tables for exactly this reason.

## Exposure scores

`data/job_exposure.csv`, from the Anthropic Economic Index repository on Hugging Face
(`Anthropic/EconomicIndex`), file `labor_market_impacts/job_exposure.csv`, created 5 March
2026 and retrieved July 2026. Released under CC BY 4.0.

The score is a national constant. It is applied identically to every year in this
analysis, and no part of the work treats a change in exposure as observed.

## O\*NET

`data/onet/` holds the Related Occupations, Job Zones and Job Zone Reference files from
<https://www.onetcenter.org/database.html>, used to construct occupational adjacency for
the transition capacity analysis. See [`../ATTRIBUTION.md`](../ATTRIBUTION.md) for the
attribution and modification disclaimer O\*NET requires.

## Deriving a national benchmark

Location quotient is by definition the ratio of local to national employment share, so
`national_share = local_share / location_quotient`. This works but is biased: published
quotients round to two decimals, and scaling by partial detail coverage assumes unmatched
occupations share the matched profile. In one measured case the derivation overstated a
national share by 0.09 points. It is fine for a first pass and is replaced by measured
national bulk files everywhere a figure is published here.

## Before trusting a batch

- Cross-check one value against a published BLS news release.
- Confirm total employment reconciles against the `00-0000` series.
- Record the vintage for every figure. Mixing 2023 wages with 2025 employment is easy and
  silent.
- Label derived quantities as derived.
