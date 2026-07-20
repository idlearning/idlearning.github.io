import { useState } from "react";

import { Page, PageHeading } from "../components/Page";
import { NewsRow } from "../components/NewsCard";
import { useT } from "../lib/i18n";
import { getSortedNews } from "../data/news";

/** News items shown per page in the index list. */
const PAGE_SIZE = 5;

export function NewsIndexPage() {
  const t = useT();
  const news = getSortedNews();

  const pageCount = Math.max(1, Math.ceil(news.length / PAGE_SIZE));
  const [page, setPage] = useState(1);
  // Guard against a stale page number if the list ever shrinks.
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = news.slice(start, start + PAGE_SIZE);

  const goTo = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Page>
      <PageHeading>{t.news.title}</PageHeading>
      <div className="flex flex-col">
        {pageItems.map((item) => (
          <NewsRow key={item.slug} item={item} />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            className="px-3 py-1.5 rounded-md border border-border text-sm text-text-muted hover:border-idl-blue/40 hover:text-idl-blue disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goTo(n)}
              aria-current={n === current ? "page" : undefined}
              className={
                n === current
                  ? "min-w-9 px-3 py-1.5 rounded-md border border-idl-blue bg-idl-blue text-white text-sm font-medium"
                  : "min-w-9 px-3 py-1.5 rounded-md border border-border text-sm text-text-muted hover:border-idl-blue/40 hover:text-idl-blue transition-colors"
              }
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === pageCount}
            className="px-3 py-1.5 rounded-md border border-border text-sm text-text-muted hover:border-idl-blue/40 hover:text-idl-blue disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            ›
          </button>
        </nav>
      )}
    </Page>
  );
}
