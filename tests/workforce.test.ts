import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { EXPOSURE_THRESHOLD, occupations as analysisOccupations } from "@/content/occupations";
import {
  occupationBySoc,
  ORIGIN_FAMILIES,
  routesOf,
  searchOccupations,
  sortDestinations,
  workforceOccupations,
  type Destination,
} from "@/content/workforce";
import {
  BAND_MEANING,
  EMPTY_ROUTES,
  EXPOSED_AT,
  exposureBand,
  hasSignal,
} from "@/lib/exposureBand";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("pinned workforce slice", () => {
  it("exists and has 39 in-scope origins", () => {
    const raw = JSON.parse(readFileSync(join(ROOT, "src/content/data/workforce.json"), "utf8")) as {
      occupations: unknown[];
    };
    expect(raw.occupations).toHaveLength(39);
    expect(workforceOccupations).toHaveLength(39);
  });
});

describe("exposureBand", () => {
  it("treats exact 0 as No signal, not Low", () => {
    expect(exposureBand(0)).toBe("No signal");
    expect(exposureBand(null)).toBe("No signal");
    expect(hasSignal(0)).toBe(false);
    expect(exposureBand(0.0001)).toBe("Low");
    expect(exposureBand(EXPOSED_AT)).toBe("High");
  });

  it("keeps BAND_MEANING and EMPTY_ROUTES as full sentences", () => {
    for (const { text } of [...Object.values(BAND_MEANING), EMPTY_ROUTES]) {
      expect(text.endsWith(".")).toBe(true);
      expect(text.length).toBeGreaterThan(20);
    }
    // Empty state B has to defuse the reading without reaching for the phrase
    // that does the frightening.
    expect(EMPTY_ROUTES.text).toMatch(/that is not a warning/i);
    expect(EMPTY_ROUTES.text).not.toMatch(/at risk/i);
  });
});

describe("searchOccupations", () => {
  it("returns nothing for queries shorter than 2 characters", () => {
    expect(searchOccupations("a")).toEqual([]);
    expect(searchOccupations("")).toEqual([]);
  });

  it("finds Customer Service Representatives and does not find nurses", () => {
    const titles = searchOccupations("customer").map((o) => o.title);
    expect(titles).toContain("Customer Service Representatives");
    expect(searchOccupations("nurse").map((o) => o.title)).not.toContain("Registered Nurses");
  });
});

describe("routes", () => {
  it("gives Customer Service Representatives at least one destination", () => {
    const csr = occupationBySoc("43-4051");
    expect(csr).toBeTruthy();
    expect(routesOf(csr!).length).toBeGreaterThan(0);
  });

  it("never offers an unmeasured or more-exposed destination", () => {
    for (const o of workforceOccupations) {
      for (const d of routesOf(o)) {
        expect(d.exposure).toBeGreaterThan(0);
        expect(d.exposure).toBeLessThan(o.exposure);
        if (o.wage != null) expect(d.wage).toBeGreaterThan(o.wage);
      }
    }
  });

  it("joins exposure exactly to the analysis occupations file", () => {
    const byCode = new Map(analysisOccupations.map((o) => [o.code, o]));
    for (const o of workforceOccupations) {
      expect(byCode.get(o.soc)?.exposure).toBe(o.exposure);
    }
  });

  it("every origin is in the four families and at least 0.25 exposed", () => {
    const families = new Set<string>(ORIGIN_FAMILIES);
    expect(workforceOccupations).toHaveLength(39);
    for (const o of workforceOccupations) {
      expect(families.has(o.group)).toBe(true);
      expect(o.exposure).toBeGreaterThanOrEqual(0.25);
    }
  });

  it("covers 36 of 39 origins with at least one route", () => {
    const withRoutes = workforceOccupations.filter((o) => routesOf(o).length > 0);
    expect(withRoutes).toHaveLength(36);
    expect(
      workforceOccupations
        .filter((o) => routesOf(o).length === 0)
        .map((o) => o.soc)
        .sort(),
    ).toEqual(["13-1151", "13-2052", "13-2054"]);
  });

  it("leaves the analysis exposure cut at 0.25", () => {
    expect(EXPOSURE_THRESHOLD).toBe(0.25);
    expect(EXPOSED_AT).toBe(0.3);
  });
});

function dest(partial: Pick<Destination, "soc" | "tier" | "wageGain">): Destination {
  return {
    soc: partial.soc,
    title: partial.soc,
    group: "G",
    tier: partial.tier,
    wage: 2,
    exposure: 0.1,
    wageGain: partial.wageGain,
    zone: 2,
    build: [],
    programIds: [],
    leadProgramId: null,
    timeBand: null,
    timeSource: "none",
    openDoor: false,
  };
}

describe("sortDestinations", () => {
  it("orders Primary-Short before Supplemental at equal wage gain", () => {
    const a = dest({ soc: "1", tier: "Supplemental", wageGain: 100 });
    const b = dest({ soc: "2", tier: "Primary-Short", wageGain: 100 });
    expect(sortDestinations([a, b]).map((d) => d.soc)).toEqual(["2", "1"]);
  });
});
