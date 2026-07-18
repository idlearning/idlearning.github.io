import { Page, PageHeading } from "../components/Page";
import { NewsCard, NEWS_GRID } from "../components/NewsCard";
import { useT } from "../lib/i18n";
import { getSortedNews } from "../data/news";

export function NewsIndexPage() {
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
