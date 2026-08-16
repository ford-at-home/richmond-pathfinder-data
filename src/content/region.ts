import { csvParse } from "d3-dsv";

import qcewCsv from "../../data/source/output/qcew_fixed_geography.csv?raw";
import type { Limitation, Locality, RegionMeasure } from "./types";
import { GEOGRAPHY, GEOGRAPHY_SHORT } from "@/lib/geography";

function num(v: string | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const QCEW_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025] as const;

export type QcewYear = (typeof QCEW_YEARS)[number];

export type QcewRow = {
  naics: string;
  industry: string;
  countySet: string;
  emp2019: number | null;
  emp2023: number | null;
  emp2025: number | null;
  series: { year: QcewYear; emp: number | null }[];
  suppressedCells: number | null;
  empLegacy: number | null;
  empCurrent: number | null;
  difference: number | null;
};

export const qcewSeries: QcewRow[] = csvParse(qcewCsv).map((row) => ({
  naics: row["naics"] ?? "",
  industry: row["industry"] ?? "",
  countySet: row["county_set"] ?? "",
  emp2019: num(row["emp_2019"]),
  emp2023: num(row["emp_2023"]),
  emp2025: num(row["emp_2025"]),
  series: QCEW_YEARS.map((year) => ({
    year,
    emp: num(row[`emp_${year}`]),
  })),
  suppressedCells: num(row["suppressed_county_year_cells"]),
  empLegacy: num(row["emp_legacy"]),
  empCurrent: num(row["emp_current"]),
  difference: num(row["difference"]),
}));

/** Industry rows on the constant 17-county geography. */
export const qcewCurrent = qcewSeries.filter((r) => r.countySet === "current_17");

/** Legacy vs current county-set comparison; not an industry series. */
export const qcewGeographyComparison = qcewSeries.filter((r) =>
  r.countySet.startsWith("legacy_vs_current_"),
);

const totalCurrent = qcewSeries.find((r) => r.naics === "10" && r.countySet === "current_17");

const oewsProvenance = {
  source:
    "BLS OEWS joined to Anthropic observed-task exposure; codebook for richmond_exposure_2025.csv",
  geography: GEOGRAPHY,
  period: "May 2025",
};

export const regionMeasures: RegionMeasure[] = [
  {
    id: "matched-occupations",
    label: "Matched occupations in the join",
    value: "523",
    unit: "detailed occupations",
    provenance: {
      ...oewsProvenance,
      unit: "occupations",
      note: "Codebook: one row per detailed occupation in the May 2025 release that carries both an exposure score and a national comparator.",
    },
    isPlaceholder: false,
  },
  {
    id: "join-coverage",
    label: "Share of metropolitan employment in the join",
    value: "88.4",
    unit: "percent",
    provenance: {
      ...oewsProvenance,
      unit: "percent of metropolitan employment",
      note: "Published in the codebook for richmond_exposure_2025.csv. The unmatched occupations are in coverage_excluded.csv.",
    },
    isPlaceholder: false,
  },
  {
    id: "qcew-total",
    label: "QCEW employment, current 17-county set",
    value: totalCurrent?.emp2025 == null ? null : String(Math.round(totalCurrent.emp2025)),
    unit: "jobs (annual average, private ownership except all-ownerships total)",
    provenance: {
      source: "BLS QCEW county files, aggregated in qcew_fixed_geography.csv",
      geography: "Richmond MSA, 2020-standards 17-county set (constant geography)",
      unit: "jobs",
      period: "2025 annual average",
      note: "QCEW has no occupational dimension. Do not read this as an occupation or exposure total.",
    },
    isPlaceholder: false,
  },
  {
    id: "hiring-demand",
    label: "Hiring demand",
    value: null,
    unit: "postings",
    provenance: {
      source: "No file in the pinned analysis",
      geography: GEOGRAPHY_SHORT,
      unit: "postings",
      note: "Unresolved (U4). No job-postings dataset was migrated.",
    },
    isPlaceholder: true,
  },
  {
    id: "training-providers",
    label: "Training providers",
    value: null,
    unit: "providers",
    provenance: {
      source: "No file in the pinned analysis",
      geography: GEOGRAPHY_SHORT,
      unit: "providers",
      note: "Unresolved (U4). No training-seat dataset was migrated.",
    },
    isPlaceholder: true,
  },
];

/**
 * Per-locality occupation measures cannot be built from the source files.
 * QCEW is industry × county-set, not occupation × locality. The array stays
 * empty rather than inventing city/county AI-exposure rows (U5).
 */
export const localities: Locality[] = [];

export const regionLimitations: Limitation[] = [
  {
    id: "geography-definition",
    title: "Geography is the Richmond VA MSA, BLS 40060",
    body: "The Richmond MSA was redelineated between the May 2023 and May 2024 OEWS releases: Caroline County left and King and Queen County entered. QCEW tables hold a 17-county current set so industry series can be compared on constant geography. This is not the City of Richmond.",
    isPlaceholder: false,
  },
  {
    id: "no-locality-occupation-table",
    title: "No occupation × locality table exists in the source",
    body: "QCEW in the pinned analysis is industry employment on a county-set, not occupation or AI exposure by city or county. A locality comparison of exposure cannot be built from these files.",
    isPlaceholder: false,
  },
  {
    id: "qcew-suppression",
    title: "Suppressed QCEW cells understate some industry totals",
    body: "A nonzero suppressed_county_year_cells count means the summed series understates the true level in those years. Empty cells mean not published, never zero.",
    isPlaceholder: false,
  },
];
