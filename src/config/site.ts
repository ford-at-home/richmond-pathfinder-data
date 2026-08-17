/**
 * Single source of truth for site identity and navigation.
 * Change the project name here and it updates everywhere.
 */

export const siteConfig = {
  name: "Richmond Workforce Transition",
  shortName: "RWT",
  tagline:
    "Explore Greater Richmond jobs where workers already use AI and discover nearby occupations that pay more with less AI exposure.",
  region: "Richmond, VA metropolitan statistical area (BLS 40060)",
  /** Remaining gaps (employer/worker demos, capacity calculator, locality map) stay labelled. */
  isScaffold: false,
} as const;

export type NavItem = {
  label: string;
  to: string;
  description: string;
};

export const primaryNav: NavItem[] = [
  {
    label: "Find a job",
    to: "/",
    description:
      "See whether AI is already in a job, and which nearby jobs pay more and use it less.",
  },
  {
    label: "Evidence",
    to: "/research",
    description: "Reports, the published pair table, geography, and method.",
  },
  {
    label: "Feedback",
    to: "/feedback",
    description: "Send a correction, question, or comment about this project.",
  },
];
