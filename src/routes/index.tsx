import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { getLatestNews } from "../data/news";
import { PROJECTS, type Project } from "../data/projects";
import { NewsCard } from "../components/NewsCard";
import { SITE_URL, SITE_DESCRIPTION, absoluteUrl } from "../lib/site-meta";

// Structured data so search engines recognise the lab as an organisation.
const ORGANIZATION_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: "Interaction Design for Learning Lab",
  alternateName: "IDL Lab",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/favicon-idl.png`,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Ewha Womans University",
    url: "https://www.ewha.ac.kr",
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IDL Lab — Interaction Design for Learning" },
      {
        name: "description",
        content:
          "IDL Lab designs innovative and interactive learning experiences by integrating learning sciences, HCI, and emerging technologies.",
      },
      { property: "og:title", content: "IDL Lab — Interaction Design for Learning" },
      {
        property: "og:description",
        content:
          "Designing innovative and interactive learning experiences through learning sciences, HCI, and emerging technologies.",
      },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: HomePage,
});

const INTRO_KO =
  "학습과학, 인간-컴퓨터 상호작용, 그리고 신기술을 융합하여 새롭고 상호작용적인 학습경험을 디자인하는 것을 목표로 합니다. 학제간 연구 공간으로서 IDL Lab은 형식학습과 비형식학습을 아우르는 다양한 교육환경에서 적용 가능한 학습경험 디자인을 탐구하고 발전시키고자 합니다.";
const INTRO_EN =
  "We aim to design innovative and interactive learning experiences by integrating learning sciences, human-computer interaction, and emerging technologies. As an interdisciplinary research space, the IDL Lab explores and advances learning experience design that can be applied across various educational environments, encompassing both formal and informal learning settings.";

const AIDEAL_URL = "https://www.aideal.ewha.ac.kr";
const AIDEAL_DESC_KO =
  "AI-Inspired Dialogue for Ethics and Learning (AIDEAL)은 학습자가 복합적인 인공지능 윤리 쟁점을 주도적으로 탐구하고 도덕적 추론 역량을 기를 수 있는 대화형 학습 환경을 제안합니다.";
const AIDEAL_DESC_EN =
  "AI-Inspired Dialogue for Ethics and Learning (AIDEAL) proposes a conversational learning environment where learners can proactively explore complex AI-ethics issues and build their moral-reasoning skills.";

function FeaturedCarousel() {
  const { lang } = usePreferences();
  const slides = PROJECTS.filter((project): project is Project & { img: string } =>
    Boolean(project.img),
  ).slice(0, 3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  if (slides.length === 0) return null;
  const active = slides[index];
  const title = lang === "ko" ? active.titleKo : active.titleEn;

  return (
    // Pause auto-advance while hovered or keyboard-focused (WCAG 2.2.2).
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Link
        to="/projects"
        className="relative block rounded-2xl overflow-hidden shadow-lg group bg-gray-100"
      >
        <img
          alt={title}
          className="w-full h-56 object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          src={active.img}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-6">
          <h3 className="text-lg md:text-xl font-bold leading-snug text-white drop-shadow-md line-clamp-3">
            {title}
          </h3>
        </div>
      </Link>
      <div className="mt-3 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-gray-400" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const t = useT();
  const { lang } = usePreferences();
  const latestNews = getLatestNews(3);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ORGANIZATION_JSONLD }}
      />
      {/* Hero */}
      <section className="pt-10 pb-8 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-idl-blue mb-6 leading-tight tracking-tight">
            Interaction Design for
            <br />
            Learning Lab
          </h1>
          <p
            className="text-base text-text-main leading-relaxed text-justify"
            style={{ wordBreak: "keep-all" }}
          >
            {lang === "ko" ? INTRO_KO : INTRO_EN}
          </p>
        </div>
        {/* Featured Project carousel */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-idl-blue mb-4">{t.home.researchProjects}</h2>
          <FeaturedCarousel />
          <div className="mt-3 flex justify-end">
            <Link
              to="/projects"
              className="text-text-muted hover:text-idl-blue flex items-center gap-1 text-sm transition-colors"
            >
              {t.home.moreProjects}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News (3, at the original 5-up card width) + AIDEAL intro */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-idl-blue mb-6">{t.home.latestNews}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {latestNews.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
          {/* AIDEAL intro fills the remaining space; the whole panel is the link.
              lg:ml-5 adds to the grid's gap-5 so the gap to the news block is
              gap-10 — matching the hero's intro↔carousel spacing. */}
          <a
            href={AIDEAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden sm:col-span-2 lg:ml-5 flex flex-col justify-center rounded-xl border border-border bg-idl-blue/5 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Yellow gradient rises from the bottom on hover as the affordance. */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-yellow-200/80 via-yellow-100/40 to-transparent transition-[height] duration-500 ease-out group-hover:h-full" />
            <img
              src="/aideal_logo.svg"
              alt="AIDEAL"
              className="relative h-11 w-auto self-start mb-4"
            />
            <p
              className="relative text-sm text-text-main leading-relaxed mb-5"
              style={{ wordBreak: "keep-all" }}
            >
              {lang === "ko" ? AIDEAL_DESC_KO : AIDEAL_DESC_EN}
            </p>
            <span className="relative inline-flex items-center gap-1.5 self-start text-sm font-medium text-idl-blue">
              Discover AIDEAL
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
        {/* More News below the grid, aligned right — same style as More Projects */}
        <div className="mt-6 flex justify-end">
          <Link
            to="/news"
            className="text-text-muted hover:text-idl-blue flex items-center gap-1 text-sm transition-colors"
          >
            {t.home.moreNews}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
