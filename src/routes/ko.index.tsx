// Korean route. Mirrors the English route above it in src/routes/, sharing the
// same page component; only the URL prefix and the SEO copy differ.
import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "../pages/home";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/ko/")({
  head: () => pageHead("/", "ko"),
  component: HomePage,
});
