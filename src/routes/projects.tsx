import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Page, PageHeading } from "../components/Page";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { PROJECTS, type Project } from "../data/projects";
import { getPublicationById } from "../data/publications";

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
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectCard({ project }: { project: Project }) {
  const t = useT();
  const { lang } = usePreferences();
  const [open, setOpen] = useState(false);

  const title = lang === "ko" ? project.titleKo : project.titleEn;
  const subtitle = lang === "ko" ? project.titleEn : project.titleKo;
  const relatedPubs = (project.relatedPubIds ?? [])
    .map(getPublicationById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const hasMore = Boolean(project.descriptionKo) || relatedPubs.length > 0;

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex-shrink-0 flex items-center justify-center p-4">
          <img
            alt={title}
            className="w-full h-auto object-contain max-h-48 rounded shadow-sm border border-border"
            src={project.img}
          />
        </div>
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-idl-blue mb-1">{title}</h2>
          <p className="text-sm text-text-muted mb-6">{subtitle}</p>
          <table className="text-sm text-text-muted w-full max-w-md">
            <tbody>
              <tr>
                <th className="text-left font-medium w-24 py-1 align-top text-text-main">
                  {t.projects.period}
                </th>
                <td className="py-1">{project.period}</td>
              </tr>
              <tr>
                <th className="text-left font-medium w-24 py-1 align-top text-text-main">
                  {t.projects.funder}
                </th>
                <td className="py-1">{project.funder}</td>
              </tr>
              <tr>
                <th className="text-left font-medium w-24 py-1 align-top text-text-main">
                  {t.projects.members}
                </th>
                <td className="py-1">{project.members}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 text-sm font-medium text-idl-blue hover:underline"
          >
            {open ? t.common.showLess : t.common.readMore}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="mt-4 flex flex-col gap-6">
              {project.descriptionKo && (
                <p
                  className="text-sm text-text-muted text-justify leading-relaxed"
                  style={{ wordBreak: "keep-all" }}
                >
                  {project.descriptionKo}
                </p>
              )}
              {relatedPubs.length > 0 && (
                <div>
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
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ProjectsPage() {
  const t = useT();
  return (
    <Page>
      <PageHeading>{t.projects.title}</PageHeading>
      <div className="flex flex-col gap-16">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Page>
  );
}
