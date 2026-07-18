import { createFileRoute } from "@tanstack/react-router";

import { PublicationsPage } from "../pages/publications";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/publications")({
  head: () => pageHead("/publications", "en"),
  component: PublicationsPage,
});
