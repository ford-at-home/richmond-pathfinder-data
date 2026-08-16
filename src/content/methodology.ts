import methodologyMd from "../../data/source/docs/methodology.md?raw";
import robustnessMd from "../../data/source/docs/robustness.md?raw";
import { marked } from "marked";

import type { Definition, Limitation } from "./types";

marked.use({ gfm: true });

function html(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** Full methodology page body, from the pinned docs. Not paraphrased. */
export const methodologyHtml = html(methodologyMd);
export const robustnessHtml = html(robustnessMd);

/**
 * Terms as the methodology and the capacity report define them.
 * Wording is taken from those documents, not rewritten.
 */
export const definitions: Definition[] = [
  {
    term: "Exposure",
    definition:
      "The share of an occupation's tasks appearing in measured interactions with one provider's models. Three inputs are combined by Anthropic before publication: the O*NET task taxonomy, Anthropic's usage data, and the task-level capability estimates of Eloundou et al. (2023).",
    isPlaceholder: false,
  },
  {
    term: "Adjacent",
    definition:
      "A destination is adjacent to a displaced worker when the national skills database records substantial overlap between the two occupations, which indicates transferable skill rather than an easy or likely move.",
    isPlaceholder: false,
  },
  {
    term: "Wage replacement",
    definition:
      "The destination's mean pay expressed as a percentage of the pay the worker is leaving, so 100% is a lateral move and anything below it is a pay cut.",
    isPlaceholder: false,
  },
  {
    term: "Exposure-weighted jobs",
    definition: "employment × observed_exposure, summed.",
    isPlaceholder: false,
  },
  {
    term: "Mean exposure",
    definition: "exposure-weighted jobs ÷ employment.",
    isPlaceholder: false,
  },
  {
    term: "Concentration",
    definition: "occupations with exposure ≥ 0.25 and location quotient ≥ 1.10.",
    isPlaceholder: false,
  },
];

export const methodologyLimitations: Limitation[] = [
  {
    id: "not-displacement",
    title: "Exposure is not displacement",
    body: 'The measure captures where tasks are being delegated, and some share of that is augmentation. "Exposed" is not a synonym for "at risk."',
    isPlaceholder: false,
  },
  {
    id: "one-provider",
    title: "The instrument is one provider's traffic",
    body: "Occupations rank high partly because that provider's customers work in them. The 411 occupations scoring exactly zero hit a sampling floor — tasks too rare in the data to clear a threshold — which is not a safety guarantee.",
    isPlaceholder: false,
  },
  {
    id: "oews-not-series",
    title: "OEWS is not a time series",
    body: "BLS states this explicitly. Two breaks sit inside the Richmond panel: the metro lost Caroline County and gained King and Queen County between the May 2023 and May 2024 vintages, and the pooled six-panel sample design means one discrete event surfaces as three consecutive declining vintages.",
    isPlaceholder: false,
  },
  {
    id: "no-causal",
    title: "No causal identification",
    body: "Office support has been shrinking since well before 2022. Offshoring, ERP consolidation, interest rates, post-pandemic normalization and hybrid-work restructuring are live alternatives, and the pre-2020 placebo windows show comparable exposed-versus-rest gaps arising without AI.",
    isPlaceholder: false,
  },
  {
    id: "no-determinations",
    title: "No eligibility or ranking determinations",
    body: "This site does not determine eligibility for any program and does not rank employers, providers, or localities.",
    isPlaceholder: false,
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
    body: "Updates to a page state what changed and when. Reports are pinned by SHA-256 in data/source/analysis.lock.json.",
  },
  {
    id: "uncertainty",
    title: "Uncertainty is shown, not hidden",
    body: "Where a measure is estimated or incomplete, the page says so near the number rather than in a footnote alone. Zero exposure is absence of measurement, not safety.",
  },
] as const;
