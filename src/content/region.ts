import type { Limitation, Locality, RegionMeasure } from "./types";

/**
 * PLACEHOLDER regional data.
 * Measure values are null; locality rows exist to demonstrate the table
 * fallback that accompanies the future MapLibre GL JS map.
 */

const pendingProvenance = {
  source: "Pending migration",
  geography: "Richmond, Virginia region",
  period: "Pending migration",
  note: "No value is displayed until a sourced dataset is migrated.",
};

export const regionMeasures: RegionMeasure[] = [
  {
    id: "employment",
    label: "Total employment",
    value: null,
    unit: "jobs",
    provenance: { ...pendingProvenance, unit: "jobs" },
    isPlaceholder: true,
  },
  {
    id: "ai-exposure",
    label: "AI exposure of employment",
    value: null,
    unit: "share of jobs",
    provenance: { ...pendingProvenance, unit: "share of jobs" },
    isPlaceholder: true,
  },
  {
    id: "hiring-demand",
    label: "Hiring demand",
    value: null,
    unit: "postings",
    provenance: { ...pendingProvenance, unit: "postings" },
    isPlaceholder: true,
  },
  {
    id: "training-providers",
    label: "Training providers",
    value: null,
    unit: "providers",
    provenance: { ...pendingProvenance, unit: "providers" },
    isPlaceholder: true,
  },
];

export const localities: Locality[] = [
  {
    id: "locality-1",
    name: "Placeholder locality 1",
    type: "city",
    measures: { employment: null, "ai-exposure": null, "hiring-demand": null },
    isPlaceholder: true,
  },
  {
    id: "locality-2",
    name: "Placeholder locality 2",
    type: "county",
    measures: { employment: null, "ai-exposure": null, "hiring-demand": null },
    isPlaceholder: true,
  },
  {
    id: "locality-3",
    name: "Placeholder locality 3",
    type: "county",
    measures: { employment: null, "ai-exposure": null, "hiring-demand": null },
    isPlaceholder: true,
  },
  {
    id: "locality-4",
    name: "Placeholder locality 4",
    type: "county",
    measures: { employment: null, "ai-exposure": null, "hiring-demand": null },
    isPlaceholder: true,
  },
];

export const regionLimitations: Limitation[] = [
  {
    id: "geography-definition",
    title: "Regional boundary is not yet fixed",
    body: "The set of localities treated as the Richmond region must be defined during migration and stated on every map and table.",
    isPlaceholder: true,
  },
  {
    id: "timing",
    title: "Reference periods will differ across datasets",
    body: "Employment, postings, and training data are collected on different schedules. Each measure will carry its own period label.",
    isPlaceholder: true,
  },
];
