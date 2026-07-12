import { createFileRoute, Link } from "@tanstack/react-router";

import { getLatestNews, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";

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

function HomePage() {
  // Pull the 5 most recent items from the shared news source so Home and the
  // News page never drift out of sync.
  const latestNews = getLatestNews(5);

  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-idl-blue mb-8 leading-tight tracking-tight">
            Interaction Design for Learning Lab
          </h1>
          <div className="space-y-6 text-text-main leading-relaxed">
            <p className="text-lg font-medium">
              학습과학, 인간-컴퓨터 상호작용, 그리고 신기술을 융합하여 새롭고 상호작용적인
              학습경험을 디자인하는 것을 목표로 합니다. 학제간 연구 공간으로서 IDL Lab은 형식학습과
              비형식학습을 아우르는 다양한 교육환경에서 적용 가능한 학습경험 디자인을 탐구하고
              발전시키고자 합니다.
            </p>
            <p className="text-lg">
              We aim to design innovative and interactive learning experiences by integrating
              learning sciences, human-computer interaction, and emerging technologies. As an
              interdisciplinary research space, the IDL Lab explores and advances learning
              experience design that can be applied across various educational environments,
              encompassing both formal and informal learning settings.
            </p>
          </div>
        </div>
        {/* Featured Project */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-idl-blue mb-6">Research Projects</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-gray-100">
            <img
              alt="Featured Research Project Diagram"
              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-md mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWOSDZKY-tsuwZ6RnDefrVANCT3lcgkhriizYFSPWp9MXzto-y76vzqOvar75eSGHpVQG6mgSPosKaJ3J49xf_YOPByPE6DOe-QrUjJV7HfZX4XKHXEOdHxc1UfXOtLovMHGlsqpmF-wiSzQoP8PGVCm28vdRdJS-3ySt2tz-z3zRqyr7HuvhCoKmICUmoTnV8UOmdbT47EmYm56M1WHZHvUEHpvOt81XVO0pwUGFFgrsc6w7y5qon"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold leading-snug drop-shadow-md">
                생성형 AI 시대의 교사역량 강화
              </h3>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button
                aria-label="Slide 1"
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              />
              <button aria-label="Slide 2" className="w-6 h-2 rounded-full bg-white" />
              <button
                aria-label="Slide 3"
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              to="/projects"
              className="text-text-muted hover:text-text-main flex items-center transition-colors"
            >
              More Projects
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-bold text-idl-blue">News</h2>
          <Link
            to="/news"
            className="text-text-muted hover:text-text-main flex items-center transition-colors"
          >
            More News
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {latestNews.map((item) => (
            <article
              key={`${item.title}-${item.date}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className={item.wrapClass ?? NEWS_WRAP_DEFAULT}>
                <img
                  alt={item.title}
                  className={item.imgClass ?? NEWS_IMG_DEFAULT}
                  src={item.img}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-text-main mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 text-xs text-text-muted">{item.date}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
