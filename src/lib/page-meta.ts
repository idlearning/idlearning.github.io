// Per-page <title>/description copy, in both languages.
//
// Kept out of the route files so the English and Korean routes for a page read
// their SEO copy from one place and cannot drift apart. The Korean strings are
// what makes the site findable in Korean-language search — the previous
// localStorage-only toggle meant crawlers only ever saw the English text.

import { localizedHead } from "./site-meta";
import type { Lang } from "./lang";

type Copy = { title: string; description: string };

/** Keyed by logical path (no language prefix). */
export const PAGE_META: Record<string, Record<Lang, Copy>> = {
  "/": {
    en: {
      title: "IDL Lab — Interaction Design for Learning",
      description:
        "IDL Lab designs innovative and interactive learning experiences by integrating learning sciences, HCI, and emerging technologies.",
    },
    ko: {
      title: "Interaction Design for Learning Lab — 이화여자대학교 교육공학과",
      description:
        "Interaction Design for Learning Lab(IDL Lab)은 학습과학, 인간-컴퓨터 상호작용(HCI), 신기술을 융합하여 새롭고 상호작용적인 학습경험을 디자인하는 이화여자대학교 교육공학과 소효정 교수 연구실입니다.",
    },
  },
  "/people": {
    en: {
      title: "People — IDL Lab",
      description: "Meet the professor and students of the Interaction Design for Learning Lab.",
    },
    ko: {
      title: "구성원 — IDL Lab",
      description: "IDL Lab의 지도교수, 박사·석사과정 학생, 그리고 졸업생을 소개합니다.",
    },
  },
  "/projects": {
    en: {
      title: "Projects — IDL Lab",
      description: "Research projects of the Interaction Design for Learning Lab.",
    },
    ko: {
      title: "연구 프로젝트 — IDL Lab",
      description: "IDL Lab이 수행 중이거나 완료한 연구 프로젝트 목록입니다.",
    },
  },
  "/publications": {
    en: {
      title: "Publications — IDL Lab",
      description:
        "Journal and conference publications from the Interaction Design for Learning Lab.",
    },
    ko: {
      title: "연구 성과 — IDL Lab",
      description: "IDL Lab의 학술지 논문, 학술대회 발표, 저서 목록입니다.",
    },
  },
  "/news": {
    en: {
      title: "News — IDL Lab",
      description:
        "Latest news, awards, and announcements from the Interaction Design for Learning Lab.",
    },
    ko: {
      title: "소식 — IDL Lab",
      description: "IDL Lab의 최신 소식, 수상 내역, 공지사항을 확인하세요.",
    },
  },
};

/** Head (meta + links, including hreflang alternates) for a fixed page. */
export function pageHead(path: keyof typeof PAGE_META | string, lang: Lang) {
  const copy = PAGE_META[path]?.[lang] ?? PAGE_META["/"][lang];
  return localizedHead({ path, lang, ...copy });
}
