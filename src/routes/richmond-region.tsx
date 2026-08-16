import { createFileRoute } from "@tanstack/react-router";

import { DataTable, VisualizationFrame, VisualizationLegend, VisualizationStagePlaceholder } from "@/components/data";
import { EvidencePanel, LimitationNote, MetricCallout } from "@/components/editorial";
import { PageHeader, PageSection, ProseContainer, SectionIntro } from "@/components/page/PageHeader";
import { localities, regionLimitations, regionMeasures } from "@/content/region";

export const Route = createFileRoute("/richmond-region")({
  head: () => ({
    meta: [
      { title: "Richmond Region Data — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Regional labor-market conditions, AI exposure, hiring demand, training resources, geography, and workforce constraints across the Richmond, Virginia region.",
      },
      { property: "og:title", content: "Richmond Region Data — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "Locality-level labor-market conditions and constraints across the Richmond region.",
      },
    ],
  }),
  component: RichmondRegionPage,
});

function RichmondRegionPage() {
  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow="Section 03"
        title="Richmond Region Data"
        lead="The conditions the region is working with: where employment sits, where hiring demand shows up, where training capacity exists, and how those differ across localities."
        meta={[
          { label: "Geography", value: "Richmond, Virginia region" },
          { label: "Localities", value: "Defined at migration" },
          { label: "Status", value: "Structure only — data not migrated" },
        ]}
      />

      <PageSection labelledBy="measures">
        <SectionIntro
          eyebrow="Regional overview"
          title="Key measures"
          lead="A short set of headline measures, each carrying its own source, unit, and reference period."
        >
          <span id="measures" className="sr-only">
            Key measures
          </span>
        </SectionIntro>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {regionMeasures.map((m) => (
            <MetricCallout
              key={m.id}
              label={m.label}
              value={m.value}
              unit={m.unit}
              note={`${m.provenance.geography} · ${m.provenance.source}`}
              isPlaceholder={m.isPlaceholder}
            />
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="map" className="rule-t">
        <span id="map" className="sr-only">
          Regional map
        </span>
        <VisualizationFrame
          title="Regional map of the Richmond area"
          description="Locality-level view of employment, exposure, demand, and training locations."
          provenance={{
            source: "Pending migration",
            geography: "Richmond, Virginia region",
            unit: "Varies by layer",
            period: "Pending migration",
            note: "Layer definitions and the regional boundary are set during migration.",
          }}
          legend={
            <VisualizationLegend
              items={[
                { label: "City", shape: "circle", colorClass: "bg-chart-1" },
                { label: "County", shape: "square", colorClass: "bg-chart-3" },
                { label: "Training location", shape: "diamond", colorClass: "bg-chart-2" },
                { label: "No data", shape: "hatched", colorClass: "bg-muted" },
              ]}
              note="Each map symbol is distinguished by shape as well as color."
            />
          }
          tableView={
            <LocalityTable />
          }
        >
          <VisualizationStagePlaceholder
            library="a MapLibre GL JS map"
            purpose="An interactive locality map with switchable layers for employment, exposure, hiring demand, and training locations."
          />
        </VisualizationFrame>
      </PageSection>

      <PageSection labelledBy="comparison" className="rule-t">
        <SectionIntro
          eyebrow="Comparison"
          title="Locality comparison"
          lead="The map's fallback: the same values in a sortable, readable table."
        >
          <span id="comparison" className="sr-only">
            Locality comparison
          </span>
        </SectionIntro>
        <div className="mt-8 border border-border bg-surface p-4">
          <LocalityTable />
        </div>
      </PageSection>

      <PageSection labelledBy="patterns" className="rule-t">
        <span id="patterns" className="sr-only">
          Occupational patterns and demand
        </span>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <EvidencePanel title="Occupational patterns" note="Which occupations concentrate where.">
            <p className="annotation">Reserved for migrated occupational composition data.</p>
          </EvidencePanel>
          <EvidencePanel title="Employer demand" note="What regional employers are hiring for.">
            <p className="annotation">Reserved for migrated postings or survey data.</p>
          </EvidencePanel>
          <EvidencePanel title="Training locations" note="Where programs are physically delivered.">
            <p className="annotation">Reserved for migrated provider and program locations.</p>
          </EvidencePanel>
        </div>
      </PageSection>

      <PageSection labelledBy="limits" className="rule-t">
        <span id="limits" className="sr-only">
          Data limitations
        </span>
        <div className="grid gap-4 md:grid-cols-2">
          {regionLimitations.map((l) => (
            <LimitationNote key={l.id} title={l.title} tone="caution">
              {l.body}
            </LimitationNote>
          ))}
        </div>
      </PageSection>
    </ProseContainer>
  );
}

function LocalityTable() {
  return (
    <DataTable
      caption="Locality comparison — placeholder rows, no values migrated."
      columns={[
        { key: "name", label: "Locality" },
        { key: "type", label: "Type" },
        { key: "employment", label: "Employment", numeric: true },
        { key: "ai-exposure", label: "AI exposure", numeric: true },
        { key: "hiring-demand", label: "Hiring demand", numeric: true },
      ]}
      rows={localities.map((l) => ({
        name: l.name,
        type: l.type,
        employment: l.measures["employment"] ?? null,
        "ai-exposure": l.measures["ai-exposure"] ?? null,
        "hiring-demand": l.measures["hiring-demand"] ?? null,
      }))}
    />
  );
}
