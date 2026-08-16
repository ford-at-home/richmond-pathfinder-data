import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { LimitationNote } from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { ResearchCard } from "@/components/research";
import { DepthLabel } from "@/components/story";
import { PLACEMENT, REPORTS } from "@/content/figures";
import { researchStories } from "@/content/research";
import { pinCommitUrl, pinRepo, pinShort, pinSynced } from "@/lib/pin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "AI Exposure and Employment Change in the Richmond Metropolitan Area",
      },
      {
        name: "description",
        content:
          "Occupation-level evidence on where AI-exposed work sits in the Richmond, Virginia economy, what happened to employment in that work between May 2023 and May 2025, and what it would take to move the people affected.",
      },
      {
        property: "og:title",
        content: "AI Exposure and Employment Change in the Richmond Metropolitan Area",
      },
      {
        property: "og:description",
        content:
          "523 detailed occupations, 88.4% of metropolitan employment, joined from Anthropic observed task-exposure scores and BLS occupational employment estimates.",
      },
    ],
  }),
  component: Overview,
});

function liveCount(slug: string): number {
  const placement = PLACEMENT[slug] ?? {};
  return Object.values(placement).reduce((n, ids) => n + ids.length, 0);
}

function Overview() {
  const reports = REPORTS.map((r) => researchStories.find((s) => s.slug === r.slug)).filter(
    (s): s is (typeof researchStories)[number] => Boolean(s),
  );
  const [lead, companion] = [reports.slice(0, 2), reports.slice(2)];

  return (
    <>
      <ProseContainer>
        <PageHeader
          eyebrow="Richmond VA MSA (BLS 40060)"
          title="AI Exposure and Employment Change in the Richmond Metropolitan Area"
          lead="523 detailed occupations, 88.4% of metropolitan employment, joined from Anthropic's observed task-exposure scores and Bureau of Labor Statistics occupational employment estimates."
        >
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Two of the most quotable numbers in this analysis are labelled{" "}
            <strong className="text-foreground">not supportable</strong> by the analysis itself. The
            interactive figures set into the reports exist so that a reader can take those numbers
            apart rather than repeat them.
          </p>
        </PageHeader>
      </ProseContainer>

      <ProseContainer>
        <PageSection labelledBy="reports">
          <DepthLabel>In two minutes</DepthLabel>
          <SectionIntro
            className="mt-2"
            eyebrow="The reports"
            title="Start with the evidence base"
            lead="Two argumentative reports, then the tables. Where a claim has an interactive figure, the figure sits in the section that makes the claim."
          >
            <span id="reports" className="sr-only">
              The reports
            </span>
          </SectionIntro>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {lead.map((story) => {
              const n = liveCount(story.slug);
              return (
                <li key={story.slug}>
                  <ResearchCard story={story} />
                  <p className="mt-2 annotation">
                    {n > 0 ? `${n} interactive figure${n === 1 ? "" : "s"}` : "Generated tables"}
                    {story.keyFindings.length > 0
                      ? ` · ${story.keyFindings.length} numbered findings`
                      : ""}
                  </p>
                </li>
              );
            })}
          </ul>
          {companion.map((story) => (
            <p
              key={story.slug}
              className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground"
            >
              Companion:{" "}
              <Link
                to="/research/$slug"
                params={{ slug: story.slug }}
                className="text-foreground editorial-link"
              >
                {story.title}
              </Link>
              . {story.thesis}
            </p>
          ))}
        </PageSection>

        <PageSection labelledBy="other-views" className="rule-t">
          <SectionIntro
            eyebrow="Other views of the same tables"
            title="Map, capacity, and region"
            lead="These routes keep the Lovable information architecture. They present the published pairs, the capacity report, and the MSA / QCEW geography."
          >
            <span id="other-views" className="sr-only">
              Other views
            </span>
          </SectionIntro>
          <ul className="mt-8 divide-y divide-border border-t border-border">
            <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="max-w-xl">
                <h3 className="font-display text-lg text-foreground">Transition Map</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Origin-first view of the 28 screened pairs. Zone gap and wage replacement from the
                  CSV; no invented distance.
                </p>
              </div>
              <Link to="/transition-map" className="editorial-link shrink-0 text-sm font-medium">
                Open
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
            <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="max-w-xl">
                <h3 className="font-display text-lg text-foreground">Transition Capacity</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Published findings and the pathways figure. The six-stage gap calculator stays
                  empty because that chain is not in the source.
                </p>
              </div>
              <Link
                to="/transition-capacity"
                className="editorial-link shrink-0 text-sm font-medium"
              >
                Open
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
            <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="max-w-xl">
                <h3 className="font-display text-lg text-foreground">Richmond Region Data</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  MSA definition (BLS 40060), the 2023/24 county swap, and QCEW industry series on
                  the current 17-county set.
                </p>
              </div>
              <Link to="/richmond-region" className="editorial-link shrink-0 text-sm font-medium">
                Open
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </PageSection>

        <PageSection labelledBy="integrity" className="rule-t">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <SectionIntro
              eyebrow="Source integrity"
              title="How this site handles evidence"
              lead="Every figure shows its source, geography, unit, and reference period. Zero exposure is absence of measurement, not safety. The 4.37% aggregate and the placebo screen stay labelled Not supportable."
            >
              <span id="integrity" className="sr-only">
                Source integrity
              </span>
              <Link
                to="/methodology"
                className="mt-5 inline-flex items-center gap-1.5 editorial-link text-sm"
              >
                Read the methodology
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </SectionIntro>
            <LimitationNote title="What this site does not do" tone="note">
              It does not rank employers, providers, or localities, does not make causal claims, and
              does not determine eligibility for any program. The employer and worker demonstrators
              from the source site are not on this site (unresolved U1): those pages run on invented
              employers and a simulated roster, and the source itself says the demonstrator is not
              evidence.
            </LimitationNote>
          </div>
        </PageSection>

        <PageSection labelledBy="pin" className="rule-t">
          <p id="pin" className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Reports and figures are reproduced from{" "}
            <a href={pinCommitUrl} className="editorial-link">
              {pinRepo}
            </a>{" "}
            at commit <code>{pinShort}</code>, synced {pinSynced}.
          </p>
        </PageSection>
      </ProseContainer>
    </>
  );
}
