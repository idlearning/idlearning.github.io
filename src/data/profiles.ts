// Hand-maintained profile detail for the lab members who get their own page.
//
// This is deliberately NOT in src/data/generated/people.json: that file is
// overwritten by `scripts/sync-sheets.mjs` on every sheet sync, so anything
// written there by hand would be lost. Keyed by `Person.id`.
//
// Only people listed here get a /people/<id> detail page — the route 404s for
// everyone else, so adding an entry is what publishes a page.

import type { Lang } from "../lib/lang";

export type PersonProfile = {
  /** Academic title, e.g. "Professor" / "교수". */
  jobTitle: Record<Lang, string>;
  /** Department the person belongs to, spelled out per language. */
  department: Record<Lang, string>;
  /** Institution. */
  institution: Record<Lang, string>;
  /**
   * Free-form biography, rendered as paragraphs. Left empty until the lab
   * supplies the copy — the page simply omits the section while it is blank.
   */
  bio: Record<Lang, string[]>;
  /**
   * Research areas. Also emitted as schema.org `knowsAbout`, which is how a
   * search engine associates the person with a topic rather than just a name.
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
    // TODO(lab): supply the professor's biography. Each string is one paragraph.
    bio: { en: [], ko: [] },
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
