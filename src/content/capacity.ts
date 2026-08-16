import type { CapacityStage, Limitation } from "./types";

/**
 * The published transition-capacity report does not compute
 * exposed-workers → openings → seats → funding → remaining-gap.
 * Stage values stay null so this page cannot invent that chain (decision 6).
 */

const notInSource =
  "This six-stage calculator is not in the published analysis. Values stay empty until a human decides the chain exists in a sourced file.";

export const capacityStages: CapacityStage[] = [
  {
    id: "exposed-workers",
    label: "Exposed workers",
    question: "How many workers hold roles with meaningful exposure to change?",
    value: null,
    unit: "workers",
    note: notInSource,
    isPlaceholder: true,
  },
  {
    id: "plausible-destinations",
    label: "Plausible destinations",
    question: "Which adjacent occupations are realistic destinations?",
    value: null,
    unit: "occupations",
    note: notInSource,
    isPlaceholder: true,
  },
  {
    id: "job-openings",
    label: "Job openings",
    question: "How many regional openings exist in those destinations?",
    value: null,
    unit: "annual openings",
    note: notInSource,
    isPlaceholder: true,
  },
  {
    id: "training-seats",
    label: "Training seats",
    question: "How many training seats can the region deliver?",
    value: null,
    unit: "seats per year",
    note: notInSource,
    isPlaceholder: true,
  },
  {
    id: "funding-support",
    label: "Funding and support",
    question: "What funding and wraparound support is available?",
    value: null,
    unit: "dollars",
    note: notInSource,
    isPlaceholder: true,
  },
  {
    id: "capacity-gap",
    label: "Remaining capacity gap",
    question: "What remains unserved after the steps above?",
    value: null,
    unit: "workers",
    note: notInSource,
    isPlaceholder: true,
  },
];

export const evidenceSections = [
  { id: "supply", label: "Workforce supply", note: "Who is available to move, and from where." },
  {
    id: "demand",
    label: "Employer demand",
    note: "What regional employers are actually hiring for. No postings file is in the source (U4).",
  },
  {
    id: "training",
    label: "Training capacity",
    note: "Providers, programs, seats, and throughput. No seat-count file is in the source (U4).",
  },
  { id: "time", label: "Time", note: "How long a transition takes end to end." },
  { id: "cost", label: "Cost", note: "Direct cost, forgone wages, and who bears them." },
  {
    id: "institutional",
    label: "Institutional readiness",
    note: "Coordination, funding rules, and delivery capacity.",
  },
] as const;

export const scenarioControls = [
  { id: "horizon", label: "Time horizon", state: "Not in the source report" },
  { id: "geography", label: "Geography", state: "MSA 40060 — not a control" },
  { id: "cohort", label: "Worker cohort", state: "Not in the source report" },
  { id: "training-throughput", label: "Training throughput", state: "Not in the source report" },
] as const;

export const capacityLimitations: Limitation[] = [
  {
    id: "no-calculator",
    title: "This page does not calculate a regional capacity gap",
    body: "The published Transition Capacity report screens adjacent destinations for occupations that lost employment. It does not compute exposed workers minus openings minus seats. The six stages below are the scaffold's reserved calculator and remain empty.",
    isPlaceholder: false,
  },
  {
    id: "adjacency-not-ease",
    title: "Adjacency is transferable skill, not an easy or likely move",
    body: "The report's own summary: a destination is adjacent when the national skills database records substantial overlap, which indicates transferable skill rather than an easy or likely move.",
    isPlaceholder: false,
  },
];
