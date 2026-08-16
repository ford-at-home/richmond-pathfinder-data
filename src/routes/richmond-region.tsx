import { createFileRoute } from "@tanstack/react-router";

import { DataTable, VisualizationFrame, VisualizationStagePlaceholder } from "@/components/data";
import { LimitationNote, MetricCallout } from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { qcewSeries, regionLimitations, regionMeasures } from "@/content/region";
import { GEOGRAPHY } from "@/lib/geography";

export const Route = createFileRoute("/richmond-region")({
  head: () => ({
    meta: [
      { title: "Richmond Region Data — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Richmond VA MSA (BLS 40060) geography, join coverage, and QCEW industry employment on the current 17-county set.",
      },
      { property: "og:title", content: "Richmond Region Data — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "MSA definition and QCEW industry series. Not a City of Richmond map and not occupation-by-locality exposure.",
      },
    ],
  }),
  component: RichmondRegionPage,
});

function fmt(n: number | null): string | null {
  return n == null ? null : n.toLocaleString("en-US");
}

function RichmondRegionPage() {
  const current = qcewSeries.filter((r) => r.countySet === "current_17");

  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow="Section 03"
        title="Richmond Region Data"
        lead="Geography is the Richmond, VA metropolitan statistical area, BLS area code 40060, unless stated otherwise. That is not the City of Richmond."
        meta={[
          { label: "Geography", value: GEOGRAPHY },
          { label: "QCEW set", value: "Current 17-county (2020 standards)" },
          { label: "OEWS join", value: "523 occupations, 88.4% of metro employment" },
        ]}
      />

      <PageSection labelledBy="measures">
        <SectionIntro
          eyebrow="Regional overview"
          title="Key measures"
          lead="Headline counts taken from the codebook and the QCEW fixed-geography table. Hiring demand and training providers have no source file and stay empty."
        >
          <span id="measures" className="sr-only">
            Key measures
          </span>
        </SectionIntro>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
          title="MapLibre choropleth — not in the source"
          description="The source site has no map library. A locality choropleth of AI exposure cannot be built from these files (U5)."
          provenance={{
            source: "None — no geographic occupation layer in the pinned analysis",
            geography: GEOGRAPHY,
            unit: "Not applicable",
            period: "Not applicable",
            note: "QCEW is industry × county-set, not occupation × locality.",
          }}
          tableView={
            <DataTable
              caption="QCEW annual average employment, current 17-county Richmond MSA (2020 standards)."
              columns={[
                { key: "naics", label: "NAICS" },
                { key: "industry", label: "Industry" },
                { key: "emp2019", label: "2019", numeric: true },
                { key: "emp2023", label: "2023", numeric: true },
                { key: "emp2025", label: "2025", numeric: true },
                { key: "supp", label: "Suppressed cells", numeric: true },
              ]}
              rows={current.map((r) => ({
                naics: r.naics,
                industry: r.industry,
                emp2019: fmt(r.emp2019),
                emp2023: fmt(r.emp2023),
                emp2025: fmt(r.emp2025),
                supp: r.suppressedCells == null ? null : String(r.suppressedCells),
              }))}
            />
          }
        >
          <VisualizationStagePlaceholder
            library="MapLibre GL JS (not in the source)"
            purpose="Reserved for a future geographic layer. The table is the migrated regional series."
          />
        </VisualizationFrame>
      </PageSection>

      <PageSection labelledBy="delineation" className="rule-t">
        <div className="grid gap-8 lg:grid-cols-2">
          <SectionIntro
            eyebrow="Delineation"
            title="The metro changed between May 2023 and May 2024"
            lead="Caroline County left and King and Queen County entered. QCEW tables hold a 17-county current set so industry series can be compared on constant geography."
          >
            <span id="delineation" className="sr-only">
              Delineation
            </span>
          </SectionIntro>
          <LimitationNote title="QCEW cannot confirm occupation change" tone="caution">
            QCEW has no occupational dimension, so it cannot confirm or refute the OEWS clerical
            employment change directly; it can only show whether the industries that employ the most
            clerical workers moved in a consistent direction.
          </LimitationNote>
        </div>
      </PageSection>

      <PageSection labelledBy="limits" className="rule-t">
        <span id="limits" className="sr-only">
          Limitations
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
