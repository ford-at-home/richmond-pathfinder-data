import { programById, type Destination, type WorkforceProgram } from "@/content/workforce";

/**
 * What it takes to reach a next job, added by hand from the August 2026 regional
 * training research.
 *
 * Two things are kept apart on purpose.
 *
 * A **gate** belongs to the destination: what that job asks of anyone, wherever
 * they start. **Training** belongs to a named skill. Neither is keyed to an
 * origin-destination pair, because the research could not re-derive every pair
 * and says so; keying by pair would publish a precision it does not have.
 *
 * This file is hand-authored and must stay out of `data/workforce.json`, which
 * `scripts/pin-workforce.mjs` overwrites from the generated slice.
 */

/** How much weight a claim carries. Shown next to the claim, never hidden. */
export type Evidence = "reported" | "modelled" | "unverified";

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  reported: "Confirmed with the source",
  modelled: "Worked out from this data",
  unverified: "Not confirmed",
};

export type Gate = {
  /** One or two plain sentences. What this job asks of anyone. */
  need: string;
  evidence: Evidence;
};

export type TrainingOption = {
  name: string;
  provider: string;
  /** Published price, or an explicit statement that none is published. */
  cost: string;
  scope: "Greater Richmond" | "National";
};

export type Training = {
  /** Plain name for this family of skills. */
  group: string;
  /** What builds them, or why nothing local does. */
  detail: string;
  /** Named courses. Empty is a finding, not a lookup failure. */
  options: TrainingOption[];
  evidence: Evidence;
};

const MANAGEMENT_GATE: Gate = {
  need: "Years of supervising people, and being chosen for the job by an employer. No local course opens this door. The time shown above compares how much preparation each job takes — it is not a course you can enrol in.",
  evidence: "modelled",
};

const GATES_BY_SOC: Record<string, Gate> = {
  "43-3051": {
    need: "The payroll exam has no prerequisite and no experience requirement, so this is one of the few doors on this map that a course actually opens.",
    evidence: "reported",
  },
  "15-1252": {
    need: "No licence. Employers hire on demonstrated work, so the course below is a start and not the whole door.",
    evidence: "modelled",
  },
  "13-2053": {
    need: "Underwriting is usually unlicensed, but employers decide who does it. The insurance licence you may have heard of applies to selling, not to underwriting.",
    evidence: "reported",
  },
  "13-2052": {
    need: "Advising on money is registered work. Expect securities registration, and often a planning credential, before anyone lets you do it.",
    evidence: "reported",
  },
  "13-2054": {
    need: "Risk roles commonly expect a quantitative credential. This map compares skill ratings only and cannot see credentials, so treat this as a question for the employer.",
    evidence: "unverified",
  },
  "13-2061": {
    need: "Examiner work is reached from inside accounting, by experience rather than by a short course.",
    evidence: "modelled",
  },
  "19-3011": {
    need: "Usually a graduate degree. This map cannot see education requirements, so confirm before planning around it.",
    evidence: "unverified",
  },
};

const GATES_BY_PREFIX: [string, Gate][] = [
  ["11-", MANAGEMENT_GATE],
  [
    "25-",
    {
      need: "Teaching at college level usually means a graduate degree. This map cannot see education requirements, so confirm before planning around it.",
      evidence: "unverified",
    },
  ],
  [
    "49-",
    {
      need: "A different trade, not a step sideways. Employers here hire on hours spent working with the tools.",
      evidence: "modelled",
    },
  ],
  [
    "17-3",
    {
      need: "Technician work. Employers hire on hands-on hours, which is why the pay rise is real and the door is slow.",
      evidence: "modelled",
    },
  ],
  [
    "17-2",
    {
      need: "Engineering roles usually expect an engineering degree. This map compares skill ratings only and cannot see degrees.",
      evidence: "unverified",
    },
  ],
];

const DEFAULT_GATE: Gate = {
  need: "Nothing here names a licence or a degree — this map compares skill ratings only and cannot see them. Ask the employer what they require.",
  evidence: "modelled",
};

export function gateFor(soc: string): Gate {
  const exact = GATES_BY_SOC[soc];
  if (exact) return exact;
  for (const [prefix, gate] of GATES_BY_PREFIX) {
    if (soc.startsWith(prefix)) return gate;
  }
  return DEFAULT_GATE;
}

const SUPERVISING = new Set([
  "Management of Personnel Resources",
  "Management of Financial Resources",
  "Management of Material Resources",
]);

const ANALYSING = new Set(["Systems Analysis", "Systems Evaluation", "Operations Analysis"]);

const HANDS_ON = new Set([
  "Installation",
  "Repairing",
  "Equipment Maintenance",
  "Equipment Selection",
  "Troubleshooting",
  "Operation and Control",
]);

