import projectsData from "./generated/projects.json";

// Single source of truth for research projects.

export type Project = {
  id: string;
  titleKo: string;
  titleEn: string;
  period: string;
  funder: string;
  members: string;
  img?: string;
  description: string;
  /** IDs of related publications (see src/data/publications.ts). */
  relatedPubIds?: string[];
};

export const PROJECTS: Project[] = projectsData as Project[];
