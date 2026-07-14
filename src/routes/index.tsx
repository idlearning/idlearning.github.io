import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { getLatestNews, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";
import { PROJECTS, type Project } from "../data/projects";

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
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const INTRO_KO =
  "학습과학, 인간-컴퓨터 상호작용, 그리고 신기술을 융합하여 새롭고 상호작용적인 학습경험을 디자인하는 것을 목표로 합니다. 학제간 연구 공간으로서 IDL Lab은 형식학습과 비형식학습을 아우르는 다양한 교육환경에서 적용 가능한 학습경험 디자인을 탐구하고 발전시키고자 합니다.";
const INTRO_EN =
  "We aim to design innovative and interactive learning experiences by integrating learning sciences, human-computer interaction, and emerging technologies. As an interdisciplinary research space, the IDL Lab explores and advances learning experience design that can be applied across various educational environments, encompassing both formal and informal learning settings.";

function FeaturedCarousel() {
  const { lang } = usePreferences();
  const slides = PROJECTS.filter((project): project is Project & { img: string } =>
    Boolean(project.img),
  ).slice(0, 3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const active = slides[index];
  const title = lang === "ko" ? active.titleKo : active.titleEn;

  return (
    <div>
      <Link
        to="/projects"
        className="relative block rounded-2xl overflow-hidden shadow-lg group bg-gray-100"
      >
        <img
          alt={title}
          className="w-full h-56 object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          src={active.img}
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
  const latestNews = getLatestNews(5);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Latest News */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-idl-blue mb-6">{t.home.latestNews}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {latestNews.map((item) => (
            <Link
              key={item.slug}
              to="/news/$slug"
              params={{ slug: item.slug }}
              className="group bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-idl-blue/40 transition-all"
            >
              <div className={item.wrapClass ?? NEWS_WRAP_DEFAULT}>
                <img
                  alt={item.title}
                  className={item.imgClass ?? NEWS_IMG_DEFAULT}
                  src={item.img}
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-text-main mb-2 line-clamp-2 text-center group-hover:text-idl-blue transition-colors">
                  {item.title}
                </h3>
                <div className="mt-auto pt-3 text-xs text-text-muted text-center">{item.date}</div>
              </div>
            </Link>
          ))}
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
