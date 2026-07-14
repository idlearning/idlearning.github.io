import { createFileRoute, Link } from "@tanstack/react-router";

import { Page, PageHeading } from "../components/Page";
import { useT } from "../lib/i18n";
import { getSortedNews, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";

export const Route = createFileRoute("/news/")({
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
  const t = useT();
  const news = getSortedNews();

  return (
    <Page>
      <PageHeading>{t.news.title}</PageHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {news.map((item) => (
          <Link
            key={item.slug}
            to="/news/$slug"
            params={{ slug: item.slug }}
            className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm flex flex-col h-full hover:shadow-md hover:border-idl-blue/40 transition-all"
          >
            <div className={item.wrapClass ?? NEWS_WRAP_DEFAULT}>
              <img alt={item.title} className={item.imgClass ?? NEWS_IMG_DEFAULT} src={item.img} />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h2 className="text-sm font-medium text-center mb-4 line-clamp-2 leading-tight text-text-main group-hover:text-idl-blue transition-colors">
                {item.title}
              </h2>
              <time className="text-xs text-text-muted block mt-auto text-center">{item.date}</time>
            </div>
          </Link>
        ))}
      </div>
    </Page>
  );
}
