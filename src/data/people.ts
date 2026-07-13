// Single source of truth for lab members.

export type PersonRole = "professor" | "doctoral" | "masters" | "alumni";

export type Person = {
  id: string;
  /** Korean name. Optional — international students may not have one. */
  nameKo?: string;
  nameEn: string;
  role: PersonRole;
  /** International student: display the English name only, no Korean form. */
  international?: boolean;
  email?: string;
  img?: string;
  /** Shown for current students. */
  interests?: string;
  /** Education & career lines. Shown for current students. */
  education?: string[];
  /** Master's thesis — shown for doctoral students. */
  thesis?: string;
  /** Master's thesis PDF URL — renders a link icon next to the title. */
  thesisUrl?: string;
  /** Current affiliation — shown for alumni. */
  affiliation?: string;
  /** Degree dissertation — shown for alumni. */
  dissertation?: string;
  /** Dissertation PDF URL — renders a link icon next to the title. */
  dissertationUrl?: string;
  /** Degree earned in the lab, for alumni. Renders a "Ph.D." / "M.A." tag. */
  alumniDegree?: "phd" | "ma";
  /** Graduation year, for alumni. Used to group the Alumni section by year. */
  gradYear?: number;
  /** Google Scholar profile URL. */
  scholar?: string;
  /** Personal homepage URL. Also used to link this person's name in publications. */
  homepage?: string;
};

export const PEOPLE: Person[] = [
  {
    id: "hyojeong-so",
    nameKo: "소효정",
    nameEn: "Hyo-Jeong So",
    role: "professor",
    email: "hyojeongso@ewha.ac.kr",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOCfxy1HI3JTY6YOgiWHeVYXeaRHrxjH7FG7zH7Ble2IsuzbN2yMw0Lfd5luUWaS4K-s-xTWsBVc6WDgstMkKX5rgmNZRKuUtdPP5d9nBekvN1iqMiw7YXILo6Khm15u4O7NWZDJjeHFJzC8LtppKVt0dna5aNdTg8igavw3ixcKGCLQ3Q9uAY2iJopzNlnJFUtruRPL363K70lfBry0abg1OYmSzKsb3SsX4Ax62twJxTSeNsy3F9",
  },
  {
    id: "sungeun-kim",
    nameKo: "김성은",
    nameEn: "Sungeun Kim",
    role: "doctoral",
    email: "soul_81@naver.com",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgcMvMhZncCKd5IzjUTWe8q2dX8gbrM1x3ctnfS-FOVofRdG2jp-NjQeC755Pmh0m32jD-j3TD-ztoLQ6FxPv2g27sUxp_iOkvAvxDwYB-NDQe543mjzoio-XPRq_fAnvcCP6R3TVcpFTZiwhlHEqUoUD5XKDo5Vf3KUdUcNLewTIXWCpdOgRVNSwX6jc0WD1lcpAYTghEU8a9W3c7_-LDtj8mbOgevlw84EsXWP6fyPVXm__TpwQk",
    interests: "GBL, CSCL",
    education: ["이화여자대학교 교육대학원 교육공학과 석사", "이화여자대학교 경영학과 학사"],
  },
  {
    id: "hyosung-park",
    nameKo: "박효성",
    nameEn: "Hyosung Park",
    role: "doctoral",
    email: "hyosungpark@ewhain.net",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd4YH9r9841oUArcZPbkD0H_xIu2YfiC52aiHxUOf93BC-scKQLrwJOZa8AUr87JO0w466z_zLDJPFByjTt-BhEvVJe9ADeIYkQfPiY_j_fcHvDjgcFTIKqMUol9dsqGpKBovS5czAhEfQ6OXtTBZfeoBYiqlVapJMcblZwNwQvh9smLvSf1VkYkGMFmIx_GiX_dwNHC-sF9lX-6Vl8ELRWEcmO0WhFq1cM8BIcUgDApPHWA-lcuQP",
    interests: "AIED, GBL",
    education: [
      "이화여자대학교 교육대학원 교육공학과 석사",
      "한국과학기술원(KAIST) 생명화학공학과 석사",
      "연세대학교 화학공학과 학사",
    ],
    thesis: "비대면 원격강의에서 대학생이 인식하는 학습실재감이 학습성과에 미치는 영향",
  },
  {
    id: "gayoung-lee",
    nameKo: "이가영",
    nameEn: "Ga Young Lee",
    role: "doctoral",
    email: "lgy1202@gmail.com",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB_iLvK9PnuK23M1K0nVdQUmhbcl67AoCtzDLvN_TLYkLd0CaVg1eLGTRJ9Am1S-bm0SIaC4Mkg6MqirC_N5iW9i_Fhs4nYz1uw0s10pp_DiSipU9OmeZTvtu1YlDHjL3togcS7jBRp6OnxCxKvw6L0NJdqXh1Zwuktx564VdSPtHKQWzVU7ZOynTQa4bejJHUttUIChVWu2V_gJ7Y3J0ZMyewG52mu_ambBHCIWW9KuSzEjCilCFe",
  },
  {
    id: "lingxi-jin",
    nameEn: "Lingxi Jin",
    role: "doctoral",
    international: true,
  },
  {
    id: "eunyoung-kim",
    nameKo: "김은영",
    nameEn: "Eunyoung Kim",
    role: "doctoral",
  },
  {
    id: "kyuwon-kim",
    nameKo: "김규원",
    nameEn: "Kyuwon Kim",
    role: "masters",
  },
  {
    id: "yeji-ko",
    nameKo: "고예지",
    nameEn: "Yeji Ko",
    role: "masters",
  },
  {
    id: "hyeji-jang",
    nameKo: "장혜지",
    nameEn: "Hyeji Jang",
    role: "alumni",
    alumniDegree: "ma",
    gradYear: 2024,
  },
];

export const getPeopleByRole = (role: PersonRole): Person[] =>
  PEOPLE.filter((p) => p.role === role);

/** Finds a person by English display name (used to link publication authors). */
export const getPersonByEnName = (nameEn: string): Person | undefined =>
  PEOPLE.find((p) => p.nameEn === nameEn);
