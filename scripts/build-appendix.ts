/**
 * Writes the audit appendix.
 *
 * Generated rather than maintained, so it cannot disagree with the screen. Run
 * it after any copy change:
 *
 *   bun scripts/build-appendix.ts
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { appendixCsv, buildAppendix } from "@/content/appendix";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "audit-appendix.csv");

const rows = buildAppendix();
writeFileSync(OUT, `${appendixCsv(rows)}\n`);

const byLabel = rows.reduce<Record<string, number>>((acc, r) => {
  acc[r.label] = (acc[r.label] ?? 0) + 1;
  return acc;
}, {});

console.log(`${rows.length} rows → docs/audit-appendix.csv`);
console.log(
  Object.entries(byLabel)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, n]) => `  ${label.padEnd(11)} ${n}`)
    .join("\n"),
);
