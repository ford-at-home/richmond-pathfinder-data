# What this means for Greater Richmond

Date: 2026-08-17
Data: the pinned workforce slice (generated 2026-08-15) — 39 starting jobs,
110 next-job mappings, 54 distinct destinations, 119,630 people.
Training and gate findings: the August 2026 regional training research.

Every count below is computed from `src/content/data/workforce.json`, not quoted
from the research. Where a count differs from the research's own figure, it is
because the research counted skill mentions and this counts mappings; both
definitions are stated.

## A course exists for 9 of the 110 moves

Nine mappings name a course: five office jobs into Payroll and Timekeeping
Clerks (PayrollOrg's payroll exam, with a Reynolds for-credit certificate
behind it), three computer jobs into Software Developers (CCWA's Python PCAP),
and Insurance Sales Agents into Insurance Underwriters (The Institutes' AINS).

Those nine sit inside nine starting jobs holding **11,870 people — about 10% of
the 119,630 on the map**.

For the other 90% the row says no course in this data names the job, which is a
narrower claim than it first appears, and the narrowing is not cosmetic. **The
upstream generator knows 28 courses and attaches only 14 to any job at all.**
The fourteen it never attaches include CCWA's CompTIA Tech+, A+, Network+ and
Security+ and its AWS Cloud Practitioner — $433 to $1,250, all FastForward
eligible. Five rows on this map point at Computer Network Architects and
Computer Network Support Specialists with no course named, and Network+
plausibly serves every one of them.

So on the computer side, "no course" is a gap in the join rather than a gap in
the region, and no screen may say otherwise until an eligible-training-provider
sweep settles which of the fourteen serve which destination.

Two claims below are not affected, because they rest on a catalog search rather
than on the join, and this 28-course list corroborates both: nothing in it is a
supervisory credential, and nothing in it teaches business analysis.

## The gap is two gaps, and neither is exotic

Counting mappings that name at least one skill in each family:

| What the move needs | Mappings | Starting jobs | People in them |
|---|---|---|---|
| Everyday working skills | 76 | 31 | 97,140 |
| Taking a system apart and judging it | 32 | 19 | 66,590 |
| Running a team or a budget | 31 | 23 | 64,230 |
| Working with numbers | 21 | 15 | 34,200 |
| Working with equipment | 6 | 6 | 10,250 |

The research counted skill mentions and got 18 for Systems Analysis and 18 for
Systems Evaluation; a mapping naming both is one mapping, which is why the
combined family is 32 rather than 36. The same applies to supervision: 27
mentions of Management of Personnel Resources, 31 mappings once the two related
management skills are folded in.

The top two are within 4% of each other on people affected, so they are one
priority, not a ranked pair:

1. **Business analysis has no local seat at all.** No CCWA, Reynolds, or
   Brightpoint course teaches Systems Analysis, Systems Evaluation, or
   Operations Analysis. The nearest local offerings — data analysis, Six Sigma,
   Power BI — are neighbouring skills. The only named option is IIBA's entry
   certificate, which is national.
2. **Supervision is sold, but only in pieces.** CCWA has one-month online
   leadership modules at $145–$295 and a short "Making the Move to Supervisor"
   workshop, plus project-management prep at $700 and $1,200. None of them is a
   stackable supervisory credential, and none is the same skill as running a
   team.

A third, smaller ask: 21 mappings need Mathematics and no short workforce course
targets it. The local answer is for-credit community-college mathematics, which
financial aid and G3 can cover.

## Twenty-eight moves lead to management, and no course opens that door

Twenty-eight of the 110 mappings land in a management job. Until now the row
showed a pay rise and "Same preparation level" beside it, which reads as though
nothing were required. What the move actually needs is years of supervising
people and being chosen by an employer.

The site now says that on the row. It is the single most misleading impression
the map was leaving, and it was leaving it on the highest-paying moves it knows.

Fifty-six mappings have no gate this map can see, and the row says so plainly
rather than implying the way is clear: this data compares skill ratings, and
cannot see a licence or a degree.

## Eight jobs where every road is behind a gate we cannot measure

For eight starting jobs, every next job the map offers sits behind management
selection, an engineering degree, or a credential this data cannot see:

Software Developers (7,680 people, one route), Securities and Financial Services
Sales Agents (2,990), Computer Systems Analysts (2,990), Data Scientists (1,050),
Technical and Scientific Sales Representatives (1,010), Computer Network Support
Specialists (610), Database Architects (440), and Computer and Information
Research Scientists (160).

Six of the eight are Computer & Mathematical. For this group the map can say
where the money is and cannot say how to get there, and it should not pretend
otherwise. That is a different problem from the office and sales side, where the
destination is reachable and the training simply is not sold here.

## What this asks of the region

1. Fund a stackable, FastForward-eligible supervision credential. It serves 31
   mappings out of 23 starting jobs holding 64,230 people, and the region
   currently answers it with $145 modules.
2. Stand up a business-analysis course. It serves 32 mappings out of 19 starting
   jobs holding 66,590 people, and the region currently answers it with nothing.
3. Add a short quantitative-reasoning module for the 21 mappings that need
   Mathematics.

The test that would move any of these from "gap" to "course": it appears on the
Virginia eligible training provider list with a published price.

## Three corrections to carry back to the generator

The first is the largest and is not a typo: **fourteen of the twenty-eight
courses in the generated file are attached to no job**, so the map cannot offer
them even where they obviously fit. Attaching the CompTIA and AWS credentials to
the network destinations is the single change that would most increase the number
of moves this map can answer.

The other two are field-level:

Both are in the frozen upstream generator, and neither is visible today because
no screen renders a course price:

- `R006F` (Python PCAP) stores `costFastForward: 1100`, but $1,100 is the list
  price and an eligible Virginia resident pays roughly a third. The field name
  asserts the funded price while holding the unfunded one, so it would be about
  three times too high the moment a screen showed it.
- `RVA-reynolds-payroll` stores `timeBand: "1–2 years"`; the certificate is 22
  credits over two semesters — one year.

Also unresolved upstream: the PCAP course length is published as 72 hours on the
course page and 84 hours in an older CCWA guide. Do not render either until it
is settled.

## What this does not say

- **AI use is not risk.** Everything on the starting list is there because people
  already use AI for that work. Nothing here forecasts a job cut, and no screen
  orders jobs by exposure.
- **Twenty-four mappings show no skill gap.** That means the 35 measured skill
  ratings found none — not that the move needs no learning. Those rows still
  carry a gate.
- **Staying in your job and taking on higher-value work with AI is an open
  question.** The research found documented in-role gains for roughly a third of
  the 39 jobs, and in every documented case the gain accrued to the employer
  first. There is no measure behind it, so the site publishes no such number.
- **No job-zone difference is converted into lost wages.** Most of those bands
  describe preparation gathered while employed.

## Sources

The regional training findings, retrieved 2026-08-17: CCWA Summer/Fall 2026
catalog (ccwatraining.org); Reynolds Payroll and Taxation certificate
(reynolds.edu); PayrollOrg payroll exam (payroll.org); The Institutes AINS
(theinstitutes.org); FastForward and the Workforce Credential Grant (schev.edu,
fastforwardva.org); IIBA (iiba.org). Pay is BLS OEWS May 2025 for the Richmond
MSA; skills and related jobs are O\*NET 29.0; AI use is the Anthropic Economic
Index.
