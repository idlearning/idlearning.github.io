import { createFileRoute } from "@tanstack/react-router";

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
      { property: "og:url", content: "/people" },
    ],
    links: [{ rel: "canonical", href: "/people" }],
  }),
  component: PeoplePage,
});

function LinkedInIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.15 15.24v-4.04h-1.3v4.04h1.3zm.67-10.97c-.45 0-.82.37-.82.82s.37.82.82.82.82-.37.82-.82-.37-.82-.82-.82zm5.72 10.97h-1.3v-4.04h1.3v4.04zm.66-10.97c-.45 0-.82.37-.82.82s.37.82.82.82.82-.37.82-.82-.37-.82-.82-.82z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function PeoplePage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      {/* Professor */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-idl-blue mb-6">Professor</h2>
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <img
            alt="Hyo-Jeong So"
            className="w-48 h-48 rounded-lg object-cover bg-gray-200"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOCfxy1HI3JTY6YOgiWHeVYXeaRHrxjH7FG7zH7Ble2IsuzbN2yMw0Lfd5luUWaS4K-s-xTWsBVc6WDgstMkKX5rgmNZRKuUtdPP5d9nBekvN1iqMiw7YXILo6Khm15u4O7NWZDJjeHFJzC8LtppKVt0dna5aNdTg8igavw3ixcKGCLQ3Q9uAY2iJopzNlnJFUtruRPL363K70lfBry0abg1OYmSzKsb3SsX4Ax62twJxTSeNsy3F9"
          />
          <div>
            <div className="flex items-end gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">소효정</h3>
              <span className="text-gray-500 text-sm mb-1">Hyo-Jeong So</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">hyojeongso@ewha.ac.kr</p>
            <div className="flex gap-2">
              <a className="text-gray-700 hover:text-black" href="#" aria-label="LinkedIn">
                <LinkedInIcon className="w-6 h-6" />
              </a>
              <a className="text-gray-700 hover:text-black" href="#" aria-label="Homepage">
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Students */}
      <section>
        <h2 className="text-2xl font-semibold text-idl-blue mb-6">Students</h2>
        <div className="flex gap-3 mb-10">
          <button className="px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-800 font-medium transition-colors">
            Doctoral Student
          </button>
          <button className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            Master's Student
          </button>
          <button className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            Alumni
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-idl-blue mb-8">Doctoral Student</h3>
          <div className="flex flex-col gap-12">
            {/* Student 1 */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <img
                alt="Sungeun Kim"
                className="w-44 h-44 rounded-lg object-cover bg-gray-200 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgcMvMhZncCKd5IzjUTWe8q2dX8gbrM1x3ctnfS-FOVofRdG2jp-NjQeC755Pmh0m32jD-j3TD-ztoLQ6FxPv2g27sUxp_iOkvAvxDwYB-NDQe543mjzoio-XPRq_fAnvcCP6R3TVcpFTZiwhlHEqUoUD5XKDo5Vf3KUdUcNLewTIXWCpdOgRVNSwX6jc0WD1lcpAYTghEU8a9W3c7_-LDtj8mbOgevlw84EsXWP6fyPVXm__TpwQk"
              />
              <div className="text-sm">
                <div className="flex items-end gap-2 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">김성은</h4>
                  <span className="text-gray-500 mb-0.5">Sungeun Kim</span>
                </div>
                <p className="text-gray-600 mb-4">soul_81@naver.com</p>
                <div className="grid grid-cols-[100px_1fr] gap-y-1 mb-2">
                  <div className="font-semibold text-gray-800">관심분야</div>
                  <div className="text-gray-600">GBL, CSCL</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-y-1">
                  <div className="font-semibold text-gray-800">교육 및 경력</div>
                  <div className="text-gray-600">
                    이화여자대학교 교육대학원 교육공학과 석사
                    <br />
                    이화여자대학교 경영학과 학사
                  </div>
                </div>
              </div>
            </div>

            {/* Student 2 */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <img
                alt="Hyosung Park"
                className="w-44 h-44 rounded-lg object-cover bg-gray-200 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd4YH9r9841oUArcZPbkD0H_xIu2YfiC52aiHxUOf93BC-scKQLrwJOZa8AUr87JO0w466z_zLDJPFByjTt-BhEvVJe9ADeIYkQfPiY_j_fcHvDjgcFTIKqMUol9dsqGpKBovS5czAhEfQ6OXtTBZfeoBYiqlVapJMcblZwNwQvh9smLvSf1VkYkGMFmIx_GiX_dwNHC-sF9lX-6Vl8ELRWEcmO0WhFq1cM8BIcUgDApPHWA-lcuQP"
              />
              <div className="text-sm w-full">
                <div className="flex items-end gap-2 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">박효성</h4>
                  <span className="text-gray-500 mb-0.5">Hyosung Park</span>
                </div>
                <p className="text-gray-600 mb-2">hyosungpark@ewhain.net</p>
                <a
                  className="text-gray-700 hover:text-black inline-block mb-4"
                  href="#"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
                <div className="grid grid-cols-[100px_1fr] gap-y-1 mb-2">
                  <div className="font-semibold text-gray-800">관심분야</div>
                  <div className="text-gray-600">AIED, GBL</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-y-1 mb-2">
                  <div className="font-semibold text-gray-800">교육 및 경력</div>
                  <div className="text-gray-600">
                    이화여자대학교 교육대학원 교육공학과 석사
                    <br />
                    한국과학기술원(KAIST) 생명화학공학과 석사
                    <br />
                    연세대학교 화학공학과 학사
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-y-1">
                  <div className="font-semibold text-gray-800">석사학위논문</div>
                  <div className="text-gray-600 underline">
                    비대면 원격강의에서 대학생이 인식하는 학습실재감이 학습성과에 미치는 영향
                  </div>
                </div>
              </div>
            </div>

            {/* Student 3 */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <img
                alt="Ga Young Lee"
                className="w-44 h-44 rounded-lg object-cover bg-gray-200 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_iLvK9PnuK23M1K0nVdQUmhbcl67AoCtzDLvN_TLYkLd0CaVg1eLGTRJ9Am1S-bm0SIaC4Mkg6MqirC_N5iW9i_Fhs4nYz1uw0s10pp_DiSipU9OmeZTvtu1YlDHjL3togcS7jBRp6OnxCxKvw6L0NJdqXh1Zwuktx564VdSPtHKQWzVU7ZOynTQa4bejJHUttUIChVWu2V_gJ7Y3J0ZMyewG52mu_ambBHCIWW9KuSzEjCilCFe"
              />
              <div className="text-sm">
                <div className="flex items-end gap-2 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">이가영</h4>
                  <span className="text-gray-500 mb-0.5">Ga Young Lee</span>
                </div>
                <p className="text-gray-600">lgy1202@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
