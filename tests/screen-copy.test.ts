import { describe, expect, it } from "vitest";

import { buildAppendix, rowsForCard, type AppendixRow } from "@/content/appendix";
import { NOT_A_COURSE, routeDuration } from "@/content/bridge";
import { CLAIMS, claimFor, reviewBy, type ClaimKey } from "@/content/claims";
import { inRoleFor, SOURCED_IN_ROLE } from "@/content/inRole";
import { cardFor, destinationCardFor } from "@/content/screen/card";
import { plainWords, TRANSLATED_SKILLS } from "@/content/skillWords";
import { routesOf, workforceOccupations } from "@/content/workforce";

/**
 * The pre-publish checklist, run over all 39 cards on every commit.
 *
 * The checklist is only worth writing down if something checks it, and a person
 * reading 39 cards will not catch a stray decimal on the thirty-first. Each
 * describe block below is one numbered item from the standard.
 */

const cards = workforceOccupations.map(cardFor);
const appendix = buildAppendix();
const registered = Object.keys(CLAIMS) as ClaimKey[];

/** Every sentence the site publishes on a job screen, with where it appears. */
const published: { screenId: string; sentence: string }[] = appendix.map((r) => ({
  screenId: r.screenId,
  sentence: r.sentence,
}));

describe("1 — no codes, no scores, no labels in the body", () => {
  it("prints no SOC code inside a sentence", () => {
    // The code belongs under the title in small type, or in the URL. A body
    // sentence containing one is the failure this catches.
    for (const { screenId, sentence } of published) {
      expect(sentence, screenId).not.toMatch(/\b\d{2}-\d{4}\b/);
    }
  });

  it("prints no exposure score anywhere on a card", () => {
    // 0.701 read as a countdown is the whole reason the band exists.
    for (const { screenId, sentence } of published) {
      expect(sentence, screenId).not.toMatch(/\b0\.\d+/);
    }

    // A percentage is the same number wearing a hat, so no sentence resting on
    // the exposure measurement may carry one. A percentage from a study that
    // measured something else — output per hour, say — is a different number
    // and is allowed to keep its shape.
    const exposureRows = appendix.filter((r) => r.basis.includes("Anthropic Economic Index"));
    expect(exposureRows.length).toBeGreaterThan(0);
    for (const r of exposureRows) {
      expect(r.sentence, r.screenId).not.toMatch(/%|\bpercent\b/);
    }
  });

  it("prints no epistemic label in the body", () => {
    for (const { screenId, sentence } of published) {
      expect(sentence, screenId).not.toMatch(/\b(REPORTED|MODELLED|UNVERIFIED|OPEN)\b/);
    }
  });
});

describe("2 — every number has a noun, and pay says what it is", () => {
  it("attaches a noun to the employment and pay figures", () => {
    for (const card of cards) {
      const scale = card.scale.map((c) => c.text).join(" ");
      expect(scale, card.soc).toMatch(/people do this job/);
      expect(scale, card.soc).toMatch(/\$[\d,]+ a year/);
    }
  });

  it("never prints a pay figure without saying what the average hides", () => {
    // The published figure is an annual mean and the slice carries no median,
    // so the qualifier is about the average rather than about the midpoint.
    const payRows = appendix.filter((r) => r.sentence.includes("a year"));
    expect(payRows.length).toBeGreaterThan(0);

    for (const card of cards) {
      const qualifier = "most people earn less than it";
      expect(card.scale.map((c) => c.text).join(" "), card.soc).toContain(qualifier);
    }
  });
});

