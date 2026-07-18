import { ArrowRight, Globe, Mail } from "lucide-react";

import { Page } from "../components/Page";
import { GoogleScholarIcon } from "../components/icons";
import { LocalLink } from "../components/LocalLink";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { nameWithTitle, personName } from "../lib/person-head";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../lib/site-meta";
import type { Person } from "../data/people";
import type { PersonProfile } from "../data/profiles";
import { getPublicationsByPerson } from "../data/publications";
import { PROJECTS } from "../data/projects";

/** How many items the page shows before deferring to the full list page. */
const MAX_PUBLICATIONS = 10;
const MAX_PROJECTS = 5;

/**
 * schema.org Person. This is the part that makes a name search resolve to this
 * page: `sameAs` ties it to the same human's Google Scholar and university
 * profiles, `alternateName` covers the Korean spelling, and `knowsAbout` links
 * the person to research topics rather than only to a string of characters.
 */
function personJsonLd(person: Person, profile: PersonProfile): string {
  const alternateNames = [person.nameKo, ...(person.aliases ?? [])].filter(Boolean);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.nameEn,
    ...(alternateNames.length > 0 && { alternateName: alternateNames }),
    url: absoluteUrl(`/people/${person.id}`),
    ...(person.img && { image: person.img }),
    ...(person.email && { email: `mailto:${person.email}` }),
    jobTitle: profile.jobTitle.en,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: profile.institution.en,
      alternateName: profile.institution.ko,
      department: {
        "@type": "Organization",
        name: profile.department.en,
        alternateName: profile.department.ko,
      },
      url: "https://www.ewha.ac.kr",
    },
    worksFor: {
      "@type": "ResearchOrganization",
      name: "Interaction Design for Learning Lab",
      alternateName: SITE_NAME,
      url: SITE_URL,
    },
    knowsAbout: profile.researchAreas.en,
    ...(profile.sameAs?.length && { sameAs: profile.sameAs }),
  });
}

function ProfileLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-text-muted hover:text-idl-blue transition-colors"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-idl-blue mb-5">{title}</h2>
      {children}
    </section>
  );
}

export function PersonDetailPage({ person, profile }: { person: Person; profile: PersonProfile }) {
  const t = useT();
  const { lang } = usePreferences();
  const name = personName(person, lang);
  const secondaryName = lang === "ko" ? person.nameEn : person.nameKo;
  const bio = profile.bio[lang];
  const areas = profile.researchAreas[lang];
  const publications = getPublicationsByPerson(person);
  // Projects list members as one comma-separated string of display names.
  const projects = PROJECTS.filter((project) =>
    project.members.split(",").some((m) => m.trim().startsWith(person.nameKo ?? person.nameEn)),
  ).slice(0, MAX_PROJECTS);

  return (
    <Page>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd(person, profile) }}
      />

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {person.img && (
          <img
            src={person.img}
            alt={`${name} ${profile.jobTitle[lang]} — ${SITE_NAME}`}
            className="w-44 h-44 shrink-0 rounded-lg object-cover bg-gray-200"
          />
        )}
        <div className="min-w-0">
          {/* The H1 carries the name plus the role and department — the exact
              phrasing a name search uses. */}
          <h1 className="text-3xl font-bold text-text-main">
            {nameWithTitle(person, profile, lang)}
          </h1>
          {secondaryName && <p className="mt-1 text-text-muted">{secondaryName}</p>}
          <p className="mt-3 text-text-main" style={{ wordBreak: "keep-all" }}>
            {lang === "ko"
              ? `${profile.institution.ko} ${profile.department.ko}`
              : `${profile.department.en}, ${profile.institution.en}`}
          </p>
          <p className="text-text-muted" style={{ wordBreak: "keep-all" }}>
            {lang === "ko"
              ? "Interaction Design for Learning Lab 지도교수"
              : "Director, Interaction Design for Learning Lab"}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {person.email && (
              <ProfileLink
                href={`mailto:${person.email}`}
                icon={<Mail className="w-4 h-4" />}
                label={person.email}
              />
            )}
            {person.scholar && (
              <ProfileLink
                href={person.scholar}
                icon={<GoogleScholarIcon className="w-4 h-4" />}
                label="Google Scholar"
              />
            )}
            {person.homepage && (
              <ProfileLink
                href={person.homepage}
                icon={<Globe className="w-4 h-4" />}
                label={lang === "ko" ? "이화여자대학교 교수 소개" : "University profile"}
              />
            )}
          </div>
        </div>
      </div>

      {bio.length > 0 && (
        <Section title={lang === "ko" ? "소개" : "Biography"}>
          <div className="max-w-3xl space-y-4">
            {bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-text-main leading-relaxed text-justify"
                style={{ wordBreak: "keep-all" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Section>
      )}

      {areas.length > 0 && (
        <Section title={lang === "ko" ? "연구 분야" : "Research Areas"}>
          <ul className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <li
                key={area}
                className="rounded-full bg-idl-blue/10 px-4 py-1.5 text-sm text-idl-blue"
              >
                {area}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={t.projects.title}>
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id}>
                <LocalLink
                  to="/projects"
                  hash={project.id}
                  className="text-text-main hover:text-idl-blue transition-colors"
                  style={{ wordBreak: "keep-all" }}
                >
                  {lang === "ko" ? project.titleKo : project.titleEn}
                </LocalLink>
                <span className="ml-2 text-sm text-text-muted">{project.period}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {publications.length > 0 && (
        <Section title={lang === "ko" ? "주요 연구 성과" : "Selected Publications"}>
          <ul className="space-y-4">
            {publications.slice(0, MAX_PUBLICATIONS).map((pub) => (
              <li key={pub.id} className="text-sm" style={{ wordBreak: "keep-all" }}>
                <span className="text-text-main">{pub.authors.join(", ")}</span>{" "}
                <span className="text-text-muted">({pub.year}).</span>{" "}
                <span className="font-medium text-text-main">{pub.title}</span>{" "}
                <span className="italic text-text-muted">{pub.venue}</span>
              </li>
            ))}
          </ul>
          {publications.length > MAX_PUBLICATIONS && (
            <div className="mt-6">
              <LocalLink
                to="/publications"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-idl-blue transition-colors"
              >
                {lang === "ko"
                  ? `전체 연구 성과 ${publications.length}건 보기`
                  : `View all ${publications.length} publications`}
                <ArrowRight className="w-4 h-4" />
              </LocalLink>
            </div>
          )}
        </Section>
      )}

      <div className="mt-12">
        <LocalLink
          to="/people"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-idl-blue transition-colors"
        >
          {t.common.backToList}
        </LocalLink>
      </div>
    </Page>
  );
}
