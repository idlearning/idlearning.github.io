import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { useT } from "../lib/i18n";
import { getNewsBySlug } from "../data/news";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNewsBySlug(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — IDL Lab` : "News — IDL Lab" },
      { property: "og:title", content: loaderData?.title ?? "News — IDL Lab" },
      { property: "og:url", content: `/news/${loaderData?.slug ?? ""}` },
    ],
  }),
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const item = Route.useLoaderData();
  const t = useT();

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
          {item.content && (
            <div
              className="text-sm text-text-main leading-relaxed whitespace-pre-line"
              style={{ wordBreak: "keep-all" }}
            >
              {item.content}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
