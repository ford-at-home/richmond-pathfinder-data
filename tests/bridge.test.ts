import { describe, expect, it } from "vitest";

import {
  bridgeFor,
  bridgeSummary,
  FREE_LOCAL_HELP,
  gateFor,
  PARTIAL_COURSE_LIST,
  ROUTED_SKILLS,
  SELF_STUDY_CAVEAT,
  trainingForSkill,
} from "@/content/bridge";
import { routesOf, workforceOccupations } from "@/content/workforce";

const destinations = workforceOccupations.flatMap((o) => routesOf(o));
const skillNames = [...new Set(destinations.flatMap((d) => d.build.map((s) => s.name)))];

describe("what it takes", () => {
  it("covers every destination on the map", () => {
    expect(destinations).toHaveLength(110);
    for (const d of destinations) {
      const bridge = bridgeFor(d);
      expect(bridge.gate.need.endsWith(".")).toBe(true);
      expect(bridge.gate.need.length).toBeGreaterThan(40);
    }
  });

  it("routes every named skill, and routes no skill the data dropped", () => {
    for (const skill of skillNames) {
      expect(trainingForSkill(skill).group.length).toBeGreaterThan(0);
    }
    for (const skill of ROUTED_SKILLS) {
      expect(skillNames).toContain(skill);
    }
  });

  it("groups a skill by what builds it, not by where the row sorted", () => {
    expect(trainingForSkill("Management of Personnel Resources").group).toMatch(
      /team or a budget/i,
    );
    expect(trainingForSkill("Systems Evaluation").group).toMatch(/system apart/i);
    expect(trainingForSkill("Mathematics").group).toMatch(/numbers/i);
    expect(trainingForSkill("Equipment Selection").group).toMatch(/equipment/i);
    expect(trainingForSkill("Negotiation").group).toMatch(/everyday/i);
  });
});

describe("gates", () => {
  it("never lets a management landing read as a short course", () => {
    const management = destinations.filter((d) => d.soc.startsWith("11-"));
    expect(management).toHaveLength(28);
    for (const d of management) {
      expect(gateFor(d.soc).need).toMatch(/no local course opens this door/i);
    }
  });

  it("states plainly where the map cannot see a credential", () => {
    for (const soc of ["13-2054", "19-3011", "25-1011", "17-2061"]) {
      expect(gateFor(soc).need).toMatch(/cannot see/i);
    }
  });

  it("keeps the selling licence off the underwriting door", () => {
    expect(gateFor("13-2053").need).toMatch(/applies to selling, not to underwriting/i);
  });
});

describe("training honesty", () => {
  it("publishes no Greater Richmond course for business analysis", () => {
    const analysing = trainingForSkill("Systems Analysis");
    expect(analysing.options.every((o) => o.scope === "National")).toBe(true);
    expect(analysing.detail).toMatch(/no course in this/i);
  });

  it("mints no certificate for skills that experience builds", () => {
    for (const skill of ["Negotiation", "Troubleshooting"]) {
      expect(trainingForSkill(skill).options).toEqual([]);
    }
  });

  it("names a price or says none is published", () => {
    for (const skill of ROUTED_SKILLS) {
      for (const option of trainingForSkill(skill).options) {
        expect(option.cost.length).toBeGreaterThan(0);
      }
    }
  });

  it("offers something free for the skills where free study is real", () => {
    for (const skill of ["Mathematics", "Monitoring", "Writing", "Negotiation"]) {
      expect(trainingForSkill(skill).selfStudy.length).toBeGreaterThan(0);
    }
    const maths = trainingForSkill("Mathematics").selfStudy;
    expect(maths.map((o) => o.provider)).toContain("Khan Academy");
  });

  it("links each resource to itself, not to a page listing forty of them", () => {
    const all = [...new Set(skillNames.flatMap((s) => trainingForSkill(s).selfStudy))];
    const urls = all.map((o) => o.url);
    // Two resources sharing a URL means at least one is pointing at an index.
    expect(new Set(urls).size).toBe(urls.length);
    for (const o of all) {
      expect(o.url).toMatch(/^https:\/\//);
      expect(o.url).not.toMatch(/\/services\/online-resources|jobs-career-resources/);
    }
    for (const link of [...FREE_LOCAL_HELP.card.links, ...FREE_LOCAL_HELP.board.links]) {
      expect(link.url).toMatch(/^https:\/\//);
    }
  });

  it("keeps the two honest blanks blank", () => {
    // Filling either of these with a near-enough resource would erase a finding:
    // that the region sells no business-analysis course, and that nothing
    // substitutes for apprentice hours.
    for (const skill of ["Systems Analysis", "Systems Evaluation", "Operations Analysis"]) {
      expect(trainingForSkill(skill).selfStudy).toHaveLength(0);
    }
    for (const skill of ["Installation", "Repairing", "Troubleshooting"]) {
      expect(trainingForSkill(skill).selfStudy).toHaveLength(0);
    }
  });

  it("never lets free study read as a credential or as a way past the gate", () => {
    expect(SELF_STUDY_CAVEAT).toMatch(/credential an employer screens on/i);
    expect(SELF_STUDY_CAVEAT).toMatch(/none of them changes the requirement/i);
    const every = [...new Set(skillNames.flatMap((s) => trainingForSkill(s).selfStudy))];
    expect(every.length).toBeGreaterThan(0);
    for (const o of every) {
      expect(o.access).toMatch(/free/i);
      expect(`${o.name} ${o.covers}`).not.toMatch(/qualif|licen[cs]e|degree|guarantee/i);
    }
  });

  it("points at Virginia's Richmond, not at the two places that share its names", () => {
    const urls = [
      ...FREE_LOCAL_HELP.card.links.map((l) => l.url),
      ...FREE_LOCAL_HELP.board.links.map((l) => l.url),
      ...[...new Set(skillNames.flatMap((s) => trainingForSkill(s).selfStudy))].map((o) => o.url),
    ];
    for (const url of urls) {
      // yourlibrary.ca is Richmond, British Columbia; skillupamerica's Capital
      // Region portal is Albany and Schenectady, New York.
      expect(url).not.toMatch(/yourlibrary\.ca|skillupamerica/i);
    }
    expect(FREE_LOCAL_HELP.board.text).toMatch(/assess eligibility|not automatic/i);
  });

  it("reports a missing course as absent from the data, not from the region", () => {
    const withoutCourse = destinations.filter((d) => bridgeFor(d).course === undefined);
    expect(withoutCourse).toHaveLength(101);
    for (const d of withoutCourse) {
      const line = bridgeSummary(bridgeFor(d), d.build.length);
      expect(line).toContain("no course in this data names it");
      expect(line).not.toMatch(/no local course|none in the region|nothing available/i);
    }
    expect(PARTIAL_COURSE_LIST).toMatch(/not that none exists/i);
  });

  it("separates a named course from the skills it does not teach", () => {
    const withCourse = destinations.filter((d) => bridgeFor(d).course !== undefined);
    expect(withCourse).toHaveLength(9);
    for (const d of withCourse) {
      expect(bridgeFor(d).courseIsNotTheSkills).toBe(d.build.length > 0);
    }
    const withoutCourse = destinations.filter((d) => bridgeFor(d).course === undefined);
    for (const d of withoutCourse) {
      expect(bridgeFor(d).courseIsNotTheSkills).toBe(false);
    }
  });
});
