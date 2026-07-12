// GitHub Pages serves `404.html` for any path it can't find as a static file.
// Copying the prerendered home shell to `404.html` lets the client-side router
// take over for unknown paths and render the app's own not-found page instead
// of GitHub's default 404. All real routes are prerendered to their own
// `index.html`, so this only affects genuinely unknown URLs.
import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "dist/client/index.html");
const dest = resolve(root, "dist/client/404.html");

await copyFile(source, dest);
console.log("[postbuild] Wrote dist/client/404.html (SPA fallback)");
