import exposureMd from "../../data/source/reports/ai-exposure-and-employment-change.md?raw";
import capacityMd from "../../data/source/reports/transition-capacity.md?raw";
import appendixMd from "../../data/source/reports/technical-appendix.md?raw";
import trainingMd from "../../data/source/reports/training-bridges-and-career-ladders.md?raw";

import { REPORTS } from "./figures";
import type { ResearchSection, ResearchStory, Source } from "./types";
import { numberedFindings, readingMinutes, splitReport } from "@/lib/reports";
import { pinRef, pinRepoUrl } from "@/lib/pin";

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
  {
    id: "ccwa-catalog",
    title: "CCWA course catalog, July–December 2026 (FastForward student prices)",
    publisher: "Community College Workforce Alliance (Reynolds and Brightpoint)",
    date: "2026",
    accessed: "2026-11-12",
    url: "https://ccwatraining.org/resources/docs/ccwa-spr2026-catalog-111025-interactive.pdf",
    pages: "Program prices, schedules, locations and prerequisites",
    kind: "report",
    isPlaceholder: false,
  },
  {
    id: "jlarc-608",
    title: "JLARC Report 608 (FastForward cost sharing)",
    publisher: "Joint Legislative Audit and Review Commission",
    accessed: "2026-11-12",
    url: "https://jlarc.virginia.gov/pdfs/reports/Rpt608.pdf",
    pages: "Student pays one-third of program cost on completion",
    kind: "report",
    isPlaceholder: false,
  },
  {
    id: "bls-cps-11",
    title: "Current Population Survey Table 11 / 11b",
    publisher: "U.S. Bureau of Labor Statistics",
    date: "2025",
    accessed: "2026-11-12",
    url: "https://www.bls.gov/cps/cpsaat11.htm",
    pages: "National demographic composition by occupation",
    kind: "dataset",
    isPlaceholder: false,
  },
];

const RAW: Record<string, string> = {
  "ai-exposure-and-employment-change": exposureMd,
  "transition-capacity": capacityMd,
  "technical-appendix": appendixMd,
  "training-bridges-and-career-ladders": trainingMd,
};

/** Reports researched after the pinned analysis. Cited at their own page, dated, not pinned. */
const UNPINNED: Record<string, { date: string; label: string }> = {
  "training-bridges-and-career-ladders": { date: "2026-11", label: "November 2026" },
};

const RELATED: Record<string, string[]> = {
  "ai-exposure-and-employment-change": ["transition-capacity", "technical-appendix"],
  "transition-capacity": ["ai-exposure-and-employment-change", "technical-appendix"],
  "technical-appendix": ["ai-exposure-and-employment-change", "transition-capacity"],
  "training-bridges-and-career-ladders": ["transition-capacity", "technical-appendix"],
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
  "training-bridges-and-career-ladders": ["ccwa-catalog", "jlarc-608", "bls-oews", "bls-cps-11"],
};

function toStory(slug: string): ResearchStory {
  const raw = RAW[slug];
  if (!raw) throw new Error(`No markdown for report ${slug}`);
  const split = splitReport(slug, raw);
  const meta = REPORTS.find((r) => r.slug === slug);
  if (!meta) throw new Error(`No REPORTS entry for ${slug}`);

  const summary = split.sections.find((s) => s.heading.toLowerCase().includes("summary"));
  const tldr = split.sections.find((s) => s.heading.toLowerCase() === "tl;dr");
  const findings = summary
    ? numberedFindings(summary.markdown)
    : tldr
      ? tldr.markdown
          .split(/^-\s+/m)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
  const unpinned = UNPINNED[slug];

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
    publishedAt: unpinned?.date ?? "2026-07",
    readingMinutes: readingMinutes(raw),
    sourceIds: SOURCE_IDS[slug] ?? [],
    citation: unpinned
      ? {
          title: split.title,
          url: `https://workforcerichmond.org/research/${slug}`,
          reference: `${split.title}. Richmond Workforce Transition. ${unpinned.label}. Wages marked provisional are unverified.`,
        }
      : {
          title: split.title,
          url: `${pinRepoUrl}/blob/${pinRef}/reports/${slug}.md`,
          reference: `${split.title}. hack4rva/richmond-ai-impact-analysis. July 2026. Revision ${pinRef}.`,
        },
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
