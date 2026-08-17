import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, FilterBar } from "@/components/data";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { ResearchCard } from "@/components/research";
import { PLACEMENT } from "@/content/figures";
import { researchStories } from "@/content/research";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Evidence — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "The published reports on AI exposure, employment change, and transition capacity in the Richmond VA MSA, with sources and limits in view.",
      },
      { property: "og:title", content: "Evidence — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "AI Exposure and Employment Change, Transition Capacity, and the Technical Appendix.",
      },
    ],
  }),
  component: ResearchLibrary,
});

function liveCount(slug: string): number {
  const placement = PLACEMENT[slug] ?? {};
  return Object.values(placement).reduce((n, ids) => n + ids.length, 0);
}

function ResearchLibrary() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchStories.filter(
      (s) => q === "" || s.title.toLowerCase().includes(q) || s.thesis.toLowerCase().includes(q),
    );
  }, [query]);

  const argumentative = results.filter((s) => s.slug !== "technical-appendix");
  const appendix = results.filter((s) => s.slug === "technical-appendix");

  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Evidence"
        title="How we know"
        lead="Same reports. Same jobs. Find a job is a shorter starting list."
      />


      <PageSection labelledBy="library">
        <DepthLabel>Choose a document</DepthLabel>
        <span id="library" className="sr-only">
          Research entries
        </span>
        <FilterBar
          searchLabel="Search research"
          searchPlaceholder="Search titles"
          value={query}
          onValueChange={setQuery}
        />

        <p className="mt-4 annotation" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "entry" : "entries"} shown
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No entries match"
              body="Clear the search or try a different phrase."
            />
          </div>
        ) : (
          <>
            {argumentative.length > 0 ? (
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {argumentative.map((story) => {
                  const n = liveCount(story.slug);
                  return (
                    <li key={story.slug}>
                      <ResearchCard story={story} />
                      <p className="mt-2 annotation">
                        {n > 0
                          ? `${n} interactive figure${n === 1 ? "" : "s"}`
                          : "Generated tables"}
                        {story.keyFindings.length > 0
                          ? ` · ${story.keyFindings.length} numbered findings`
                          : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {appendix.map((story) => (
              <div key={story.slug} className="mt-8 border-t border-rule pt-8">
                <p className="eyebrow">Companion tables</p>
                <div className="mt-4 max-w-xl">
                  <ResearchCard story={story} />
                </div>
              </div>
            ))}
          </>
        )}
        <p className="mt-8 annotation">Also here</p>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm">
          <li>
            <Link to="/transition-map" className="editorial-link">
              Transition map
            </Link>
            <span className="text-muted-foreground"> — jobs that already shrank, not the map</span>
          </li>
          <li>
            <Link to="/transition-capacity" className="editorial-link">
              Transition capacity
            </Link>
          </li>
          <li>
            <Link to="/richmond-region" className="editorial-link">
              Richmond region
            </Link>
          </li>
          <li>
            <Link to="/methodology" className="editorial-link">
              Methodology
            </Link>
          </li>
        </ul>
      </PageSection>
    </ProseContainer>
  );
}
