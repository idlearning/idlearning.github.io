// Re-download the self-hosted Pretendard webfont and regenerate src/fonts.css.
//
// The site used to pull Pretendard from jsDelivr as a render-blocking <link>,
// which cost a third-party connection on every first paint. We now vendor the
// *dynamic subset* build: 92 woff2 chunks, each declared with a unicode-range,
// so a browser downloads only the chunks the page's characters need (roughly
// 50-150KB) rather than the ~2MB full family.
//
// Run this only when bumping the Pretendard version below.
//   node scripts/fetch-fonts.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "v1.3.9";
const CHUNKS = 92;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = resolve(root, "public/fonts");
const cssOut = resolve(root, "src/fonts.css");

const CDN = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@${VERSION}`;
const CSS_URL = `${CDN}/dist/web/variable/pretendardvariable-dynamic-subset.min.css`;
const CHUNK_BASE = `${CDN}/packages/pretendard/dist/web/variable/woff2-dynamic-subset`;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res;
}

mkdirSync(fontsDir, { recursive: true });

for (let i = 0; i < CHUNKS; i++) {
  const name = `PretendardVariable.subset.${i}.woff2`;
  const res = await download(`${CHUNK_BASE}/${name}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // woff2 files start with the magic string "wOF2"; anything else is an error page.
  if (buf.subarray(0, 4).toString() !== "wOF2") {
    throw new Error(`${name} is not a woff2 file (got ${buf.subarray(0, 16).toString()})`);
  }
  writeFileSync(resolve(fontsDir, name), buf);
}

const upstream = await (await download(CSS_URL)).text();
const css = upstream.replace(
  /url\([^)]*woff2-dynamic-subset\/(PretendardVariable\.subset\.\d+\.woff2)\)/g,
  "url(/fonts/$1)",
);
const rewritten = (css.match(/url\(\/fonts\//g) ?? []).length;
if (rewritten !== CHUNKS) {
  throw new Error(`expected ${CHUNKS} rewritten font URLs, got ${rewritten}`);
}

const header = `/* Pretendard ${VERSION} (SIL Open Font License 1.1) — self-hosted dynamic subset.
 * GENERATED FILE. Do not edit by hand; run \`node scripts/fetch-fonts.mjs\`.
 *
 * Each @font-face carries a unicode-range, so the browser downloads only the
 * chunks a page's characters actually need instead of the full ~2MB family.
 */
`;
writeFileSync(cssOut, header + css);

console.log(`[fonts] ${CHUNKS} woff2 chunks -> public/fonts, ${rewritten} URLs -> src/fonts.css`);
