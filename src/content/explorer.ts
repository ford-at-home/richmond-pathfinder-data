export type DataRow = Record<string, string>;
export type DataColumn = {
  key: string;
  label: string;
  kind?: "number" | "money" | "exposure";
  description: string;
};
export type Dataset = {
  id: string;
  title: string;
  filename: string;
  description: string;
  columns: DataColumn[];
  code: string;
  occupation: string;
  group?: string;
  year?: string;
  exposure?: string;
  wage?: string;
};

export const datasets: Dataset[] = [
  {
    id: "exposure",
    title: "Workforce & AI exposure · 2025",
    filename: "richmond_exposure_2025.csv",
    description:
      "Detailed Richmond occupations with a measured AI exposure score and national comparator. BLS May 2025 employment and wages; Anthropic observed task exposure.",
    code: "occ_code",
    occupation: "bls_title",
    group: "group",
    exposure: "observed_exposure",
    wage: "annual_mean",
    columns: [
      {
        key: "occ_code",
        label: "SOC code",
        description: "Standard Occupational Classification code.",
      },
      { key: "bls_title", label: "Occupation", description: "Occupation title published by BLS." },
      { key: "group", label: "Occupational family", description: "SOC major group name." },
      {
        key: "employment",
        label: "Employment",
        kind: "number",
        description: "Richmond employment estimate, May 2025; jobs, not unique workers.",
      },
      {
        key: "annual_mean",
        label: "Average annual pay",
        kind: "money",
        description: "Mean annual wage in nominal 2025 dollars.",
      },
      {
        key: "observed_exposure",
        label: "AI exposure",
        kind: "exposure",
        description:
          "Share of tasks appearing in measured model interactions. Source CSV stores a fraction from 0 to 1; the table displays a percentage.",
      },
      {
        key: "loc_quotient",
        label: "Location quotient",
        kind: "number",
        description: "Local employment share divided by national share; 1 means the national rate.",
      },
      {
        key: "nat_employment",
        label: "National employment",
        kind: "number",
        description: "National employment estimate, May 2025.",
      },
      {
        key: "nat_annual_mean",
        label: "National average pay",
        kind: "money",
        description: "National mean annual wage, nominal 2025 dollars.",
      },
    ],
  },
  {
    id: "history",
    title: "Workforce history · 2010–2025",
    filename: "richmond_panel_2010_2025.csv",
    description:
      "Published Richmond OEWS estimates across sixteen May releases. Includes total, major-group, and detailed rows; geography and SOC classifications change across vintages.",
    code: "occ_code",
    occupation: "occ_title",
    year: "vintage",
    wage: "a_mean",
    columns: [
      { key: "vintage", label: "Year", kind: "number", description: "May survey reference year." },
      {
        key: "occ_code",
        label: "SOC code",
        description: "SOC code under the classification used for this release.",
      },
      { key: "occ_title", label: "Occupation", description: "Title as published in this vintage." },
      {
        key: "o_group",
        label: "Row type",
        description:
          "Total, major group, or detailed occupation. Do not sum these overlapping rows.",
      },
      {
        key: "tot_emp",
        label: "Employment",
        kind: "number",
        description: "Published employment estimate; suppressed estimates are blank.",
      },
      {
        key: "a_mean",
        label: "Average annual pay",
        kind: "money",
        description: "Mean annual wage in nominal dollars of the release year.",
      },
      {
        key: "emp_prse",
        label: "Employment error (%)",
        kind: "number",
        description: "Published employment relative standard error, in percent.",
      },
      {
        key: "loc_quotient",
        label: "Location quotient",
        kind: "number",
        description: "Local employment share relative to national share.",
      },
      {
        key: "soc_version",
        label: "SOC revision",
        description: "Classification revision in force for this vintage.",
      },
      {
        key: "area_title",
        label: "Published geography",
        description: "Metropolitan area name in the original release.",
      },
    ],
  },
  {
    id: "excluded",
    title: "Coverage exclusions · 2025",
    filename: "coverage_excluded.csv",
    description:
      "Detailed occupations in the May 2025 Richmond release excluded from the analytical base because an exposure score or national comparator is unavailable. No exposure scores are inferred.",
    code: "OCC_CODE",
    occupation: "OCC_TITLE",
    columns: [
      {
        key: "OCC_CODE",
        label: "SOC code",
        description: "Standard Occupational Classification code.",
      },
      { key: "OCC_TITLE", label: "Occupation", description: "Published BLS occupation title." },
      {
        key: "emp",
        label: "Employment",
        kind: "number",
        description: "Richmond employment estimate, May 2025.",
      },
    ],
  },
];

