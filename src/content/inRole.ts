import type { Claimed } from "@/content/claims";

/**
 * Staying in this job.
 *
 * The panel most workforce sites would fill with encouragement. It is filled
 * here only where a source says something, because a reader may act on it.
 *
 * Two things are deliberately absent.
 *
 * There is no "work in the same family that pays more" line. It is computable
 * from the published wage table — same major group, higher mean — but a second
 * list of better-paid jobs built without the relatedness screen would sit beside
 * the routes above and read as a weaker version of them. One rule for what
 * counts as a next job, or none.
 *
 * And there is no default for `evidence`. Where no study was found, the panel
 * says so in its own words rather than falling back to a hedge, because the
 * absence is the finding: for 37 of the 39 starting jobs, nobody has published
 * anything we would stand behind about doing this job with AI.
 */
export type InRole = {
  /** What the job already does. Only where the published task list is plain. */
  does?: Claimed;
  /** What AI is documented doing here. Empty state D where nothing was found. */
  evidence: Claimed;
  /** The non-negotiable a person still has to check. */
  mustCheck?: Claimed;
  /** Who captures the value — and it says "the employer" where that is true. */
  whoDecides?: Claimed;
};

/** Empty state D. The default, and by count the usual case. */
const NO_EVIDENCE: Claimed = {
  text: "We don't have good information yet. We looked for studies and employer guides about people in this job using AI to take on more valuable work, and didn't find any we would stand behind. Absence of a study isn't absence of a possibility — it means we won't guess on a screen you might act on.",
  claim: "stay.no-evidence",
};

const PANELS: Record<string, InRole> = {
  // Customer Service Representatives. The strongest in-role evidence on the map,
  // and the only occupation here with a randomised field study behind it.
  "43-4051": {
    does: {
      text: "This job already answers questions, resolves complaints and documents cases.",
      claim: "onet.tasks",
    },
    evidence: {
      text: "This is the job with the strongest evidence on the map. In a study of more than 5,000 support agents, access to an AI assistant raised issues resolved per hour by about 14% on average, and by about 34% for the newest agents.",
      claim: "stay.support-agent-study",
    },
    mustCheck: {
      text: "Anything you tell a customer they are entitled to. These tools invent policy details fluently.",
      claim: "stay.tool-fabricates",
    },
    whoDecides: {
      text: "The extra output goes to the employer by default. It reaches you only if the role is formally redesigned, or if you move into the lead work.",
      claim: "stay.employer-captures",
    },
  },

  // Medical Secretaries and Administrative Assistants. No study found, and a
  // rule that comes before the question of whether one would help.
  "43-6013": {
    does: {
      text: "This job already handles scheduling, patient records, insurance correspondence and front-desk coordination.",
      claim: "onet.tasks",
    },
    evidence: NO_EVIDENCE,
    mustCheck: {
      text: "This job touches protected health information. Patient data does not go into a general AI tool. That rule comes before any efficiency question, and it is your employer's to set, not yours.",
      claim: "stay.phi-rule",
    },
  },
};

export function inRoleFor(soc: string): InRole {
  return PANELS[soc] ?? { evidence: NO_EVIDENCE };
}

/** Origins with a sourced in-role study. A test pins the count so it can only grow deliberately. */
export const SOURCED_IN_ROLE: readonly string[] = Object.entries(PANELS)
  .filter(([, p]) => p.evidence !== NO_EVIDENCE)
  .map(([soc]) => soc);
