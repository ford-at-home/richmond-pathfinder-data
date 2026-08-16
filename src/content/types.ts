/**
 * Content model for the site.
 *
 * Every record carries `isPlaceholder` so scaffold content can never be
 * mistaken for migrated, sourced material. Migration should replace the
 * data modules in this folder, not these types (extend them as needed).
 */

export type Provenance = {
  /** Human-readable publisher or dataset owner. */
  source: string;
  /** Geography the value describes, e.g. "Richmond MSA". */
  geography: string;
  /** Unit of measure, e.g. "workers", "percent of employment". */
  unit?: string | undefined;
  /** ISO date or period label for the underlying data. */
  period?: string | undefined;
  /** Link to the source, when one exists. */
  url?: string | undefined;
  /** Notes about collection, revision, or comparability. */
  note?: string | undefined;
};

export type Source = {
  id: string;
  title: string;
  publisher: string;
  /** ISO 8601 date string. */
  date?: string | undefined;
  url?: string | undefined;
  kind: "dataset" | "report" | "article" | "interview" | "administrative" | "other";
  isPlaceholder: boolean;
};

export type Limitation = {
  id: string;
  title: string;
  body: string;
  isPlaceholder: boolean;
};

export type Definition = {
  term: string;
  definition: string;
  isPlaceholder: boolean;
};

export type Occupation = {
  id: string;
  /** SOC code or other stable identifier once migrated. */
  code?: string | undefined;
  title: string;
  cluster: string;
  isPlaceholder: boolean;
};

export type TransitionEdge = {
  fromId: string;
  toId: string;
  /** 0–1 normalized distance; higher means a harder move. Placeholder only. */
  distance: number | null;
  /** Qualitative band used for the legend. */
  band: "near" | "moderate" | "far" | "unknown";
  transferableSkills: string[];
  skillGaps: string[];
  steps: string[];
  isPlaceholder: boolean;
};

export type CapacityStage = {
  id: string;
  label: string;
  question: string;
  /** Intentionally null in the scaffold — no fabricated calculations. */
  value: number | null;
  unit?: string | undefined;
  note: string;
  isPlaceholder: boolean;
};

export type RegionMeasure = {
  id: string;
  label: string;
  value: string | null;
  unit?: string | undefined;
  provenance: Provenance;
  isPlaceholder: boolean;
};

export type Locality = {
  id: string;
  name: string;
  type: "city" | "county" | "town";
  /** Column values keyed by measure id; null where unmigrated. */
  measures: Record<string, string | null>;
  isPlaceholder: boolean;
};

export type ResearchStory = {
  slug: string;
  title: string;
  topic: string;
  /** One-sentence answer or thesis. */
  thesis: string;
  publishedAt: string;
  updatedAt?: string | undefined;
  readingMinutes: number;
  sourceIds: string[];
  keyFindings: string[];
  sections: { heading: string; body: string }[];
  limitations: string[];
  whatThisMeans: string;
  relatedSlugs: string[];
  isPlaceholder: boolean;
};
