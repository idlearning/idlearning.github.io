import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Publications — IDL Lab" },
      {
        name: "description",
        content: "Journal and conference publications from the Interaction Design for Learning Lab.",
      },
      { property: "og:title", content: "Publications — IDL Lab" },
      {
        property: "og:description",
        content: "Journal and conference publications from the Interaction Design for Learning Lab.",
      },
      { property: "og:url", content: "/publications" },
    ],
    links: [{ rel: "canonical", href: "/publications" }],
  }),
  component: PublicationsPage,
});

const CONFERENCES = [
  {
    title:
      "Supporting Scientific Sensemaking under Uncertainty in Inquiry-Based Learning with an AI-based Chatbot",
    authors: "Ga Young Lee, Hyo-Jeong So",
    venue: "AIED 2026",
  },
  {
    title:
      "An Adaptive Multi-Agent Learning Environment for Interprofessional Communication Training in Nursing Education",
    authors: "Eunyoung Kim, Hyosung Park, Subin Yu, Jiyeong Shin, Hyo-Jeong So",
    venue: "AIED 2026",
  },
  {
    title:
      "Persona.A.I.: Supporting Ethical Decision-Making Through a Role-Playing Game with Conversational Agents",
    authors: "Yue Wang, Yeji Ko, Sieun Park, Hyo-Jeong So",
    venue: "AIED 2026",
  },
  {
    title:
      "Pedagogically Steered LLM-Based Teachable Agents for Scaffolding Tutor Learning in Learning-by-Teaching",
    authors: "Lingxi Jin, Hyo-Jeong So",
    venue: "Doctoral Consortium at AIED 2026",
  },
  {
    title: "When Should AI Intervene? Rethinking In-Video Quizzes as Affective Transition Points",
    authors: "Eunyoung Kim, Kyuwon Kim, Hyo-Jeong So",
    venue: "MAAI Workshop at Festival of Learning 2026",
  },
];

function PublicationsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Filters */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-gray-700 mb-4">Publication Type</h2>
        <div className="flex gap-2 text-sm">
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            All
          </button>
          <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium">
            Journal
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            Conference
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            Book
          </button>
        </div>
      </section>

      {/* Year 2026 */}
      <section>
        <h1 className="text-3xl font-bold text-gray-300 mb-8">2026</h1>

        {/* Journal */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-48 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800">Journal</h3>
          </div>
          <div className="flex-grow flex flex-col gap-8">
            <article>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Trustworthiness of AI in academic writing: Perspectives from Indonesian EFL
                students
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                Nikolas Datu Entriawan, Nur Arifah Drajati, Sumardi Sumardi, Hyo-Jeong So
              </p>
              <p className="text-sm text-gray-500 mb-3">
                The Asian Journal of Applied Linguistics, v.10, no.1, 1280,
                https://doi.org/10.25442/hku.31338805
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#facc15] text-white text-xs font-bold rounded uppercase tracking-wider">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                    <path d="M11 12 5.12 2.2" />
                    <path d="m13 12 5.88-9.8" />
                    <path d="M8 7h8" />
                    <circle cx="12" cy="17" r="5" />
                    <path d="M12 18v-2h-.5" />
                  </svg>
                  Best Paper Award
                </span>
                <span className="inline-block px-2 py-0.5 border border-gray-300 text-xs text-gray-500 rounded uppercase tracking-wider">
                  SCOPUS
                </span>
              </div>
            </article>
            <article>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                Examining University Students' Engagement with ChatGPT in English Essay Writing:
                Interaction Patterns and Perceptions
              </h4>
              <p className="text-sm text-gray-600 mb-1">Hyeji Jang, Lingxi Jin, Hyo-Jeong So</p>
              <p className="text-sm text-gray-500 mb-3">
                The Asia-Pacific Education Researcher, https://doi.org/10.1007/s40299-025-01076-9
              </p>
              <div className="flex gap-2">
                <span className="inline-block px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wider bg-[#89b4ff] text-white">
                  SSCI
                </span>
                <span className="inline-block px-2 py-0.5 border border-gray-300 text-xs text-gray-500 rounded uppercase tracking-wider">
                  SCOPUS
                </span>
              </div>
            </article>
          </div>
        </div>

        <hr className="border-gray-100 my-8" />

        {/* Conference */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-48 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800">Conference</h3>
          </div>
          <div className="flex-grow flex flex-col gap-8">
            {CONFERENCES.map((pub) => (
              <article key={pub.title}>
                <h4 className="text-base font-bold text-gray-800 mb-2">{pub.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{pub.authors}</p>
                <p className="text-sm text-gray-500">{pub.venue}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