describe("3 — every empty is a written empty state", () => {
  it("writes empty state B for the three jobs with no next job", () => {
    const empty = cards.filter((c) => c.routes.length === 0);
    expect(empty.map((c) => c.soc).sort()).toEqual(["13-1151", "13-2052", "13-2054"]);
    for (const card of empty) {
      expect(card.noRoutes?.text, card.soc).toMatch(/that is not a warning/i);
      expect(claimFor(card.noRoutes!.claim).label).toBe("OPEN");
    }
  });

  it("writes empty state D wherever no in-role study was found", () => {
    const withoutEvidence = workforceOccupations.filter(
      (o) => !SOURCED_IN_ROLE.includes(o.soc),
    ).length;
    expect(withoutEvidence).toBe(38);
    for (const o of workforceOccupations) {
      const { evidence } = inRoleFor(o.soc);
      expect(evidence.text.endsWith("."), o.soc).toBe(true);
      if (!SOURCED_IN_ROLE.includes(o.soc)) {
        expect(evidence.text, o.soc).toMatch(/don't have good information yet/i);
        expect(claimFor(evidence.claim).label).toBe("OPEN");
      }
    }
  });

  it("never prints a blank or an N/A in place of an empty state", () => {
    for (const { screenId, sentence } of published) {
      expect(sentence.trim().length, screenId).toBeGreaterThan(0);
      expect(sentence, screenId).not.toMatch(/\bN\/A\b|\bTBD\b|—\s*$/);
    }
  });
});

describe("4 — no banned phrasing", () => {
  const BANNED = [
    /\bat risk\b/i,
    /future.?proof/i,
    /reskill/i,
    /safe from AI/i,
    /\bdisrupted\b/i,
    /\bin.?demand\b/i,
    /\byou should\b/i,
    /coming soon/i,
  ];

  it("keeps all eight banned phrasings off the job screens", () => {
    for (const { screenId, sentence } of published) {
      for (const banned of BANNED) {
        expect(sentence, `${screenId}: ${sentence}`).not.toMatch(banned);
      }
    }
  });
});

describe("5 — a management landing never reads as a course", () => {
  it("says 'not a course' on every one of the 28 management routes", () => {
    const management = workforceOccupations
      .flatMap((o) => routesOf(o))
      .filter((d) => d.soc.startsWith("11-"));
    expect(management).toHaveLength(28);

    for (const d of management) {
      expect(routeDuration(d)?.text).toBe(NOT_A_COURSE);
    }

    for (const card of cards) {
      for (const route of card.routes.filter((r) => r.soc.startsWith("11-"))) {
        const line = route.line.map((c) => c.text).join(" ");
        expect(line, `${card.soc} → ${route.soc}`).toContain("not a course");
        // The pinned band for one of these reads "No training needed", which
        // would say the opposite of the gate.
        expect(line, `${card.soc} → ${route.soc}`).not.toMatch(/no training needed|years/i);
      }
    }
  });
});

describe("5b — a job-zone distance never reads as a schedule", () => {
  it("says 'how long' only where a programme publishes a length", () => {
    const routes = workforceOccupations.flatMap((o) => routesOf(o));
    const scheduled = routes.filter((d) => d.timeSource === "program");
    expect(scheduled).toHaveLength(9);

    for (const d of routes.filter((r) => r.timeSource === "zone" && !r.soc.startsWith("11-"))) {
      const text = routeDuration(d)?.text ?? "";
      expect(text, d.soc).toContain("no set course length");
      expect(claimFor(routeDuration(d)!.claim).label).toBe("MODELLED");
    }
  });

  it("renders every time band the pinned slice carries", () => {
    // A refreshed slice with a new band should fail here rather than quietly
    // drop the line from 110 routes.
    for (const d of workforceOccupations.flatMap((o) => routesOf(o))) {
      if (d.timeBand != null) expect(routeDuration(d), `${d.soc} ${d.timeBand}`).not.toBeNull();
    }
  });
});

describe("6 — gates are named, and suspected gates are marked as suspected", () => {
  it("gives every route a gate", () => {
    for (const card of cards) {
      for (const route of card.routes) {
        expect(route.bridge.gate.need.length, `${card.soc} → ${route.soc}`).toBeGreaterThan(0);
      }
    }
  });

  it("records an unmeasured gate as UNVERIFIED and nothing else", () => {
    const gateRows = appendix.filter((r) => r.screenId.endsWith("/ gate"));
    expect(gateRows.length).toBeGreaterThan(0);
    for (const r of gateRows) {
      if (r.gateUnmeasured) expect(r.label).toBe("UNVERIFIED");
      if (r.label === "UNVERIFIED") expect(r.gateUnmeasured).not.toBe("");
    }
  });
});

describe("7 — nothing implies the map measured the reader", () => {
  it("makes no claim about the reader's fit, ability or prospects", () => {
    const ABOUT_THE_READER = [
      /you (are|'re) (a )?(good|great|strong|poor|bad) (fit|match|candidate)/i,
      /\byou (could|will|would) earn\b/i,
      /\byour (skills|ability|aptitude|potential)\b/i,
      /\bperfect for you\b/i,
      /\bwe recommend\b/i,
    ];
    for (const { screenId, sentence } of published) {
      for (const pattern of ABOUT_THE_READER) {
        expect(sentence, `${screenId}: ${sentence}`).not.toMatch(pattern);
      }
    }
  });
});

describe("8 — every sentence has an appendix row inside its review window", () => {
  it("gives every published sentence a row", () => {
    for (const card of cards) {
      const forCard = rowsForCard(card);
      expect(forCard.length, card.soc).toBeGreaterThan(0);
      for (const r of forCard) {
        expect(r.basis.length, `${r.screenId}: ${r.sentence}`).toBeGreaterThan(10);
        expect(r.retrieved).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("shapes every screen_id as card / scope / slot", () => {
    for (const r of appendix) {
      expect(r.screenId).toMatch(/^\d{2}-\d{4} \/ [a-z0-9-]+ \/ [a-z-]+$/);
    }
  });

  it("has not let any claim go stale", () => {
    // This test is the staleness alarm, and it is meant to fail one day. A
    // course price six months old is not a price.
    const today = new Date().toISOString().slice(0, 10);
    const stale = registered.filter((key) => reviewBy(key) < today);
    expect(stale, `re-check these claims: ${stale.join(", ")}`).toEqual([]);
  });

  it("reviews a published price at least every six months", () => {
    for (const key of registered) {
      const claim = claimFor(key);
      if (claim.priceStatus === "published" || claim.priceStatus === "not published") {
        expect(claim.reviewMonths, key).toBeLessThanOrEqual(6);
      }
    }
  });

  it("gives a REPORTED claim something to point at", () => {
    for (const key of registered) {
      const claim = claimFor(key);
      if (claim.label === "REPORTED") {
        expect(claim.basis.length, key).toBeGreaterThan(20);
      }
      if (claim.url) expect(claim.url, key).toMatch(/^https:\/\//);
    }
  });

  it("leaves no claim registered that nothing publishes", () => {
    const used = new Set(appendix.map((r) => `${r.label}|${r.basis}`));
    const unused = registered.filter((key) => {
      const c = claimFor(key);
      return !used.has(`${c.label}|${c.basis}`);
    });
    // A claim nobody cites is a claim nobody maintains.
    expect(unused, `unused claims: ${unused.join(", ")}`).toEqual([]);
  });
});

describe("9 — the stay panel says who captures the value", () => {
  it("names the employer where the employer is the answer", () => {
    const csr = inRoleFor("43-4051");
    expect(csr.whoDecides?.text).toMatch(/goes to the employer by default/i);
  });

  it("never reports an in-role gain without saying where it lands", () => {
    for (const o of workforceOccupations) {
      const panel = inRoleFor(o.soc);
      const reportsAGain = /\b\d+%/.test(panel.evidence.text);
      if (reportsAGain) expect(panel.whoDecides, o.soc).toBeDefined();
    }
  });
});

describe("10 — copy is built from the pinned map, not from prose", () => {
  it("translates every skill the pinned slice names", () => {
    const inData = new Set(
      workforceOccupations.flatMap((o) => routesOf(o)).flatMap((d) => d.build.map((s) => s.name)),
    );
    for (const skill of inData) {
      expect(plainWords(skill), skill).toBeDefined();
    }
    // And nothing translated that the data dropped, so the lexicon cannot rot.
    for (const skill of TRANSLATED_SKILLS) {
      expect([...inData], skill).toContain(skill);
    }
  });

  it("prints no raw O*NET skill name in a body sentence", () => {
    for (const { screenId, sentence } of published.filter((p) =>
      p.screenId.endsWith("/ different"),
    )) {
      expect(sentence, screenId).not.toMatch(
        /Management of|Social Perceptiveness|Systems Analysis/,
      );
    }
  });

  it("builds one card per pinned origin and no others", () => {
    expect(cards).toHaveLength(39);
    const socs = new Set(cards.map((c) => c.soc));
    expect(socs.size).toBe(39);
  });

  it("marks a destination-only job as a destination", () => {
    const card = destinationCardFor({
      code: "11-3012",
      title: "Administrative Services Managers",
      group: "Management",
      exposure: 0.2,
    });
    expect(card.lead.text).toMatch(/not one of the 39 starting jobs/);
  });
});

describe("the appendix as an artifact", () => {
  it("covers the five worked cards from the standard", () => {
    for (const soc of ["43-3031", "43-4051", "13-2052", "43-2011", "43-6013"]) {
      const forSoc = appendix.filter((r: AppendixRow) => r.screenId.startsWith(soc));
      expect(forSoc.length, soc).toBeGreaterThan(0);
    }
  });
});
