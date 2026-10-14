// Generate dist/client/robots.txt after the static build.
//
// The production site allows everything and points at the sitemap. A dev build
// (VITE_NOINDEX=true, e.g. dev.idlearning.org) still allows crawling but lists
// no sitemap: crawlers must be able to fetch the pages to see their noindex meta
// tag — a `Disallow: /` would hide it and the URLs could still be indexed.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Keep in sync with SITE_URL in src/lib/site-meta.ts.
const SITE_URL = process.env.VITE_SITE_URL || "https://idlearning.org";
const noindex = process.env.VITE_NOINDEX === "true";

const body = noindex
  ? "User-agent: *\nAllow: /\n"
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

writeFileSync(resolve(root, "dist/client/robots.txt"), body);
console.log(`[robots] wrote dist/client/robots.txt (${noindex ? "noindex" : "indexable"})`);
