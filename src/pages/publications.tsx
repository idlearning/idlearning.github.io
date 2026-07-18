import { Award, Link2 } from "lucide-react";
import { Fragment, useState } from "react";

import { Page, PageHeading } from "../components/Page";
import { useT } from "../lib/i18n";
import { getPersonByName } from "../data/people";
import {
  PUBLICATIONS,
  getPublicationsByYear,
  type Publication,
  type PubBadge,
  type PubType,
} from "../data/publications";
import { SITE_URL } from "../lib/site-meta";

/**
 * Publication list as schema.org ScholarlyArticle entries. This is the page
 * search engines and scholarly indexers care about most, and the visual markup
 * alone gives them nothing machine-readable to work with.
 */
const PUBLICATIONS_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "IDL Lab publications",
  itemListElement: PUBLICATIONS.map((pub, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "ScholarlyArticle",
      headline: pub.title,
      name: pub.title,
      author: pub.authors.map((name) => ({ "@type": "Person", name })),
      datePublished: String(pub.year),
      isPartOf: { "@type": "Periodical", name: pub.venue },
      publisher: { "@type": "ResearchOrganization", name: "IDL Lab", url: SITE_URL },
      ...(pub.doi ? { sameAs: `https://doi.org/${pub.doi}`, identifier: `doi:${pub.doi}` } : {}),
      ...(pub.pdf ? { url: pub.pdf } : {}),
    },
  })),
});

function Badge({ badge }: { badge: PubBadge }) {
  if (badge.kind === "award") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-white text-xs font-bold rounded uppercase tracking-wider">
        <Award className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    );
  }
  // SSCI gets a filled sky-blue treatment; other index badges stay neutral.
  if (badge.label === "SSCI") {
    return (
      <span className="inline-block px-2 py-0.5 bg-idl-blue text-white text-xs font-bold rounded uppercase tracking-wider">
        {badge.label}
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 border border-border text-xs text-text-muted rounded uppercase tracking-wider">
      {badge.label}
    </span>
  );
}

/** Small outlined link button (DOI, PDF, ACM, Web) with a link icon. */
function LinkButton({ href, label, filled }: { href: string; label: string; filled?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs rounded uppercase tracking-wider transition-colors hover:border-idl-blue hover:text-idl-blue ${
        filled
          ? "bg-gray-100 border-gray-200 text-text-muted hover:bg-idl-blue/10"
          : "border-border text-text-muted"
      }`}
    >
      <Link2 className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}

function AuthorList({ authors }: { authors: string[] }) {
  return (
    <p className="text-sm text-text-main mb-1">
      {authors.map((name, i) => {
        const person = getPersonByName(name);
        return (
          <Fragment key={`${name}-${i}`}>
            {person?.homepage ? (
              <a
                href={person.homepage}
                target="_blank"
                rel="noreferrer"
                className="rounded px-0.5 transition-colors hover:bg-yellow-200/70"
              >
                {name}
              </a>
            ) : (
              name
            )}
            {i < authors.length - 1 && ", "}
          </Fragment>
        );
      })}
    </p>
  );
}

function PublicationItem({ pub }: { pub: Publication }) {
  const hasLinks = Boolean(pub.doi || pub.pdf || pub.acmdl || pub.website);
  const hasMeta = hasLinks || (pub.badges && pub.badges.length > 0);
  return (
    <article>
      <h4 className="text-base font-bold text-text-main mb-2">{pub.title}</h4>
      <AuthorList authors={pub.authors} />
      <p className="text-sm text-text-muted mb-3">{pub.venue}</p>
      {hasMeta && (
        <div className="flex gap-2 flex-wrap items-center">
          {pub.doi && <LinkButton href={`https://doi.org/${pub.doi}`} label="DOI" filled />}
          {pub.pdf && <LinkButton href={pub.pdf} label="PDF" />}
          {pub.acmdl && <LinkButton href={pub.acmdl} label="ACM" />}
          {pub.website && <LinkButton href={pub.website} label="Web" />}
          {pub.badges?.map((badge) => (
            <Badge key={badge.label} badge={badge} />
          ))}
        </div>
      )}
    </article>
  );
}

const FILTERS: { value: PubType | "all"; key: "all" | "journal" | "conference" | "book" }[] = [
  { value: "all", key: "all" },
  { value: "journal", key: "journal" },
  { value: "conference", key: "conference" },
  { value: "book", key: "book" },
];

const TYPE_LABEL_KEY: Record<PubType, "journal" | "conference" | "book"> = {
  journal: "journal",
  conference: "conference",
  book: "book",
};

export function PublicationsPage() {
  const t = useT();
  const [filter, setFilter] = useState<PubType | "all">("all");
  const groups = getPublicationsByYear(filter);

  return (
    <Page>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: PUBLICATIONS_JSONLD }}
      />
      <PageHeading>{t.publications.title}</PageHeading>

      {/* Filters, left-aligned */}
      <section className="mb-12 flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              filter === f.value
                ? "bg-idl-blue text-white font-medium"
                : "border border-border text-text-muted hover:bg-idl-blue/10"
            }`}
          >
            {t.publications[f.key]}
          </button>
        ))}
      </section>

      {groups.length === 0 && <p className="text-text-muted text-sm">—</p>}

      {groups.map((group) => (
        <section key={group.year} className="mb-4">
          <h3 className="text-3xl font-bold text-[#BFBFBF] mb-8">{group.year}</h3>
          {group.types.map((typeGroup, idx) => (
            <div key={typeGroup.type}>
              {idx > 0 && <hr className="border-border my-8" />}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-48 flex-shrink-0">
                  <h4 className="text-lg font-bold text-text-main">
                    {t.publications[TYPE_LABEL_KEY[typeGroup.type]]}
                  </h4>
                </div>
                <div className="flex-grow flex flex-col gap-8">
                  {typeGroup.items.map((pub) => (
                    <PublicationItem key={pub.id} pub={pub} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}
    </Page>
  );
}
