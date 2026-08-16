// Publishes the report figures so the rendered reports can reach them.
//
// The reports reference their figures as `figures/fig4_exposure_wage.png`, a path
// relative to the markdown file, which is correct for GitHub and for the LaTeX
// build but means nothing to a browser. Rather than rewrite the vendored
// markdown — which is pinned by hash and must stay byte-identical — the images
// are copied to a stable absolute path and the link is rewritten at render time.
//
// PNG only. The PDF siblings exist for print and would double the payload.

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FROM = join(ROOT, 'vendor', 'analysis', 'reports', 'figures');
const TO = join(ROOT, 'public', 'figures');

let names;
try {
  names = readdirSync(FROM).filter((f) => f.endsWith('.png'));
} catch {
  console.error(
    `No figures at ${FROM}. Run \`npm run sync\` to populate vendor/ before building.`,
  );
  process.exit(1);
}

if (names.length === 0) {
  console.error(`No PNG figures in ${FROM}. The vendored reports would render without them.`);
  process.exit(1);
}

mkdirSync(TO, { recursive: true });
for (const name of names) copyFileSync(join(FROM, name), join(TO, name));

console.log(`figures: ${names.length} published to public/figures/`);
