import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { getNewsBySlug } from "../data/news";
import { absoluteUrl, SITE_NAME } from "../lib/site-meta";

/** One-line summary for meta/og:description, from the body or the title. */
function newsDescription(item: ReturnType<typeof getNewsBySlug>): string {
  const body = item?.contentEn || item?.contentKo || "";
  const text = body.replace(/\s+/g, " ").trim();
  if (text) return text.length > 160 ? `${text.slice(0, 157)}…` : text;
  return item?.title ?? "";
}

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNewsBySlug(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — ${SITE_NAME}` : `News — ${SITE_NAME}`;
    const url = absoluteUrl(`/news/${loaderData?.slug ?? ""}`);
    const description = newsDescription(loaderData);
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: loaderData?.title ?? `News — ${SITE_NAME}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:title", content: loaderData?.title ?? `News — ${SITE_NAME}` },
      { name: "twitter:description", content: description },
    ];
    if (loaderData?.img) {
      // News images are already absolute (external CDN) URLs.
      meta.push({ property: "og:image", content: loaderData.img });
      meta.push({ name: "twitter:image", content: loaderData.img });
    }
    if (loaderData?.date) {
      meta.push({ property: "article:published_time", content: loaderData.date });
    }
    return { meta, links: [{ rel: "canonical", href: url }] };
  },
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const item = Route.useLoaderData();
  const t = useT();
  const { lang } = usePreferences();
  const content =
    lang === "ko" ? item.contentKo || item.contentEn : item.contentEn || item.contentKo;

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/news"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-idl-blue transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.common.backToList}
      </Link>

      <article className="rounded-xl border border-border bg-card overflow-hidden">
        <header className="px-6 pt-6 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold text-text-main leading-snug">{item.title}</h1>
          <time className="text-sm text-text-muted mt-2 block">{item.date}</time>
        </header>
        <div className="p-6">
          <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-6">
            <img alt={item.title} className="max-h-[28rem] w-auto object-contain" src={item.img} />
          </div>
          {content && (
            <div
              className="text-sm text-text-main leading-relaxed whitespace-pre-line"
              style={{ wordBreak: "keep-all" }}
            >
              {content}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
