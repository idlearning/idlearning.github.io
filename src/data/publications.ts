import publicationsData from "./generated/publications.json";
import { getPersonByName, type Person } from "./people";

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

/**
 * Publications `person` authored, newest first. Author strings are resolved
 * through the People name index, so every romanization and alias of the name
 * matches — not just the spelling used on the People page.
 */
export function getPublicationsByPerson(person: Person): Publication[] {
  return PUBLICATIONS.filter((pub) =>
    pub.authors.some((author) => getPersonByName(author)?.id === person.id),
  ).sort((a, b) => b.year - a.year || b.id.localeCompare(a.id));
}

/**
 * Publications grouped by year (desc), then by type in `PUB_TYPE_ORDER`.
 * Within a year+type, items are sorted by id descending so the newest entry
 * (highest `YYYY-<t>-NNN` sequence, e.g. a fresh form submission) is on top —
 * independent of the sheet's row order.
 */
export function getPublicationsByYear(filter: PubType | "all") {
  const filtered = filter === "all" ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.type === filter);
  const years = [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    types: PUB_TYPE_ORDER.map((type) => ({
      type,
      items: filtered
        .filter((p) => p.year === year && p.type === type)
        .sort((a, b) => b.id.localeCompare(a.id)),
    })).filter((group) => group.items.length > 0),
  }));
}
