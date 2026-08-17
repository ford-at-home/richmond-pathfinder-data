import type { ResearchStory } from "@/content/types";
import { isFigureId } from "@/content/figures";
import { LiveFigure } from "@/components/research/LiveFigure";
import { pinRepoUrl, pinRepo, pinShort, pinSynced } from "@/lib/pin";

import "@/visualizations/source-report.css";

export function ReportDocument({ story }: { story: ResearchStory }) {
  return (
    <div className="source-report source-figure">
      {story.preambleHtml ? (
        <div className="preamble" dangerouslySetInnerHTML={{ __html: story.preambleHtml }} />
      ) : null}

      <div className="report">
        <nav className="toc" aria-label="Sections of this report">
          <h2 className="toc__title">Contents</h2>
          <ol className="toc__list">
            {story.sections.map((s) => (
              <li key={s.anchor}>
                <a href={`#${s.anchor}`}>{s.heading}</a>
                {s.figureIds.length > 0 ? (
                  <span className="toc__live">{s.figureIds.length} interactive</span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>

        <div className="report__body">
          {story.sections.map((s) => (
            <section key={s.anchor} className="report__section" id={s.anchor}>
              <h2>{s.heading}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
              {s.figureIds.map((id) => (isFigureId(id) ? <LiveFigure key={id} id={id} /> : null))}
            </section>
          ))}
        </div>
      </div>

      <p className="colophon">
        This document is reproduced from <a href={pinRepoUrl}>{pinRepo}</a> at commit{" "}
        <code>{pinShort}</code>, synced {pinSynced}, and is verified against a recorded hash. The
        interactive figures set into it are recomputed from the same published tables.
      </p>
    </div>
  );
}
