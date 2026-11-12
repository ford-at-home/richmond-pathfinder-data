import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Only the pinned, already-public source outputs are available through this function.
export const getExplorerDataset = createServerFn({ method: "GET" })
  .inputValidator(z.object({ dataset: z.string() }))
  .handler(async ({ data }) => {
    const { csvParse } = await import("d3-dsv");
    let raw: string;
    if (data.dataset === "history") {
      raw = (await import("../../data/source/output/richmond_panel_2010_2025.csv?raw")).default;
    } else if (data.dataset === "excluded") {
      raw = (await import("../../data/source/output/coverage_excluded.csv?raw")).default;
    } else {
      raw = (await import("../../data/source/output/richmond_exposure_2025.csv?raw")).default;
    }
    const parsed = csvParse(raw);
    return {
      columns: [...parsed.columns],
      rows: parsed.map((row) =>
        Object.fromEntries(parsed.columns.map((key) => [key, row[key] ?? ""])),
      ),
    };
  });
