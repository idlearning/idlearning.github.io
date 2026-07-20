import { LocalLink } from "./LocalLink";
import { type NewsItem, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";
import { useLang } from "../lib/preferences";
import { stripMarkdown } from "../lib/markdown";

/**
 * One news preview card, shared by the home "Latest News" strip and the News
 * index grid so both stay visually identical. Pair with the shared grid classes
 * in `NEWS_GRID` below.
 */
export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <LocalLink
      to="/news/$slug"
      params={{ slug: item.slug }}
      className="group bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md hover:border-idl-blue/40 transition-all"
    >
      <div className={item.wrapClass ?? NEWS_WRAP_DEFAULT}>
        <img
          alt={item.title}
          className={item.imgClass ?? NEWS_IMG_DEFAULT}
          src={item.img}
          loading="lazy"
          onError={(e) => {
            // Degrade gracefully if the external CDN image is unavailable.
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-text-main mb-2 line-clamp-2 leading-tight text-center group-hover:text-idl-blue transition-colors">
          {item.title}
        </h3>
        <time className="mt-auto pt-3 text-xs text-text-muted text-center block">{item.date}</time>
      </div>
    </LocalLink>
  );
}

/** Shared responsive grid for news card lists (home + news index). */
export const NEWS_GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

/**
 * Horizontal news row used on the News index page: image on the left, then the
 * title, a short body excerpt, and the date. Borderless like the Projects list —
 * a thin rule separates rows, and only the title tints on hover. The home strip
 * keeps the vertical `NewsCard` above; only the index uses this wider layout.
 */
export function NewsRow({ item }: { item: NewsItem }) {
  const lang = useLang();
  const body = lang === "ko" ? item.contentKo || item.contentEn : item.contentEn || item.contentKo;
  const excerpt = body ? stripMarkdown(body) : "";

  return (
    <LocalLink
      to="/news/$slug"
      params={{ slug: item.slug }}
      className="group flex items-start gap-5 sm:gap-6 border-b border-border py-6 first:pt-0 last:border-b-0"
    >
      <div className="w-28 sm:w-48 flex-shrink-0">
        <img
          alt={item.title}
          className="w-full aspect-[3/2] rounded-md object-cover bg-gray-100"
          src={item.img}
          loading="lazy"
          onError={(e) => {
            // Degrade gracefully if the external CDN image is unavailable.
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-text-main line-clamp-2 leading-snug group-hover:text-idl-blue transition-colors">
          {item.title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-text-muted line-clamp-2 leading-relaxed">{excerpt}</p>
        )}
        <time className="mt-3 text-xs text-text-muted block">{item.date}</time>
      </div>
    </LocalLink>
  );
}
