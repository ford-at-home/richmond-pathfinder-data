import { Link } from "@tanstack/react-router";

import { PlaceholderBadge } from "@/components/editorial";
import { SourceBadge } from "@/components/sources";
import type { ResearchStory } from "@/content/types";

export function ResearchCard({ story }: { story: ResearchStory }) {
  return (
    <article className="flex h-full flex-col border border-border bg-surface p-5 transition-colors hover:border-rule">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-sm">{story.topic}</span>
        {story.isPlaceholder ? <PlaceholderBadge>Placeholder entry</PlaceholderBadge> : null}
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug text-foreground">
        <Link
          to="/research/$slug"
          params={{ slug: story.slug }}
          className="underline-offset-4 hover:underline"
        >
          {story.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.thesis}</p>
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 annotation">
          <SourceBadge count={story.sourceIds.length} />
          <span>
            <span className="sr-only">Published </span>
            {story.updatedAt ? `Updated ${story.updatedAt}` : story.publishedAt}
          </span>
          <span>{story.readingMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}

export function RelatedResearch({ stories, title = "Related research" }: { stories: ResearchStory[]; title?: string }) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="related-research" className="border-t border-rule pt-8">
      <h2 id="related-research" className="font-display text-xl text-foreground">
        {title}
      </h2>
      <ul className="mt-5 grid gap-5 md:grid-cols-2">
        {stories.map((story) => (
          <li key={story.slug}>
            <ResearchCard story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
}
