import { Link } from "@tanstack/react-router";

import { primaryNav, siteConfig } from "@/config/site";
import { pinCommitUrl, pinRepo, pinShort, pinSynced } from "@/lib/pin";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-[5px] border-foreground bg-background">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-8 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="eyebrow">About this site</p>
          <p className="mt-2 max-w-md font-display text-lg leading-snug text-foreground">
            {siteConfig.tagline}
          </p>
          <p className="mt-3 annotation max-w-md">
            Reports and figures are reproduced from{" "}
            <a href={pinCommitUrl} className="editorial-link">
              {pinRepo}
            </a>{" "}
            at commit <code>{pinShort}</code>, synced {pinSynced}. Geography is the Richmond VA MSA
            (BLS 40060), not the City of Richmond.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="label-sm">Sections</p>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label-sm">Data integrity</p>
          <ul className="mt-3 space-y-2 annotation">
            <li>Source, geography, unit, and period shown with every figure.</li>
            <li>Every visualization can be read as a table.</li>
            <li>No rankings, recommendations, or eligibility determinations.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1280px] px-8 py-5 annotation">
          {siteConfig.name} — public-interest information project.
        </p>
      </div>
    </footer>
  );
}
