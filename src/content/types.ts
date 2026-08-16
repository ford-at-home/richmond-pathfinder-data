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
  /** Date the analysis retrieved the source, when the source record states one. */
  accessed?: string | undefined;
  url?: string | undefined;
  /** Pages or sections supporting a claim, when the source record states them. */
  pages?: string | undefined;
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
  fromTitle: string;
  toTitle: string;
  /** 0–1 normalized distance. The source table does not publish this; leave null. */
  distance: number | null;
  /** Qualitative band used for the legend. Unused until a source definition exists. */
  band: "near" | "moderate" | "far" | "unknown";
  /** Job-zone difference from pathways_reachable.csv. */
  zoneGap: number | null;
  /** Destination mean pay as a percentage of origin pay. */
  replacement: number | null;
  /** Screen tier from the published table, e.g. Primary-Short. */
  tier: string;
  originLost: number | null;
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

export type ResearchSection = {
  heading: string;
  /** Plain-text excerpt for search; not a paraphrase of the HTML. */
  body: string;
  html: string;
  number: number | null;
  anchor: string;
  figureIds: string[];
};

export type ResearchStory = {
  slug: string;
  title: string;
  topic: string;
  /** One-sentence answer or thesis. Taken from the source report blurbs, not rewritten. */
  thesis: string;
  publishedAt: string;
  updatedAt?: string | undefined;
  readingMinutes: number;
  sourceIds: string[];
  keyFindings: string[];
  preambleHtml: string;
  sections: ResearchSection[];
  limitations: string[];
  whatThisMeans: string;
  relatedSlugs: string[];
  isPlaceholder: boolean;
};
