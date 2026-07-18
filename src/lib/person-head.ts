// Head metadata for a member's own page, shared by the English and Korean
// routes so their tags (and the hreflang pair between them) cannot drift apart.
import type { Person } from "../data/people";
import type { PersonProfile } from "../data/profiles";
import { localizedHead, SITE_NAME } from "./site-meta";
import type { Lang } from "./lang";

/** Display name in `lang`, falling back to the English form. */
export function personName(person: Person, lang: Lang): string {
  if (lang === "ko" && person.nameKo && !person.international) return person.nameKo;
  return person.nameEn;
}

/**
 * `<title>` for a person page. The Korean form leads with the Korean name and
 * title, then the department — the phrasing people actually type into a search
 * box ("소효정 교수", "이화여대 교육공학과 소효정").
 */
function personTitle(person: Person, profile: PersonProfile, lang: Lang): string {
  const org =
    lang === "ko"
      ? `${profile.institution.ko} ${profile.department.ko}`
      : `${profile.department.en}, ${profile.institution.en}`;
  return `${nameWithTitle(person, profile, lang)} — ${org} | ${SITE_NAME}`;
}

/**
 * Name and academic title in the order each language writes them: Korean
 * appends the title ("소효정 교수"), English separates it with a comma
 * ("Hyo-Jeong So, Professor").
 */
export function nameWithTitle(person: Person, profile: PersonProfile, lang: Lang): string {
  const name = personName(person, lang);
  const role = profile.jobTitle[lang];
  return lang === "ko" ? `${name} ${role}` : `${name}, ${role}`;
}

function personDescription(person: Person, profile: PersonProfile, lang: Lang): string {
  const areas = profile.researchAreas[lang].join(lang === "ko" ? ", " : ", ");
  if (lang === "ko") {
    const both = person.nameKo ? `${person.nameKo}(${person.nameEn})` : person.nameEn;
    return `${both} ${profile.jobTitle.ko}는 ${profile.institution.ko} ${profile.department.ko} 교수이자 Interaction Design for Learning Lab(IDL Lab) 지도교수입니다. 연구 분야: ${areas}.`;
  }
  return `${person.nameEn} is a ${profile.jobTitle.en} in the ${profile.department.en} at ${profile.institution.en} and directs the Interaction Design for Learning Lab (IDL Lab). Research areas: ${areas}.`;
}

export function personHead(
  person: Person | undefined,
  profile: PersonProfile | undefined,
  lang: Lang,
) {
  if (!person || !profile) {
    return localizedHead({
      path: "/people",
      lang,
      title: lang === "ko" ? `구성원 — ${SITE_NAME}` : `People — ${SITE_NAME}`,
      description: "",
    });
  }
  return localizedHead({
    path: `/people/${person.id}`,
    lang,
    title: personTitle(person, profile, lang),
    description: personDescription(person, profile, lang),
    // Member photos are absolute (external CDN) URLs; fall back to the site OG
    // image when there is none rather than emitting a relative path.
    image: person.img?.startsWith("http") ? person.img : undefined,
    type: "profile",
  });
}
