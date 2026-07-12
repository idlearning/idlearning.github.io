// Single source of truth for publications.

export type PubType = "journal" | "conference" | "book";

export type PubBadge = {
  label: string;
  /** "award" badges are highlighted; "index" badges (SSCI, SCOPUS, ...) are neutral. */
  kind: "award" | "index";
};

export type Publication = {
  id: string;
  title: string;
  /** Author display names, in order. Matched to People by English name for linking. */
  authors: string[];
  venue: string;
  year: number;
  type: PubType;
  badges?: PubBadge[];
  doi?: string;
};

export const PUBLICATIONS: Publication[] = [
  {
    id: "jour-trustworthiness-ai-writing",
    title: "Trustworthiness of AI in academic writing: Perspectives from Indonesian EFL students",
    authors: ["Nikolas Datu Entriawan", "Nur Arifah Drajati", "Sumardi Sumardi", "Hyo-Jeong So"],
    venue: "The Asian Journal of Applied Linguistics, v.10, no.1, 1280",
    year: 2026,
    type: "journal",
    badges: [
      { label: "Best Paper Award", kind: "award" },
      { label: "SCOPUS", kind: "index" },
    ],
    doi: "10.25442/hku.31338805",
  },
  {
    id: "jour-chatgpt-essay-engagement",
    title:
      "Examining University Students' Engagement with ChatGPT in English Essay Writing: Interaction Patterns and Perceptions",
    authors: ["Hyeji Jang", "Lingxi Jin", "Hyo-Jeong So"],
    venue: "The Asia-Pacific Education Researcher",
    year: 2026,
    type: "journal",
    badges: [
      { label: "SSCI", kind: "index" },
      { label: "SCOPUS", kind: "index" },
    ],
    doi: "10.1007/s40299-025-01076-9",
  },
  {
    id: "conf-scientific-sensemaking",
    title:
      "Supporting Scientific Sensemaking under Uncertainty in Inquiry-Based Learning with an AI-based Chatbot",
    authors: ["Ga Young Lee", "Hyo-Jeong So"],
    venue: "AIED 2026",
    year: 2026,
    type: "conference",
  },
  {
    id: "conf-multi-agent-nursing",
    title:
      "An Adaptive Multi-Agent Learning Environment for Interprofessional Communication Training in Nursing Education",
    authors: ["Eunyoung Kim", "Hyosung Park", "Subin Yu", "Jiyeong Shin", "Hyo-Jeong So"],
    venue: "AIED 2026",
    year: 2026,
    type: "conference",
  },
  {
    id: "conf-persona-ai",
    title:
      "Persona.A.I.: Supporting Ethical Decision-Making Through a Role-Playing Game with Conversational Agents",
    authors: ["Yue Wang", "Yeji Ko", "Sieun Park", "Hyo-Jeong So"],
    venue: "AIED 2026",
    year: 2026,
    type: "conference",
  },
  {
    id: "conf-teachable-agents",
    title:
      "Pedagogically Steered LLM-Based Teachable Agents for Scaffolding Tutor Learning in Learning-by-Teaching",
    authors: ["Lingxi Jin", "Hyo-Jeong So"],
    venue: "Doctoral Consortium at AIED 2026",
    year: 2026,
    type: "conference",
  },
  {
    id: "conf-in-video-quizzes",
    title: "When Should AI Intervene? Rethinking In-Video Quizzes as Affective Transition Points",
    authors: ["Eunyoung Kim", "Kyuwon Kim", "Hyo-Jeong So"],
    venue: "MAAI Workshop at Festival of Learning 2026",
    year: 2026,
    type: "conference",
  },
];

export const PUB_TYPE_ORDER: PubType[] = ["journal", "conference", "book"];

export const getPublicationById = (id: string): Publication | undefined =>
  PUBLICATIONS.find((p) => p.id === id);

/** Publications grouped by year (desc), then by type in `PUB_TYPE_ORDER`. */
export function getPublicationsByYear(filter: PubType | "all") {
  const filtered = filter === "all" ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.type === filter);
  const years = [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    types: PUB_TYPE_ORDER.map((type) => ({
      type,
      items: filtered.filter((p) => p.year === year && p.type === type),
    })).filter((group) => group.items.length > 0),
  }));
}
