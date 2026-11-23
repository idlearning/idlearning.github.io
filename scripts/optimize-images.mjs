// Shrink oversized photos in the built site (dist/client/images/) after
// `vite build`, so a full-resolution phone/camera upload never ships as-is.
//
// Only the build output is touched — the originals in public/images/ stay in
// the repo, so the limits below can be changed later and every image is
// re-derived from its original. File names and formats are kept, so the
// `/images/...` paths in the sheet keep working.
//
// Per image:
//   - wider than the folder's max width -> resized down to it (EXIF rotation
//     applied first, so portrait phone photos stay upright)
//   - still heavier than SIZE_LIMIT -> re-encoded more efficiently
//   - the result is only written when it is actually smaller than the original
//
// Usage: node scripts/optimize-images.mjs   (runs automatically as postbuild)
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, extname, sep } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = resolve(root, "dist/client/images");

/** Max width (px) per top-level folder under images/; see docs/EASY_MANAGEMENT.md. */
const MAX_WIDTH = { people: 800 };
const DEFAULT_MAX_WIDTH = 1200;
/** Files at or under this size that are already narrow enough are left alone. */
const SIZE_LIMIT = 300 * 1024;

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(entry.name).toLowerCase())) yield p;
  }
}

/** Encode in the file's own format with web-friendly settings. */
async function encode(pipeline, ext) {
  if (ext === ".png") {
    const lossless = await pipeline
      .clone()
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    if (lossless.length <= SIZE_LIMIT) return lossless;
    // Photos saved as PNG stay huge losslessly; a 256-colour dithered palette
    // (pngquant-style) is visually close at a fraction of the size.
    const palette = await pipeline
      .clone()
      .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
      .toBuffer();
    return palette.length < lossless.length ? palette : lossless;
  }
  if (ext === ".webp") return pipeline.webp({ quality: 82 }).toBuffer();
  return pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}

async function main() {
  if (!existsSync(imagesDir)) {
    console.warn(`[images] ${imagesDir} does not exist — run after build. Skipping.`);
    return;
  }
  let before = 0;
  let after = 0;
  let changed = 0;
  for (const file of walk(imagesDir)) {
    const rel = relative(imagesDir, file);
    const ext = extname(file).toLowerCase();
    const maxWidth = MAX_WIDTH[rel.split(sep)[0]] ?? DEFAULT_MAX_WIDTH;
    const input = readFileSync(file);
    before += input.length;
    try {
      const meta = await sharp(input).metadata();
      // EXIF orientations 5–8 are rotated 90°, so the displayed width is the height.
      const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
      const tooWide = width > maxWidth;
      if (!tooWide && input.length <= SIZE_LIMIT) {
        after += input.length;
        continue;
      }
      let pipeline = sharp(input).rotate();
      if (tooWide) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
      const output = await encode(pipeline, ext);
      if (output.length < input.length) {
        writeFileSync(file, output);
        after += output.length;
        changed++;
        console.log(
          `[images] ${rel}: ${width}px ${kb(input.length)} -> ` +
            `${tooWide ? `${maxWidth}px ` : ""}${kb(output.length)}`,
        );
      } else {
        after += input.length;
      }
    } catch (err) {
      after += input.length;
      console.warn(`[images] ${rel}: skipped (${err.message})`);
    }
  }
  console.log(
    `[images] optimized ${changed} file(s): ${kb(before)} -> ${kb(after)} total in images/.`,
  );
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

main().catch((err) => {
  // Never fail the deploy over image optimization; the originals still work.
  console.warn(`[images] optimization failed (${err.message}) — shipping originals.`);
});
