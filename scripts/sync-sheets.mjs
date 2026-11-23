// Pull lab content from a public Google Sheet and regenerate the JSON seeds in
// src/data/generated/*.json that the data modules import.
//
// The sheet is read as CSV (no API key needed; sharing must be set to "Anyone
// with the link" as Viewer). Column mapping is by header NAME, so column order
// is irrelevant.
//
// A dataset can read SEVERAL tabs (e.g. a hand-edited tab plus a Google Form
// response tab); their rows are concatenated in the order listed in
// scripts/sheets.config.json. A tab's `columns` map renames its headers (form
// question titles) to the canonical headers the transforms below expect, so
// no bridging formulas are needed in the sheet itself.
//
// All shaping happens here, in one place: ids, sorting, news URL slugs, date
// normalization. The sheet only holds raw input.
//
// Safe by design:
//   - If scripts/sheets.config.json has no spreadsheetId, this is a no-op and the
//     committed seeds are kept (so local/CI builds work before setup is done).
//   - If any tab of a dataset fails to fetch/parse, that dataset's existing JSON
//     seed is kept (never a partial dataset).
//   - Data problems (bad dates, unknown types, missing images, ...) are reported
//     as warnings — GitHub Actions annotations in CI — but never block a deploy.
//
// Usage: node scripts/sync-sheets.mjs   (also: bun run sync)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const genDir = resolve(root, "src/data/generated");
const publicDir = resolve(root, "public");

// --- warnings -----------------------------------------------------------------
const warnings = [];
/** Record a data problem; printed at the end (and as a CI annotation). */
function warn(dataset, message) {
  warnings.push({ dataset, message });
}

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

/** Placeholder answers people type into optional form fields ("n/a", "-", "없음"). */
const isPlaceholder = (v) =>
  ["n/a", "na", "-", "--", "x", "none", "없음", "해당없음", "해당 없음"].includes(
    clean(v).toLowerCase(),
  );

const stripDoi = (s) =>
  isPlaceholder(s) ? "" : clean(s).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

/** Truthy for spreadsheet flag cells like 1 / TRUE / O / Y; falsy for 0 / X / - / blank. */
const isTrue = (v) => {
  const s = clean(v).toLowerCase();
  return s !== "" && !["0", "false", "no", "n", "-", "x"].includes(s);
};

/** Set key on obj only when value is a non-empty string. */
const put = (obj, key, val) => {
  const v = clean(val);
  if (v) obj[key] = v;
};

/**
 * Normalize the date formats a sheet/form produces ("2026-11-14",
 * "2026. 11. 14", "2026/11/14", "2026-11-14 9:00:00") to ISO `YYYY-MM-DD`.
 * Returns "" when the value isn't a recognizable date.
 */
