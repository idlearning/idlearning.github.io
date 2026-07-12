// Single source of truth for lab news.
//
// The News page renders this whole list; the Home page pulls the latest few
// items via `getLatestNews()`. Keep dates in ISO `YYYY-MM-DD` format so they
// sort correctly as strings.

export type NewsItem = {
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  img: string;
  /** Optional Tailwind classes for the image wrapper (falls back to a default). */
  wrapClass?: string;
  /** Optional Tailwind classes for the <img> (falls back to a default). */
  imgClass?: string;
};

export const NEWS_WRAP_DEFAULT =
  "h-40 overflow-hidden bg-gray-100 flex items-center justify-center";
export const NEWS_IMG_DEFAULT = "w-full h-full object-cover";

export const NEWS: NewsItem[] = [
  {
    title: "2025년도 교육정보미디어연구 학술우수상 수상",
    date: "2025-06-18",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBd0dXaIMbNeBlj-Y-T1XcHDZ56cEf7dMU8LCGnm6-6YZeVsxUrMyGEzYPQDsBjM_aCwUpFBVblR37EtLCvYamqTpSYhofmlRcXkjBlqwNCEFmMNmm05OCjnkDIIiPh8uWH5x504P-3yjg2nc-Ee9ttymv5kXduuyiyvICBXlKgYjiPdhp7aNNmfvhmJ2Gbt8b8zCXvT6wGNlKvnimwBH_mI6-DzEzbVy-c7i4WY2uUy4LG4YXM-t9",
  },
  {
    title: "2025 한국교육정보미디어학회 춘계학술대회 최우수논문상 수상",
    date: "2025-06-17",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPihiS1niNiQgNZJywDSx9RxEmQqU0lZk4X3qbKGu0jpZlPns72ZSxtmbhYO2UO4OXmbfPh_MWibu8sK1v1ynw4V_yBTV7-CbdFJS9FvTaDwbCtlbLpSFoEByJuheQ6Q-HgRh2bMTckxW2X9ZIRFl1y-Q36oBxyoZI9CAb7Xrs8NUXytLeBtjDB06xl0zphlEHVmKMpyDMbyo3JeDDdPEqy6vFpk1iIBNCcxZAPb9tAIejI3Tx6LLa",
  },
  {
    title: "AIED 2025 발표 소식",
    date: "2025-05-26",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIji6YtQgK-UEjZGwa1Sg11wYnyfOjgLJQFxNT0SV9fBf7-PGIPrdLNZiOstKZjtdDwY7zS9rY6WKtOEBez6pjiNJnb3_sjE92SuOy5KtgMLu1YSzwDpdAqlY6riVrppNCQaSZ2a7ttky-Wl29PvZuld9tgdCH24ontBnL19reAoFgi3YWZIykVetYycUUvl3WHSv-8iTphr8QfVIFpXzGBLXUtGjR6AynmYhrFG6Q_-EtjpNODXgw",
    imgClass: "w-full h-full object-contain",
  },
  {
    title: "ICLS 2025 발표 소식",
    date: "2025-05-26",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9XwCf4y3WDl9JAMFtHg4zxjbi-E9LKxNE5qyMY5s2eL7A_9UrYHTSfiOUNnUoxCpVItufExVwnpnRIImQuw1gP18qxUep_V21uxRnXsLAHBIQ8diNHVZsfaeLXSC2SlWbSmczjhEJSgUIMn2E_jb7nexbvvK41DU6j-UL9sYEaYBJB5p6yop6aPEcLMtAPwKmrC9_kGA9Vgxh7Oo5dMAlfrowut76s12gJmipGxrd7jF-WC4YWPds",
  },
  {
    title: "[Alumni] 장혜지 박사, 한국교육공학회 우수박사학위논문상 수상",
    date: "2025-05-16",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmMeAS4IA5F6r99x5cPJ5j8VnXKkikuts5ZtofHsnQxOYn_LBvtnCIeHgzFcRIQekDHRhH-VHJb_M5TgKYRORQuVvtGfdpHaoD73RWEraSt_BUpi9f51_wRYdbbIb0iMNwhEK8jvyBvn2ZJB8wOFkWb8EowB-p6e9qMSV0p56mQCy7tSFQ9cnHJa_ngG7kZQFjp8sRIok-UVVjRdCj5U-4JSNx_LyiSjKWOGsfhbKnOGfTBwYWLftH",
  },
  {
    title: "석사과정생 김규원, ICALT Student Award 선정",
    date: "2025-05-15",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8bpcu_iE3qwYAlgiXIL-MRrAuJTqOfWfM6xMthLVy7fcNix2IPAEniVZgsmlwYAE8Ok5E3XI2zd10rQDpp_6qe2_GFyrVyjyzdSI0ce0N_ML1Fr7-53j2LQg8wTzDqKoQSEZneFqB01Ltinmbf14ZrVvUwSr0WEEYDmWa2JFqK1ZH2Lf9Fr5dqUfSArDc0BGoSvCfpwDzGXM3MQVsjx3LfdkHso80jiQTQ6eBaW21-3Bl3_6bSJai",
    wrapClass: "h-40 overflow-hidden bg-[#A73A3A] flex items-center justify-center",
  },
  {
    title: "소요정 교수, 2025학년도 이화펠로우 선정",
    date: "2025-04-25",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0nnQpRiHB_50u9HVp0r2W-O2eHFaz7_tAtLa5OFRu3tiIkU0nNvfpFQvDJyhiqL9NdixpS2BxtSdMqhovNf4UGWOVTnA55QU6tpnwol42NrAnmsk4qGFPviF0LR1maiPN424_3oqJQHc41rnXaoO2J1acQcWgD9ZiEQ3-0A9Ci2x-obikoyCjhkBStOMyqsxeQfpwdcuJdVpNl-vUOBOskLESJgPvDdQuQWI5br8MAymflMguAwOM",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-4",
    imgClass: "h-full object-contain",
  },
  {
    title: "LAK 2025 발표 소식",
    date: "2025-04-24",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIG3utVj9ZqnHrVpuZpys7xlA7psU4vlgmVf8IWGChXWMT6c1NLu7ByVbN4ep4twlTee6srPl7MSoLWbLBAGZaUWjaNsmGZ0smwcQ8OXlMEvNkPeRc1tt8oq7VJbZI0OhAUHKfuBUqUx8N0ep8AlRnA2P2_Eg13IPyMxe-4CH5hx7_LS8qRohUOPBlbFs7mLlkNxYMvxv14lgGF0yHbt9yMOvUaRbROiZ9wU9AFpPKFF8emM67W_hC",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-2",
    imgClass: "w-full h-full object-contain",
  },
  {
    title: "박사과정생 김은영, 2025 사이언스큐 (Syensqo) 장학생 최종 선정",
    date: "2025-03-23",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDunRcHMoPLXt2Uxc1i8fA3SFcYliZsXr5VAU0yqDoT5QrysEODlS2WteoX4LNC3xjVoT-hNiNjXY0HfJdKVBfHCbq0LgySr9cM6UtBiLmRqMB2zmE8UY_zy98DQBeU07TPNqDwAISlR2K6XV581O4j9OtFuLdkpNGRSwWkeHsjC6DdgRokDNMmsXN_d0euFIDuhm4MdGu_K08k0hEkdt_RZ9NCcjpKfZD1gnLMZtl2CF3G6ZlOK3OW",
  },
  {
    title: "석사과정생 고예지, 2024학년도 2학기 우수학위논문상 수상",
    date: "2025-03-09",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVTOvKGs1IQ5R_PWkj235r-ny0XDl5TU8qApOKNmrhcrAsuXuIKh-pr3c6Za-aYj3fm4v8jfvB6xDkHuL-2Tm3ry_Cd4UNs17UulpLeDACFOmNuj2rkgQrt2_jfgDN0LQH9JrwfmjPantp6z2XHIkFbsxC1WXjWg7sh_ckhKk5me3bewTi4BFXzCOyFdcpOWARk3aqbC6m55hc9XhFVkm-1MN--ZSplhbUW3QqAwhzHn1hSPMcHrg_",
    wrapClass: "h-40 overflow-hidden bg-gray-100 flex items-center justify-center p-4",
    imgClass: "h-full object-contain",
  },
  {
    title: "SSCI 및 SCOPUS 등재 저널 게재 소식",
    date: "2025-02-05",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW9zKfZI-BJOjEwvfL4s_oY_onsL75ZJ287nt6XNjgsGEkw98D78hgwaY0vCCyGRXR2XUd0b8BbNqh0dUnNLXpRe3BIeW5RCGR6O2dnWbYhrFQpCdB_MJM7t66yi14QvmoDbm3C4HKQdSOhun1z9ABMGLk4p0dd3YlqpfSPFb62uKn_FrP8rjkrdZrxOU3CDZmwNZJuclk-8sCO_yZLXLZRsdmoUlsjufAd9Ljr3ruF09fhmV8oYj0",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-2",
    imgClass: "w-full h-full object-contain",
  },
  {
    title: "SSCI 등재 저널 BJET 및 ET&S 게재 소식",
    date: "2024-11-25",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA52SsadELFoWrb0c2Zo0thciiA9p_1pBlCC03LfzVMnoglYqyL2E__MkVXTgYCNBzPJnWrfWHe6lUREXkL8PNPrIyL9b4gEimTp3PgTDoRJtTzh4MEgn6zciC3kp98eM2FueESCVHUrAP8Q32I3uBm4j5AVmolD1KXd68sh5eg0kme6Gca0zTdqmOHbxFn1pauovNlrW9rFTHy4laBEh2k6--Y4oHn1xIYAnXFTFSvI9Q_BKg1Tb2o",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-2",
    imgClass: "w-full h-full object-contain",
  },
  {
    title: "박사과정생 Lingxi Jin, 이탈리아 정부 초청 장학금 MAECI Grant 선정",
    date: "2024-08-14",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjaVJQNgQXl8VX-wlObOWuOuzB1hZcxCK-oSPezm0QX6tmUH1-h2WQmCFmWjPPq464UfCwoRX2ZPrnNMcM0wsKxWqMRfYXrxYfH353Ml95Qcna66zjdAw2SRtZq-FFe5R4XD61x8pjC9w_JEE2NOzGybBYiLNh901Yb7cgtJ1VpBKduOzWwsg_EMXVto8Zv-C6d9zwZbHt9LCZ3tFTPlIZyKviE7lp_wQgG-nTaJaD9vFWfVm_1OPP",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-4",
    imgClass: "w-full object-contain",
  },
  {
    title: "UIST 2024 발표 소식",
    date: "2024-08-10",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMGTC7kfzJqBI_9ehsJZSYwCUFQ9i9eIS6bqYt_WZoLIGvMyAQO-pIuwH6dx6hAZP2G9B9pVsUtbQCAxsV4OlHX5NnObkOG_IJKaVGXKgzSyHH7WMQC_bduBZul3jwqFFnQ7b5V0bZwATwaKFVnC-6PfFs_DRE_i75hRgSfa7R69mXquY_bmUtCHay9ZbH64SVz-uFyZ1gA0fCgYVbjeZFPGZvDlsPhDUhOcbyRk_j_wa-hMtrmQe2",
    wrapClass: "h-40 overflow-hidden bg-white flex items-center justify-center p-2",
    imgClass: "w-full h-full object-contain",
  },
  {
    title: "ICoME 2024 Young Scholar Award 수상",
    date: "2024-08-10",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSfWBjOiolD3TIRz-l5Q7A_paNHYy06RriytoJEC41nOzk6VocLcFJ0TUs8W2NSI0g_p_-HzZcvxYKYBf2-m3DjkadQuGA_V7bn9JZGPpMopNZc-kryUhpBA5HncG7wu7VZEjZ7cW-pPd2guboZQi6ApUi5Q_DMjkHBttO7B4L8-nICFjUSjYbPVGaBln6qpYZ7qQ3dtSxoe2AMDqxkFTPEVHDyGddnMH1lH8uaV3xOMIIsC5NNolu",
  },
];

/** Returns news sorted newest-first. */
export const getSortedNews = (): NewsItem[] =>
  [...NEWS].sort((a, b) => b.date.localeCompare(a.date));

/** Returns the `count` most recent news items, newest-first. */
export const getLatestNews = (count: number): NewsItem[] => getSortedNews().slice(0, count);
