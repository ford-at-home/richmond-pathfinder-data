import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { LimitationNote, PlaceholderBadge } from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { ResearchCard } from "@/components/research";
import { siteConfig } from "@/config/site";
import { researchStories } from "@/content/research";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Richmond Workforce Transition — Overview" },
      {
        name: "description",
        content:
          "A public-interest view of how workers move between occupations in the Richmond, Virginia region, and whether the region can support those moves.",
      },
      { property: "og:title", content: "Richmond Workforce Transition — Overview" },
      {
        property: "og:description",
        content:
          "How workers move between occupations in the Richmond region, and whether the region has the capacity to support those moves.",
      },
    ],
  }),
  component: Overview,
});

const entryPanels = [
  {
    to: "/transition-map" as const,
    eyebrow: "01",
    title: "Transition Map",
    body: "How a worker may move from one occupation to an adjacent occupation, and how far apart those occupations are.",
  },
  {
    to: "/transition-capacity" as const,
    eyebrow: "02",
    title: "Transition Capacity",
    body: "Whether the region has the jobs, training seats, funding, and employer demand to make those moves realistic at scale.",
  },
  {
    to: "/richmond-region" as const,
    eyebrow: "03",
    title: "Richmond Region Data",
    body: "Regional labor-market conditions, exposure, hiring demand, training resources, geography, and constraints.",
  },
];

const audienceQuestions = [
  {
    audience: "Employers",
    question: "Where can I find people who are already close to the roles I need to fill?",
    to: "/transition-map" as const,
  },
  {
    audience: "Workers",
    question: "If my occupation changes, what work is adjacent to what I already do?",
    to: "/transition-map" as const,
  },
  {
    audience: "Regional leaders",
    question: "Can this region actually absorb and retrain the workers who need to move?",
    to: "/transition-capacity" as const,
  },
];

function Overview() {
  const featured = researchStories.slice(0, 3);

  return (
    <>
      <ProseContainer>
        <PageHeader
          eyebrow="Overview"
          title="Workforce transition in the Richmond region, examined openly."
          lead={siteConfig.tagline}
        >
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This site is being built in the open. The interface below is complete; the research,
            data, and citations are migrated separately. Nothing here should be read as a finding
            yet.
          </p>
          <PlaceholderBadge className="mt-5">
            Scaffold release — content not migrated
          </PlaceholderBadge>
        </PageHeader>
      </ProseContainer>

      <ProseContainer>
        <PageSection labelledBy="entry-points">
          <h2 id="entry-points" className="sr-only">
            Main sections
          </h2>
          <div className="grid gap-px bg-rule md:grid-cols-3">
            {entryPanels.map((panel) => (
              <Link
                key={panel.to}
                to={panel.to}
                className="group flex flex-col bg-background p-6 transition-colors hover:bg-surface"
              >
                <span className="numeric text-xs text-highlight">{panel.eyebrow}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight text-foreground">
                  {panel.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panel.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open section
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </PageSection>

        <PageSection labelledBy="questions" className="rule-t">
          <SectionIntro
            eyebrow="Where to begin"
            title="Start with the question you have"
            lead="Each section answers a different kind of question. These are the questions we hear most often."
          >
            <span id="questions" className="sr-only">
              Start with the question you have
            </span>
          </SectionIntro>
          <ul className="mt-8 grid gap-px bg-rule md:grid-cols-3">
            {audienceQuestions.map((q) => (
              <li key={q.audience} className="bg-background p-5">
                <p className="label-sm">{q.audience}</p>
                <p className="mt-3 font-display text-lg leading-snug text-foreground">
                  “{q.question}”
                </p>
                <Link
                  to={q.to}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                >
                  Where this is addressed
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection labelledBy="featured" className="rule-t">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionIntro
              eyebrow="Research"
              title="Featured research"
              lead="Editorial pages that explain one question at a time, with their sources and limits in view."
            />
            <Link
              to="/research"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              All research
            </Link>
          </div>
          <span id="featured" className="sr-only">
            Featured research
          </span>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((story) => (
              <li key={story.slug}>
                <ResearchCard story={story} />
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection labelledBy="integrity" className="rule-t">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <SectionIntro
              eyebrow="Source integrity"
              title="How this site handles evidence"
              lead="Every figure will show its source, geography, unit, and reference period. Every visualization will be readable as a table. Where the evidence is thin, the page will say so."
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
              does not determine eligibility for any program.
            </LimitationNote>
          </div>
        </PageSection>
      </ProseContainer>
    </>
  );
}
