import type { CapacityStage, Limitation } from "./types";

/**
 * PLACEHOLDER capacity progression.
 * Every value is null on purpose — the scaffold performs no calculations.
 */

export const capacityStages: CapacityStage[] = [
  {
    id: "exposed-workers",
    label: "Exposed workers",
    question: "How many workers hold roles with meaningful exposure to change?",
    value: null,
    unit: "workers",
    note: "Awaiting migrated exposure estimates.",
    isPlaceholder: true,
  },
  {
    id: "plausible-destinations",
    label: "Plausible destinations",
    question: "Which adjacent occupations are realistic destinations?",
    value: null,
    unit: "occupations",
    note: "Derived from the transition map once migrated.",
    isPlaceholder: true,
  },
  {
    id: "job-openings",
    label: "Job openings",
    question: "How many regional openings exist in those destinations?",
    value: null,
    unit: "annual openings",
    note: "Awaiting migrated demand data.",
    isPlaceholder: true,
  },
  {
    id: "training-seats",
    label: "Training seats",
    question: "How many training seats can the region deliver?",
    value: null,
    unit: "seats per year",
    note: "Awaiting migrated provider capacity data.",
    isPlaceholder: true,
  },
  {
    id: "funding-support",
    label: "Funding and support",
    question: "What funding and wraparound support is available?",
    value: null,
    unit: "dollars",
    note: "Awaiting migrated program data.",
    isPlaceholder: true,
  },
  {
    id: "capacity-gap",
    label: "Remaining capacity gap",
    question: "What remains unserved after the steps above?",
    value: null,
    unit: "workers",
    note: "Computed only after every upstream input is migrated.",
    isPlaceholder: true,
  },
];

export const evidenceSections = [
  { id: "supply", label: "Workforce supply", note: "Who is available to move, and from where." },
  { id: "demand", label: "Employer demand", note: "What regional employers are actually hiring for." },
  { id: "training", label: "Training capacity", note: "Providers, programs, seats, and throughput." },
  { id: "time", label: "Time", note: "How long a transition takes end to end." },
  { id: "cost", label: "Cost", note: "Direct cost, forgone wages, and who bears them." },
  { id: "institutional", label: "Institutional readiness", note: "Coordination, funding rules, and delivery capacity." },
] as const;

export const scenarioControls = [
  { id: "horizon", label: "Time horizon", state: "Not yet wired" },
  { id: "geography", label: "Geography", state: "Not yet wired" },
  { id: "cohort", label: "Worker cohort", state: "Not yet wired" },
  { id: "training-throughput", label: "Training throughput", state: "Not yet wired" },
] as const;

export const capacityLimitations: Limitation[] = [
  {
    id: "no-calculations",
    title: "No calculations are performed in this scaffold",
    body: "Stage values are intentionally empty. Any figure shown after migration must trace to a documented input and method.",
    isPlaceholder: true,
  },
];
