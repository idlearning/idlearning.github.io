import { createFileRoute, notFound } from "@tanstack/react-router";

import { getNewsBySlug } from "../data/news";
import { NewsDetailPage } from "../pages/news-detail";
import { newsHead } from "../lib/news-head";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNewsBySlug(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => newsHead(loaderData, "en"),
  component: NewsDetailRoute,
});

function NewsDetailRoute() {
  return <NewsDetailPage item={Route.useLoaderData()} />;
}
