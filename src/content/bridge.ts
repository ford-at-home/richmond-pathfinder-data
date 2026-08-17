import type { Claimed, ClaimKey } from "@/content/claims";
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

export type Gate = {
  /**
   * What this job asks of anyone, in plain blocks. Several rather than one,
   * because a single gate routinely mixes a confirmed requirement with a
   * suspected one, and the appendix has to be able to tell them apart.
   */
  need: Claimed[];
};

export type TrainingOption = {
  name: string;
  provider: string;
  /** Published price, or an explicit statement that none is published. */
  cost: string;
  scope: "Greater Richmond" | "National";
  claim: ClaimKey;
};

/**
 * Something free a person can start today. Kept apart from TrainingOption
 * because it costs nothing, carries no credential, and opens no gate — three
 * differences that collapse if both are printed in one list.
 */
export type SelfStudyOption = {
  name: string;
  provider: string;
  /** How you get to it. A library card is a real precondition, so it is stated. */
  access: string;
  /** What the provider says it covers, in their words as far as possible. */
  covers: string;
  url: string;
  claim: ClaimKey;
};

export type Training = {
  /** Plain name for this family of skills. */
  group: string;
  /** What builds them, or why nothing local does. */
  detail: string;
  /** Backs `detail`. Each option and free resource carries its own. */
  claim: ClaimKey;
  /** Named courses. Empty is a finding, not a lookup failure. */
  options: TrainingOption[];
  /**
   * Free study. Empty where nothing credible matched — see ANALYSING and
   * HANDS_ON, whose emptiness a test pins so it cannot be filled with a
   * near-enough resource later.
   */
  selfStudy: SelfStudyOption[];
};

/**
 * Two blocks, not one. Employer selection is suspected from a job-zone
 * difference and is not in the Skills file; the absence of a local course was
 * searched for and found. Merging them would lend the first the second's
 * standing.
 */
const MANAGEMENT_GATE: Gate = {
  need: [
    {
      text: "Employers choose supervisors. People move into this by taking on responsibility for the work of others where they already are, and being picked for it.",
      claim: "gate.selection-unmeasured",
    },
    {
      text: "There is no certificate that opens this door. Short leadership classes exist and can help, but they are not the thing being asked for.",
      claim: "training.no-local-supervising",
    },
  ],
};

/**
 * Management landings, which people are selected into rather than trained into.
 *
 * The pinned slice gives every one of these a time band, because the generator
 * measures the distance between two preparation levels. Printed next to a job
 * title that reads as a duration, and one of the bands is "No training needed" —
 * which says the opposite of the gate. So the duration is withheld here rather
 * than corrected downstream.
 */
export const isSelectionGated = (soc: string): boolean => soc.startsWith("11-");

/** Empty state C: what to show where a duration would imply a course. */
export const NOT_A_COURSE = "How long: not a course.";

/**
 * A job zone distance is a rating of how much preparation two occupations are
 * held to need. It is not a schedule, and only nine of the 110 routes have one
 * of those. Saying which is which here is the difference between "2+ years" read
 * as a course you could enrol in and read as what it is.
 */
/** The two lengths the linked programmes actually publish. */
const SCHEDULE: Record<string, string> = {
  "3–6 months": "How long: three to six months.",
  "No fixed schedule": "How long: the provider publishes no fixed length for this one.",
};

const PREPARATION: Record<string, string> = {
  "Same preparation level":
    "How long: no set course length. This job is rated as asking for about the same preparation as the one you are in.",
  "1–2 years":
    "How long: no set course length. This job is rated one to two years further in preparation than the one you are in.",
  "2+ years":
    "How long: no set course length. This job is rated more than two years further in preparation than the one you are in.",
};

export function routeDuration(d: Destination): Claimed | null {
  if (isSelectionGated(d.soc)) {
    // Empty state C rests on the catalogue search, not on the job zones that
    // produced the band it replaces.
    return { text: NOT_A_COURSE, claim: "training.no-local-supervising" };
  }
  if (d.timeBand == null) return null;

  if (d.timeSource === "program") {
    const schedule = SCHEDULE[d.timeBand];
    return schedule ? { text: schedule, claim: "course.published-length" } : null;
  }
  if (d.timeSource === "open") {
    return {
      text: "How long: nothing to finish first. This is one of the open doors on the map.",
      claim: "map.open-door",
    };
  }

  const preparation = PREPARATION[d.timeBand];
  return preparation ? { text: preparation, claim: "map.preparation-gap" } : null;
}

