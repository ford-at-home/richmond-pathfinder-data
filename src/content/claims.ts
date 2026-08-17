/**
 * Where every published sentence comes from.
 *
 * The four labels are the audit appendix's, and they never reach a screen. They
 * govern which sentence the copy layer is allowed to write:
 *
 * - REPORTED   state it plainly and name the source in the sentence
 * - MODELLED   state it as a comparison of job descriptions, never as a promise
 * - UNVERIFIED say what could not be confirmed, or leave it out
 * - OPEN       an honest empty state with a reason, never a blank
 *
 * A claim is registered once and referenced by key from the copy. That keeps the
 * retrieval dates and review windows in one file that can be audited on its own,
 * rather than scattered through prose where nobody will find them again.
 */

export type Label = "REPORTED" | "MODELLED" | "UNVERIFIED" | "OPEN";

export type PriceStatus = "published" | "not published" | "conflicting" | "no price";

export type Claim = {
  label: Label;
  /** Provider, dataset or study. Named specifically enough to re-find. */
  basis: string;
  /** Omitted where no stable public link was confirmed. Never guessed at. */
  url?: string;
  /** ISO date the basis was last read. */
  retrieved: string;
  priceStatus: PriceStatus;
  /** Months from `retrieved` before the claim has to be checked again. */
  reviewMonths: number;
};

export type ClaimKey = keyof typeof CLAIMS;

/** A sentence or short block of prose, and the claim that backs it. */
export type Claimed = { text: string; claim: ClaimKey };

/** Date the pinned slice was generated; the data claims were read from it. */
const PINNED = "2026-08-15";

/** Date the regional training and free-study research was last confirmed. */
const RESEARCHED = "2026-08-17";

const OEWS = "BLS Occupational Employment and Wage Statistics, May 2025, Richmond VA MSA (40060)";
const OEWS_URL = "https://www.bls.gov/oes/current/oes_40060.htm";

const CCWA = "Community College Workforce Alliance course catalogue, Summer/Fall 2026";

