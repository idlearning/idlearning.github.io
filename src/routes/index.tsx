import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IDL Lab — Interaction Design for Learning" },
      {
        name: "description",
        content:
          "IDL Lab designs innovative and interactive learning experiences by integrating learning sciences, HCI, and emerging technologies.",
      },
      { property: "og:title", content: "IDL Lab — Interaction Design for Learning" },
      {
        property: "og:description",
        content:
          "Designing innovative and interactive learning experiences through learning sciences, HCI, and emerging technologies.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const NEWS_ITEMS = [
  {
    title: "2025년도 교육정보미디어연구 학술우수상 수상",
    date: "2026-06-18",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbZhmEZUM44KTlxI2udvKkJGyhmF09XdoKZfcJ5wtqwlLodRrY5kVxh17Lb6op9gD0wRt26u-qc4OjMeF6CEK_lMWhR7sIg_TEqRP7Sj6qlTejfnn0hOHqqrzLaaSh9gfDYFrX2CcV7eKsbL4xvMOiXEaGWpHVQTmEmY3BIngrOmCpwCyrRRj9LvaeN0BWaYJ5VkbrScRZSPSkOB2z41aO3XqZ3z-ivZjnMkcYViMgGXaclTWycc9B",
    imgClass: "max-h-full max-w-full object-contain",
    wrapClass: "h-40 bg-gray-50 flex items-center justify-center p-4",
  },
  {
    title: "2026 한국교육정보미디어학회 춘계학술대회 최우수논문상 수상",
    date: "2026-06-17",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh_D1IIBCYe71k6BJvAKcxmJ3pmtE3tadkbcdDL_M_E78bUVzI-f1_yrOCc0HUrw9Xg1dmn4zVE3TKhLOP_oVeYiRmjLyrk-wOJZiMTCGtU7rabWkDrOIkAGZ5uWn_V81uVywl0bPxtX_PKZSRZAvkhXcFgCut6tRjSnOHpfw8qEqbKyOWMyEqf6cci5TuSjJCdr5TAn2nFI22VvoMwIeJPpvfOtJB0SlYJa2GkVmtDL4FjZbWEDZX",
    imgClass: "w-full h-full object-cover",
    wrapClass: "h-40 bg-gray-50 overflow-hidden",
  },
  {
    title: "AIED 2026 발표 소식",
    date: "2026-05-26",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyGwg7qZ6mfjrPwBfCT93XnEwU0Q7yA-JvNAUtpTY8U2jFETVFSvN540CsB1h_NV3wyx2NI_dNvAJFWhT9Rt7AX2tqtSskVKv8fvgUOMfCDnXU1v5hDuMn0Cbt0gReYWI161KEXI-MIJD9Je1G7ZmHadejQ5zhKb8nOCa1LQvq_O1cd8lMma6gsNDEnvrsni4haA56_U5SLkn_YybvFlOJJ6FPwCLs17DD_tcdjNCnKUZEDQSn20QD",
    imgClass: "w-full h-full object-contain p-2",
    wrapClass: "h-40 bg-gray-50 overflow-hidden",
  },
  {
    title: "ICLS 2026 발표 소식",
    date: "2026-05-26",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIpty3uRP8TeaXoLqIUHMbNfCnwQ79tQSfco0fYP3O77UHr3YHDgMcHVhD_4v9P77HjgXBRzjjgo0itEyLwAKMtWRO23iNJUmfPo1-8T0lnFIjYB7ehsLlqK7R5_vaXa5CQ8KVhyoXZs-22Nucv7piP_Fr9_GjfgeG_iiHqCwQaF3vJUq8BE_pZHjjiB4En9TOCKTNW-oXUrwNpk2usaSraCvgqJ8EHxjisdfXVMJj_jNAzyA4qyiM",
    imgClass: "w-full h-full object-cover",
    wrapClass: "h-40 bg-gray-50 overflow-hidden",
  },
  {
    title: "석사과정생 김규원, ICALT Student Award 선정",
    date: "2026-05-16",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6LaUhtJAC7ckHpYqKkhl7AKc5OwyzV-g62q87gz8Pvoi-XehzRm50bQbHIhoS2pb9QvviPOU08Ad6vZWFPjcJ5998lv7nsbs7nc6f9rcz1aFdKNCvlbooeeAdbFfmFSmjG89VuaTw3ZufggL-iRmu8CvKWj3KIhFnwuf4iKs5wwFaHgg1f5rEw7q59s50FZ608VLcAG_5CRiFPN3YBMESC3KiTKFRFiEh0rLy7Y2PJJduF-0jUBzp",
    imgClass: "max-h-full max-w-full object-contain",
    wrapClass: "h-40 bg-red-800 overflow-hidden flex items-center justify-center p-4",
  },
];

function HomePage() {
  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-idl-blue mb-8 leading-tight tracking-tight">
            Interaction Design for Learning Lab
          </h1>
          <div className="space-y-6 text-text-main leading-relaxed">
            <p className="text-lg font-medium">
              학습과학, 인간-컴퓨터 상호작용, 그리고 신기술을 융합하여 새롭고 상호작용적인
              학습경험을 디자인하는 것을 목표로 합니다. 학제간 연구 공간으로서 IDL Lab은
              형식학습과 비형식학습을 아우르는 다양한 교육환경에서 적용 가능한 학습경험
              디자인을 탐구하고 발전시키고자 합니다.
            </p>
            <p className="text-lg">
              We aim to design innovative and interactive learning experiences by
              integrating learning sciences, human-computer interaction, and emerging
              technologies. As an interdisciplinary research space, the IDL Lab explores
              and advances learning experience design that can be applied across various
              educational environments, encompassing both formal and informal learning
              settings.
            </p>
          </div>
        </div>
        {/* Featured Project */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-idl-blue mb-6">Research Projects</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-gray-100">
            <img
              alt="Featured Research Project Diagram"
              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-md mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWOSDZKY-tsuwZ6RnDefrVANCT3lcgkhriizYFSPWp9MXzto-y76vzqOvar75eSGHpVQG6mgSPosKaJ3J49xf_YOPByPE6DOe-QrUjJV7HfZX4XKHXEOdHxc1UfXOtLovMHGlsqpmF-wiSzQoP8PGVCm28vdRdJS-3ySt2tz-z3zRqyr7HuvhCoKmICUmoTnV8UOmdbT47EmYm56M1WHZHvUEHpvOt81XVO0pwUGFFgrsc6w7y5qon"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold leading-snug drop-shadow-md">
                생성형 AI 시대의 교사역량 강화
              </h3>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button
                aria-label="Slide 1"
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              />
              <button aria-label="Slide 2" className="w-6 h-2 rounded-full bg-white" />
              <button
                aria-label="Slide 3"
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              to="/projects"
              className="text-text-muted hover:text-text-main flex items-center transition-colors"
            >
              More Projects
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-idl-blue mb-8">News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {NEWS_ITEMS.map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className={item.wrapClass}>
                <img alt={item.title} className={item.imgClass} src={item.img} />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-text-main mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 text-xs text-text-muted">{item.date}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
