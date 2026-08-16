import type { Occupation, TransitionEdge } from "./types";

/**
 * PLACEHOLDER transition-map structure.
 * No real occupations, distances, skills, or steps. Replace at migration with
 * the graph export (nodes + edges) that the Cytoscape.js view will consume.
 */

export const occupations: Occupation[] = [
  { id: "role-a", title: "Placeholder role A", cluster: "Cluster one", isPlaceholder: true },
  { id: "role-b", title: "Placeholder role B", cluster: "Cluster one", isPlaceholder: true },
  { id: "role-c", title: "Placeholder role C", cluster: "Cluster two", isPlaceholder: true },
  { id: "role-d", title: "Placeholder role D", cluster: "Cluster two", isPlaceholder: true },
  { id: "role-e", title: "Placeholder role E", cluster: "Cluster three", isPlaceholder: true },
];

export const transitions: TransitionEdge[] = [
  {
    fromId: "role-a",
    toId: "role-b",
    distance: null,
    band: "unknown",
    transferableSkills: ["Placeholder transferable skill", "Placeholder transferable skill"],
    skillGaps: ["Placeholder skill gap"],
    steps: ["Placeholder step one", "Placeholder step two"],
    isPlaceholder: true,
  },
  {
    fromId: "role-a",
    toId: "role-c",
    distance: null,
    band: "unknown",
    transferableSkills: ["Placeholder transferable skill"],
    skillGaps: ["Placeholder skill gap", "Placeholder skill gap"],
    steps: ["Placeholder step one"],
    isPlaceholder: true,
  },
  {
    fromId: "role-c",
    toId: "role-d",
    distance: null,
    band: "unknown",
    transferableSkills: ["Placeholder transferable skill"],
    skillGaps: ["Placeholder skill gap"],
    steps: ["Placeholder step one", "Placeholder step two", "Placeholder step three"],
    isPlaceholder: true,
  },
  {
    fromId: "role-d",
    toId: "role-e",
    distance: null,
    band: "unknown",
    transferableSkills: ["Placeholder transferable skill"],
    skillGaps: ["Placeholder skill gap"],
    steps: ["Placeholder step one"],
    isPlaceholder: true,
  },
];

/** Legend bands pair a color token with a shape/label so meaning is never color-only. */
export const transitionBands = [
  { band: "near", label: "Near transition", shape: "circle", note: "Placeholder band definition." },
  {
    band: "moderate",
    label: "Moderate transition",
    shape: "square",
    note: "Placeholder band definition.",
  },
  { band: "far", label: "Far transition", shape: "triangle", note: "Placeholder band definition." },
  {
    band: "unknown",
    label: "Not yet migrated",
    shape: "diamond",
    note: "Distance values arrive with the data migration.",
  },
] as const;

export function occupationTitle(id: string): string {
  return occupations.find((o) => o.id === id)?.title ?? id;
}
