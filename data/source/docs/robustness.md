# Robustness protocol

The tests below are the ones a professional reviewer reaches for first. They are run
before anything is published here, and the ones that go against the finding are published
alongside the ones that support it — which is what makes the surviving claims worth
anything. `scripts/robustness.py` implements them and writes `output/robustness.txt`.

The protocol is documented so it can be applied to another region, another exposure
measure, or this analysis by someone trying to break it. Tests 1 through 4 can kill a
finding outright, so they come before any prose is written.

## 0. The historical placebo

Run the identical screen on windows that closed before the cause being implied existed.
Hold the classification fixed: score occupations by their current exposure, then ask
whether that same work was already declining a decade earlier.

This is the cheapest test that speaks directly to a causal claim, and it is the one most
likely to be run against you by anyone holding the panel. Fix the window list before
looking at results; choosing the comparison window afterwards is the failure mode.

Applied here it complicated the finding rather than settling it. The 2023–2025
exposed-versus-rest gap is the largest in the series at −7.21 points, but a −5.08 gap
appears in 2017–2019, before generative AI was available, and the count of monotonically
declining exposed occupations turns out to be ordinary — which retired one claim outright.
Comparability degrades going back, since occupation coverage grows, SOC versions change,
and the score postdates every window it is applied to.

## 1. Leverage — the jackknife

Recompute the headline with each occupation removed in turn, then with the two and three
largest contributors removed together.

An aggregate that is really a handful of large cells is not a pattern, and a reviewer takes
about ninety seconds to discover this. Here, removing two occupations moves a −4.4%
aggregate to −0.24%, so the finding is those occupations and is stated that way. That is
still a finding — a named, specific, investigable one — but the general claim is gone.

Report the leave-one-out table itself. It reads as confidence, not weakness.

## 2. The mirror screen

Whatever rule selected the set, run it in reverse and count.

Screening for occupations that declined in consecutive periods feels like corroboration
and usually is not. Under noise alone, two consecutive moves in the same direction happen
about 25% of the time in each direction, so in 479 occupations roughly 120 monotonic
decliners are expected before anything real has occurred. If the mirror set is comparable
in size, the screen carries no information.

Publish both sides in one table: decliners and risers, counts and jobs. Here it is 15
risers against 13 decliners.

## 3. Base rates

Compare the *propensity* to decline inside and outside the group, not just the outcome
inside it.

```python
from scipy import stats
tbl = [[hi.declined.sum(), len(hi) - hi.declined.sum()],
       [lo.declined.sum(), len(lo) - lo.declined.sum()]]
stats.fisher_exact(tbl)
```

A group can contain dramatic declines and still decline at exactly the background rate.
Here Fisher returns p = 0.18, so the grouping variable is not doing the work and the
finding lives entirely in magnitudes — which returns you to test 1.

## 4. Uncertainty from the survey's own standard errors

OEWS ships relative standard errors for every cell. Use them.

Compute an interval on each level and a z on each change, and distinguish the *endpoint*
test — did the total change — from the *stepwise* test, which asks whether each
consecutive move was separately distinguishable. A screen built on "declined in both
periods" implicitly claims the stepwise version, which is much harder to pass.

Report both the occupation count and the job count clearing the test. They usually tell
different stories, because the significant cells are the large ones.

## 5. The cross-sectional placebo

Compare against the *distribution* of comparable areas, never against the national mean.

The national rate is one point estimate with no variance attached. Metropolitan outcomes
for a single occupation routinely have a cross-area standard deviation of 9 to 29
percentage points, so a twenty-point excess against the nation can sit at the fortieth
percentile of actual metros. Report the area's percentile and z against all comparable
areas, and account for having screened many occupations before selecting the extremes.

**This test has not been run here**, which is why the Richmond-specific excess is labelled
exploratory rather than defensible. It is the highest-priority extension.

## 6. Extend the baseline behind the hypothesized cause

Whatever date the story starts, get several periods before it.

This is the cheapest way to kill or confirm a normalization story. If the occupation had
already returned to its pre-shock level before the window opens, "it was just the surge
unwinding" is dead. A flat pre-period followed by a cliff is a much stronger shape than a
decline measured from a single elevated starting point.

## 7. A control group holding the confound constant

Find occupations sharing the confound but not the treatment — work that is equally routine
and equally automatable by conventional software but scores low on the exposure measure.
Conventional automation, offshoring, retirement and hiring freezes should hit both groups.

Jackknife the control group too. If its performance rests on one unrelated occupation, it
is not a control.

## 8. Weighted and unweighted disagree, and both are meaningful

Compute the occupation-level correlation *and* the employment-weighted aggregate. They
answer different questions and can point opposite ways.

An unweighted correlation near zero with a large weighted gap means the effect is
concentrated in a few big occupations. That is legitimate — jobs are what matter, not
occupation codes — but it is exactly the condition under which test 1 destroys the
aggregate. Report both and explain the difference rather than choosing the flattering one.

## 9. Panel hygiene

**Entry and exit.** Occupations appearing in one vintage and not another are
indistinguishable from employment change in a naive panel. Count them, list the large
ones, and state how they are handled.

**Suppression proximity.** Cells near the disclosure threshold drop out for reasons
unrelated to employment. Flag occupations sitting in that zone.

**Reclassification.** Employers relabel work. Before attributing a decline to
disappearance, check adjacent codes — a secretary becoming a medical secretary, a
receptionist becoming a patient access coordinator. Test the cluster, not the code.

## 10. Timing from an independent higher-frequency series

Annual occupational surveys cannot date an event. Industry series can. Pull quarterly
employment for the industries employing the occupations and see when the level moved. If
the break predates the window and coincides with a macroeconomic shock, the causal story
has a timing problem, and it is better to find that yourself.

## 11. Does the explanatory measure postdate the outcome?

Check the vintage of the exposure, risk or adoption score against the period it explains.
A measure built from behaviour observed after the employment change admits reverse
causality: an occupation can score high *because* its remaining staff absorbed departed
work.

Related and separate: **a national constant cannot explain a local residual.** If the
score is identical everywhere, it cannot by construction account for the part of a local
decline exceeding the national decline at the same score.

## 12. Shift-share before claiming a local effect

Decompose into national-growth, industry-mix and local-competitive components, and report
the local-competitive residual as the finding.

"Actual minus national rate" is not a local effect; it is everything the national rate
does not explain, industry composition included. Any regional economist assumes industry
mix does most of the work until shown otherwise.
