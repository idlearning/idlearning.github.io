import { createFileRoute } from "@tanstack/react-router";

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

const PROJECTS = [
  {
    title: "AI 윤리교육을 위한 대화형 게임 플랫폼 설계 및 효과성 검증",
    subtitle: "Design and Evaluation of the Dialogue Game Platform for AI Ethics Education",
    period: "2024/05/01 - 2026/04/30",
    funder: "한국연구재단",
    members: "소효정, 김성은, Wang Yue, 고예지, 김규원, 이진희, 박시은",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc7S4MGNhfrJQmmkFYEhVswEqvccCyyw7YQf6Y2IbGu-ogDBvy4gGYEXo2hCFceuNpjU4iAijKWbZkgjkXbMUEYtjeeaK84JeYFbVJfDaKbm0Gt16iGkAlp6ZZ1GiVt_M8P0b-DttaLvmtHDPXx3Awfed6NxOXjTboHs4D5A7Sv7fi8yPU2ECXLUxeEwDr7pbWaMQzknKTw85KL8yLNYpcpGUJkK0U3LQKZ27KDDYDcldemqr3_7fU",
    description:
      "인공지능(AI)이 우리 사회 전반에 적용되면서 AI의 긍정적인 기능뿐만 아니라 데이터 편향성, 책임 귀속 문제 등 다양한 윤리적 이슈에 대한 사회적 담론이 형성되고 있다. 특히, 오늘날의 AI는 의사 결정을 수행하는 자율 시스템으로 발전하면서 기술과 인간을 둘러싼 복합적인 문제가 발생하고 있으며, 이에 따라 기존의 도덕적, 사회문화적, 법적 규범을 고려한 인간의 윤리적 판단이 더욱 중요해지고 있다. 그러나 이러한 사회적 요구와 필요성에도 불구하고, AI 윤리를 효과적으로 교육하기 위한 교수-학습 방법에 대한 논의는 아직 부족한 실정이다. 현재 AI 윤리 교육은 주로 교과서 중심의 개념적 학습이나 교조적인 원칙 중심 방식으로 이루어져 있어, 학습자들이 AI 윤리 쟁점에 내재된 다양한 요소들의 복잡성을 이해하고 도덕적 추론을 수행하는 데 어려움을 겪을 수 있다. 이러한 문제를 해결하기 위해, 본 연구는 도덕적 추론과 사고 중심의 AI 윤리 교수-학습을 지원하는 대화형 게임 플랫폼을 개발하고, 이를 실제 교육 현장에 적용하여 효과성을 검증하고자 한다. 이를 통해 학습자들이 보다 능동적으로 AI 윤리를 탐구하고, 윤리적 사고력을 키울 수 있는 새로운 학습 방식을 제안하고자 한다.",
  },
  {
    title: "생성형 인공지능 시대의 창의적 문제해결을 위한 교사역량 강화 프로그램",
    subtitle:
      "Enhancing Teacher Competencies for Creative Problem Solving in the Era of Generative Artificial Intelligence",
    period: "2023/10/01 - 2024/09/30",
    funder: "한국연구재단",
    members: "소효정, 이초희, 김수진",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpkyZAaFRnbUgt28_XqF6yV7rwuZNZQg7jQV_m19ReAnuiPCCgmGW5oTSrsTjrXZ-1wVlHVqlmWGiQ20DV54tPi6B51XJSLfdqh7MsnbikPUmnVPRJdgk6VxhJG0eVhV7JGg9vnlyRoCpwf9bVtfvQ9M8e1-Zj1ZKJcK9LNPtNlulSmodpYrYe4GI6O4r9_rU35zNv2xy6CFwb7FQu-gRF7zF9IHHqyHMNPASjzyNyoZG6bwyKLZoV",
    description:
      "생성형AI와 같은 기술이 보편화되면서, 학습자에게는 이러한 지능형 도구를 활용해 창의적으로 문제를 해결할 수 있는 역량이 요구되고 있다. 본 연구는 풍부한 교육 테크놀로지 기반 연구 경험을 갖춘 한국 이화여자대학교와, 실천 중심 교사 연구에 대한 전문성을 갖춘 인도네시아 Universitas Sebelas Maret 연구진의 협력을 통해 교사들이 생성형AI 시대에 학습자의 창의적 문제해결 능력을 효과적으로 지원할 수 있도록 돕는 교사 역량 강화 프로그램을 설계하고 적용하는 것을 목표로 하였다. 이를 통해 양국의 공통 교육 과제인 창의적 인재 양성과 AI 활용 교육 분야의 발전에 기여하고, 장기적인 국제 연구 협력의 기반을 마련하고자 하였다.",
  },
  {
    title: "스마트 디바이스 기반 SW 및 AI융합교육 현황 및 요구도 조사",
    subtitle:
      "Survey on the Status and Needs of Smart Device-based SW and AI Convergence Education",
    period: "2021/10/01 - 2021/12/31",
    funder: "Google for Education",
    members: "소효정, 이가영(이화여대), 김동심(한신대), 박주연(덕성여대)",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCH2vK2ev7FymduQTLzzwL6vDdDJstzPaVNMQjTkoeMO7YN1yl2ziYtKVj6Xf_GZTQtmVmbuh75t3FMIEfhHAxgRI7AHVGTN6Q6BIi3zKsJAKZsuyq9OdRLFHPL6zSD08G_Pj0sUthztQEn-NSVE20bQVnNP5tUbDckB_OY6UqDR1CM7EHtZapWTDfbvjpShg3gRLr0Cu2gr-2Xjep_MxqAymY2umjL5EryelWeeplne-2l5WLyze6",
    description: null,
  },
];

function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 lg:px-8 max-w-5xl py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-idl-blue mb-8">Projects</h1>
      </div>
      <div className="flex flex-col gap-16">
        {PROJECTS.map((project) => (
          <article key={project.title} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex-shrink-0 flex items-center justify-center p-4">
                <img
                  alt={project.title}
                  className="w-full h-auto object-contain max-h-48 rounded shadow-sm border border-gray-200"
                  src={project.img}
                />
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-idl-blue mb-1">{project.title}</h2>
                <p className="text-sm text-gray-400 mb-6">{project.subtitle}</p>
                <table className="text-sm text-gray-600 w-full max-w-md">
                  <tbody>
                    <tr>
                      <th className="text-left font-medium w-24 py-1 align-top">연구 기간</th>
                      <td className="py-1">{project.period}</td>
                    </tr>
                    <tr>
                      <th className="text-left font-medium w-24 py-1 align-top">지원기관</th>
                      <td className="py-1">{project.funder}</td>
                    </tr>
                    <tr>
                      <th className="text-left font-medium w-24 py-1 align-top">참여연구원</th>
                      <td className="py-1">{project.members}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {project.description && (
              <div
                className="text-sm text-gray-600 text-justify leading-relaxed"
                style={{ wordBreak: "keep-all" }}
              >
                {project.description}
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
