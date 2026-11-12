import { describe, expect, it } from "vitest";
import { researchStories, getSources } from "@/content/research";
import { pinRef, pinRepoUrl } from "@/lib/pin";

describe("single report source for research findings", () => {
  it.each(researchStories.filter((s) => s.slug !== "training-bridges-and-career-ladders"))(
    "gives $slug exactly one citeable pinned report source",
    (story) => {
      expect(Object.keys(story.citation).sort()).toEqual(["reference", "title", "url"]);
      expect(story.citation.url).toBe(`${pinRepoUrl}/blob/${pinRef}/reports/${story.slug}.md`);
      expect(story.citation.title).toBe(story.title);
      expect(story.citation.reference).toContain(pinRef);
    },
  );
  it("retains all underlying datasets rather than selecting one arbitrarily", () => {
    expect(researchStories.map((story) => getSources(story.sourceIds).length)).toEqual([
      2, 3, 5, 4,
    ]);
  });
  it("cites the November 2026 training report at its own dated page", () => {
    const story = researchStories.find((s) => s.slug === "training-bridges-and-career-ladders")!;
    expect(story.citation.url).toBe(
      "https://workforcerichmond.org/research/training-bridges-and-career-ladders",
    );
    expect(story.keyFindings).toHaveLength(3);
  });
});
