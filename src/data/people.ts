import peopleData from "./generated/people.json";

// Single source of truth for lab members.

export type PersonRole = "professor" | "doctoral" | "masters" | "alumni";

export type Person = {
  id: string;
  /** Korean name. Optional — international students may not have one. */
  nameKo?: string;
  nameEn: string;
  role: PersonRole;
  /** International student: display the English name only, no Korean form. */
  international?: boolean;
  email?: string;
  img?: string;
  /** Shown for current students. */
  interests?: string;
  /** Education & career lines. Shown for current students. */
  education?: string[];
  /** Master's thesis — shown for doctoral students. */
  thesis?: string;
  /** Master's thesis PDF URL — renders a link icon next to the title. */
  thesisUrl?: string;
  /** Current affiliation — shown for alumni. */
  affiliation?: string;
  /** Degree dissertation — shown for alumni. */
  dissertation?: string;
  /** Dissertation PDF URL — renders a link icon next to the title. */
  dissertationUrl?: string;
  /** Degree earned in the lab, for alumni. Renders a "Ph.D." / "M.A." tag. */
  alumniDegree?: "phd" | "ma";
  /** Graduation year, for alumni. Used to group the Alumni section by year. */
  gradYear?: number;
  /** Google Scholar profile URL. */
  scholar?: string;
  /** Personal homepage URL. Also used to link this person's name in publications. */
  homepage?: string;
  /**
   * Alternate spellings used in publication author lists — other romanizations
   * ("Pyeong Hwa Kim" for 김평화), maiden names, reversed name order, etc.
   * Case/spacing/hyphen variants are handled automatically and need no alias.
   */
  aliases?: string[];
};

export const PEOPLE: Person[] = peopleData as Person[];

export const getPeopleByRole = (role: PersonRole): Person[] =>
  PEOPLE.filter((p) => p.role === role);

/**
 * Collapses a display name to a comparison key so author lists match People
 * regardless of surface form: "Sung-Eun Kim" / "Sungeun Kim" / "SUNG EUN KIM"
 * all key to "sungeunkim", and "Hyo‐Jeong So" written with a U+2010 hyphen
 * matches the ASCII one. Parentheticals ("Wang Yue (Iris Wang)") are dropped.
 * Korean names are unaffected apart from NFC normalization.
 */
const nameKey = (name: string): string =>
  name
    .normalize("NFC")
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]/gu, "");

/**
 * Every spelling that should resolve to a person: English name, Korean name,
 * and any explicit aliases. When two entries share a name (a student who also
 * has an alumni record, e.g. 김은영), the one with a homepage wins so the
 * publication link still works; otherwise the first entry — current members
 * precede alumni in the sheet — is kept.
 */
const NAME_INDEX: Map<string, Person> = (() => {
  const index = new Map<string, Person>();
  for (const person of PEOPLE) {
    const names = [person.nameEn, person.nameKo, ...(person.aliases ?? [])];
    for (const name of names) {
      if (!name) continue;
      const key = nameKey(name);
      if (!key) continue;
      const existing = index.get(key);
      if (!existing || (!existing.homepage && person.homepage)) index.set(key, person);
    }
  }
  return index;
})();

/**
 * Finds a person by any of their names — English, Korean, or an alias.
 * Used to link and cross-reference publication authors.
 */
export const getPersonByName = (name: string): Person | undefined => NAME_INDEX.get(nameKey(name));
