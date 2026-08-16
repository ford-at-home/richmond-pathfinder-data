import exposureMd from "../../data/source/reports/ai-exposure-and-employment-change.md?raw";
import capacityMd from "../../data/source/reports/transition-capacity.md?raw";
import appendixMd from "../../data/source/reports/technical-appendix.md?raw";

import { REPORTS } from "./figures";
import type { ResearchSection, ResearchStory, Source } from "./types";
import { numberedFindings, readingMinutes, splitReport } from "@/lib/reports";

/**
 * Source register. Titles, dates, and retrieval notes are taken from the
 * pinned technical appendix (Section A) and data/source/docs/data-sources.md.
 * Do not add a source that those documents do not name.
 */
export const sources: Source[] = [
  {
    id: "anthropic-economic-index",
    title: "Occupational observed-task exposure (job_exposure.csv)",
    publisher: "Anthropic Economic Index",
    date: "2026-03-05",
    accessed: "2026-07",
    url: "https://huggingface.co/datasets/Anthropic/EconomicIndex",
    pages: "labor_market_impacts/job_exposure.csv; 756 occupations; CC BY 4.0",
    kind: "dataset",
    isPlaceholder: false,
  },
  {
    id: "bls-oews",
    title: "Occupational Employment and Wage Statistics, Richmond VA MSA (BLS 40060)",
    publisher: "U.S. Bureau of Labor Statistics",
    date: "2025-05",
    accessed: "2026-07",
    url: "https://www.bls.gov/oes/special-requests/",
    pages: "May 2010–May 2025 metro and national releases used in the panel",
    kind: "dataset",
    isPlaceholder: false,
  },
  {
    id: "onet",
    title: "Related Occupations and Job Zones",
    publisher: "O*NET",
    accessed: "2026-07",
    url: "https://www.onetcenter.org/database.html",
    pages: "adjacency and job zones for the capacity analysis",
    kind: "dataset",
    isPlaceholder: false,
  },
  {
    id: "bls-qcew",
    title: "Quarterly Census of Employment and Wages, county files",
    publisher: "U.S. Bureau of Labor Statistics",
    date: "2025",
    accessed: "2026-07",
    url: "https://www.bls.gov/cew/",
    pages: "seventeen counties of the current Richmond MSA, 2019–2025; private ownership",
    kind: "dataset",
    isPlaceholder: false,
  },
  {
    id: "grp-employers",
    title: "Richmond-VA-Largest-Employers.pdf",
    publisher: "Greater Richmond Partnership",
    date: "2026-02",
    kind: "report",
    isPlaceholder: false,
    pages:
      "Named in the technical appendix source table; not used as occupational evidence on this site",
  },
];

const RAW: Record<string, string> = {
  "ai-exposure-and-employment-change": exposureMd,
  "transition-capacity": capacityMd,
  "technical-appendix": appendixMd,
};

const RELATED: Record<string, string[]> = {
  "ai-exposure-and-employment-change": ["transition-capacity", "technical-appendix"],
  "transition-capacity": ["ai-exposure-and-employment-change", "technical-appendix"],
  "technical-appendix": ["ai-exposure-and-employment-change", "transition-capacity"],
};

const SOURCE_IDS: Record<string, string[]> = {
  "ai-exposure-and-employment-change": ["anthropic-economic-index", "bls-oews"],
  "transition-capacity": ["anthropic-economic-index", "bls-oews", "onet"],
  "technical-appendix": [
    "anthropic-economic-index",
    "bls-oews",
    "onet",
    "bls-qcew",
    "grp-employers",
  ],
};

function toStory(slug: string): ResearchStory {
  const raw = RAW[slug];
  if (!raw) throw new Error(`No markdown for report ${slug}`);
  const split = splitReport(slug, raw);
  const meta = REPORTS.find((r) => r.slug === slug);
  if (!meta) throw new Error(`No REPORTS entry for ${slug}`);

  const summary = split.sections.find((s) => s.heading.toLowerCase().includes("summary"));
  const findings = summary ? numberedFindings(summary.markdown) : [];

  const sections: ResearchSection[] = split.sections.map((s) => ({
    heading: s.heading,
    body: s.markdown.slice(0, 280),
    html: s.html,
    number: s.number,
    anchor: s.anchor,
    figureIds: s.figureIds,
  }));

  return {
    slug,
    title: split.title,
    topic: meta.short,
    thesis: meta.blurb,
    publishedAt: "2026-07",
    readingMinutes: readingMinutes(raw),
    sourceIds: SOURCE_IDS[slug] ?? [],
    keyFindings: findings,
    preambleHtml: split.preambleHtml,
    sections,
    limitations: [],
    whatThisMeans: "",
    relatedSlugs: RELATED[slug] ?? [],
    isPlaceholder: false,
  };
}

export const researchStories: ResearchStory[] = REPORTS.map((r) => toStory(r.slug));

export const researchTopics = [...new Set(researchStories.map((s) => s.topic))];

export function getStory(slug: string): ResearchStory | undefined {
  return researchStories.find((s) => s.slug === slug);
}

export function getSources(ids: string[]): Source[] {
  return ids.map((id) => sources.find((s) => s.id === id)).filter((s): s is Source => Boolean(s));
}
