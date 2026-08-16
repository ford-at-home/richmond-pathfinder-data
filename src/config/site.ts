/**
 * Single source of truth for site identity and navigation.
 * Change the project name here and it updates everywhere.
 */

export const siteConfig = {
  name: "Richmond Workforce Transition",
  shortName: "RWT",
  tagline: "Understanding how workers move between occupations in the Richmond, Virginia region.",
  region: "Richmond, Virginia region",
  /** Placeholder scaffold — replace during content migration. */
  isScaffold: true,
} as const;

export type NavItem = {
  label: string;
  to: string;
  description: string;
};

export const primaryNav: NavItem[] = [
  {
    label: "Overview",
    to: "/",
    description: "What this site helps you understand.",
  },
  {
    label: "Transition Map",
    to: "/transition-map",
    description: "How a worker may move from one occupation to an adjacent occupation.",
  },
  {
    label: "Transition Capacity",
    to: "/transition-capacity",
    description: "Whether the region can support those transitions at scale.",
  },
  {
    label: "Richmond Region Data",
    to: "/richmond-region",
    description: "Regional labor-market conditions, geography, and constraints.",
  },
  {
    label: "Research",
    to: "/research",
    description: "Editorial research pages on workforce transition.",
  },
  {
    label: "Methodology",
    to: "/methodology",
    description: "Definitions, limitations, and how sources are handled.",
  },
];
