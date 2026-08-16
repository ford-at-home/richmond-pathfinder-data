import { createFileRoute } from "@tanstack/react-router";

import { DataTable } from "@/components/data";
import {
  EvidencePanel,
  LimitationNote,
  MetricCallout,
  PlaceholderBadge,
  ProgressionSteps,
} from "@/components/editorial";
import { PageHeader, PageSection, ProseContainer, SectionIntro } from "@/components/page/PageHeader";
import { capacityLimitations, capacityStages, evidenceSections, scenarioControls } from "@/content/capacity";

export const Route = createFileRoute("/transition-capacity")({
  head: () => ({
    meta: [
      { title: "Transition Capacity — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Whether the Richmond region has the jobs, training seats, funding, and employer demand to make occupational transitions realistic at scale.",
      },
      { property: "og:title", content: "Transition Capacity — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "From exposed workers to remaining capacity gap: the region's ability to support transitions.",
      },
    ],
  }),
  component: TransitionCapacityPage,
});

function TransitionCapacityPage() {
  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Section 02"
        title="Transition Capacity"
        lead="A possible move is not the same as an available one. This section asks whether the region can actually carry workers through the moves the transition map describes."
        meta={[
          { label: "Geography", value: "Richmond, Virginia region" },
          { label: "Unit", value: "Workers, seats, openings, dollars" },
          { label: "Status", value: "Structure only — no calculations performed" },
        ]}
      />

      <PageSection labelledBy="thesis">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <SectionIntro
            eyebrow="Thesis"
            title="Capacity is the constraint that decides whether transitions happen"
            lead="Adjacency tells you where a worker could go. Capacity tells you how many workers could actually get there in a given period, given the openings, training seats, funding, and support the region has."
          >
            <span id="thesis" className="sr-only">
              Thesis
            </span>
            <PlaceholderBadge className="mt-5">Framing only — no findings migrated</PlaceholderBadge>
          </SectionIntro>
          <LimitationNote title="No figures are calculated on this page" tone="caution">
            Every stage below is intentionally empty. Values appear only once each input is migrated
            with its own source and method.
          </LimitationNote>
        </div>
      </PageSection>

      <PageSection labelledBy="progression" className="rule-t">
        <SectionIntro
          eyebrow="Progression"
          title="From exposed workers to the remaining gap"
          lead="Each step narrows the previous one. The final step is whatever the region cannot currently serve."
        >
          <span id="progression" className="sr-only">
            Progression
          </span>
        </SectionIntro>
        <div className="mt-8 border border-rule">
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
        </div>
        <div className="mt-6">
          <DataTable
            caption="Stage inputs as a table — the same information without the layout."
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
      </PageSection>

      <PageSection labelledBy="evidence" className="rule-t">
        <SectionIntro
          eyebrow="Evidence"
          title="Modular evidence sections"
          lead="Each block below holds one dimension of capacity, so evidence can be migrated and revised independently."
        >
          <span id="evidence" className="sr-only">
            Evidence
          </span>
        </SectionIntro>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {evidenceSections.map((section) => (
            <EvidencePanel key={section.id} title={section.label} note={section.note}>
              <MetricCallout
                label="Headline measure"
                value={null}
                unit="Unit set at migration"
                note="Reserved for a single sourced figure."
                isPlaceholder
              />
              <p className="mt-3 annotation">
                Supporting narrative, sources, and caveats attach to this panel during migration.
              </p>
            </EvidencePanel>
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="scenarios" className="rule-t">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionIntro
            eyebrow="Scenarios"
            title="Scenario controls"
            lead="Controls are reserved but inert. They will only become active once the underlying method is published, so the page cannot produce a number it cannot explain."
          >
            <span id="scenarios" className="sr-only">
              Scenarios
            </span>
          </SectionIntro>
          <div className="border border-border bg-surface p-5">
            <PlaceholderBadge>Controls not wired</PlaceholderBadge>
            <ul className="mt-4 divide-y divide-border">
              {scenarioControls.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-foreground">{c.label}</span>
                  <span className="annotation">{c.state}</span>
                </li>
              ))}
            </ul>
          </div>
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
    </ProseContainer>
  );
}
