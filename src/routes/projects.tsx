import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Page, PageHeading } from "../components/Page";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { PROJECTS, type Project } from "../data/projects";
import { getPublicationById } from "../data/publications";
import { absoluteUrl } from "../lib/site-meta";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — IDL Lab" },
      {
        name: "description",
        content: "Research projects of the Interaction Design for Learning Lab.",
      },
      { property: "og:title", content: "Projects — IDL Lab" },
      {
        property: "og:description",
        content: "Research projects of the Interaction Design for Learning Lab.",
      },
      { property: "og:url", content: absoluteUrl("/projects") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/projects") }],
  }),
  component: ProjectsPage,
});

function ProjectCard({ project }: { project: Project }) {
  const t = useT();
  const { lang } = usePreferences();
  const [open, setOpen] = useState(false);

  const primaryTitle =
    lang === "ko" ? project.titleKo || project.titleEn : project.titleEn || project.titleKo;
  const secondaryTitle = lang === "ko" ? project.titleEn : project.titleKo;
  const relatedPubs = (project.relatedPubIds ?? [])
    .map(getPublicationById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const hasMore = Boolean(project.description) || relatedPubs.length > 0;

  const fields = [
    { label: t.projects.period, value: project.period },
    { label: t.projects.funder, value: project.funder },
    { label: t.projects.members, value: project.members },
  ];

  return (
    <article className="border-b border-border pb-10 last:border-b-0">
      <div className="flex flex-col md:flex-row gap-8 md:items-start">
        <div className="md:w-48 flex-shrink-0">
          {project.img ? (
            <img
              src={project.img}
              alt={primaryTitle}
              className="w-full aspect-[3/2] rounded-md object-cover"
            />
          ) : (
            <div className="aspect-[3/2] w-full rounded-md bg-gray-200" />
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-bold text-text-main leading-snug">{primaryTitle}</h2>
          {secondaryTitle && (
            <p className="mt-1 text-sm text-text-muted leading-relaxed">{secondaryTitle}</p>
          )}
          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-1 text-sm md:grid-cols-[8rem_1fr]">
            {fields.map((field) => (
              <div key={field.label} className="contents">
                <dt className="font-bold text-text-main">{field.label}</dt>
                <dd className="text-text-muted leading-relaxed">{field.value}</dd>
              </div>
            ))}
          </dl>

          {hasMore && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="inline-flex items-center gap-1 text-sm font-medium text-idl-blue hover:underline"
              >
                {open ? t.common.showLess : t.common.readMore}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="mt-4 flex flex-col gap-6">
                  {project.description && (
                    <section>
                      <h3 className="text-sm font-bold text-text-main mb-2">
                        {t.projects.description}
                      </h3>
                      <p
                        className="text-sm text-text-muted text-justify leading-relaxed"
                        style={{ wordBreak: "keep-all" }}
                      >
                        {project.description}
                      </p>
                    </section>
                  )}
                  {relatedPubs.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-text-main mb-2">
                        {t.projects.relatedPublications}
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {relatedPubs.map((pub) => (
                          <li key={pub.id} className="text-sm text-text-muted">
                            <span className="text-text-main">{pub.title}</span>
                            <span className="text-text-muted"> — {pub.venue}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectsPage() {
  const t = useT();
  return (
    <Page>
      <PageHeading>{t.projects.title}</PageHeading>
      <div className="flex flex-col gap-10">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Page>
  );
}
