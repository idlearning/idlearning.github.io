// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender every page to static HTML so the site can be hosted on GitHub
    // Pages (a static-only host). The crawler starts at "/" and follows the nav
    // links to discover /people, /projects, /publications, and /news. Output
    // lands in `dist/client/` — the directory the deploy workflow publishes.
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
  // Disable Nitro so TanStack Start emits a plain static build (dist/client)
  // instead of a server bundle targeting Cloudflare. There are no server
  // functions in this site, so a fully prerendered static build is all we need.
  nitro: false,
});
