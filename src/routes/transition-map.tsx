import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  DataTable,
  FilterBar,
  FilterGroup,
  VisualizationFrame,
  VisualizationStagePlaceholder,
} from "@/components/data";
import { EvidencePanel, LimitationNote } from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { occupationTitle, occupations, transitions } from "@/content/transitions";
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

const clusters = ["All groups", ...Array.from(new Set(occupations.map((o) => o.cluster))).sort()];

function TransitionMapPage() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<string>("All groups");
  const [selectedId, setSelectedId] = useState(occupations[0]?.id ?? "");

  const visible = useMemo(
    () =>
      occupations.filter(
        (o) =>
          (cluster === "All groups" || o.cluster === cluster) &&
          o.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [cluster, query],
  );
  const selected = occupations.find((o) => o.id === selectedId);
  const selectedEdges = transitions.filter((t) => t.fromId === selectedId);

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
          { label: "Period", value: REPORT_PERIOD },
        ]}
      />

      <PageSection labelledBy="how-to-read">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SectionIntro
            eyebrow="Orientation"
            title="How to read this"
            lead="Each row is a published destination for an occupation that lost employment. Zone gap is the O*NET job-zone difference. Replacement is destination mean pay as a percentage of origin pay. Neither is a person-level score."
          >
            <span id="how-to-read" className="sr-only">
              How to read this
            </span>
          </SectionIntro>
          <LimitationNote title="A pair is not a recommendation" tone="note">
            The source report is explicit: adjacency indicates transferable skill rather than an
            easy or likely move. This page does not rank workers, invent skill-gap lists, or draw a
            Cytoscape network — the source site had none.
          </LimitationNote>
        </div>
      </PageSection>

      <PageSection labelledBy="graph" className="rule-t">
        <span id="graph" className="sr-only">
          Screened pairs
        </span>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <VisualizationFrame
            title="Screened origin–destination pairs"
            description="The source behavior is this table. A network canvas is reserved and labelled as not in the source."
            provenance={{
              source: "pathways_reachable.csv, pinned analysis output",
              geography: GEOGRAPHY,
              unit: "Occupation pairs that survive the published screen",
              period: REPORT_PERIOD,
              note: "transferableSkills, skillGaps, and a 0–1 distance are not columns in this file and are not filled in.",
            }}
            toolbar={
              <FilterBar
                searchLabel="Find an occupation"
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
            <VisualizationStagePlaceholder
              library="Cytoscape.js (not in the source)"
              purpose="The source site never shipped a node–edge graph. The table fallback is the migrated behavior. Do not treat this placeholder as a missing finding."
            />
          </VisualizationFrame>

          <div className="space-y-6">
            <EvidencePanel
              title="Occupations in the screened table"
              note={`${visible.length} of ${occupations.length} unique origin or destination codes.`}
            >
              <ul className="max-h-[28rem] space-y-1 overflow-y-auto">
                {visible.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(o.id)}
                      aria-pressed={o.id === selectedId}
                      className={
                        o.id === selectedId
                          ? "w-full border-l-2 border-primary bg-inset px-3 py-2 text-left text-sm text-foreground"
                          : "w-full border-l-2 border-transparent px-3 py-2 text-left text-sm text-muted-foreground hover:bg-inset hover:text-foreground"
                      }
                    >
                      {o.title}
                      <span className="block annotation">
                        {o.code} · {o.cluster}
                      </span>
                    </button>
                  </li>
                ))}
                {visible.length === 0 ? (
                  <li className="px-3 py-4 text-sm text-muted-foreground">No occupations match.</li>
                ) : null}
              </ul>
            </EvidencePanel>

            <EvidencePanel
              title={selected ? `From ${selected.title}` : "Selected occupation"}
              note="Destinations published for this origin. Skill lists are omitted because they are not in the CSV."
            >
              {selectedEdges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {selected
                    ? `${selected.title} appears as a destination or has no published outgoing pair.`
                    : "Select an occupation."}
                </p>
              ) : (
                <dl className="space-y-4">
                  {selectedEdges.map((edge) => (
                    <div
                      key={`${edge.fromId}-${edge.toId}`}
                      className="border-t border-border pt-3"
                    >
                      <dt className="text-sm font-medium text-foreground">
                        → {occupationTitle(edge.toId)}
                      </dt>
                      <dd className="mt-2 space-y-2 annotation">
                        <p>
                          <span className="label-sm">Tier</span> {edge.tier || "—"}
                        </p>
                        <p>
                          <span className="label-sm">Wage replacement</span>{" "}
                          {edge.replacement == null ? "—" : `${edge.replacement.toFixed(1)}%`}
                        </p>
                        <p>
                          <span className="label-sm">Job-zone gap</span>{" "}
                          {edge.zoneGap == null ? "—" : String(edge.zoneGap)}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </EvidencePanel>
          </div>
        </div>
      </PageSection>
    </ProseContainer>
  );
}