function normalizeDate(v) {
  const m = clean(v).match(/^(\d{4})\s*[-./]\s*(\d{1,2})\s*[-./]\s*(\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

/** Collapse whitespace so "A  B" and "A B " count as the same title. */
const titleKey = (s) => clean(s).replace(/\s+/g, " ").toLowerCase();

/**
 * Validate an image cell. Site images live in the repo under public/images/ and
 * are referenced as "/images/...". Google Drive links (what a form's file-upload
 * question stores) can't be embedded, so they're dropped. Returns the usable
 * value or "".
 */
function checkImage(dataset, label, img) {
  const v = clean(img);
  if (!v) return "";
  if (/^https?:\/\/(drive|docs)\.google\.com\//i.test(v)) {
    warn(
      dataset,
      `"${label}": image is a Google Drive link (${v}) — upload the file to public/images/ and enter its /images/... path instead.`,
    );
    return "";
  }
  if (/^https?:\/\//i.test(v)) return v; // external URL: allowed, not checked
  if (!v.startsWith("/")) {
    warn(
      dataset,
      `"${label}": image path "${v}" must start with "/" (e.g. /images/news/file.jpg).`,
    );
    return "";
  }
  if (!existsSync(resolve(publicDir, "." + decodeURI(v)))) {
    warn(dataset, `"${label}": image "${v}" does not exist in public/ — upload it first.`);
    return "";
  }
  return v;
}

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
      const mapped = STATUS_ROLE[status];
      if (!mapped)
        warn("people", `"${clean(r["영문명"])}": unknown 상태 "${status}" — treated as 석사 졸업.`);
      const { role, alumniDegree } = mapped || { role: "alumni", alumniDegree: "ma" };
      const nameKo = clean(r["한국어명"]);
      const p = {
        id: makeId(r["영문명"], role),
        nameEn: clean(r["영문명"]),
        role,
      };
      if (nameKo) p.nameKo = nameKo;
      else if (role !== "professor") p.international = true;
      put(p, "email", r["이메일"]);
      put(p, "img", checkImage("people", p.nameEn, r["사진"] || r["사진 URL"] || r["photo"]));
      put(p, "interests", r["관심분야"]);
      const edu = splitLines(r["교육 및 경력"]);
      if (edu.length) p.education = edu;
      put(p, "thesis", r["석사학위논문"]);
      put(p, "thesisUrl", r["석사학위논문 링크"]);
      put(p, "affiliation", r["소속"]);
      put(p, "dissertation", r["학위논문"]);
      put(p, "dissertationUrl", r["학위논문 링크"]);
      if (alumniDegree) p.alumniDegree = alumniDegree;
      const gy = clean(r["졸업연도"]);
      if (gy && !Number.isNaN(Number(gy))) p.gradYear = Number(gy);
      put(p, "scholar", r["구글 스칼라"]);
      put(p, "homepage", r["개인 홈페이지"]);
      const aliases = splitLines(r["논문 표기 이름"]).filter(
        (a) => a !== p.nameEn && a !== p.nameKo,
      );
      if (aliases.length) p.aliases = aliases;
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
      put(proj, "img", checkImage("projects", titleKo || titleEn, r["이미지 URL"] || r["이미지"]));
      proj.description = clean(r["프로젝트 설명"]);
      const rel = splitLines(r["연관 논문 ID"]).map((x) => x.replace(/,+$/, "").trim());
      if (rel.length) proj.relatedPubIds = rel;
      return proj;
    });
}

const PUB_TYPES = ["journal", "conference", "book"];

function transformPublications(rows) {
  const pubs = rows
    .filter((r) => clean(r["title"]))
    .map((r) => {
      const title = clean(r["title"]);
      let type = clean(r["type"]).toLowerCase();
      if (!PUB_TYPES.includes(type)) {
        warn(
          "publications",
          `"${title}": unknown type "${clean(r["type"])}" — expected journal/conference/book; using journal.`,
        );
        type = "journal";
      }
      const journal = clean(r["journal"]);
      const vol = clean(r["volume_issue"]);
      let venue = clean(r["venue"]);
      if (!venue)
        venue = type === "journal" && journal ? journal + (vol ? `, ${vol}` : "") : journal;

      const badges = [];
      const award = isPlaceholder(r["award"]) ? "" : clean(r["award"]).replace(/🏆/g, "").trim();
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

      const year = Number(clean(r["year"])) || 0;
      if (!year) warn("publications", `"${title}": missing or invalid year "${clean(r["year"])}".`);
      const pub = {
        id: clean(r["id"]),
        title,
        authors: splitAuthors(r["authors"]),
        venue,
        year,
        type,
      };
      if (badges.length) pub.badges = badges;
      const doi = stripDoi(r["doi"]);
      if (doi && !/^10\.\S+\/\S+/.test(doi))
        warn("publications", `"${title}": DOI "${doi}" doesn't look like a DOI (10.xxxx/...).`);
      if (doi) pub.doi = doi;
      put(pub, "pdf", r["pdf"]);
      put(pub, "acmdl", r["acmdl"]);
      put(pub, "website", r["website"]);
      return pub;
    });

  // Auto-assign scheme ids (YYYY-<t>-NNN) to rows with a blank id (e.g. form
  // submissions), continuing the sequence after the highest explicit number for
  // that year+type, in row order — so newer entries get higher numbers. The id
  // isn't shown on the site but drives ordering (newest-first) and Projects'
  // related-publication links.
  const maxSeq = {};
  for (const p of pubs) {
    const m = p.id.match(/^(\d{4})-([a-z])-0*(\d+)$/i);
    if (m) {
      const key = `${m[1]}-${m[2].toLowerCase()}`;
      maxSeq[key] = Math.max(maxSeq[key] || 0, Number(m[3]));
    }
  }
  for (const p of pubs) {
    if (p.id) continue;
    const letter = p.type[0];
    const key = `${p.year}-${letter}`;
    const next = (maxSeq[key] = (maxSeq[key] || 0) + 1);
    p.id = `${p.year}-${letter}-${String(next).padStart(3, "0")}`;
  }

  const seenIds = new Set();
  const seenTitles = new Map();
  for (const p of pubs) {
    if (seenIds.has(p.id)) warn("publications", `duplicate id "${p.id}" ("${p.title}").`);
    seenIds.add(p.id);
    const k = titleKey(p.title);
    if (seenTitles.has(k))
      warn(
        "publications",
        `"${p.title}" appears twice (ids ${seenTitles.get(k)} and ${p.id}) — delete one of the rows.`,
      );
    seenTitles.set(k, p.id);
  }

  // Newest first: year+type group order is decided by the page; id desc within.
  return pubs.sort((a, b) => b.id.localeCompare(a.id));
}

// News URL slugs: date + ASCII-ified title. Korean-only titles reduce to just
// the date, so when several items share a base slug, EVERY one of them gets a
// short title hash — keeping slugs independent of row order. An explicit `slug`
// cell always wins (use it to keep a URL stable after editing a title).
// Changing this algorithm changes published URLs.
function newsSlugBase(item) {
  const titlePart = String(item.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/-+$/, "");
  return titlePart ? `${item.date}-${titlePart}` : item.date;
}

/** Short deterministic FNV-1a hash (base36). */
function shortHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).slice(0, 5);
}

