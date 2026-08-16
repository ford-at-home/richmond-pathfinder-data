import type { ResearchStory, Source } from "./types";

/**
 * PLACEHOLDER research entries.
 * Titles, findings, dates and sources below are structural demonstrations only.
 * Replace wholesale during migration (JSON, MDX, or API response).
 */

export const sources: Source[] = [
  {
    id: "placeholder-source-a",
    title: "Placeholder source A — replace during migration",
    publisher: "Placeholder publisher",
    date: "2026-01-01",
    kind: "dataset",
    isPlaceholder: true,
  },
  {
    id: "placeholder-source-b",
    title: "Placeholder source B — replace during migration",
    publisher: "Placeholder publisher",
    date: "2026-01-01",
    kind: "report",
    isPlaceholder: true,
  },
  {
    id: "placeholder-source-c",
    title: "Placeholder source C — replace during migration",
    publisher: "Placeholder publisher",
    date: "2026-01-01",
    kind: "administrative",
    isPlaceholder: true,
  },
];

export const researchTopics = [
  "Transitions",
  "Capacity",
  "Regional data",
  "Training",
] as const;

export const researchStories: ResearchStory[] = [
  {
    slug: "placeholder-story-one",
    title: "Placeholder research story one",
    topic: "Transitions",
    thesis: "Placeholder thesis sentence — the migrated story states its answer here in one sentence.",
    publishedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readingMinutes: 7,
    sourceIds: ["placeholder-source-a", "placeholder-source-b"],
    keyFindings: [
      "Placeholder key finding — replace with migrated, sourced text.",
      "Placeholder key finding — replace with migrated, sourced text.",
      "Placeholder key finding — replace with migrated, sourced text.",
    ],
    sections: [
      {
        heading: "What the question is",
        body: "Placeholder section body. Migration should place the story's framing here, written as editorial prose with inline references to the source list.",
      },
      {
        heading: "What the evidence shows",
        body: "Placeholder section body. The visual evidence stage above this section is reserved for a chart or diagram with its own unit, geography, period, and source line.",
      },
      {
        heading: "Where the picture is incomplete",
        body: "Placeholder section body. Gaps in coverage, timing, or comparability belong here rather than in the findings.",
      },
    ],
    limitations: [
      "Placeholder limitation — replace with the real caveat text at migration.",
      "Placeholder limitation — replace with the real caveat text at migration.",
    ],
    whatThisMeans:
      "Placeholder interpretation. Scaffold text makes no causal claim, recommendation, ranking, or eligibility determination.",
    relatedSlugs: ["placeholder-story-two", "placeholder-story-three"],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-story-two",
    title: "Placeholder research story two",
    topic: "Capacity",
    thesis: "Placeholder thesis sentence — the migrated story states its answer here in one sentence.",
    publishedAt: "2026-01-01",
    readingMinutes: 5,
    sourceIds: ["placeholder-source-b"],
    keyFindings: [
      "Placeholder key finding — replace with migrated, sourced text.",
      "Placeholder key finding — replace with migrated, sourced text.",
    ],
    sections: [
      {
        heading: "What the question is",
        body: "Placeholder section body for the capacity-oriented story template.",
      },
      {
        heading: "What the evidence shows",
        body: "Placeholder section body reserved for migrated analysis.",
      },
    ],
    limitations: ["Placeholder limitation — replace during migration."],
    whatThisMeans: "Placeholder interpretation reserved for migrated text.",
    relatedSlugs: ["placeholder-story-one"],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-story-three",
    title: "Placeholder research story three",
    topic: "Regional data",
    thesis: "Placeholder thesis sentence — the migrated story states its answer here in one sentence.",
    publishedAt: "2026-01-01",
    readingMinutes: 9,
    sourceIds: ["placeholder-source-a", "placeholder-source-c"],
    keyFindings: ["Placeholder key finding — replace with migrated, sourced text."],
    sections: [
      {
        heading: "What the question is",
        body: "Placeholder section body for the regional-data story template.",
      },
      {
        heading: "What the evidence shows",
        body: "Placeholder section body reserved for migrated analysis.",
      },
    ],
    limitations: ["Placeholder limitation — replace during migration."],
    whatThisMeans: "Placeholder interpretation reserved for migrated text.",
    relatedSlugs: ["placeholder-story-one", "placeholder-story-two"],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-story-four",
    title: "Placeholder research story four",
    topic: "Training",
    thesis: "Placeholder thesis sentence — the migrated story states its answer here in one sentence.",
    publishedAt: "2026-01-01",
    readingMinutes: 4,
    sourceIds: ["placeholder-source-c"],
    keyFindings: ["Placeholder key finding — replace with migrated, sourced text."],
    sections: [
      {
        heading: "What the question is",
        body: "Placeholder section body for the training-oriented story template.",
      },
    ],
    limitations: ["Placeholder limitation — replace during migration."],
    whatThisMeans: "Placeholder interpretation reserved for migrated text.",
    relatedSlugs: ["placeholder-story-two"],
    isPlaceholder: true,
  },
];

export function getStory(slug: string): ResearchStory | undefined {
  return researchStories.find((s) => s.slug === slug);
}

export function getSources(ids: string[]): Source[] {
  return ids
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));
}
