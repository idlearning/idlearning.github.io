// Pull lab content from a public Google Sheet and regenerate the JSON seeds in
// src/data/generated/*.json that the data modules import.
//
// The sheet is read as CSV (no API key needed; sharing must be set to "Anyone
// with the link" as Viewer). Column mapping is by header NAME, so column order
// is irrelevant and Google Form response tabs work too.
//
// Safe by design:
//   - If scripts/sheets.config.json has no spreadsheetId, this is a no-op and the
//     committed seeds are kept (so local/CI builds work before setup is done).
//   - If a single tab fails to fetch/parse, its existing JSON seed is kept.
//
// Usage: node scripts/sync-sheets.mjs   (also: npm run sync)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const genDir = resolve(root, "src/data/generated");
const config = JSON.parse(readFileSync(resolve(root, "scripts/sheets.config.json"), "utf8"));

// --- tiny RFC-4180 CSV parser (handles quoted fields, embedded newlines/commas/quotes) ---
function parseCSV(text) {
  // Normalize newlines; strip a leading BOM if present.
  text = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else field += c;
    }
  }
  // flush last field/row (unless the file ended on a clean newline with no trailing data)
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? "").trim();
    });
    return obj;
  });
}

// --- helpers ---
const clean = (v) => (v == null ? "" : String(v).trim());
const slug = (s) =>
  clean(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "item";

/** Split "A, B, C & D" into ["A","B","C","D"]. */
const splitAuthors = (s) =>
  clean(s)
    .split(/,\s*|\s*&\s*|\s+and\s+/i)
    .map((x) => x.trim())
    .filter(Boolean);

/** Split "a; b; c" (or newlines) into a trimmed array. */
const splitLines = (s) =>
  clean(s)
    .split(/\s*;\s*|\n+/)
    .map((x) => x.trim())
    .filter(Boolean);

const stripDoi = (s) => clean(s).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

/** Truthy for spreadsheet flag cells like 1 / TRUE / O / Y; falsy for 0 / X / - / blank. */
const isTrue = (v) => {
  const s = clean(v).toLowerCase();
  return s !== "" && !["0", "false", "no", "n", "-", "x", "false"].includes(s);
};

/** Set key on obj only when value is a non-empty string. */
const put = (obj, key, val) => {
  const v = clean(val);
  if (v) obj[key] = v;
};

// --- per-dataset transforms ---
const STATUS_ROLE = {
  지도교수: { role: "professor" },
  "박사 또는 통합 재학": { role: "doctoral" },
  "석사 재학": { role: "masters" },
  "박사 졸업": { role: "alumni", alumniDegree: "phd" },
  "석사 졸업": { role: "alumni", alumniDegree: "ma" },
};

function transformPeople(rows) {
  const usedIds = new Set();
  const makeId = (nameEn, role) => {
    let base = slug(nameEn);
    if (!usedIds.has(base)) {
      usedIds.add(base);
      return base;
    }
    let candidate = role === "alumni" ? `${base}-alumni` : `${base}-2`;
    let n = 2;
    while (usedIds.has(candidate)) candidate = `${base}-${++n}`;
    usedIds.add(candidate);
    return candidate;
  };
  return rows
    .filter((r) => clean(r["영문명"]))
    .map((r) => {
      const status = clean(r["상태"]);
      const mapped = STATUS_ROLE[status] || { role: "alumni", alumniDegree: "ma" };
      const nameKo = clean(r["한국어명"]);
      const p = {
        id: makeId(r["영문명"], mapped.role),
        nameEn: clean(r["영문명"]),
        role: mapped.role,
      };
      if (nameKo) p.nameKo = nameKo;
      else if (mapped.role !== "professor") p.international = true;
      put(p, "email", r["이메일"]);
      put(p, "img", r["사진"] || r["사진 URL"] || r["photo"]);
      put(p, "interests", r["관심분야"]);
      const edu = splitLines(r["교육 및 경력"]);
      if (edu.length) p.education = edu;
      put(p, "thesis", r["석사학위논문"]);
      put(p, "thesisUrl", r["석사학위논문 링크"]);
      put(p, "affiliation", r["소속"]);
      put(p, "dissertation", r["학위논문"]);
      put(p, "dissertationUrl", r["학위논문 링크"]);
      if (mapped.alumniDegree) p.alumniDegree = mapped.alumniDegree;
      const gy = clean(r["졸업연도"]);
      if (gy && !Number.isNaN(Number(gy))) p.gradYear = Number(gy);
      put(p, "scholar", r["구글 스칼라"]);
      put(p, "homepage", r["개인 홈페이지"]);
      return p;
    });
}

function transformProjects(rows) {
  return rows
    .filter((r) => clean(r["영문명"]) || clean(r["한국어명"]))
    .map((r) => {
      const titleKo = clean(r["한국어명"]);
      const titleEn = clean(r["영문명"]);
      const proj = {
        id: slug(titleEn || titleKo),
        titleKo, // may be "" — the UI falls back to titleEn
        titleEn,
        period: clean(r["연구 기간"]),
        funder: clean(r["지원기관"]),
        members: clean(r["참여연구원"]),
      };
      put(proj, "img", r["이미지 URL"] || r["이미지"]);
      proj.description = clean(r["프로젝트 설명"]);
      const rel = splitLines(r["연관 논문 ID"]).map((x) => x.replace(/,+$/, "").trim());
      if (rel.length) proj.relatedPubIds = rel;
      return proj;
    });
}

function transformPublications(rows) {
  return rows
    .filter((r) => clean(r["title"]))
    .map((r) => {
      const type = clean(r["type"]).toLowerCase() || "journal";
      const journal = clean(r["journal"]);
      const vol = clean(r["volume_issue"]);
      let venue = clean(r["venue"]);
      if (!venue)
        venue = type === "journal" && journal ? journal + (vol ? `, ${vol}` : "") : journal;

      const badges = [];
      const award = clean(r["award"]).replace(/🏆/g, "").trim();
      if (award) badges.push({ label: award, kind: "award" });
      const indexCol = clean(r["index"]);
      if (indexCol) {
        indexCol
          .split(/[;,]/)
          .map((x) => x.trim())
          .filter(Boolean)
          .forEach((label) => badges.push({ label, kind: "index" }));
      } else {
        if (isTrue(r["ssci"])) badges.push({ label: "SSCI", kind: "index" });
        if (isTrue(r["scopus"])) badges.push({ label: "SCOPUS", kind: "index" });
        if (isTrue(r["kci"])) badges.push({ label: "KCI", kind: "index" });
      }

      const pub = {
        id: clean(r["id"]) || `${type.slice(0, 4)}-${slug(r["title"])}`,
        title: clean(r["title"]),
        authors: splitAuthors(r["authors"]),
        venue,
        year: Number(clean(r["year"])) || 0,
        type,
      };
      if (badges.length) pub.badges = badges;
      const doi = stripDoi(r["doi"]);
      if (doi) pub.doi = doi;
      put(pub, "pdf", r["pdf"]);
      put(pub, "acmdl", r["acmdl"]);
      put(pub, "website", r["website"]);
      return pub;
    });
}

function transformNews(rows) {
  return rows
    .filter((r) => clean(r["title"] ?? r["제목"]))
    .map((r) => {
      const item = {
        title: clean(r["title"] ?? r["제목"]),
        date: clean(r["date"] ?? r["날짜"]).slice(0, 10),
        img: clean(r["img"] ?? r["썸네일"]),
      };
      put(item, "contentKo", r["contentKo"] ?? r["국문 본문"]);
      put(item, "contentEn", r["contentEn"] ?? r["영문 본문"]);
      return item;
    });
}

const TRANSFORMS = {
  people: transformPeople,
  projects: transformProjects,
  publications: transformPublications,
  news: transformNews,
};

// Google's gviz CSV endpoint (tqx=out:csv&sheet=<name>) can serve a stale cached
// response for a few minutes right after an edit. The /export?format=csv&gid=<id>
// endpoint reliably reflects the latest content, but needs a numeric gid rather
// than a tab name. We discover name->gid by scraping the public htmlview page
// (which lists every tab's gid), then fetch export by gid. If that discovery
// fails for any reason, fall back to the gviz-by-name endpoint.
async function fetchTabGids(spreadsheetId) {
  const res = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview`);
  if (!res.ok) throw new Error(`htmlview HTTP ${res.status}`);
  const html = await res.text();
  const gids = {};
  const re = /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(html))) {
    gids[m[1].replace(/\\"/g, '"')] = m[2];
  }
  return gids;
}

async function fetchCsv(spreadsheetId, tabName, gidByName) {
  const gid = gidByName?.[tabName];
  if (gid != null) {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const res = await fetch(url, { redirect: "follow" });
    if (res.ok) return res.text();
    // fall through to the gviz fallback below on failure
  }
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for tab "${tabName}"`);
  return res.text();
}

