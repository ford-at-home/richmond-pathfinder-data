import { describe, expect, it } from "vitest";

import { getStory, researchStories } from "@/content/research";
import { capacityStages } from "@/content/capacity";
import { localities } from "@/content/region";

describe("navigation content", () => {
  it("exposes the three published reports and no placeholder stories", () => {
    expect(researchStories.map((s) => s.slug)).toEqual([
      "ai-exposure-and-employment-change",
      "transition-capacity",
      "technical-appendix",
    ]);
    for (const story of researchStories) {
      expect(story.isPlaceholder).toBe(false);
    }
  });

  it("keeps source slugs so /report/:slug can redirect", () => {
    expect(getStory("ai-exposure-and-employment-change")).toBeTruthy();
    expect(getStory("placeholder-story-one")).toBeUndefined();
  });

  it("does not fill the scaffold capacity calculator", () => {
    for (const stage of capacityStages) {
      expect(stage.value).toBeNull();
    }
  });

  it("does not invent occupation × locality rows", () => {
    expect(localities).toEqual([]);
  });
});
