// Korean route. Mirrors the English route above it in src/routes/, sharing the
// same page component; only the URL prefix and the SEO copy differ.
import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "../pages/projects";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/ko/projects")({
  head: () => pageHead("/projects", "ko"),
  component: ProjectsPage,
});
