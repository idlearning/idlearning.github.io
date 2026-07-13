import newsData from "./generated/news.json";

// Single source of truth for lab news.
//
// The News page renders this whole list; the Home page pulls the latest few
// items via `getLatestNews()`. Keep dates in ISO `YYYY-MM-DD` format so they
// sort correctly as strings.

type NewsInput = {
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  img: string;
  /** Optional Korean body shown on the news detail page. */
  contentKo?: string;
  /** Optional English body shown on the news detail page. */
  contentEn?: string;
  /** Optional Tailwind classes for the image wrapper (falls back to a default). */
  wrapClass?: string;
  /** Optional Tailwind classes for the <img> (falls back to a default). */
  imgClass?: string;
};

export type NewsItem = NewsInput & {
  /** Stable URL slug used by the detail route `/news/$slug`. */
  slug: string;
};

export const NEWS_WRAP_DEFAULT =
  "h-40 overflow-hidden bg-gray-100 flex items-center justify-center";
export const NEWS_IMG_DEFAULT = "w-full h-full object-cover";

const NEWS_INPUT: NewsInput[] = newsData as NewsInput[];

// Attach a stable, unique slug to each item (date, with a suffix when a date
// repeats). Slugs stay stable as long as the authored order above is stable.
const slugCounts: Record<string, number> = {};
export const NEWS: NewsItem[] = NEWS_INPUT.map((item) => {
  const n = (slugCounts[item.date] = (slugCounts[item.date] ?? 0) + 1);
  return { ...item, slug: n > 1 ? `${item.date}-${n}` : item.date };
});

/** Returns news sorted newest-first. */
export const getSortedNews = (): NewsItem[] =>
  [...NEWS].sort((a, b) => b.date.localeCompare(a.date));

/** Returns the `count` most recent news items, newest-first. */
export const getLatestNews = (count: number): NewsItem[] => getSortedNews().slice(0, count);

/** Finds a single news item by its slug. */
export const getNewsBySlug = (slug: string): NewsItem | undefined =>
  NEWS.find((item) => item.slug === slug);
