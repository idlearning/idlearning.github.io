import { createFileRoute } from "@tanstack/react-router";
import { Globe, Link2, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Page, PageHeading } from "../components/Page";
import { GoogleScholarIcon } from "../components/icons";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { getPeopleByRole, type Person, type PersonRole } from "../data/people";
import { absoluteUrl } from "../lib/site-meta";

// A ring of stars that encircles the professor's honors box on hover (see
// .ring-star in CSS). `pos` places each star around the perimeter; tx/ty center
// it on that point; `sd` staggers them so the ring "draws" itself clockwise.
const RING_STARS = [
  { pos: "-top-3 -left-3", tx: "0", ty: "0", size: "h-3 w-3", sd: "0s" },
  { pos: "-top-3 left-1/4", tx: "-50%", ty: "0", size: "h-3.5 w-3.5", sd: "0.05s" },
  { pos: "-top-4 left-1/2", tx: "-50%", ty: "0", size: "h-4 w-4", sd: "0.1s" },
  { pos: "-top-3 left-3/4", tx: "-50%", ty: "0", size: "h-3.5 w-3.5", sd: "0.15s" },
  { pos: "-top-3 -right-3", tx: "0", ty: "0", size: "h-3 w-3", sd: "0.2s" },
  { pos: "top-1/2 -right-3", tx: "0", ty: "-50%", size: "h-4 w-4", sd: "0.25s" },
  { pos: "-bottom-3 -right-3", tx: "0", ty: "0", size: "h-3 w-3", sd: "0.3s" },
  { pos: "-bottom-3 left-3/4", tx: "-50%", ty: "0", size: "h-3.5 w-3.5", sd: "0.35s" },
  { pos: "-bottom-4 left-1/2", tx: "-50%", ty: "0", size: "h-4 w-4", sd: "0.4s" },
  { pos: "-bottom-3 left-1/4", tx: "-50%", ty: "0", size: "h-3.5 w-3.5", sd: "0.45s" },
  { pos: "-bottom-3 -left-3", tx: "0", ty: "0", size: "h-3 w-3", sd: "0.5s" },
  { pos: "top-1/2 -left-3", tx: "0", ty: "-50%", size: "h-4 w-4", sd: "0.55s" },
];

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
      { property: "og:url", content: absoluteUrl("/people") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/people") }],
  }),
  component: PeoplePage,
});

function PersonName({ person, size }: { person: Person; size: "lg" | "md" }) {
  const { lang } = usePreferences();
  // International students (or anyone without a Korean name) show the English name only.
  const showKorean = Boolean(person.nameKo) && !person.international;
  const primary = lang === "ko" && showKorean ? person.nameKo : person.nameEn;
  const secondary = showKorean ? (lang === "ko" ? person.nameEn : person.nameKo) : null;
  return (
    <div className="flex items-end gap-2 mb-1">
      <h3 className={`font-bold text-text-main ${size === "lg" ? "text-xl" : "text-lg"}`}>
        {primary}
      </h3>
      {secondary && <span className="text-text-muted text-sm mb-0.5">{secondary}</span>}
    </div>
  );
}

