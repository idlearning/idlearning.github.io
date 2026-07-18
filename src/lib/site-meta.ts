// Single source of truth for site-wide metadata and absolute-URL helpers.
//
// GitHub Pages serves this repo at the org root domain, so links can be
// root-absolute. Crawlers and social scrapers, however, need FULLY qualified
// URLs for `og:url`/`canonical`/`og:image` — relative values are effectively
// broken for them. Build those through `absoluteUrl()`.

import { LANGS, OG_LOCALE, localizedPath, type Lang } from "./lang";

export const SITE_URL = "https://idlearning.github.io";
export const SITE_NAME = "IDL Lab";
export const SITE_TITLE = "IDL Lab — Interaction Design for Learning";
export const SITE_DESCRIPTION =
  "IDL Lab designs innovative and interactive learning experiences by integrating learning sciences, HCI, and emerging technologies.";

/** Absolute URL for the shared social share image (1200×630). */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Turn a root-relative path (e.g. "/people") into an absolute URL. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).href;

/** Absolute URL of `path` as served in `lang`. */
export const localizedUrl = (path: string, lang: Lang): string =>
  absoluteUrl(localizedPath(path, lang));

type HeadOptions = {
  /** Logical path without a language prefix, e.g. "/people". */
  path: string;
  lang: Lang;
  title: string;
  description: string;
  /** Absolute image URL; falls back to the site-wide OG image. */
  image?: string;
  type?: "website" | "article" | "profile";
};

type MetaTag = Record<string, string>;

/**
 * Builds the per-page head for one language: title/description, Open Graph and
 * Twitter cards, the canonical URL, and — the important part — `hreflang`
 * alternates pointing at the same page in every other language. Without those,
 * the English and Korean versions of a page look like duplicate content and
 * search engines pick one arbitrarily.
 */
export function localizedHead({
  path,
  lang,
  title,
  description,
  image,
  type = "website",
}: HeadOptions): { meta: MetaTag[]; links: MetaTag[] } {
  const url = localizedUrl(path, lang);
  const ogImage = image ?? OG_IMAGE;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:locale", content: OG_LOCALE[lang] },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  for (const other of LANGS) {
    if (other !== lang) {
      meta.push({ property: "og:locale:alternate", content: OG_LOCALE[other] });
    }
  }

  const links: MetaTag[] = [{ rel: "canonical", href: url }];
  for (const other of LANGS) {
    links.push({ rel: "alternate", hrefLang: other, href: localizedUrl(path, other) });
  }
  // x-default is what a search engine serves when it cannot match the user's
  // language; point it at the English page, which is what "/" already serves.
  links.push({ rel: "alternate", hrefLang: "x-default", href: localizedUrl(path, "en") });

  return { meta, links };
}
