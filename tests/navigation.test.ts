import { describe, expect, it } from "vitest";

import { primaryNav, siteConfig } from "@/config/site";
import { capacityStages } from "@/content/capacity";
import { getStory, researchStories } from "@/content/research";
import { localities, qcewCurrent, qcewGeographyComparison, QCEW_YEARS } from "@/content/region";

describe("navigation content", () => {
  it("puts one product door and one evidence door in primary nav", () => {
    expect(primaryNav.map((i) => [i.label, i.to])).toEqual([
      ["Find a job", "/"],
      ["Evidence", "/research"],
    ]);
  });

  it("states the four-family exposed-job question in the tagline", () => {
    expect(siteConfig.tagline.toLowerCase()).toContain("job");
    expect(siteConfig.tagline.toLowerCase()).toContain("ai");
    expect(siteConfig.tagline).not.toMatch(/occupation-level evidence/i);
  });
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

  it("keeps QCEW industry series on the current 17-county set", () => {
    expect(QCEW_YEARS).toEqual([2019, 2020, 2021, 2022, 2023, 2024, 2025]);
    expect(qcewCurrent.length).toBeGreaterThan(0);
    for (const row of qcewCurrent) {
      expect(row.countySet).toBe("current_17");
      expect(row.series).toHaveLength(7);
    }
    expect(qcewGeographyComparison.length).toBe(7);
    const latest = qcewGeographyComparison.find((r) => r.countySet === "legacy_vs_current_2025");
    expect(latest?.difference).not.toBeNull();
  });
});
