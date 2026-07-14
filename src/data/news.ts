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
  /** Optional explicit URL slug; overrides the derived one when set. */
  slug?: string;
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

/**
 * Base slug from an item's date + ASCII-ified title. Korean-only titles reduce
 * to just the date (their characters aren't URL-friendly ASCII), so this alone
 * isn't unique — `newsSlug` below adds a deterministic hash for collisions.
 * Keep this algorithm in sync with `scripts/gen-sitemap.mjs`.
 */
function newsSlugBase(item: Pick<NewsInput, "date" | "title">): string {
  const date = String(item.date ?? "").slice(0, 10);
  const titlePart = String(item.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/-+$/, "");
  return titlePart ? `${date}-${titlePart}` : date;
}

/** Short deterministic FNV-1a hash (base36) — order-independent tie-breaker. */
function shortHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).slice(0, 5);
}

// Precompute which base slugs are shared so we can disambiguate ALL colliding
// items (not just the later ones) — keeping slugs independent of row order.
const baseCounts = new Map<string, number>();
for (const item of NEWS_INPUT) {
  const b = item.slug ?? newsSlugBase(item);
  baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1);
}

/**
 * Stable, row-order-independent URL slug. Honors an explicit `slug`, otherwise
 * date+title; when that base is shared by multiple items, every one of them
 * gets a title-hash suffix so no single item depends on being "first".
 */
export function newsSlug(item: Pick<NewsInput, "date" | "title" | "slug">): string {
  if (item.slug) return item.slug;
  const base = newsSlugBase(item);
  if ((baseCounts.get(base) ?? 0) > 1) return `${base}-${shortHash(item.title ?? "")}`;
  return base;
}

export const NEWS: NewsItem[] = NEWS_INPUT.map((item) => ({ ...item, slug: newsSlug(item) }));

/** Returns news sorted newest-first. */
export const getSortedNews = (): NewsItem[] =>
  [...NEWS].sort((a, b) => b.date.localeCompare(a.date));

/** Returns the `count` most recent news items, newest-first. */
export const getLatestNews = (count: number): NewsItem[] => getSortedNews().slice(0, count);

/** Finds a single news item by its slug. */
export const getNewsBySlug = (slug: string): NewsItem | undefined =>
  NEWS.find((item) => item.slug === slug);
