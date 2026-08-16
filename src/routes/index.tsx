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
          <SectionIntro
            eyebrow="The reports"
            title="The evidence base, reproduced in full"
            lead="Where a claim has an interactive figure, the figure sits in the section that makes the claim."
          >
            <span id="reports" className="sr-only">
              The reports
            </span>
          </SectionIntro>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {REPORTS.map((r) => {
              const story = researchStories.find((s) => s.slug === r.slug);
              const n = liveCount(r.slug);
              return (
                <li key={r.slug}>
                  {story ? <ResearchCard story={story} /> : null}
                  <p className="mt-2 annotation">
                    {n > 0 ? `${n} interactive figure${n === 1 ? "" : "s"}` : "Generated tables"}
                  </p>
                </li>
              );
            })}
          </ul>
        </PageSection>

        <PageSection labelledBy="other-views" className="rule-t">
          <SectionIntro
            eyebrow="Other views of the same tables"
            title="Map, capacity, and region"
            lead="These routes keep the Lovable information architecture. They present the published pairs, the capacity report, and the MSA / QCEW geography — they do not add a network graph, a gap calculator, or a city map the source did not have."
          >
            <span id="other-views" className="sr-only">
              Other views
            </span>
          </SectionIntro>
          <ul className="mt-8 grid gap-px bg-rule md:grid-cols-3">
            <li className="bg-background p-6">
              <h3 className="font-display text-2xl leading-tight text-foreground">
                Transition Map
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Screened origin–destination pairs from pathways_reachable.csv. Not a Cytoscape
                network; the source has none.
              </p>
              <Link
                to="/transition-map"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Open section
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
            <li className="bg-background p-6">
              <h3 className="font-display text-2xl leading-tight text-foreground">
                Transition Capacity
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The published findings and the pathways figure. The six-stage gap calculator stays
                empty because that chain is not in the source.
              </p>
              <Link
                to="/transition-capacity"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Open section
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
            <li className="bg-background p-6">
              <h3 className="font-display text-2xl leading-tight text-foreground">
                Richmond Region Data
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                MSA definition (BLS 40060) and QCEW industry series on the current 17-county set.
                Not a city choropleth.
              </p>
              <Link
                to="/richmond-region"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Open section
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
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
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
            <a href={pinCommitUrl} className="text-primary underline-offset-4 hover:underline">
              {pinRepo}
            </a>{" "}
            at commit <code>{pinShort}</code>, synced {pinSynced}.
          </p>
        </PageSection>
      </ProseContainer>
    </>
  );
}
