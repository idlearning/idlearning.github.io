import { ArrowLeft } from "lucide-react";

import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import type { NewsItem } from "../data/news";
import { LocalLink } from "../components/LocalLink";
import { Markdown } from "../components/Markdown";
import { localizedUrl, SITE_NAME, SITE_URL } from "../lib/site-meta";
import { newsDescription } from "../lib/news-head";
import type { Lang } from "../lib/lang";

/** schema.org NewsArticle so the item can surface as a news result, not just a page. */
function newsJsonLd(item: NewsItem, lang: Lang): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: newsDescription(item),
    datePublished: item.date,
    inLanguage: lang,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": localizedUrl(`/news/${item.slug}`, lang),
    },
    ...(item.img ? { image: item.img } : {}),
    publisher: {
      "@type": "ResearchOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-idl.png` },
    },
  });
}

export function NewsDetailPage({ item }: { item: NewsItem }) {
  const t = useT();
  const { lang } = usePreferences();
  const content =
    lang === "ko" ? item.contentKo || item.contentEn : item.contentEn || item.contentKo;

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: newsJsonLd(item, lang) }}
      />
      <LocalLink
        to="/news"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-idl-blue transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.common.backToList}
      </LocalLink>

      <article className="rounded-xl border border-border bg-card overflow-hidden">
        <header className="px-6 pt-6 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold text-text-main leading-snug">{item.title}</h1>
          <time dateTime={item.date} className="text-sm text-text-muted mt-2 block">
            {item.date}
          </time>
        </header>
        <div className="p-6">
          {item.img && (
            <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-6">
              <img
                alt={item.title}
                className="max-h-[28rem] w-auto object-contain"
                src={item.img}
                onError={(e) => {
                  e.currentTarget.closest("div")?.style.setProperty("display", "none");
                }}
              />
            </div>
          )}
          {content && <Markdown content={content} />}
        </div>
      </article>
    </main>
  );
}