const GATES_BY_SOC: Record<string, Gate> = {
  "43-3051": {
    need: [
      {
        text: "The payroll exam has no prerequisite and no experience requirement, so this is one of the few doors on this map that a course actually opens.",
        claim: "gate.payroll-exam-open",
      },
    ],
  },
  "15-1252": {
    need: [
      {
        text: "No licence. Employers hire on demonstrated work, so the course below is a start and not the whole door.",
        claim: "gate.hired-on-work",
      },
    ],
  },
  "13-2053": {
    need: [
      {
        text: "Underwriting is usually unlicensed, but employers decide who does it. The insurance licence you may have heard of applies to selling, not to underwriting.",
        claim: "gate.underwriting-licence",
      },
    ],
  },
  "13-2052": {
    need: [
      {
        text: "Advising on money is registered work. Expect securities registration, and often a planning credential, before anyone lets you do it.",
        claim: "gate.securities-registration",
      },
    ],
  },
  "13-2054": {
    need: [
      {
        text: "Risk roles commonly expect a quantitative credential. This map compares skill ratings only and cannot see credentials, so treat this as a question for the employer.",
        claim: "gate.credential-unmeasured",
      },
    ],
  },
  "13-2061": {
    need: [
      {
        text: "Examiner work is reached from inside accounting, by experience rather than by a short course.",
        claim: "gate.experience-route",
      },
    ],
  },
  "19-3011": {
    need: [
      {
        text: "Usually a graduate degree. This map cannot see education requirements, so confirm before planning around it.",
        claim: "gate.credential-unmeasured",
      },
    ],
  },
};

const GATES_BY_PREFIX: [string, Gate][] = [
  ["11-", MANAGEMENT_GATE],
  [
    "25-",
    {
      need: [
        {
          text: "Teaching at college level usually means a graduate degree. This map cannot see education requirements, so confirm before planning around it.",
          claim: "gate.credential-unmeasured",
        },
      ],
    },
  ],
  [
    "49-",
    {
      need: [
        {
          text: "A different trade, not a step sideways. Employers here hire on hours spent working with the tools.",
          claim: "gate.hired-on-work",
        },
      ],
    },
  ],
  [
    "17-3",
    {
      need: [
        {
          text: "Technician work. Employers hire on hands-on hours, which is why the pay rise is real and the door is slow.",
          claim: "gate.hired-on-work",
        },
      ],
    },
  ],
  [
    "17-2",
    {
      need: [
        {
          text: "Engineering roles usually expect an engineering degree. This map compares skill ratings only and cannot see degrees.",
          claim: "gate.credential-unmeasured",
        },
      ],
    },
  ],
];

