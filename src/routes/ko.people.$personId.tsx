// Korean route. Mirrors src/routes/people.$personId.tsx, sharing the same
// loader and page component; only the URL prefix and the metadata language
// differ.
import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPersonById } from "../data/people";
import { getProfile } from "../data/profiles";
import { PersonDetailPage } from "../pages/person-detail";
import { personHead } from "../lib/person-head";

export const Route = createFileRoute("/ko/people/$personId")({
  loader: ({ params }) => {
    const person = getPersonById(params.personId);
    const profile = getProfile(params.personId);
    if (!person || !profile) throw notFound();
    return { person, profile };
  },
  head: ({ loaderData }) => personHead(loaderData?.person, loaderData?.profile, "ko"),
  component: PersonDetailRoute,
});

function PersonDetailRoute() {
  const { person, profile } = Route.useLoaderData();
  return <PersonDetailPage person={person} profile={profile} />;
}
