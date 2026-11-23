// Generate dist/client/sitemap.xml after the static build.
//
// Enumerates the fixed routes plus every prerendered /news/<slug> detail page.
// News slugs are assigned once, by scripts/sync-sheets.mjs, and stored in
// news.json — the same values the site's routes use.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Keep in sync with SITE_URL in src/lib/site-meta.ts.
const SITE_URL = process.env.VITE_SITE_URL || "https://idlearning.org";
const outPath = resolve(root, "dist/client/sitemap.xml");

const staticPaths = ["/", "/people", "/projects", "/publications", "/news"];

let newsPaths = [];
// Per-URL last-modified dates, so a news item reports the day it was published
// rather than the day the site happened to be rebuilt.
const lastmodByPath = new Map();
try {
  const news = JSON.parse(readFileSync(resolve(root, "src/data/generated/news.json"), "utf8"));
  for (const { slug, date } of news) {
    if (!slug) continue;
    const path = `/news/${slug}`;
    newsPaths.push(path);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) lastmodByPath.set(path, date);
  }
} catch (err) {
  console.warn(
    `[sitemap] could not read news.json (${err.message}) — sitemap will omit news pages.`,
  );
}

// Keep in sync with `localizedPath` in src/lib/lang.ts.
const KO_PREFIX = "/ko";
const localizedPath = (path, lang) =>
  lang === "en" ? path : path === "/" ? KO_PREFIX : `${KO_PREFIX}${path}`;

const today = new Date().toISOString().slice(0, 10);

// Every page exists in both languages. Each <url> lists the whole language set
// as xhtml:link alternates, which is what tells a search engine the English and
// Korean pages are translations rather than duplicate content.
const allPaths = [...staticPaths, ...newsPaths];

const urls = allPaths
  .flatMap((path) =>
    ["en", "ko"].map((lang) => {
      const alternates = ["en", "ko"]
        .map(
          (other) =>
            `    <xhtml:link rel="alternate" hreflang="${other}" href="${SITE_URL}${localizedPath(path, other)}"/>`,
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizedPath(path, "en")}"/>`,
        )
        .join("\n");
      const lastmod = lastmodByPath.get(path) ?? today;
      return `  <url>\n    <loc>${SITE_URL}${localizedPath(path, lang)}</loc>\n${alternates}\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    }),
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;

if (!existsSync(dirname(outPath))) {
  console.warn(`[sitemap] ${dirname(outPath)} does not exist — run after build. Skipping.`);
} else {
  writeFileSync(outPath, xml, "utf8");
  console.log(`[sitemap] wrote ${allPaths.length * 2} URLs (en + ko) to dist/client/sitemap.xml`);
}
