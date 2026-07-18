// Korean route. Mirrors src/routes/news.$slug.tsx, sharing the same loader and
// page component; only the URL prefix and the language of the metadata differ.
import { createFileRoute, notFound } from "@tanstack/react-router";

import { getNewsBySlug } from "../data/news";
import { NewsDetailPage } from "../pages/news-detail";
import { newsHead } from "../lib/news-head";

export const Route = createFileRoute("/ko/news/$slug")({
  loader: ({ params }) => {
    const item = getNewsBySlug(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => newsHead(loaderData, "ko"),
  component: NewsDetailRoute,
});

function NewsDetailRoute() {
  return <NewsDetailPage item={Route.useLoaderData()} />;
}
