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

let newsPaths = [];
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
    newsPaths.push(`/news/${slug}`);
  }
} catch (err) {
  console.warn(
    `[sitemap] could not read news.json (${err.message}) — sitemap will omit news pages.`,
  );
}

const today = new Date().toISOString().slice(0, 10);
const urls = [...staticPaths, ...newsPaths]
  .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

if (!existsSync(dirname(outPath))) {
  console.warn(`[sitemap] ${dirname(outPath)} does not exist — run after build. Skipping.`);
} else {
  writeFileSync(outPath, xml, "utf8");
  console.log(
    `[sitemap] wrote ${staticPaths.length + newsPaths.length} URLs to dist/client/sitemap.xml`,
  );
}
