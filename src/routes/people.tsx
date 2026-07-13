import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";

import { Page, PageHeading } from "../components/Page";
import { GoogleScholarIcon } from "../components/icons";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { getPeopleByRole, type Person, type PersonRole } from "../data/people";

export const Route = createFileRoute("/people")({
  head: () => ({
    meta: [
      { title: "People — IDL Lab" },
      {
        name: "description",
        content: "Meet the professor and students of the Interaction Design for Learning Lab.",
      },
      { property: "og:title", content: "People — IDL Lab" },
      {
        property: "og:description",
        content: "Meet the professor and students of the Interaction Design for Learning Lab.",
      },
      { property: "og:url", content: "/people" },
    ],
    links: [{ rel: "canonical", href: "/people" }],
  }),
  component: PeoplePage,
});

function PersonName({ person, size }: { person: Person; size: "lg" | "md" }) {
  const { lang } = usePreferences();
  const primary = lang === "ko" ? person.nameKo : person.nameEn;
  const secondary = lang === "ko" ? person.nameEn : person.nameKo;
  return (
    <div className="flex items-end gap-2 mb-1">
      <h3 className={`font-bold text-text-main ${size === "lg" ? "text-xl" : "text-lg"}`}>
        {primary}
      </h3>
      <span className="text-text-muted text-sm mb-0.5">{secondary}</span>
    </div>
  );
}

function ProfileLinks({ person }: { person: Person }) {
  if (!person.scholar && !person.homepage) return null;
  return (
    <div className="flex gap-3 mt-2">
      {person.scholar && (
        <a
          href={person.scholar}
          target="_blank"
          rel="noreferrer"
          aria-label="Google Scholar"
          className="text-text-muted hover:text-idl-blue transition-colors"
        >
          <GoogleScholarIcon className="w-5 h-5" />
        </a>
      )}
      {person.homepage && (
        <a
          href={person.homepage}
          target="_blank"
          rel="noreferrer"
          aria-label="Homepage"
          className="text-text-muted hover:text-idl-blue transition-colors"
        >
          <Globe className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}

function Avatar({ person, className }: { person: Person; className: string }) {
  if (person.img) {
    return (
      <img
        alt={person.nameEn}
        className={`${className} object-cover bg-gray-200`}
        src={person.img}
      />
    );
  }
  return (
    <div
      className={`${className} flex items-center justify-center bg-idl-blue/10 text-idl-blue text-3xl font-bold`}
      aria-hidden="true"
    >
      {person.nameEn.charAt(0)}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-y-1 mb-2">
      <div className="font-semibold text-text-main">{label}</div>
      <div className="text-text-muted">{children}</div>
    </div>
  );
}

function StudentCard({ person }: { person: Person }) {
  const t = useT();
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Avatar person={person} className="w-36 h-36 rounded-lg shrink-0" />
      <div className="text-sm min-w-0">
        <PersonName person={person} size="md" />
        {person.email && <p className="text-text-muted mb-3">{person.email}</p>}
        <ProfileLinks person={person} />
        <div className="mt-3">
          {person.interests && <DetailRow label={t.people.interests}>{person.interests}</DetailRow>}
          {person.education && person.education.length > 0 && (
            <DetailRow label={t.people.education}>
              {person.education.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < person.education!.length - 1 && <br />}
                </span>
              ))}
            </DetailRow>
          )}
          {person.thesis && (
            <DetailRow label={t.people.thesis}>
              <span className="underline">{person.thesis}</span>
            </DetailRow>
          )}
          {person.affiliation && (
            <DetailRow label={t.people.affiliation}>{person.affiliation}</DetailRow>
          )}
          {person.dissertation && (
            <DetailRow label={t.people.dissertation}>
              <span className="underline">{person.dissertation}</span>
            </DetailRow>
          )}
        </div>
      </div>
    </div>
  );
}

const STUDENT_SECTIONS: { role: PersonRole; key: "doctoral" | "masters" | "alumni" }[] = [
  { role: "doctoral", key: "doctoral" },
  { role: "masters", key: "masters" },
  { role: "alumni", key: "alumni" },
];

function PeoplePage() {
  const t = useT();

  const professor = getPeopleByRole("professor")[0];

  return (
    <Page>
      {/* Professor */}
      <section className="mb-16">
        <PageHeading>{t.people.professor}</PageHeading>
        {professor && (
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Avatar person={professor} className="w-44 h-44 rounded-lg shrink-0" />
            <div>
              <PersonName person={professor} size="lg" />
              {professor.email && <p className="text-text-muted text-sm mb-1">{professor.email}</p>}
              <ProfileLinks person={professor} />
            </div>
          </div>
        )}
      </section>

      {/* Students, split into subsections by role */}
      <section>
        <h2 className="text-2xl font-bold text-idl-blue mb-8">{t.people.students}</h2>
        <div className="flex flex-col gap-14">
          {STUDENT_SECTIONS.map((sec) => {
            const people = getPeopleByRole(sec.role);
            if (people.length === 0) return null;
            return (
              <div key={sec.role}>
                <h3 className="text-lg font-bold text-text-main mb-6 pb-2 border-b border-border">
                  {t.people[sec.key]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                  {people.map((person) => (
                    <StudentCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Page>
  );
}
