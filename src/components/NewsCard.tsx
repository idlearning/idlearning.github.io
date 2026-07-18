import { LocalLink } from "./LocalLink";
import { type NewsItem, NEWS_IMG_DEFAULT, NEWS_WRAP_DEFAULT } from "../data/news";

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
