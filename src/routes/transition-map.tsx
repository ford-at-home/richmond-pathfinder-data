import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataTable, FilterBar, FilterGroup, VisualizationFrame } from "@/components/data";
import { LimitationNote } from "@/components/editorial";
import { OriginExplorer } from "@/components/map/OriginExplorer";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { DepthLabel } from "@/components/story";
import { destinationsFrom, origins, transitions } from "@/content/transitions";
import { GEOGRAPHY, REPORT_PERIOD } from "@/lib/geography";

export const Route = createFileRoute("/transition-map")({
  head: () => ({
    meta: [
      { title: "Transition Map — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Screened origin–destination occupation pairs for the Richmond VA MSA from the published pathways_reachable table.",
      },
      { property: "og:title", content: "Transition Map — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "Adjacent, growing, better-paid destinations that survive the published screen. Not a recommendation and not a network graph.",
      },
    ],
  }),
  component: TransitionMapPage,
});

const clusters = ["All groups", ...Array.from(new Set(origins.map((o) => o.cluster))).sort()];

function TransitionMapPage() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<string>("All groups");
  const [selectedId, setSelectedId] = useState(origins[0]?.id ?? "");

  const visibleOrigins = useMemo(
    () =>
      origins.filter(
        (o) =>
          (cluster === "All groups" || o.cluster === cluster) &&
          o.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [cluster, query],
  );
  const effectiveId = visibleOrigins.some((o) => o.id === selectedId)
    ? selectedId
    : (visibleOrigins[0]?.id ?? "");
  const destinations = destinationsFrom(effectiveId);

  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow="Section 01"
        title="Transition Map"
        lead="Screened origin–destination pairs from the published analysis. A pair is in this table because it survived the capacity report's adjacency, exposure, growth, and wage-replacement screen — not because a network layout scored it."
        meta={[
          { label: "Geography", value: GEOGRAPHY },
          { label: "Unit", value: "Occupation pairs" },
          { label: "Pairs", value: String(transitions.length) },
          { label: "Origins", value: String(origins.length) },
          { label: "Period", value: REPORT_PERIOD },
        ]}
      />

      <PageSection labelledBy="how-to-read">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SectionIntro
            eyebrow="Orientation"
            title="How to read this"
            lead="Choose an origin. Each destination is a published pair. Zone gap is the O*NET job-zone difference. Replacement is destination mean pay as a percentage of origin pay. Neither is a person-level score."
          >
            <span id="how-to-read" className="sr-only">
              How to read this
            </span>
          </SectionIntro>
          <LimitationNote title="A pair is not a recommendation" tone="note">
            The source report is explicit: adjacency indicates transferable skill rather than an
            easy or likely move. This page does not rank workers, invent skill-gap lists, or draw a
            metro-wide network — the source site had none.
          </LimitationNote>
        </div>
      </PageSection>

      <PageSection labelledBy="graph" className="rule-t">
        <DepthLabel>In two minutes</DepthLabel>
        <span id="graph" className="sr-only">
          Screened pairs
        </span>
        <VisualizationFrame
          title="From one origin, the destinations the screen kept"
          description="Stroke encodes job-zone gap. Labels encode wage replacement. Distance is not shown: the source table does not publish a 0–1 score."
          stage="data"
          provenance={{
            source: "pathways_reachable.csv, pinned analysis output",
            geography: GEOGRAPHY,
            unit: "Occupation pairs that survive the published screen",
            period: REPORT_PERIOD,
            note: "transferableSkills, skillGaps, and a 0–1 distance are not columns in this file and are not filled in.",
          }}
          toolbar={
            <FilterBar
              searchLabel="Find an origin"
              searchPlaceholder="Occupation title"
              value={query}
              onValueChange={setQuery}
              filters={
                <FilterGroup
                  label="Job family"
                  options={clusters}
                  value={cluster}
                  onChange={setCluster}
                />
              }
            />
          }
          tableView={
            <DataTable
              caption="Every screened pair in pathways_reachable.csv."
              columns={[
                { key: "from", label: "From" },
                { key: "to", label: "To" },
                { key: "tier", label: "Tier" },
                { key: "replacement", label: "Wage replacement %", numeric: true },
                { key: "zoneGap", label: "Job-zone gap", numeric: true },
              ]}
              rows={transitions.map((t) => ({
                from: t.fromTitle,
                to: t.toTitle,
                tier: t.tier,
                replacement: t.replacement == null ? null : t.replacement.toFixed(1),
                zoneGap: t.zoneGap == null ? null : String(t.zoneGap),
              }))}
            />
          }
        >
          {visibleOrigins.length === 0 ? (
            <p className="px-4 py-10 text-sm text-muted-foreground">No origins match the filter.</p>
          ) : (
            <OriginExplorer
              origins={visibleOrigins}
              selectedId={effectiveId}
              onSelect={setSelectedId}
              destinations={destinations}
            />
          )}
        </VisualizationFrame>
      </PageSection>
    </ProseContainer>
  );
}
