// Hand-maintained profile detail for lab members, supplementing the sheet.
//
// This is deliberately NOT in src/data/generated/people.json: that file is
// overwritten by `scripts/sync-sheets.mjs` on every sheet sync, so anything
// written there by hand would be lost. Keyed by `Person.id`.
//
// Members listed here get their affiliation shown on the People page and a
// schema.org `Person` node emitted for them.

import type { Lang } from "../lib/lang";

export type PersonProfile = {
  /** Academic title, e.g. "Professor" / "교수". */
  jobTitle: Record<Lang, string>;
  /** Department the person belongs to, spelled out per language. */
  department: Record<Lang, string>;
  /** Institution. */
  institution: Record<Lang, string>;
  /**
   * Research areas, emitted as schema.org `knowsAbout` — how a search engine
   * associates the person with a topic rather than just a name.
   */
  researchAreas: Record<Lang, string[]>;
  /**
   * Profile URLs elsewhere on the web. Emitted as schema.org `sameAs`, the
   * strongest signal available for tying this page to a real-world person —
   * add ORCID / ResearchGate / LinkedIn / DBLP here as they become available.
   */
  sameAs?: string[];
};

export const PERSON_PROFILES: Record<string, PersonProfile> = {
  "hyo-jeong-so": {
    jobTitle: { en: "Professor", ko: "교수" },
    department: {
      en: "Department of Educational Technology",
      ko: "교육공학과",
    },
    institution: { en: "Ewha Womans University", ko: "이화여자대학교" },
    researchAreas: {
      en: [
        "Learning Sciences",
        "Human-Computer Interaction",
        "Learning Experience Design",
        "AI in Education",
        "AI Ethics Education",
      ],
      ko: [
        "학습과학",
        "인간-컴퓨터 상호작용(HCI)",
        "학습경험 디자인",
        "교육에서의 인공지능",
        "인공지능 윤리교육",
      ],
    },
    sameAs: [
      "https://scholar.google.com/citations?user=dI0biU8AAAAJ",
      "https://www.ewha.ac.kr/ewha/professor/info.do?mode=view&pId=aUu8X%2F6dSe7uJ%2F5ElYusAA%3D%3D",
    ],
  },
};

export const getProfile = (id: string): PersonProfile | undefined => PERSON_PROFILES[id];
