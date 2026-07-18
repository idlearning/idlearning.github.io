import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "../pages/projects";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/projects")({
  head: () => pageHead("/projects", "en"),
  component: ProjectsPage,
});