datasets.push({
  id: "training",
  title: "Local training programs · CCWA 2026",
  filename: "ccwa_training_programs_2026.csv",
  description:
    "Short-term credential programs in the Richmond region from the CCWA July–December 2026 catalog, with student price, length and prerequisites. Accessed 2026-11-12.",
  code: "target_soc",
  occupation: "program",
  columns: [
    { key: "program", label: "Program", description: "Program name as listed in the catalog." },
    { key: "provider_location", label: "Provider / location", description: "Provider and campus." },
    {
      key: "credential",
      label: "Credential / exam",
      description: "Credential or exam the program prepares for.",
    },
    {
      key: "target_soc",
      label: "Target SOC",
      description: "Occupation code the program leads toward.",
    },
    {
      key: "student_price",
      label: "Student price",
      description:
        "FastForward student share (one-third). Full price not published; G3 or WIOA may reduce it to $0 for eligible residents.",
    },
    {
      key: "schedule",
      label: "Schedule / length",
      description: "Published cohort dates or length.",
    },
    { key: "modality", label: "Modality", description: "In-person, hybrid or online." },
    {
      key: "prerequisites",
      label: "Prerequisites / notes",
      description: "Published prerequisites.",
    },
    {
      key: "licensing",
      label: "Licensing",
      description: "State licensing step, where verified; items marked verify are unconfirmed.",
    },
    { key: "source_url", label: "Source", description: "Where the row was read." },
    { key: "accessed", label: "Accessed", description: "Date the source was read." },
  ],
});

export function datasetById(id: string): Dataset {
  return datasets.find((d) => d.id === id) ?? (datasets[0] as Dataset);
}

export type ExplorerFilters = {
  q: string;
  family: string;
  year: string;
  rowType: string;
  minExposure: string;
  maxExposure: string;
  minPay: string;
  sort: string;
  order: string;
  page: number;
};
export const defaultFilters: ExplorerFilters = {
  q: "",
  family: "",
  year: "",
  rowType: "",
  minExposure: "",
  maxExposure: "",
  minPay: "",
  sort: "",
  order: "asc",
  page: 1,
};

function bound(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function filterRows(rows: DataRow[], dataset: Dataset, filters: ExplorerFilters): DataRow[] {
  const q = filters.q.trim().toLowerCase();
  const min = bound(filters.minExposure),
    max = bound(filters.maxExposure),
    pay = bound(filters.minPay);
  const result = rows.filter((row) => {
    if (q && !`${row[dataset.occupation]} ${row[dataset.code]}`.toLowerCase().includes(q))
      return false;
    if (dataset.group && filters.family && row[dataset.group] !== filters.family) return false;
    if (dataset.year && filters.year && row[dataset.year] !== filters.year) return false;
    if (dataset.id === "history" && filters.rowType && row["o_group"] !== filters.rowType)
      return false;
    if (dataset.exposure && (min !== null || max !== null)) {
      const exposure = bound(row[dataset.exposure] ?? "");
      if (
        exposure === null ||
        (min !== null && exposure * 100 < min) ||
        (max !== null && exposure * 100 > max)
      )
        return false;
    }
    if (dataset.wage && pay !== null) {
      const wage = bound(row[dataset.wage] ?? "");
      if (wage === null || wage < pay) return false;
    }
    return true;
  });
  const column = dataset.columns.find((c) => c.key === filters.sort);
  if (column)
    result.sort((a, b) => {
      const av = a[column.key] ?? "",
        bv = b[column.key] ?? "";
      if (av === "" || bv === "") return av === bv ? 0 : av === "" ? 1 : -1;
      const diff = column.kind ? Number(av) - Number(bv) : av.localeCompare(bv);
      return filters.order === "desc" ? -diff : diff;
    });
  return result;
}
