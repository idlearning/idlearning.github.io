// UI chrome translations (navigation, section titles, field labels, buttons).
// Body content that only exists in one language (e.g. Korean news titles,
// Korean project descriptions) is handled per-item in the data files.
import { useLang, type Lang } from "./preferences";

type Dict = {
  nav: { home: string; people: string; projects: string; publications: string; news: string };
  common: { more: string; readMore: string; showLess: string; backToList: string };
  home: {
    researchProjects: string;
    moreProjects: string;
    latestNews: string;
    moreNews: string;
  };
  people: {
    professor: string;
    students: string;
    doctoral: string;
    masters: string;
    alumni: string;
    interests: string;
    education: string;
    thesis: string;
    affiliation: string;
    dissertation: string;
  };
  projects: {
    title: string;
    koreanName: string;
    englishName: string;
    period: string;
    funder: string;
    members: string;
    description: string;
    relatedPublications: string;
  };
  publications: {
    title: string;
    all: string;
    journal: string;
    conference: string;
    book: string;
  };
  news: { title: string; latest: string };
  footer: { rights: string };
};

const DICTS: Record<Lang, Dict> = {
  ko: {
    nav: {
      home: "Home",
      people: "People",
      projects: "Projects",
      publications: "Publications",
      news: "News",
    },
    common: { more: "더보기", readMore: "더보기", showLess: "접기", backToList: "목록으로" },
    home: {
      researchProjects: "Research Projects",
      moreProjects: "More Projects",
      latestNews: "Latest News",
      moreNews: "More News",
    },
    people: {
      professor: "Professor",
      students: "Students",
      doctoral: "박사과정",
      masters: "석사과정",
      alumni: "졸업생",
      interests: "관심분야",
      education: "교육 및 경력",
      thesis: "석사학위논문",
      affiliation: "소속",
      dissertation: "학위논문",
    },
    projects: {
      title: "Projects",
      koreanName: "한국어명",
      englishName: "영문명",
      period: "연구 기간",
      funder: "지원기관",
      members: "참여연구원",
      description: "프로젝트 설명",
      relatedPublications: "연관 논문",
    },
    publications: {
      title: "Publications",
      all: "전체",
      journal: "Journal",
      conference: "Conference",
      book: "Book",
    },
    news: { title: "News", latest: "Latest News" },
    footer: { rights: "All rights reserved." },
  },
  en: {
    nav: {
      home: "Home",
      people: "People",
      projects: "Projects",
      publications: "Publications",
      news: "News",
    },
    common: {
      more: "More",
      readMore: "Read more",
      showLess: "Show less",
      backToList: "Back to list",
    },
    home: {
      researchProjects: "Research Projects",
      moreProjects: "More Projects",
      latestNews: "Latest News",
      moreNews: "More News",
    },
    people: {
      professor: "Professor",
      students: "Students",
      doctoral: "Doctoral Students",
      masters: "Master's Students",
      alumni: "Alumni",
      interests: "Interests",
      education: "Education & Career",
      thesis: "Master's Thesis",
      affiliation: "Affiliation",
      dissertation: "Dissertation",
    },
    projects: {
      title: "Projects",
      koreanName: "Korean Title",
      englishName: "English Title",
      period: "Period",
      funder: "Funder",
      members: "Members",
      description: "Project Description",
      relatedPublications: "Related Publications",
    },
    publications: {
      title: "Publications",
      all: "All",
      journal: "Journal",
      conference: "Conference",
      book: "Book",
    },
    news: { title: "News", latest: "Latest News" },
    footer: { rights: "All rights reserved." },
  },
};

/** Returns the translation dictionary for the current language. */
export function useT(): Dict {
  return DICTS[useLang()];
}

/** Picks the localized value from a `{ ko, en }` pair, falling back to the other. */
export function pick(lang: Lang, value: { ko?: string; en?: string }): string {
  return (lang === "ko" ? value.ko || value.en : value.en || value.ko) ?? "";
}
