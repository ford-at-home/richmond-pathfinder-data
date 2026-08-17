import { describe, expect, it } from "vitest";

import {
  bridgeFor,
  bridgeSummary,
  gateFor,
  PARTIAL_COURSE_LIST,
  ROUTED_SKILLS,
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
