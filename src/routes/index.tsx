import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "../pages/home";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/")({
  head: () => pageHead("/", "en"),
  component: HomePage,
});