const DEFAULT_GATE: Gate = {
  need: [
    {
      text: "Nothing here names a licence or a degree — this map compares skill ratings only and cannot see them. Ask the employer what they require.",
      claim: "gate.none-seen",
    },
  ],
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

/**
 * Free resources, each confirmed on the provider's own Virginia site on
 * 2026-08-17. Two near-misses are recorded so nobody re-finds them and assumes
 * they belong: "Richmond Public Library" offering LinkedIn Learning is Richmond,
 * British Columbia (yourlibrary.ca), and the SkillUp "Capital Region" portal
 * with 7,000 free courses serves Albany and Schenectady, New York. Neither
 * serves this region.
 *
 * What each provider covers is quoted from them. Whether that builds a given
 * O*NET skill is a judgement made here by topic, which is why the caveat below
 * travels with the list.
 */
/**
 * Each URL is the resource itself, taken from the link the library publishes on
 * its own page and confirmed to answer 200. Pointing several of these at the
 * library's resource index instead would land the reader on a wall of forty
 * databases, which is the same as not linking them. A test keeps them distinct
 * so that regression cannot creep back.
 *
 * The library entry points carry an institutional token in the query string.
 * They are published openly and are how the library intends patrons to arrive,
 * but a rotated token would break the link silently — hence FREE_LOCAL_HELP,
 * which always names the library itself.
 */
const KHAN_MATH: SelfStudyOption = {
  name: "Mathematics, arithmetic through statistics",
  provider: "Khan Academy",
  access: "Free, no library card, no sign-up fee",
  covers:
    "A full curriculum with practice problems, including “Get ready for” courses for brushing up rather than starting over",
  url: "https://www.khanacademy.org/math",
  claim: "free.khan",
};

const LEARNING_EXPRESS: SelfStudyOption = {
  name: "EBSCO Learning Express",
  provider: "Richmond Public Library",
  access: "Free with a library card",
  covers: "Maths, reading and writing tutorials, plus practice tests and skill-building exercises",
  url: "https://learningexpresshub.com/?Authtoken=A4E8DAD5-B884-47C9-894E-7E2960880642",
  claim: "free.learning-express",
};

const ACCEL: SelfStudyOption = {
  name: "EBSCOlearning ACCEL",
  provider: "Richmond Public Library",
  access: "Free with a library card",
  covers: "Videos, book summaries and articles for building personal and professional skills",
  url: "https://accel.ebscolearning.com/register/fvtbhjGa",
  claim: "free.accel",
};

const UNIVERSAL_CLASS: SelfStudyOption = {
  name: "Universal Class",
  provider: "Richmond Public Library",
  access: "Free with a library card",
  covers: "Over 500 courses with an instructor, most ending in a certificate of completion",
  url: "https://richmondva.universalclass.com/promo.htm",
  claim: "free.universal-class",
};

const BRAINFUSE: SelfStudyOption = {
  name: "Brainfuse E-Learning",
  provider: "Richmond Public Library",
  access: "Free with a library card",
  covers: "Live tutoring and written feedback on your writing",
  url: "https://landing.brainfuse.com/authenticate.asp?u=main.richmondpubliclibrary.virginialibrarieshn.va.brainfuse.com",
  claim: "free.brainfuse",
};

const HENRICO_COMPUTER: SelfStudyOption = {
  name: "Computer classes",
  provider: "Henrico County Public Library",
  access: "Free, in person",
  covers: "Basic computer skills, Microsoft Word, Excel and other Office apps",
  url: "https://www.henricolibrary.org/computer-classes",
  claim: "free.henrico-computer",
};

/** Travels with every free list. Free study is real learning and not a key. */
export const SELF_STUDY_CAVEAT: Claimed = {
  text: "These are free and you can start today. None of them is a credential an employer screens on, a certificate of completion is only a record that you finished, and none of them changes the requirement above. They were matched to these skills by what the provider says they cover, not against the skill ratings.",
  claim: "free.study-is-not-a-credential",
};

const TRAINING: Record<string, Training> = {
  supervising: {
    group: "Running a team or a budget",
    detail:
      "Nothing local that we could find. No school or programme in Greater Richmond sells a course in managing people. It is built by supervising people and by being given the responsibility. These are the nearest things the region sells, and none of them teaches the same skill.",
    claim: "training.no-local-supervising",
    options: [
      {
        name: "Leadership and supervision modules",
        provider: "Community College Workforce Alliance",
        cost: "$145–$295 each, one month, online",
        scope: "Greater Richmond",
        claim: "course.ccwa-leadership",
      },
      {
        name: "Making the Move to Supervisor",
        provider: "Community College Workforce Alliance",
        cost: "Price not published",
        scope: "Greater Richmond",
        claim: "course.ccwa-move-to-supervisor",
      },
      {
        name: "Project management (CAPM, then PMP)",
        provider: "Community College Workforce Alliance",
        cost: "$700 and $1,200",
        scope: "Greater Richmond",
        claim: "course.ccwa-project-management",
      },
    ],
    selfStudy: [UNIVERSAL_CLASS, ACCEL],
  },
  analysing: {
    group: "Taking a system apart and judging it",
    detail:
      "Nothing local that we could find, and this is the largest single training gap on the map. The nearest local courses — data analysis, Six Sigma, Power BI — are neighbouring skills, not this one. This is on our list of what the region is missing.",
    claim: "training.no-local-analysis",
    options: [
      {
        name: "Entry Certificate in Business Analysis (ECBA)",
        provider: "International Institute of Business Analysis",
        cost: "Price not published",
        scope: "National",
        claim: "course.iiba-ecba",
      },
    ],
    // Deliberately empty. Nothing free that was checked teaches these, and a
    // near-enough substitute would erase the largest training gap on the map.
    selfStudy: [],
  },
  mathematics: {
    group: "Working with numbers",
    detail:
      "No short workforce course targets this. The honest local answer is for-credit mathematics at a community college, which financial aid and G3 can cover.",
    claim: "training.maths-for-credit",
    options: [
      {
        name: "For-credit mathematics",
        provider: "Reynolds or Brightpoint Community College",
        cost: "In-state tuition, financial aid eligible",
        scope: "Greater Richmond",
        claim: "course.community-college-maths",
      },
    ],
    selfStudy: [KHAN_MATH, LEARNING_EXPRESS],
  },
  handsOn: {
    group: "Working with equipment",
    detail:
      "Learned in an apprenticeship or a community-college technician programme, where you are paid while you learn. There is no short version, and no certificate stands in for the hours.",
    claim: "training.hands-on-hours",
    options: [],
    // Deliberately empty. Nothing read online substitutes for hours on the tools.
    selfStudy: [],
  },
  working: {
    group: "Everyday working skills",
    detail:
      "These are built by doing the work, by being coached, and in short workshops. No certificate covers them, so nobody should be sold one for this. What is free is practice and coaching, which is worth more here than any course.",
    claim: "training.built-by-doing",
    options: [],
    selfStudy: [ACCEL, LEARNING_EXPRESS, BRAINFUSE, HENRICO_COMPUTER],
  },
};

/**
 * Free, local, and true of every row, so it belongs on the page once rather
 * than inside each skill group. Confirmed 2026-08-17.
 */
export const FREE_LOCAL_HELP = {
  card: {
    // Chesterfield's own library does not carry these platforms, so naming a
    // Chesterfield card here would send a reader somewhere that cannot serve
    // them. A free Henrico card can, and Chesterfield residents qualify for one.
    text: "A free library card unlocks most of the study listed on this page. Henrico gives free cards to residents of Henrico, Chesterfield and the City of Richmond, and to Goochland and Hanover residents through a reciprocal agreement. Both libraries need a photo ID and proof of address.",
    claim: "help.library-card",
    links: [
      {
        label: "Get a Richmond Public Library card",
        url: "https://rvalibrary.org/services/get-card/",
      },
      {
        label: "Get a Henrico County Public Library card",
        url: "https://henricolibrary.org/library-card-registration",
      },
    ],
  },
  board: {
    text: "Virginia Career Works Capital Region is the regional workforce board, federally funded and free, with centres in Chesterfield, Henrico and Richmond West. Where this page says the region sells no course, or sells one at a price, they are who to ask about paying for it. Training there is not automatic: they assess eligibility over one to two weeks, give priority by need, and fund training for the occupations their own published list names.",
    claim: "help.workforce-board",
    links: [{ label: "Virginia Career Works Capital Region", url: "https://vcwcapital.com/" }],
  },
} as const;

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
export function bridgeSummary(bridge: Bridge, skillCount: number): Claimed[] {
  const skills: Claimed = {
    text:
      skillCount === 0
        ? "No skill gap measured"
        : `${skillCount} skill${skillCount === 1 ? "" : "s"} to build`,
    claim: "onet.skill-gap",
  };
  const course: Claimed = bridge.course
    ? { text: "a course names this job", claim: "map.course-subject-not-skills" }
    : { text: "no course in this data names it", claim: "map.course-not-in-data" };
  // Worth a third clause only because it is the half of the row a reader can act
  // on today, and it is otherwise hidden behind the toggle.
  const free: Claimed | undefined = bridge.training.some((t) => t.training.selfStudy.length > 0)
    ? { text: "free study listed", claim: "free.study-is-not-a-credential" }
    : undefined;
  return free ? [skills, course, free] : [skills, course];
}

/**
 * Why a missing course beside a *destination* is not a statement about Greater
 * Richmond — unlike the skill-level gaps above, which were searched for.
 */
export const PARTIAL_COURSE_LIST: Claimed = {
  text: "Courses appear beside a job only where this data links one to it. The region sells others that are not linked, so “no course named here” means none is named here — not that none exists. Where this page instead says nothing local teaches a skill, that gap was searched for in the local catalogues.",
  claim: "map.course-not-in-data",
};

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