const TRAINING: Record<string, Training> = {
  supervising: {
    group: "Running a team or a budget",
    detail:
      "No Greater Richmond course builds this. It is built by supervising people and by being given the responsibility. These are the nearest things the region sells, and none of them teaches the same skill.",
    options: [
      {
        name: "Leadership and supervision modules",
        provider: "Community College Workforce Alliance",
        cost: "$145–$295 each, one month, online",
        scope: "Greater Richmond",
      },
      {
        name: "Making the Move to Supervisor",
        provider: "Community College Workforce Alliance",
        cost: "Price not published",
        scope: "Greater Richmond",
      },
      {
        name: "Project management (CAPM, then PMP)",
        provider: "Community College Workforce Alliance",
        cost: "$700 and $1,200",
        scope: "Greater Richmond",
      },
    ],
    evidence: "reported",
  },
  analysing: {
    group: "Taking a system apart and judging it",
    detail:
      "Greater Richmond sells no course in this, and it is the largest single training gap on this map. The nearest local courses — data analysis, Six Sigma, Power BI — are neighbouring skills, not this one.",
    options: [
      {
        name: "Entry Certificate in Business Analysis (ECBA)",
        provider: "International Institute of Business Analysis",
        cost: "Price not published",
        scope: "National",
      },
    ],
    evidence: "reported",
  },
  mathematics: {
    group: "Working with numbers",
    detail:
      "No short workforce course targets this. The honest local answer is for-credit mathematics at a community college, which financial aid and G3 can cover.",
    options: [
      {
        name: "For-credit mathematics",
        provider: "Reynolds or Brightpoint Community College",
        cost: "In-state tuition, financial aid eligible",
        scope: "Greater Richmond",
      },
    ],
    evidence: "modelled",
  },
  handsOn: {
    group: "Working with equipment",
    detail:
      "Learned in an apprenticeship or a community-college technician programme. There is no short version, and no certificate stands in for the hours.",
    options: [],
    evidence: "modelled",
  },
  working: {
    group: "Everyday working skills",
    detail:
      "These are built by doing the work, by being coached, and in short workshops. No certificate covers them, so nobody should be sold one for this.",
    options: [],
    evidence: "modelled",
  },
};

/**
 * Every skill this file routes by name. A test asserts each one still appears in
 * the pinned data, so a typo or a renamed skill fails rather than silently
 * falling through to the everyday-skills group.
 */
export const ROUTED_SKILLS: readonly string[] = [
  ...SUPERVISING,
  ...ANALYSING,
  "Mathematics",
  ...HANDS_ON,
];

function groupOf(skill: string): string {
  if (SUPERVISING.has(skill)) return "supervising";
  if (ANALYSING.has(skill)) return "analysing";
  if (skill === "Mathematics") return "mathematics";
  if (HANDS_ON.has(skill)) return "handsOn";
  return "working";
}

/** Every named skill resolves. Used by the tests to prove total coverage. */
export function trainingForSkill(skill: string): Training {
  return TRAINING[groupOf(skill)]!;
}

export type Bridge = {
  gate: Gate;
  /** One entry per skill family present, in the order the reader meets them. */
  training: { training: Training; skills: string[] }[];
  course: WorkforceProgram | undefined;
  /**
   * True when a course is named and skill gaps are also listed. The courses in
   * this data teach a job's subject matter, which is a different thing from the
   * skill ratings, and saying so stops the course reading as the whole answer.
   */
  courseIsNotTheSkills: boolean;
};

const GROUP_ORDER = ["supervising", "analysing", "mathematics", "handsOn", "working"];

/**
 * Says how much is inside, so a row can be skipped without being opened.
 *
 * The absence half is deliberately about *this data*, not about the region. The
 * upstream generator knows 28 courses and attaches only 14 to any job at all —
 * the unattached ones include CCWA's CompTIA and AWS credentials, which plainly
 * serve the network destinations here. So a missing course means none is named
 * here, and saying "no local course" would assert an absence nobody measured.
 */
export function bridgeSummary(bridge: Bridge, skillCount: number): string {
  const skills =
    skillCount === 0
      ? "No skill gap measured"
      : `${skillCount} skill${skillCount === 1 ? "" : "s"} to build`;
  return `${skills} · ${bridge.course ? "a course names this job" : "no course in this data names it"}`;
}

/** Why a missing course is not a statement about Greater Richmond. */
export const PARTIAL_COURSE_LIST =
  "Courses appear here only where this data links one to a job. The region sells others that are not linked, so “no course” means none is named here — not that none exists.";

export function bridgeFor(d: Destination): Bridge {
  const skills = d.build.map((s) => s.name);
  const byGroup = new Map<string, string[]>();
  for (const skill of skills) {
    const key = groupOf(skill);
    byGroup.set(key, [...(byGroup.get(key) ?? []), skill]);
  }

  const course = programById(d.leadProgramId);

  return {
    gate: gateFor(d.soc),
    training: GROUP_ORDER.filter((key) => byGroup.has(key)).map((key) => ({
      training: TRAINING[key]!,
      skills: byGroup.get(key)!,
    })),
    course,
    courseIsNotTheSkills: course !== undefined && skills.length > 0,
  };
}