export const CLAIMS = {
  "oews.employment": {
    label: "REPORTED",
    basis: OEWS,
    url: OEWS_URL,
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "oews.mean-wage": {
    label: "REPORTED",
    basis: OEWS,
    url: OEWS_URL,
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  /**
   * The published figure is an annual mean and the slice carries no median, so
   * "half earn less" is not available to say. Wage distributions are bounded
   * below and have a long upper tail, which puts the mean above the midpoint —
   * enough to warn a reader off the average, not enough to report a median.
   */
  "oews.mean-not-median": {
    label: "MODELLED",
    basis: `${OEWS} — annual mean only; no median in the pinned slice`,
    url: OEWS_URL,
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "oews.wage-gain": {
    label: "MODELLED",
    basis: `${OEWS} — difference between two occupational annual means`,
    url: OEWS_URL,
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "aei.exposure-band": {
    label: "REPORTED",
    basis:
      "Anthropic Economic Index — observed share of conversations mapped to this occupation's tasks",
    url: "https://www.anthropic.com/economic-index",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "aei.no-signal": {
    label: "OPEN",
    basis:
      "Occupation absent from the Anthropic Economic Index sample; absence of measurement, not a measurement of zero",
    url: "https://www.anthropic.com/economic-index",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "onet.related": {
    label: "MODELLED",
    basis: "O*NET 29.0 Related Occupations, compared on published skill ratings",
    url: "https://www.onetcenter.org/database.html",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "onet.skill-gap": {
    label: "MODELLED",
    basis: "O*NET 29.0 Skills — difference between two occupations' importance ratings",
    url: "https://www.onetcenter.org/database.html",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "map.no-routes": {
    label: "OPEN",
    basis: "No O*NET-related occupation for this SOC clears the map's pay-and-exposure screen",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "map.destination-only": {
    label: "MODELLED",
    basis: "SOC appears in the slice only as a destination, not among the 39 in-scope origins",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "map.course-not-in-data": {
    label: "OPEN",
    basis:
      "Pinned slice links no course to this destination. The generator carries 28 courses and attaches 14, so this is absence from the data and not from the region",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "map.course-subject-not-skills": {
    label: "MODELLED",
    basis:
      "Course is matched to a destination by subject matter; the skill gaps are measured separately from O*NET ratings",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  /**
   * Nine of the 110 routes carry a length because a real programme is attached.
   * The other 101 carry a job-zone distance, which compares how much preparation
   * two occupations are rated as needing — not a schedule anyone publishes.
   * Printing the second as the first is how "2+ years" comes to look like a
   * course you could enrol in, so they carry different claims and read
   * differently on screen.
   */
  "course.published-length": {
    label: "REPORTED",
    basis:
      "Published length of the training programme linked to this destination in the pinned slice",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 6,
  },
  "map.preparation-gap": {
    label: "MODELLED",
    basis:
      "O*NET job zone difference between origin and destination — a comparison of rated preparation, not a course length",
    url: "https://www.onetcenter.org/database.html",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "map.open-door": {
    label: "MODELLED",
    basis:
      "Destination rated at or below the origin's job zone with no training programme attached — nothing to finish before applying",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },

  // Gates. A gate belongs to the destination: what the job asks of anyone.

  "gate.selection-unmeasured": {
    label: "UNVERIFIED",
    basis:
      "Employer selection is not in the O*NET Skills file. Inferred from the job-zone difference between origin and destination",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.payroll-exam-open": {
    label: "REPORTED",
    basis:
      "PayrollOrg Fundamental Payroll Certification — published eligibility: no prerequisite, no experience requirement",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 6,
  },
  "gate.underwriting-licence": {
    label: "REPORTED",
    basis:
      "Virginia insurance licensing applies to producers selling insurance, not to underwriting staff",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.securities-registration": {
    label: "REPORTED",
    basis:
      "FINRA registration is required to advise on securities; planning credentials are separate and commonly expected",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.hired-on-work": {
    label: "MODELLED",
    basis:
      "No licence found for this occupation; hiring practice inferred from the destination's job zone and the regional research",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.credential-unmeasured": {
    label: "UNVERIFIED",
    basis:
      "Degree and credential requirements are outside the O*NET Skills comparison this map runs. Suspected, not measured",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.experience-route": {
    label: "MODELLED",
    basis:
      "Regional workforce research, August 2026 — entry observed from inside the occupational family rather than from a course",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "gate.none-seen": {
    label: "MODELLED",
    basis:
      "No licence or degree named for this destination. The map compares skill ratings only and cannot see either",
    retrieved: PINNED,
    priceStatus: "no price",
    reviewMonths: 12,
  },

  // Training. Belongs to a named skill, not to an origin-destination pair.

  "training.no-local-supervising": {
    label: "OPEN",
    basis: `${CCWA}, Augusoft search; Reynolds and Brightpoint catalogues — no course found teaching Management of Personnel Resources`,
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 6,
  },
  "training.no-local-analysis": {
    label: "OPEN",
    basis: `${CCWA}; Reynolds and Brightpoint catalogues — no course found teaching Systems Analysis, Systems Evaluation or Operations Analysis`,
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 6,
  },
  "training.maths-for-credit": {
    label: "MODELLED",
    basis:
      "Reynolds and Brightpoint for-credit mathematics; no short workforce course found targeting the O*NET Mathematics skill",
    retrieved: RESEARCHED,
    priceStatus: "not published",
    reviewMonths: 6,
  },
  "training.hands-on-hours": {
    label: "MODELLED",
    basis:
      "Regional workforce research, August 2026 — trades entry through apprenticeship or a technician programme",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "training.built-by-doing": {
    label: "MODELLED",
    basis:
      "Regional workforce research, August 2026 — no credential found covering the everyday working skills",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "course.ccwa-leadership": {
    label: "REPORTED",
    basis: `${CCWA} — leadership and supervision modules`,
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "course.ccwa-move-to-supervisor": {
    label: "REPORTED",
    basis: `${CCWA} — Making the Move to Supervisor; listed without a price`,
    retrieved: RESEARCHED,
    priceStatus: "not published",
    reviewMonths: 6,
  },
  "course.ccwa-project-management": {
    label: "REPORTED",
    basis: `${CCWA} — CAPM and PMP preparation`,
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "course.iiba-ecba": {
    label: "REPORTED",
    basis:
      "International Institute of Business Analysis — Entry Certificate in Business Analysis; no price published to non-members",
    retrieved: RESEARCHED,
    priceStatus: "not published",
    reviewMonths: 6,
  },
  "course.community-college-maths": {
    label: "REPORTED",
    basis:
      "Reynolds and Brightpoint for-credit tuition; financial aid eligibility per each college's published policy",
    retrieved: RESEARCHED,
    priceStatus: "not published",
    reviewMonths: 6,
  },

  // Free study, each confirmed on the provider's own Virginia site.

  "free.khan": {
    label: "REPORTED",
    basis: "Khan Academy mathematics curriculum, provider's own description",
    url: "https://www.khanacademy.org/math",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.learning-express": {
    label: "REPORTED",
    basis: "Richmond Public Library — EBSCO Learning Express, library's own listing",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.accel": {
    label: "REPORTED",
    basis: "Richmond Public Library — EBSCOlearning ACCEL, library's own listing",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.universal-class": {
    label: "REPORTED",
    basis: "Richmond Public Library — Universal Class, library's own listing",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.brainfuse": {
    label: "REPORTED",
    basis: "Richmond Public Library — Brainfuse E-Learning, library's own listing",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.henrico-computer": {
    label: "REPORTED",
    basis: "Henrico County Public Library — computer classes, library's own listing",
    url: "https://www.henricolibrary.org/computer-classes",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "free.study-is-not-a-credential": {
    label: "MODELLED",
    basis:
      "Free resources matched to skills by what each provider says it covers, not against the O*NET ratings",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "help.library-card": {
    label: "REPORTED",
    basis:
      "Richmond Public Library and Henrico County Public Library published card eligibility, including the reciprocal agreement",
    url: "https://rvalibrary.org/services/get-card/",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },
  "help.workforce-board": {
    label: "REPORTED",
    basis:
      "Virginia Career Works Capital Region — published centres, eligibility assessment and funding priorities",
    url: "https://vcwcapital.com/",
    retrieved: RESEARCHED,
    priceStatus: "published",
    reviewMonths: 6,
  },

  // Staying in this job.

  "stay.support-agent-study": {
    label: "REPORTED",
    basis:
      "Brynjolfsson, Li and Raymond, “Generative AI at Work”, Quarterly Journal of Economics 140(2), 2025; NBER working paper 31161",
    url: "https://www.nber.org/papers/w31161",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "onet.tasks": {
    label: "REPORTED",
    basis: "O*NET 29.0 Task Statements for this occupation, summarised without adding to them",
    url: "https://www.onetcenter.org/database.html",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "stay.tool-fabricates": {
    label: "MODELLED",
    basis:
      "Confabulation is a documented general property of large language models. What it costs in this occupation is inferred from the nature of the work, not measured for it",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
  "stay.no-evidence": {
    label: "OPEN",
    basis: "No in-role AI study or employer guide found for this SOC that names measured outcomes",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 6,
  },
  "stay.phi-rule": {
    label: "REPORTED",
    basis:
      "HIPAA Privacy Rule, 45 CFR Part 164 — disclosure of protected health information is governed by the covered entity, not the individual",
    url: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 24,
  },
  "stay.employer-captures": {
    label: "MODELLED",
    basis:
      "Where a study measures output per hour rather than pay, the gain accrues to the employer unless the role is redesigned",
    retrieved: RESEARCHED,
    priceStatus: "no price",
    reviewMonths: 12,
  },
} as const satisfies Record<string, Claim>;

export function claimFor(key: ClaimKey): Claim {
  return CLAIMS[key];
}

/** ISO date this claim has to be checked again. */
export function reviewBy(key: ClaimKey): string {
  const { retrieved, reviewMonths } = CLAIMS[key];
  const d = new Date(`${retrieved}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + reviewMonths);
  return d.toISOString().slice(0, 10);
}

/**
 * How much weight a claim carries, in the reader's words. The label itself never
 * appears on screen; OPEN has no badge because its on-screen form is the empty
 * state, which already carries its own reason.
 */
export const LABEL_ON_SCREEN: Record<Label, string | null> = {
  REPORTED: "Confirmed with the source",
  MODELLED: "Worked out from this data",
  UNVERIFIED: "Not confirmed",
  OPEN: null,
};
