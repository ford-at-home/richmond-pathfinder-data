import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { csvParse } from "d3-dsv";
import { describe, expect, it } from "vitest";

import { FIGURES } from "@/content/figures";
import { movement, occupations } from "@/content/occupations";
import { origins, transitions } from "@/content/transitions";
import { GEOGRAPHY } from "@/lib/geography";
import { pinRef, pinRepo, pinShort } from "@/lib/pin";
import {
  anchor,
  findingHtml,
  numberedFindings,
  resolveLinks,
  sectionNumber,
  splitReport,
} from "@/lib/reports";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("movement()", () => {
  it("treats |z| below 1.96 as indeterminate", () => {
    const sample = {
      code: "00-0000",
      title: "Test",
      group: "Test",
      emp: 100,
      lq: 1,
      wage: 50000,
      exposure: 0.3,
      emp23: 90,
      pct: 11.1,
      prse23: 10,
      prse25: 10,
      z: 1.95,
    };
    expect(movement(sample)).toBe("indeterminate");
  });

  it("reports grew / fell only when |z| >= 1.96", () => {
    const base = {
      code: "00-0000",
      title: "Test",
      group: "Test",
      emp: 100,
      lq: 1,
      wage: 50000,
      exposure: 0.3,
      emp23: 90,
      pct: 11.1,
      prse23: 10,
      prse25: 10,
      z: 1.96,
    };
    expect(movement({ ...base, z: 1.96 })).toBe("grew");
    expect(movement({ ...base, z: -1.96 })).toBe("fell");
  });

  it("does not treat a missing 2023 estimate as a decline", () => {
    const sample = {
      code: "00-0000",
      title: "Test",
      group: "Test",
      emp: 100,
      lq: 1,
      wage: 50000,
      exposure: 0.3,
      emp23: null,
      pct: null,
      prse23: null,
      prse25: 10,
      z: null,
    };
    expect(movement(sample)).toBe("unknown");
  });
});

describe("occupations join", () => {
  it("has 523 matched occupations", () => {
    expect(occupations.length).toBe(523);
  });

  it("does not treat exposure 0 as a low score in the data", () => {
    const zeros = occupations.filter((o) => o.exposure === 0);
    expect(zeros.length).toBeGreaterThan(0);
    for (const o of zeros) {
      expect(o.exposure).toBe(0);
    }
  });
});

describe("pathways_reachable.csv", () => {
  it("loads 28 screened pairs", () => {
    const csv = readFileSync(join(ROOT, "data/source/output/pathways_reachable.csv"), "utf8");
    const rows = csvParse(csv);
    expect(rows.length).toBe(28);
    expect(transitions.length).toBe(28);
  });

  it("does not invent a 0–1 distance or skill lists", () => {
    for (const t of transitions) {
      expect(t.distance).toBeNull();
      expect(t.transferableSkills).toEqual([]);
      expect(t.skillGaps).toEqual([]);
      expect(t.steps).toEqual([]);
      expect(t.isPlaceholder).toBe(false);
    }
  });

  it("derives origins from fromId only, covering every pair", () => {
    const fromIds = new Set(transitions.map((t) => t.fromId));
    expect(origins.map((o) => o.id).sort()).toEqual([...fromIds].sort());
    const destCount = origins.reduce((n, o) => n + o.destinationCount, 0);
    expect(destCount).toBe(transitions.length);
  });
});

describe("report splitter", () => {
  it("matches the source heading → anchor algorithm", () => {
    expect(anchor("Summary of findings")).toBe("summary-of-findings");
    expect(anchor("1. Data and method")).toBe("1-data-and-method");
  });

  it("reads the leading section number", () => {
    expect(sectionNumber("Summary of findings")).toBeNull();
    expect(sectionNumber("1. Data and method")).toBe(1);
    expect(sectionNumber("8. Robustness")).toBe(8);
  });

  it("rewrites figure and sibling-report links", () => {
    expect(resolveLinks("](figures/fig1.png)")).toBe("](/figures/fig1.png)");
    expect(resolveLinks("[Appendix](technical-appendix.md#a-source-files)")).toBe(
      "[Appendix](/research/technical-appendix#a-source-files)",
    );
  });

  it("splits the pinned exposure report on ## and places figures by section number", () => {
    const raw = readFileSync(
      join(ROOT, "data/source/reports/ai-exposure-and-employment-change.md"),
      "utf8",
    );
    const split = splitReport("ai-exposure-and-employment-change", raw);
    expect(split.title).toBe("AI Exposure and Employment Change in the Richmond Metropolitan Area");
    const byNumber = new Map(split.sections.map((s) => [s.number, s]));
    expect(byNumber.get(2)?.figureIds).toEqual(["landscape"]);
    expect(byNumber.get(3)?.figureIds).toEqual(["leverage"]);
    expect(byNumber.get(5)?.figureIds).toEqual(["wages"]);
    expect(byNumber.get(8)?.figureIds).toEqual(["placebo", "history"]);
  });

  it("keeps summary findings as numbered items from the report", () => {
    const raw = readFileSync(
      join(ROOT, "data/source/reports/ai-exposure-and-employment-change.md"),
      "utf8",
    );
    const split = splitReport("ai-exposure-and-employment-change", raw);
    const summary = split.sections.find((s) => s.heading === "Summary of findings");
    expect(summary).toBeTruthy();
    const items = numberedFindings(summary?.markdown ?? "");
    expect(items.length).toBe(6);
    expect(items[0]).toContain("2.3% above it");
  });

  it("renders finding emphasis without rewriting the numbers", () => {
    const html = findingHtml(
      "**Richmond's overall AI exposure is close to the national average — 2.3% above it.**",
    );
    expect(html).toContain("<strong>");
    expect(html).toContain("2.3% above it");
  });
});

describe("claim labels that must not be dropped", () => {
  it("labels the 4.37% aggregate Not supportable", () => {
    expect(FIGURES.leverage.tier).toBe("Not supportable");
    expect(FIGURES.leverage.lede).toContain("4.37%");
  });

  it("labels the placebo screen Not supportable", () => {
    expect(FIGURES.placebo.tier).toBe("Not supportable");
  });
});

describe("geography and pin", () => {
  it("names the MSA, not the City of Richmond", () => {
    expect(GEOGRAPHY).toContain("metropolitan statistical area");
    expect(GEOGRAPHY).toContain("40060");
    expect(GEOGRAPHY.toLowerCase()).not.toContain("city of richmond");
  });

  it("keeps the analysis pin", () => {
    expect(pinRepo).toBe("hack4rva/richmond-ai-impact-analysis");
    expect(pinRef).toBe("b8728fc84b5ea8da12247d6f64fd8cd290598301");
    expect(pinShort).toBe("b8728fc84b5e");
  });
});
