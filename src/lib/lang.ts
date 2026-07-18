// Language routing primitives.
//
// The visitor's language is carried by the URL, not by localStorage:
//
//   English (default)   /            /people        /news/<slug>
//   Korean              /ko          /ko/people     /ko/news/<slug>
//
// This matters for two reasons. Search engines can only index what is in the
// prerendered HTML, and a localStorage-only toggle meant the Korean site did
// not exist as far as a crawler was concerned. It also makes a Korean page
// linkable — you can send someone /ko/people and they land on Korean.
//
// Deliberately React-free so both the app and build scripts can share it.

export type Lang = "ko" | "en";

/** Every language the site publishes, in sitemap/hreflang order. */
export const LANGS = ["en", "ko"] as const;

/** The language served at the unprefixed root. */
export const DEFAULT_LANG: Lang = "en";

/** URL prefix for the non-default language. */
export const KO_PREFIX = "/ko";

/** BCP-47 tags for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = { en: "en", ko: "ko" };

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Lang, string> = { en: "en_US", ko: "ko_KR" };

/** The language a pathname belongs to. */
export function langFromPathname(pathname: string): Lang {
  return pathname === KO_PREFIX || pathname.startsWith(`${KO_PREFIX}/`) ? "ko" : DEFAULT_LANG;
}

/**
 * Drop the language prefix to get the "logical" path shared by both languages.
 * `/ko/people` and `/people` both reduce to `/people`.
 */
export function stripLangPrefix(pathname: string): string {
  if (langFromPathname(pathname) === DEFAULT_LANG) return pathname || "/";
  const rest = pathname.slice(KO_PREFIX.length);
  return rest === "" ? "/" : rest;
}

/**
 * The URL for a logical path in a given language. Safe to call with a path that
 * already carries a prefix — it is normalised first.
 */
export function localizedPath(path: string, lang: Lang): string {
  const logical = stripLangPrefix(path.startsWith("/") ? path : `/${path}`);
  if (lang === DEFAULT_LANG) return logical;
  return logical === "/" ? KO_PREFIX : `${KO_PREFIX}${logical}`;
}
