import { createFileRoute } from "@tanstack/react-router";

import { Page, PageHeading } from "../components/Page";
import { NewsCard, NEWS_GRID } from "../components/NewsCard";
import { useT } from "../lib/i18n";
import { getSortedNews } from "../data/news";
import { absoluteUrl } from "../lib/site-meta";

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
      { property: "og:url", content: absoluteUrl("/news") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/news") }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const t = useT();
  const news = getSortedNews();

  return (
    <Page>
      <PageHeading>{t.news.title}</PageHeading>
      <div className={NEWS_GRID}>
        {news.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
    </Page>
  );
}
