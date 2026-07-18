// Head metadata for a news article, shared by the English and Korean routes so
// their tags (and the hreflang pair between them) cannot drift apart.
import type { NewsItem } from "../data/news";
import { stripMarkdown } from "./markdown";
import { localizedHead, SITE_NAME } from "./site-meta";
import type { Lang } from "./lang";

/** One-line summary for meta/og:description, from the body or the title. */
export function newsDescription(item: NewsItem | undefined): string {
  const body = item?.contentEn || item?.contentKo || "";
  const text = stripMarkdown(body);
  if (text) return text.length > 160 ? `${text.slice(0, 157)}…` : text;
  return item?.title ?? "";
}

export function newsHead(item: NewsItem | undefined, lang: Lang) {
  if (!item) {
    return localizedHead({
      path: "/news",
      lang,
      title: lang === "ko" ? `소식 — ${SITE_NAME}` : `News — ${SITE_NAME}`,
      description: "",
    });
  }
  const head = localizedHead({
    path: `/news/${item.slug}`,
    lang,
    title: `${item.title} — ${SITE_NAME}`,
    description: newsDescription(item),
    // News images are already absolute (external CDN) URLs.
    image: item.img || undefined,
    type: "article",
  });
  if (item.date) {
    head.meta.push({ property: "article:published_time", content: item.date });
  }
  return head;
}
