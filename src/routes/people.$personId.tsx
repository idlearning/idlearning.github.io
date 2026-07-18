import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPersonById } from "../data/people";
import { getProfile } from "../data/profiles";
import { PersonDetailPage } from "../pages/person-detail";
import { personHead } from "../lib/person-head";

export const Route = createFileRoute("/people/$personId")({
  loader: ({ params }) => {
    const person = getPersonById(params.personId);
    const profile = getProfile(params.personId);
    // Only members with a hand-written profile (src/data/profiles.ts) get a
    // page; everyone else lives on the People list.
    if (!person || !profile) throw notFound();
    return { person, profile };
  },
  head: ({ loaderData }) => personHead(loaderData?.person, loaderData?.profile, "en"),
  component: PersonDetailRoute,
});

function PersonDetailRoute() {
  const { person, profile } = Route.useLoaderData();
  return <PersonDetailPage person={person} profile={profile} />;
}
