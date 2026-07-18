// Generate dist/client/sitemap.xml after the static build.
//
// Enumerates the fixed routes plus every prerendered /news/<slug> detail page.
// The news slug derivation MUST match src/data/news.ts (newsSlug) so the URLs
// here line up with the pages TanStack actually prerendered.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://idlearning.github.io";
const outPath = resolve(root, "dist/client/sitemap.xml");

// Keep this in sync with `newsSlug` in src/data/news.ts.
function newsSlugBase(item) {
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
function shortHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).slice(0, 5);
}

const staticPaths = ["/", "/people", "/projects", "/publications", "/news"];

// Members with a hand-written profile get their own page. Keep the id list in
// sync with PERSON_PROFILES in src/data/profiles.ts — those are the only
// /people/<id> routes that resolve; every other id 404s.
let personPaths = [];
try {
  const profiles = readFileSync(resolve(root, "src/data/profiles.ts"), "utf8");
  const block = profiles.split("PERSON_PROFILES")[1] ?? "";
  personPaths = [...block.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => `/people/${m[1]}`);
  if (personPaths.length === 0) {
    console.warn("[sitemap] no person profiles matched — sitemap will omit person pages.");
  }
} catch (err) {
  console.warn(
    `[sitemap] could not read profiles.ts (${err.message}) — sitemap will omit person pages.`,
  );
}

let newsPaths = [];
// Per-URL last-modified dates, so a news item reports the day it was published
// rather than the day the site happened to be rebuilt.
const lastmodByPath = new Map();
try {
  const news = JSON.parse(readFileSync(resolve(root, "src/data/generated/news.json"), "utf8"));
  const baseCounts = new Map();
  for (const item of news) {
    const b = item.slug ?? newsSlugBase(item);
    baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1);
  }
  for (const item of news) {
    let slug = item.slug ?? newsSlugBase(item);
    if (!item.slug && (baseCounts.get(slug) ?? 0) > 1)
      slug = `${slug}-${shortHash(item.title ?? "")}`;
    const path = `/news/${slug}`;
    newsPaths.push(path);
    const date = String(item.date ?? "").slice(0, 10);
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
const allPaths = [...staticPaths, ...personPaths, ...newsPaths];

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
