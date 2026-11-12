import { csvParse, csvFormatRows } from "d3-dsv";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { datasetById, defaultFilters, filterRows } from "@/content/explorer";

const exposure = datasetById("exposure");
const source = csvParse(readFileSync("data/source/output/richmond_exposure_2025.csv", "utf8"));
const rows = source.map((row) =>
  Object.fromEntries(source.columns.map((key) => [key, row[key] ?? ""])),
);

describe("public data explorer", () => {
  it("filters real occupations by title and SOC code", () => {
    const match = filterRows(rows, exposure, { ...defaultFilters, q: "43-4051" });
    expect(match).toHaveLength(1);
    expect(match[0]?.["bls_title"]).toBe("Customer Service Representatives");
    expect(filterRows(rows, exposure, { ...defaultFilters, q: "customer service" })).toEqual(match);
  });
  it("combines family, percentage exposure bounds, and average pay", () => {
    const match = filterRows(rows, exposure, {
      ...defaultFilters,
      family: "Office & Administrative Support",
      minExposure: "70",
      maxExposure: "71",
      minPay: "44000",
    });
    expect(match.map((row) => row["occ_code"])).toEqual(["43-4051"]);
    expect(
      filterRows(rows, exposure, { ...defaultFilters, minExposure: "71", maxExposure: "70" }),
    ).toHaveLength(0);
  });
  it("keeps unpublished values distinct from zero and last in numeric sorting", () => {
    const fixture = [
      { annual_mean: "", observed_exposure: "" },
      { annual_mean: "0", observed_exposure: "0" },
      { annual_mean: "100", observed_exposure: "0.5" },
    ];
    expect(filterRows(fixture, exposure, { ...defaultFilters, minPay: "0" })).toHaveLength(2);
    expect(
      filterRows(fixture, exposure, { ...defaultFilters, minExposure: "0", maxExposure: "0" }),
    ).toEqual([fixture[1]]);
    expect(
      filterRows(fixture, exposure, { ...defaultFilters, sort: "annual_mean", order: "desc" }),
    ).toEqual([fixture[2], fixture[1], fixture[0]]);
  });
  it("filters workforce history by year and row type without adding exposure", () => {
    const history = datasetById("history");
    const fixture = [
      { vintage: "2025", o_group: "detailed" },
      { vintage: "2024", o_group: "detailed" },
      { vintage: "2025", o_group: "total" },
    ];
    expect(
      filterRows(fixture, history, { ...defaultFilters, year: "2025", rowType: "detailed" }),
    ).toEqual([fixture[0]]);
    expect(history.exposure).toBeUndefined();
  });
  it("exports all original columns and unrounded values with CSV escaping", () => {
    const match = filterRows(rows, exposure, { ...defaultFilters, q: "43-4051" });
    const csv = csvFormatRows([
      source.columns,
      ...match.map((row) => source.columns.map((key) => row[key] ?? "")),
    ]);
    const exported = csvParse(csv);
    expect(exported.columns).toEqual(source.columns);
    expect(exported[0]?.["observed_exposure"]).toBe("0.7011");
    expect(exported[0]?.["employment"]).toBe("10960.0");
  });
});
