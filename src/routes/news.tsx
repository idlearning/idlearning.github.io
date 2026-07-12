import { createFileRoute } from "@tanstack/react-router";

import { getSortedNews, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — IDL Lab" },
      {
        name: "description",
        content:
          "Latest news, awards, and announcements from the Interaction Design for Learning Lab.",
      },
      { property: "og:title", content: "News — IDL Lab" },
      {
        property: "og:description",
        content:
          "Latest news, awards, and announcements from the Interaction Design for Learning Lab.",
      },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const news = getSortedNews();

  return (
    <main className="pb-20 pt-12 px-8 max-w-7xl mx-auto">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-idl-blue mb-8">News</h1>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {news.map((item) => (
          <article
            key={`${item.title}-${item.date}`}
            className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className={item.wrapClass ?? NEWS_WRAP_DEFAULT}>
              <img alt={item.title} className={item.imgClass ?? NEWS_IMG_DEFAULT} src={item.img} />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h2 className="text-sm font-bold text-center mb-4 line-clamp-2 leading-tight">
                {item.title}
              </h2>
              <time className="text-xs text-gray-400 block mt-auto">{item.date}</time>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
