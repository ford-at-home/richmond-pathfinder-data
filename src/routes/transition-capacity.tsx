import { createFileRoute, Link } from "@tanstack/react-router";

import { DataTable } from "@/components/data";
import { LiveFigure } from "@/components/research/LiveFigure";
import {
  LimitationNote,
  MetricCallout,
  PlaceholderBadge,
  ProgressionSteps,
} from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { DepthLabel, FindingList, ReservedDisclosure } from "@/components/story";
import {
  capacityLimitations,
  capacityStages,
  evidenceSections,
  scenarioControls,
} from "@/content/capacity";
import { getStory } from "@/content/research";
import { GEOGRAPHY, REPORT_PERIOD } from "@/lib/geography";

export const Route = createFileRoute("/transition-capacity")({
  head: () => ({
    meta: [
      { title: "Transition Capacity — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Whether occupations that contracted in the Richmond VA MSA have adjacent, durable, better-paid destinations, from the published Transition Capacity report.",
      },
      { property: "og:title", content: "Transition Capacity — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "Published findings from the Transition Capacity report. The six-stage gap calculator is not in the source and stays empty.",
      },
    ],
  }),
  component: TransitionCapacityPage,
});

function TransitionCapacityPage() {
  const story = getStory("transition-capacity");
  const findings = story?.keyFindings ?? [];

  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Section 02"
        title="Transition Capacity"
        lead="What the occupation-level evidence implies for the AI workforce pilot. This page quotes the published summary and hosts the pathways figure. The full document is the research report."
        meta={[
          { label: "Geography", value: GEOGRAPHY },
          { label: "Period", value: REPORT_PERIOD },
          { label: "Document", value: "July 2026 report" },
        ]}
      />

      <PageSection labelledBy="thesis">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <SectionIntro
            eyebrow="Published report"
            title="Capacity exists, reach does not"
            lead={story?.thesis}
          >
            <span id="thesis" className="sr-only">
              Published report
            </span>
            <Link
              to="/research/$slug"
              params={{ slug: "transition-capacity" }}
              className="mt-5 inline-block editorial-link text-sm"
            >
              Read the full Transition Capacity report
            </Link>
          </SectionIntro>
          <LimitationNote title="Until U2 is decided, this is not a second full copy" tone="note">
            The full markdown lives at /research/transition-capacity (and
            /report/transition-capacity redirects there). This route quotes the published summary
            and shows the section 5 figure rather than paraphrasing the report.
          </LimitationNote>
        </div>
      </PageSection>

      {findings.length > 0 ? (
        <PageSection labelledBy="findings" className="rule-t">
          <DepthLabel>In two minutes</DepthLabel>
          <SectionIntro
            className="mt-2"
            eyebrow="Summary of findings"
            title="From the published report"
            lead="Numbered items below are the report's own summary, not a rewrite."
          >
            <span id="findings" className="sr-only">
              Summary of findings
            </span>
          </SectionIntro>
          <FindingList findings={findings} className="mt-6" />
        </PageSection>
      ) : null}

      <PageSection labelledBy="pathways" className="rule-t">
        <SectionIntro
          eyebrow="Section 5 figure"
          title="Capacity exists, reach does not"
          lead="Interactive figure from the published report. Claim tier: Defensible."
        >
          <span id="pathways" className="sr-only">
            Pathways figure
          </span>
        </SectionIntro>
        <div className="mt-6">
          <LiveFigure id="pathways" />
        </div>
      </PageSection>

      <PageSection labelledBy="limits" className="rule-t">
        <span id="limits" className="sr-only">
          Limitations
        </span>
        <div className="grid gap-4 md:grid-cols-2">
          {capacityLimitations.map((l) => (
            <LimitationNote key={l.id} title={l.title} tone="caution">
              {l.body}
            </LimitationNote>
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="reserved" className="rule-t">
        <DepthLabel>Not in the source</DepthLabel>
        <h2 id="reserved" className="mt-2 section-lead">
          Reserved calculator
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The published report does not compute exposed workers minus openings minus seats. Opening
          the panel below shows the empty scaffold. Nothing in it is a finding.
        </p>
        <div className="mt-6">
          <ReservedDisclosure
            title="Six-stage gap calculator (empty)"
            summary="Not in the published analysis. Values stay empty until a sourced file exists."
          >
            <ProgressionSteps
              steps={capacityStages.map((s) => ({
                id: s.id,
                label: s.label,
                question: s.question,
                value: s.value === null ? null : String(s.value),
                unit: s.unit,
                note: s.note,
              }))}
            />
            <div className="mt-6">
              <DataTable
                caption="Stage inputs as a table — empty because the chain is not in the source."
                columns={[
                  { key: "stage", label: "Stage" },
                  { key: "question", label: "Question" },
                  { key: "value", label: "Value", numeric: true },
                  { key: "unit", label: "Unit" },
                ]}
                rows={capacityStages.map((s) => ({
                  stage: s.label,
                  question: s.question,
                  value: s.value === null ? null : String(s.value),
                  unit: s.unit ?? null,
                }))}
              />
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {evidenceSections.map((section) => (
                <div key={section.id} className="border border-border bg-surface p-4">
                  <p className="label-sm">{section.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{section.note}</p>
                  <MetricCallout
                    label="Headline measure"
                    value={null}
                    note="No sourced file."
                    isPlaceholder
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 border border-border bg-surface p-5">
              <PlaceholderBadge>Controls not in the source</PlaceholderBadge>
              <ul className="mt-4 divide-y divide-border">
                {scenarioControls.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-foreground">{c.label}</span>
                    <span className="annotation">{c.state}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ReservedDisclosure>
        </div>
      </PageSection>
    </ProseContainer>
  );
}