function ProfileLinks({ person }: { person: Person }) {
  if (!person.scholar && !person.homepage) return null;
  // Stop clicks from bubbling up to a clickable card.
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div className="flex gap-3">
      {person.scholar && (
        <a
          href={person.scholar}
          onClick={stop}
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
          onClick={stop}
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
  const [imgError, setImgError] = useState(false);
  if (person.img && !imgError) {
    return (
      <img
        alt={person.nameEn}
        className={`${className} object-cover bg-gray-200`}
        src={person.img}
        loading="lazy"
        onError={() => setImgError(true)}
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

/** Title text with a small link icon appended right after it, when a URL is set. */
function DocLine({ title, url }: { title: string; url?: string }) {
  if (!url) return <span>{title}</span>;
  return (
    <a
      href={url}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      rel="noreferrer"
      className="hover:text-idl-blue transition-colors"
    >
      {title}
      <Link2 className="inline-block w-3.5 h-3.5 ml-1 -translate-y-px" />
    </a>
  );
}

/** True when the person has extra detail worth opening the modal for. */
function hasModalDetail(person: Person): boolean {
  return (
    Boolean(person.education?.length) ||
    Boolean(person.affiliation) ||
    Boolean(person.dissertation) ||
    Boolean(person.thesis)
  );
}

const DEGREE_LABEL: Record<NonNullable<Person["alumniDegree"]>, string> = {
  phd: "Ph.D.",
  ma: "M.A.",
};

function PersonCard({
  person,
  onOpen,
  variant = "student",
}: {
  person: Person;
  onOpen: (p: Person) => void;
  variant?: "student" | "alumni";
}) {
  const t = useT();
  const clickable = variant !== "alumni" && hasModalDetail(person);
  const showPhoto = variant !== "alumni";
  const degreeLabel = person.alumniDegree ? DEGREE_LABEL[person.alumniDegree] : null;
  const dissertationLabel =
    person.alumniDegree === "ma" ? t.people.dissertationMa : t.people.dissertation;

  return (
    <div
      onClick={clickable ? () => onOpen(person) : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(person);
              }
            }
          : undefined
      }
      className={`flex flex-col sm:flex-row gap-6 items-start ${
        clickable ? "group cursor-pointer" : ""
      }`}
    >
      {showPhoto && (
        <div className="relative w-40 h-40 shrink-0 overflow-hidden rounded-lg">
          <Avatar person={person} className="w-full h-full rounded-lg" />
          {clickable && (
            // On hover, a warm yellow gradient floods up from the bottom to about
            // half the photo's height.
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-idl-blue/80 via-idl-blue/40 to-transparent transition-all duration-500 ease-out group-hover:h-1/2" />
          )}
        </div>
      )}
      <div className="text-sm min-w-0">
        {degreeLabel && (
          <div className="text-xs font-semibold uppercase tracking-wider text-idl-blue mb-1">
            {degreeLabel}
          </div>
        )}
        <PersonName person={person} size="md" />
        {person.email && <p className="text-text-muted mb-3">{person.email}</p>}
        {variant !== "alumni" && (person.scholar || person.homepage) && (
          <div className="mt-2 mb-6">
            <ProfileLinks person={person} />
          </div>
        )}
        {variant === "alumni" && person.affiliation && person.affiliation !== "-" && (
          <p className="text-text-muted mt-3 mb-2">{person.affiliation}</p>
        )}
        {variant === "alumni" && person.dissertation && (
          <DetailRow label={dissertationLabel}>
            <DocLine title={person.dissertation} url={person.dissertationUrl} />
          </DetailRow>
        )}
        {variant === "alumni" && (person.scholar || person.homepage) && (
          <DetailRow label={t.people.profile}>
            <ProfileLinks person={person} />
          </DetailRow>
        )}
        {person.interests && <DetailRow label={t.people.interests}>{person.interests}</DetailRow>}
        {person.thesis && (
          <DetailRow label={t.people.thesis}>
            <DocLine title={person.thesis} url={person.thesisUrl} />
          </DetailRow>
        )}
      </div>
    </div>
  );
}

function StudentModal({ person, onClose }: { person: Person; onClose: () => void }) {
  const t = useT();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog on open; restore it to the trigger on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={person.nameEn}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-card p-6 sm:p-8 shadow-xl focus:outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-text-muted hover:text-idl-blue transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar person={person} className="w-32 h-32 rounded-lg shrink-0" />
          <div className="min-w-0">
            <PersonName person={person} size="lg" />
            {person.email && <p className="text-text-muted text-sm mb-1">{person.email}</p>}
            <div className="mt-2">
              <ProfileLinks person={person} />
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm">
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
              <DocLine title={person.thesis} url={person.thesisUrl} />
            </DetailRow>
          )}
          {person.affiliation && person.affiliation !== "-" && (
            <DetailRow label={t.people.affiliation}>{person.affiliation}</DetailRow>
          )}
          {person.dissertation && (
            <DetailRow label={t.people.dissertation}>
              <DocLine title={person.dissertation} url={person.dissertationUrl} />
            </DetailRow>
          )}
        </div>
      </div>
    </div>
  );
}