function assignNewsSlugs(items) {
  const baseCounts = new Map();
  for (const item of items) {
    const b = item.slug ?? newsSlugBase(item);
    baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1);
  }
  for (const item of items) {
    if (item.slug) continue;
    const base = newsSlugBase(item);
    item.slug = (baseCounts.get(base) ?? 0) > 1 ? `${base}-${shortHash(item.title)}` : base;
  }
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.slug))
      warn(
        "news",
        `"${item.title}": URL slug "${item.slug}" is used twice — set a different slug.`,
      );
    seen.add(item.slug);
  }
  return items;
}

// News headers (as on the hand-edited News tab): 날짜, 제목, 국문 본문, 영문 본문,
// 썸네일, plus optional `slug` and `사진 업로드` (a form's file-upload answer,
// used only to remind the admin that a photo is waiting to be added).
function transformNews(rows) {
  // Rows with the same title are one item (e.g. a form submission that was also
  // copied into the hand-edited tab, or a corrected re-submission). Merge them
  // field by field; a non-empty value from a LATER row/tab wins.
  const byTitle = new Map();
  for (const r of rows) {
    const title = clean(r["제목"]);
    if (!title) continue;
    const fields = {
      title,
      date: clean(r["날짜"]),
      img: clean(r["썸네일"]),
      slug: clean(r["slug"]),
      contentKo: clean(r["국문 본문"]),
      contentEn: clean(r["영문 본문"]),
      upload: clean(r["사진 업로드"]),
    };
    const k = titleKey(title);
    const prev = byTitle.get(k) ?? {};
    for (const [f, v] of Object.entries(fields)) if (v) prev[f] = v;
    byTitle.set(k, prev);
  }

  const items = [];
  for (const m of byTitle.values()) {
    const date = normalizeDate(m.date);
    if (!date) {
      // Without a date the item can't be sorted or given a URL — leave it out.
      warn(
        "news",
        `"${m.title}": missing or invalid 날짜 "${m.date ?? ""}" (use YYYY-MM-DD) — skipped.`,
      );
      continue;
    }
    if (m.upload && !m.img)
      warn(
        "news",
        `"${m.title}": a photo was submitted (${m.upload}) but 썸네일 is empty — upload it to public/images/news/ and enter its path.`,
      );
    const item = { title: m.title, date, img: checkImage("news", m.title, m.img) };
    put(item, "slug", m.slug);
    put(item, "contentKo", m.contentKo);
    put(item, "contentEn", m.contentEn);
    items.push(item);
  }

  // Stable newest-first order (ties broken by title) so the JSON diff stays quiet.
  items.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return assignNewsSlugs(items);
}

const TRANSFORMS = {
  people: transformPeople,
  projects: transformProjects,
  publications: transformPublications,
  news: transformNews,
};

/** Headers each dataset can't work without (checked after column mapping). */
const REQUIRED_HEADERS = {
  people: ["영문명"],
  projects: ["영문명"],
  publications: ["title"],
  news: ["제목", "날짜"],
};

/** Checks that span datasets; run on the final data (fresh or kept). */
function validateCrossRefs(data) {
  const pubIds = new Set((data.publications ?? []).map((p) => p.id));
  for (const proj of data.projects ?? []) {
    for (const id of proj.relatedPubIds ?? []) {
      if (!pubIds.has(id))
        warn(
          "projects",
          `"${proj.titleKo || proj.titleEn}": 연관 논문 ID "${id}" matches no publication.`,
        );
    }
  }
}

// --- config -------------------------------------------------------------------
/**
 * Normalize `tabs` config. Each dataset is a tab name, or a list of tab names /
 * `{ "name": "...", "columns": { "<sheet header>": "<canonical header>" } }`.
 */
function datasetTabs(spec) {
  const list = Array.isArray(spec) ? spec : [spec];
  return list.map((t) =>
    typeof t === "string" ? { name: t, columns: {} } : { columns: {}, ...t },
  );
}

