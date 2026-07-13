import publicationsData from "./generated/publications.json";

// Single source of truth for publications.

export type PubType = "journal" | "conference" | "book";

export type PubBadge = {
  label: string;
  /** "award" badges are highlighted; "index" badges (SSCI, SCOPUS, ...) are neutral. */
  kind: "award" | "index";
};

export type Publication = {
  id: string;
  title: string;
  /** Author display names, in order. Matched to People by English name for linking. */
  authors: string[];
  venue: string;
  year: number;
  type: PubType;
  badges?: PubBadge[];
  doi?: string;
  /** PDF URL. */
  pdf?: string;
  /** ACM Digital Library URL. */
  acmdl?: string;
  /** External website / project page URL. */
  website?: string;
};

export const PUBLICATIONS: Publication[] = publicationsData as Publication[];

export const PUB_TYPE_ORDER: PubType[] = ["journal", "conference", "book"];

export const getPublicationById = (id: string): Publication | undefined =>
  PUBLICATIONS.find((p) => p.id === id);

/** Publications grouped by year (desc), then by type in `PUB_TYPE_ORDER`. */
export function getPublicationsByYear(filter: PubType | "all") {
  const filtered = filter === "all" ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.type === filter);
  const years = [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    types: PUB_TYPE_ORDER.map((type) => ({
      type,
      items: filtered.filter((p) => p.year === year && p.type === type),
    })).filter((group) => group.items.length > 0),
  }));
}