function PeopleGrid({
  people,
  onOpen,
  variant,
}: {
  people: Person[];
  onOpen: (p: Person) => void;
  variant?: "student" | "alumni";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} onOpen={onOpen} variant={variant} />
      ))}
    </div>
  );
}

const STUDENT_SECTIONS: { role: PersonRole; key: "doctoral" | "masters" }[] = [
  { role: "doctoral", key: "doctoral" },
  { role: "masters", key: "masters" },
];

/** Groups alumni by graduation year, newest first; those without a year go last. */
function groupAlumniByYear(people: Person[]): { key: string; label: string; people: Person[] }[] {
  const byYear = new Map<number, Person[]>();
  const noYear: Person[] = [];
  for (const p of people) {
    if (p.gradYear == null) {
      noYear.push(p);
    } else {
      const arr = byYear.get(p.gradYear) ?? [];
      arr.push(p);
      byYear.set(p.gradYear, arr);
    }
  }
  const groups = [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, ppl]) => ({ key: String(year), label: String(year), people: ppl }));
  if (noYear.length > 0) groups.push({ key: "other", label: "—", people: noYear });
  return groups;
}

function PeoplePage() {
  const t = useT();
  const [selected, setSelected] = useState<Person | null>(null);

  const professor = getPeopleByRole("professor")[0];
  const alumniGroups = groupAlumniByYear(getPeopleByRole("alumni"));

  return (
    <Page>
      <PageHeading>{t.nav.people}</PageHeading>

      {/* Professor */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-idl-blue mb-8">{t.people.professor}</h2>
        {professor && (
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Avatar person={professor} className="w-44 h-44 rounded-lg shrink-0" />
            <div>
              <PersonName person={professor} size="lg" />
              {professor.email && <p className="text-text-muted text-sm mb-1">{professor.email}</p>}
              <div className="mt-2">
                <ProfileLinks person={professor} />
              </div>
              <div className="group relative mt-4 w-fit px-1 py-1 text-sm text-text-main">
                {/* Easter egg: a ring of stars encircles the box on hover. */}
                {RING_STARS.map((s, i) => (
                  <Star
                    key={i}
                    className={`ring-star pointer-events-none absolute fill-amber-400 text-amber-400 ${s.pos} ${s.size}`}
                    style={{ "--tx": s.tx, "--ty": s.ty, "--sd": s.sd } as React.CSSProperties}
                  />
                ))}
                <ul className="list-disc space-y-1 pl-5 font-medium marker:text-amber-400">
                  <li>World's Top 2% Scientists, Stanford University (2024-2026)</li>
                  <li>Ewha Fellow (2026-2028)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Students, split into subsections by role */}
      <section className="mb-16">
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
                <PeopleGrid people={people} onOpen={setSelected} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Alumni, its own top-level section, grouped by graduation year */}
      {alumniGroups.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-idl-blue mb-8">{t.people.alumni}</h2>
          <div className="flex flex-col gap-14">
            {alumniGroups.map((g) => (
              <div key={g.key}>
                <h3 className="text-lg font-bold text-text-main mb-6 pb-2 border-b border-border">
                  {g.label}
                </h3>
                <PeopleGrid people={g.people} onOpen={setSelected} variant="alumni" />
              </div>
            ))}
          </div>
        </section>
      )}

      {selected && <StudentModal person={selected} onClose={() => setSelected(null)} />}
    </Page>
  );
}
