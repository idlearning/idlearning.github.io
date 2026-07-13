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
};

export const PEOPLE: Person[] = peopleData as Person[];

export const getPeopleByRole = (role: PersonRole): Person[] =>
  PEOPLE.filter((p) => p.role === role);

/** Finds a person by English display name (used to link publication authors). */
export const getPersonByEnName = (nameEn: string): Person | undefined =>
  PEOPLE.find((p) => p.nameEn === nameEn);