async function main() {
  const spreadsheetId = clean(config.spreadsheetId);
  if (!spreadsheetId) {
    console.log(
      "[sync] No spreadsheetId configured in scripts/sheets.config.json — keeping existing seeds.",
    );
    return;
  }
  let gidByName = {};
  try {
    gidByName = await fetchTabGids(spreadsheetId);
  } catch (err) {
    console.warn(
      `[sync] could not discover tab gids (${err.message}) — falling back to gviz by name.`,
    );
  }

  let anyChange = false;
  for (const [key, tabName] of Object.entries(config.tabs)) {
    const outPath = resolve(genDir, `${key}.json`);
    try {
      const csv = await fetchCsv(spreadsheetId, tabName, gidByName);
      const rows = parseCSV(csv);
      const data = TRANSFORMS[key](rows);
      if (!data.length) throw new Error(`tab "${tabName}" produced 0 rows`);
      const next = JSON.stringify(data, null, 2) + "\n";
      const prev = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
      if (next !== prev) {
        writeFileSync(outPath, next, "utf8");
        anyChange = true;
      }
      console.log(
        `[sync] ${key}: ${data.length} rows${next !== prev ? " (updated)" : " (unchanged)"}`,
      );
    } catch (err) {
      console.warn(`[sync] ${key}: FAILED (${err.message}) — keeping existing ${key}.json`);
    }
  }
  console.log(anyChange ? "[sync] done (some files updated)." : "[sync] done (no changes).");
}

// Only run the CLI when executed directly (not when imported for testing).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { parseCSV, transformPeople, transformProjects, transformPublications, transformNews };
