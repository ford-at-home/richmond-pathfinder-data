import { marked } from "marked";

import { PLACEMENT, REPORTS, type FigureId } from "@/content/figures";

marked.use({ gfm: true, breaks: false });

/** Heading text to the anchor a reader can link to. Same algorithm as the Astro source. */
export function anchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * The leading number of a section heading, where it has one.
 *
 * Both reports number their body sections but not their summaries, and the
 * companion documents cross-reference each other by number.
 */
export function sectionNumber(heading: string): number | null {
  const m = /^(\d+)\.\s/.exec(heading);
  return m?.[1] ? Number(m[1]) : null;
}

/**
 * Rewrite the two link forms that only make sense on disk.
 *
 * Source used `/report/$slug`. This project keeps that URL as a redirect and
 * serves the document at `/research/$slug`.
 */
export function resolveLinks(md: string): string {
  return md
    .replace(/\]\(figures\//g, "](/figures/")
    .replace(/\]\(([a-z0-9-]+)\.md(#[^)]*)?\)/g, "](/research/$1$2)");
}

export type SplitSection = {
  heading: string;
  markdown: string;
  html: string;
  number: number | null;
  anchor: string;
  order: number;
  figureIds: FigureId[];
};

export type SplitReport = {
  slug: string;
  title: string;
  preambleMarkdown: string;
  preambleHtml: string;
  sections: SplitSection[];
};

function parseHtml(md: string): string {
  return marked.parse(resolveLinks(md), { async: false }) as string;
}

/**
 * Split a pinned report on `##` headings. The markdown files stay byte-identical;
 * figure placement is applied from PLACEMENT by section number.
 */
export function splitReport(slug: string, raw: string): SplitReport {
  const titleMatch = /^#\s+(.+)$/m.exec(raw);
  const title = titleMatch?.[1]?.trim() ?? slug;

  const parts = raw.split(/^##\s+/m);
  const preamble = (parts[0] ?? "")
    .replace(/^#\s+.+$/m, "")
    .replace(/^\s*---\s*$/m, "")
    .trim();

  const placement = PLACEMENT[slug] ?? {};
  const sections: SplitSection[] = [];

  for (const [i, chunk] of parts.slice(1).entries()) {
    const brk = chunk.indexOf("\n");
    const heading = chunk.slice(0, brk < 0 ? undefined : brk).trim();
    const body = brk < 0 ? "" : chunk.slice(brk + 1).trim();
    const number = sectionNumber(heading);
    const figureIds = number == null ? [] : (placement[number] ?? []);

    sections.push({
      heading,
      markdown: body,
      html: parseHtml(body),
      number,
      anchor: anchor(heading),
      order: i,
      figureIds,
    });
  }

  return {
    slug,
    title,
    preambleMarkdown: preamble,
    preambleHtml: parseHtml(preamble),
    sections,
  };
}

/** Numbered items from a "Summary of findings" section, kept verbatim. */
export function numberedFindings(markdown: string): string[] {
  const parts = markdown.split(/^\d+\.\s+/m).slice(1);
  return parts.map((p) => p.trim()).filter(Boolean);
}

export function readingMinutes(raw: string): number {
  const words = raw.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function reportMeta(slug: string) {
  return REPORTS.find((r) => r.slug === slug);
}
