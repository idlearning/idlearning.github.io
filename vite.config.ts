import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import newsData from "./src/data/generated/news.json";

// Every /news/<slug> detail page, in both languages. The news index paginates
// client-side, so the link crawler only reaches the items linked from its first
// page and the home page; the rest would fall through to the SPA 404 fallback
// even though scripts/gen-sitemap.mjs lists them. Seeding the prerender with
// the full list (built from the same news.json the sitemap reads) guarantees
// every sitemap URL gets a static page. Keep the "/ko" prefix in sync with
// `localizedPath` in src/lib/lang.ts.
const newsPages = newsData
  .map((item) => item.slug)
  .filter((slug): slug is string => Boolean(slug))
  .flatMap((slug) => [`/news/${slug}`, `/ko/news/${slug}`]);

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
      // Keep server-only modules out of the client bundle.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Prerender every page to static HTML so the site can be hosted on GitHub
      // Pages (a static-only host). The crawler starts at "/" and follows the nav
      // links to discover /people, /projects, /publications, and /news; news detail
      // pages are listed explicitly in `pages` below. Output
      // lands in `dist/client/` — the directory the deploy workflow publishes.
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      // Explicit seeds for the crawler. "/" must be listed because a non-empty
      // `pages` replaces the default ["/"] starting point; static routes are
      // still auto-discovered and links are still crawled from every page.
      pages: [{ path: "/" }, ...newsPages.map((path) => ({ path }))],
    }),
    viteReact(),
  ],
  // Use Lightning CSS in dev as well as build so the dev server renders CSS the
  // same way the published static build does.
  css: { transformer: "lightningcss" },
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: { port: 8080 },
});