/** Rename a row's headers per a tab's `columns` map (unmapped headers pass through). */
function applyColumns(rows, columns) {
  return rows.map((r) => {
    const out = {};
    for (const [h, v] of Object.entries(r)) out[columns[h] ?? h] = v;
    return out;
  });
}

// --- fetching -----------------------------------------------------------------
// Google's gviz CSV endpoint (tqx=out:csv&sheet=<name>) can serve a stale cached
// response for a few minutes right after an edit, and drops cells whose type
// differs from the rest of their column. The /export?format=csv&gid=<id>
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
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return res.text();
    } catch {
      // fall through to the gviz fallback below
    }
  } else if (Object.keys(gidByName ?? {}).length) {
    // Discovery worked but this tab name is not among the sheet's tabs — usually a
    // rename. gviz may still answer from a stale cache under the OLD name, which
    // silently deploys outdated data, so make the mismatch loud.
    throw new Error(
      `tab "${tabName}" not found in the spreadsheet (tabs: ${Object.keys(gidByName)
        .map((n) => `"${n}"`)
        .join(", ")}). Update scripts/sheets.config.json if the tab was renamed.`,
    );
  }
  // headers=1: without it gviz guesses the header row count and can glue the
  // first data row onto the headers.
  const url =
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&headers=1` +
    `&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for tab "${tabName}"`);
  return res.text();
}

/** Fetch every tab of a dataset, map its columns, and concatenate the rows. */
async function loadDatasetRows(key, tabs, spreadsheetId, gidByName) {
  const all = [];
  const headers = new Set();
  for (const { name, columns } of tabs) {
    const rows = parseCSV(await fetchCsv(spreadsheetId, name, gidByName));
    const tabHeaders = new Set(rows.length ? Object.keys(rows[0]) : []);
    for (const h of Object.keys(columns)) {
      if (!tabHeaders.has(h))
        warn(
          key,
          `tab "${name}" has no column "${h}" (mapped to "${columns[h]}") — was the form question renamed? Update scripts/sheets.config.json.`,
        );
    }
    const mapped = applyColumns(rows, columns);
    if (mapped.length) Object.keys(mapped[0]).forEach((h) => headers.add(h));
    all.push(...mapped);
  }
  const missing = REQUIRED_HEADERS[key].filter((h) => !headers.has(h));
  if (missing.length)
    throw new Error(`no ${missing.map((h) => `"${h}"`).join(", ")} column in any tab`);
  return all;
}

async function main() {
  const config = JSON.parse(readFileSync(resolve(root, "scripts/sheets.config.json"), "utf8"));
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
  const finalData = {};
  for (const [key, spec] of Object.entries(config.tabs)) {
    const outPath = resolve(genDir, `${key}.json`);
    const prev = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
    const tabs = datasetTabs(spec);
    try {
      if (!TRANSFORMS[key]) throw new Error(`unknown dataset "${key}"`);
      const rows = await loadDatasetRows(key, tabs, spreadsheetId, gidByName);
      const data = TRANSFORMS[key](rows);
      if (!data.length)
        throw new Error(`tabs ${tabs.map((t) => `"${t.name}"`).join(", ")} produced 0 rows`);
      const next = JSON.stringify(data, null, 2) + "\n";
      if (next !== prev) {
        writeFileSync(outPath, next, "utf8");
        anyChange = true;
      }
      finalData[key] = data;
      console.log(
        `[sync] ${key}: ${data.length} rows from ${tabs.map((t) => `"${t.name}"`).join(" + ")}` +
          (next !== prev ? " (updated)" : " (unchanged)"),
      );
    } catch (err) {
      warn(key, `sync FAILED (${err.message}) — kept the existing ${key}.json.`);
      if (prev) finalData[key] = JSON.parse(prev);
    }
  }
  validateCrossRefs(finalData);

  for (const { dataset, message } of warnings) {
    // `::warning::` lines become annotations on the GitHub Actions run summary.
    if (process.env.GITHUB_ACTIONS) console.log(`::warning title=Sheet ${dataset}::${message}`);
    else console.warn(`[sync] ⚠ ${dataset}: ${message}`);
  }
  console.log(
    (anyChange ? "[sync] done (some files updated)" : "[sync] done (no changes)") +
      (warnings.length ? `, ${warnings.length} warning(s).` : "."),
  );
}

// Only run the CLI when executed directly (not when imported for testing).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export {
  parseCSV,
  normalizeDate,
  applyColumns,
  datasetTabs,
  transformPeople,
  transformProjects,
  transformPublications,
  transformNews,
  warnings,
};
