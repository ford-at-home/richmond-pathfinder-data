import type { Definition, Limitation } from "./types";

/** PLACEHOLDER methodology content — replace with the migrated methodology text. */

export const definitions: Definition[] = [
  {
    term: "Transition",
    definition: "Placeholder definition: a move from one occupation to another occupation.",
    isPlaceholder: true,
  },
  {
    term: "Transition distance",
    definition:
      "Placeholder definition: a measure of how difficult a given move is expected to be.",
    isPlaceholder: true,
  },
  {
    term: "Transition capacity",
    definition: "Placeholder definition: the region's ability to support transitions at scale.",
    isPlaceholder: true,
  },
  {
    term: "Exposure",
    definition:
      "Placeholder definition: the degree to which an occupation's tasks are affected by change.",
    isPlaceholder: true,
  },
];

export const methodologyLimitations: Limitation[] = [
  {
    id: "scaffold",
    title: "This site is currently a scaffold",
    body: "Interface elements are in place, but no research findings, statistics, employers, programs, or citations have been migrated yet.",
    isPlaceholder: true,
  },
  {
    id: "no-determinations",
    title: "No eligibility or ranking determinations",
    body: "This site does not determine eligibility for any program and does not rank employers, providers, or localities.",
    isPlaceholder: true,
  },
];

export const sourceHandling = [
  {
    id: "provenance",
    title: "Every figure carries provenance",
    body: "Source, geography, unit, and reference period appear next to each value or visualization.",
  },
  {
    id: "underlying-data",
    title: "Every visualization exposes its data",
    body: "Each chart or map can be viewed as a table and exported, so readers can inspect the numbers directly.",
  },
  {
    id: "revisions",
    title: "Revisions are dated",
    body: "Updates to a page state what changed and when.",
  },
  {
    id: "uncertainty",
    title: "Uncertainty is shown, not hidden",
    body: "Where a measure is estimated or incomplete, the page says so near the number rather than in a footnote alone.",
  },
] as const;
