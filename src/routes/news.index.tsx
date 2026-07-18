import { createFileRoute } from "@tanstack/react-router";

import { NewsIndexPage } from "../pages/news-index";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/news/")({
  head: () => pageHead("/news", "en"),
  component: NewsIndexPage,
});
