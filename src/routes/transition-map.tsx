import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  DataTable,
  FilterBar,
  FilterGroup,
  VisualizationFrame,
  VisualizationLegend,
  VisualizationStagePlaceholder,
} from "@/components/data";
import { EvidencePanel, LimitationNote, PlaceholderBadge } from "@/components/editorial";
import { PageHeader, PageSection, ProseContainer, SectionIntro } from "@/components/page/PageHeader";
import { occupationTitle, occupations, transitionBands, transitions } from "@/content/transitions";

export const Route = createFileRoute("/transition-map")({
  head: () => ({
    meta: [
      { title: "Transition Map — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "How a worker may move from one occupation to an adjacent occupation in the Richmond region, including the distance and difficulty of each move.",
      },
      { property: "og:title", content: "Transition Map — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "Occupation-to-occupation moves, transition distance, transferable skills, and skill gaps.",
      },
    ],
  }),
  component: TransitionMapPage,
});

const clusters = ["All clusters", ...Array.from(new Set(occupations.map((o) => o.cluster)))];

function TransitionMapPage() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState(clusters[0]);
  const [selectedId, setSelectedId] = useState(occupations[0]?.id ?? "");

  const visible = occupations.filter(
    (o) =>
      (cluster === "All clusters" || o.cluster === cluster) &&
      o.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selected = occupations.find((o) => o.id === selectedId);
  const selectedEdges = transitions.filter((t) => t.fromId === selectedId);

  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow="Section 01"
        title="Transition Map"
        lead="A view of how one occupation connects to the occupations next to it, and how far apart those occupations really are."
        meta={[
          { label: "Geography", value: "Richmond, Virginia region" },
          { label: "Unit", value: "Occupation pairs" },
          { label: "Status", value: "Structure only — data not migrated" },
        ]}
      />

      <PageSection labelledBy="how-to-read">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SectionIntro
            eyebrow="Orientation"
            title="How to read this"
            lead="Each node is an occupation. Each connection is an observed or modeled move between two occupations. The distance of a connection describes how much retraining, credentialing, or experience the move is expected to require."
          >
            <span id="how-to-read" className="sr-only">
              How to read this
            </span>
          </SectionIntro>
          <LimitationNote title="A connection is not a recommendation" tone="note">
            A link between two occupations means a move has been observed or modeled — not that it
            is advisable, available today, or open to any particular worker.
          </LimitationNote>
        </div>
      </PageSection>

      <PageSection labelledBy="graph" className="rule-t">
        <span id="graph" className="sr-only">
          Transition network
        </span>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <VisualizationFrame
            title="Occupation transition network"
            description="Nodes are occupations; edges are transitions weighted by distance."
            provenance={{
              source: "Pending migration",
              geography: "Richmond, Virginia region",
              unit: "Occupation pairs",
              period: "Pending migration",
              note: "The network renders once the occupation graph is migrated.",
            }}
            toolbar={
              <FilterBar
                searchLabel="Find an occupation"
                searchPlaceholder="Placeholder role"
                value={query}
                onValueChange={setQuery}
                filters={
                  <FilterGroup label="Cluster" options={clusters} value={cluster} onChange={setCluster} />
                }
                disabledNote="Filters operate on placeholder records only."
              />
            }
            legend={
              <VisualizationLegend
                items={transitionBands.map((b) => ({
                  label: b.label,
                  shape: b.shape,
                  colorClass:
                    b.band === "near"
                      ? "bg-chart-1"
                      : b.band === "moderate"
                        ? "bg-chart-3"
                        : b.band === "far"
                          ? "bg-chart-2"
                          : "bg-muted",
                }))}
                note="Shape and label carry the same meaning as color, so the legend is readable without color."
              />
            }
            tableView={
              <DataTable
                caption="Non-graph fallback: the same transitions as a table."
                columns={[
                  { key: "from", label: "From occupation" },
                  { key: "to", label: "To occupation" },
                  { key: "band", label: "Transition band" },
                  { key: "distance", label: "Distance", numeric: true },
                ]}
                rows={transitions.map((t) => ({
                  from: occupationTitle(t.fromId),
                  to: occupationTitle(t.toId),
                  band: t.band === "unknown" ? null : t.band,
                  distance: t.distance === null ? null : String(t.distance),
                }))}
              />
            }
          >
            <VisualizationStagePlaceholder
              library="a Cytoscape.js network"
              purpose="An interactive graph of occupations and the transitions between them, filterable by cluster and distance."
            />
          </VisualizationFrame>

          <div className="space-y-6">
            <EvidencePanel title="Select a role" note="Placeholder roles stand in for the migrated occupation list.">
              <ul className="space-y-1">
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
                      <span className="block annotation">{o.cluster}</span>
                    </button>
                  </li>
                ))}
                {visible.length === 0 ? (
                  <li className="px-3 py-4 text-sm text-muted-foreground">No placeholder roles match.</li>
                ) : null}
              </ul>
            </EvidencePanel>

            <EvidencePanel
              title={selected ? `Detail: ${selected.title}` : "Selected role detail"}
              note="Reserved for transferable skills, skill gaps, and transition steps."
            >
              <PlaceholderBadge>Placeholder detail</PlaceholderBadge>
              {selectedEdges.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No placeholder transitions recorded from this role.
                </p>
              ) : (
                <dl className="mt-4 space-y-4">
                  {selectedEdges.map((edge) => (
                    <div key={`${edge.fromId}-${edge.toId}`} className="border-t border-border pt-3">
                      <dt className="text-sm font-medium text-foreground">
                        → {occupationTitle(edge.toId)}
                      </dt>
                      <dd className="mt-2 space-y-2 annotation">
                        <p>
                          <span className="label-sm">Distance</span>{" "}
                          {edge.distance === null ? "Not yet migrated" : edge.distance}
                        </p>
                        <p>
                          <span className="label-sm">Transferable skills</span>{" "}
                          {edge.transferableSkills.join(", ")}
                        </p>
                        <p>
                          <span className="label-sm">Skill gaps</span> {edge.skillGaps.join(", ")}
                        </p>
                        <p>
                          <span className="label-sm">Steps</span> {edge.steps.join(" → ")}
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

      <PageSection labelledBy="distance" className="rule-t">
        <div className="grid gap-8 lg:grid-cols-2">
          <SectionIntro
            eyebrow="Definition"
            title="What transition distance means"
            lead="Distance is a summary of how much a worker would need to add — skills, credentials, or supervised experience — to be a plausible candidate for the destination occupation. The exact construction is documented in the methodology and will be published with the data."
          >
            <span id="distance" className="sr-only">
              Transition distance
            </span>
          </SectionIntro>
          <LimitationNote title="Distance is a modeled quantity" tone="caution">
            It summarizes similarity between occupations. It does not account for an individual's
            circumstances, employer hiring practices, or local availability of training.
          </LimitationNote>
        </div>
      </PageSection>
    </ProseContainer>
  );
}
