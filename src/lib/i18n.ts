// UI chrome translations (navigation, section titles, field labels, buttons).
// Body content that only exists in one language (e.g. Korean news titles,
// Korean project descriptions) is handled per-item in the data files.
import { useLang } from "./preferences";
import type { Lang } from "./lang";

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
    dissertationMa: string;
    profile: string;
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
  notFound: { title: string; body: string; home: string };
  error: { title: string; body: string; retry: string; home: string };
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
      dissertationMa: "학위논문",
      profile: "프로필",
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
    notFound: {
      title: "페이지를 찾을 수 없습니다",
      body: "요청하신 페이지가 없거나 주소가 변경되었습니다.",
      home: "홈으로",
    },
    error: {
      title: "페이지를 불러오지 못했습니다",
      body: "일시적인 문제가 발생했습니다. 새로고침하거나 홈으로 이동해 주세요.",
      retry: "다시 시도",
      home: "홈으로",
    },
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
      dissertationMa: "Thesis",
      profile: "Profile",
    },
    projects: {
      title: "Projects",
      koreanName: "Korean Title",
      englishName: "English Title",
      period: "Research Period",
      funder: "Funder",
      members: "Researchers",
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
    notFound: {
      title: "Page not found",
      body: "The page you're looking for doesn't exist or has been moved.",
      home: "Go home",
    },
    error: {
      title: "This page didn't load",
      body: "Something went wrong on our end. You can try refreshing or head back home.",
      retry: "Try again",
      home: "Go home",
    },
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
