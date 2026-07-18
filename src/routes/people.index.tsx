import { createFileRoute } from "@tanstack/react-router";

import { PeoplePage } from "../pages/people";
import { pageHead } from "../lib/page-meta";

export const Route = createFileRoute("/people/")({
  head: () => pageHead("/people", "en"),
  component: PeoplePage,
});
