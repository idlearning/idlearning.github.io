// Single source of truth for site-wide metadata and absolute-URL helpers.
//
// GitHub Pages serves this repo at the org root domain, so links can be
// root-absolute. Crawlers and social scrapers, however, need FULLY qualified
// URLs for `og:url`/`canonical`/`og:image` — relative values are effectively
// broken for them. Build those through `absoluteUrl()`.

export const SITE_URL = "https://idlearning.github.io";
export const SITE_NAME = "IDL Lab";
export const SITE_TITLE = "IDL Lab — Interaction Design for Learning";
export const SITE_DESCRIPTION =
  "IDL Lab designs innovative and interactive learning experiences by integrating learning sciences, HCI, and emerging technologies.";

/** Absolute URL for the shared social share image (1200×630). */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Turn a root-relative path (e.g. "/people") into an absolute URL. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).href;
