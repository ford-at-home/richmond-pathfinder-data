/**
 * Where each interactive figure belongs inside the reports.
 *
 * The charts were built to let a reader test a claim rather than take it. That
 * only works if the chart sits at the claim: a jackknife is an argument about
 * the aggregate, and it is worth very little three screens away from the
 * paragraph that states the aggregate.
 *
 * Keyed by report slug and section number, because the vendored markdown is
 * pinned by hash and cannot be annotated. Section numbers are stable — the
 * companion documents cross-reference each other by number, so renumbering is
 * already a breaking change that gets caught elsewhere.
 */

export type FigureId = "landscape" | "leverage" | "history" | "placebo" | "wages" | "pathways";

export interface Figure {
  id: FigureId;
  title: string;
  /** How much weight the analysis says this claim bears. From Section 8.9. */
  tier: "Defensible" | "Not supportable" | "Method";
  lede: string;
}

export const FIGURES: Record<FigureId, Figure> = {
  landscape: {
    id: "landscape",
    title: "Every occupation, by exposure and pay",
    tier: "Method",
    lede: "Where AI-exposed work sits in this labour market, and how little of the employment change around it can be told apart from sampling noise.",
  },
  leverage: {
    id: "leverage",
    title: "The aggregate is three occupations",
    tier: "Not supportable",
    lede: "Exposed occupations lost 4.37% of their employment while the rest of the metro grew. That figure does not describe exposed work as a class, and you can take it apart yourself.",
  },
  history: {
    id: "history",
    title: "What the three named declines look like over sixteen years",
    tier: "Defensible",
    lede: "Each decline is many times its own sampling error and carries the occupation below where it stood a decade ago.",
  },
  placebo: {
    id: "placebo",
    title: "The same screen before generative AI existed",
    tier: "Not supportable",
    lede: "Run the identical test on windows that closed before a language model was publicly available. If the pattern appears there too, it is not evidence about AI.",
  },
  wages: {
    id: "wages",
    title: "Wage separates where exposure does not",
    tier: "Defensible",
    lede: "The most transportable result in the analysis, and it holds at every cut point tested rather than only at the one the report chose.",
  },
  pathways: {
    id: "pathways",
    title: "Capacity exists, reach does not",
    tier: "Defensible",
    lede: "The region kept creating good jobs. Almost none of them are reachable from the work that disappeared, because the occupations next door are failing together.",
  },
};

/** Report slug, then section number, to the figures that belong in it. */
export const PLACEMENT: Record<string, Record<number, FigureId[]>> = {
  "ai-exposure-and-employment-change": {
    2: ["landscape"],
    3: ["leverage"],
    5: ["wages"],
    8: ["placebo", "history"],
  },
  "transition-capacity": {
    5: ["pathways"],
  },
};

export const REPORTS = [
  {
    slug: "ai-exposure-and-employment-change",
    short: "AI Exposure and Employment Change",
    blurb:
      "Where AI-exposed work sits in the Richmond economy, what happened to employment in it between May 2023 and May 2025, and which of those movements survive a robustness battery.",
  },
  {
    slug: "transition-capacity",
    short: "Transition Capacity",
    blurb:
      "Whether the occupations that contracted have adjacent, durable, better-paid destinations in this labour market, and what the region would have to build where they do not.",
  },
  {
    slug: "technical-appendix",
    short: "Technical Appendix",
    blurb:
      "The full occupation-level tables behind both reports, generated directly from the data rather than transcribed.",
  },
] as const;

export function isFigureId(id: string): id is FigureId {
  return id in FIGURES;
}
