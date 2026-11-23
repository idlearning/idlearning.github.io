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
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
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
      put(proj, "img", r["이미지 URL"] || r["이미지"]);
      proj.description = clean(r["프로젝트 설명"]);
      const rel = splitLines(r["연관 논문 ID"]).map((x) => x.replace(/,+$/, "").trim());
      if (rel.length) proj.relatedPubIds = rel;
      return proj;
    });
}

function transformPublications(rows) {
  const pubs = rows
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
        id: clean(r["id"]),
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

  // Auto-assign scheme ids (YYYY-<t>-NNN) to rows with a blank id, continuing
  // the sequence after the highest explicit number for that year+type so newer
  // entries (e.g. form submissions) get higher numbers. The id isn't shown on
  // the site but drives ordering (newest-first) and related-publication links.
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
    const letter = (p.type[0] || "x").toLowerCase();
    const key = `${p.year}-${letter}`;
    const next = (maxSeq[key] = (maxSeq[key] || 0) + 1);
    p.id = `${p.year}-${letter}-${String(next).padStart(3, "0")}`;
  }
  return pubs;
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

// --- Google Drive images (News photos uploaded through the Google Form) ---
//
// A form "file upload" answer lands in the sheet as a Drive link
// (https://drive.google.com/open?id=<id>). Browsers can't reliably embed those,
// and hotlinking Drive breaks under its rate limits, so at sync time we download
// each linked image into public/images/news/drive/<id>.<ext> (shipped with the
// build, gitignored) and point the item at that local path instead. The file
// must be shared "Anyone with the link: Viewer" (see docs/EASY_MANAGEMENT.md).
//
// Already-downloaded files are reused (CI caches the folder between runs), so
// each run only fetches new photos. If a download fails the item falls back to
// the default image rather than shipping a broken Drive URL.
const DRIVE_IMG_DIR = resolve(root, "public/images/news/drive");
const DRIVE_IMG_PATH = "/images/news/drive";
const DRIVE_MAX_BYTES = 15 * 1024 * 1024;
const IMAGE_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Drive file id from a Drive/Docs share or download link, else null. Takes the first of several links. */
function driveFileId(value) {
  const first = clean(value).split(/[\s,]+/)[0];
  let url;
  try {
    url = new URL(first);
  } catch {
    return null;
  }
  if (!/^(drive|docs)\.google\.com$|^lh\d\.googleusercontent\.com$/.test(url.hostname)) return null;
  const id = url.searchParams.get("id") ?? url.pathname.match(/\/d\/([\w-]+)/)?.[1];
  return id && /^[\w-]{10,}$/.test(id) ? id : null;
}

/** Download a publicly shared Drive image, preferring Drive's resized rendition (also converts HEIC to JPEG). */
async function downloadDriveImage(id, fetchImpl = fetch) {
  const urls = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];
  let reason = "unknown error";
  for (const url of urls) {
    try {
      const res = await fetchImpl(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
      const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
      if (!res.ok) {
        reason = `HTTP ${res.status}`;
        continue;
      }
      const ext = IMAGE_EXT[type];
      if (!ext) {
        reason = type.startsWith("text/html")
          ? "got a web page instead of an image — is the file shared 'Anyone with the link'?"
          : `unsupported content type "${type}"`;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0 || buf.length > DRIVE_MAX_BYTES) {
        reason = `bad size (${buf.length} bytes)`;
        continue;
      }
      return { buf, ext };
    } catch (err) {
      reason = err.message;
    }
  }
  throw new Error(reason);
}

/** Replace Drive links in news `img` with local copies; removes copies no longer referenced. */
async function localizeDriveImages(items, { dir = DRIVE_IMG_DIR, fetchImpl = fetch } = {}) {
  mkdirSync(dir, { recursive: true });
  const cached = new Map(
    readdirSync(dir)
      .filter((f) => /^[\w-]+\.\w+$/.test(f))
      .map((f) => [f.replace(/\.\w+$/, ""), f]),
  );
  const used = new Set();
  for (const item of items) {
    const id = driveFileId(item.img);
    if (!id) continue;
    let file = cached.get(id);
    if (!file) {
      try {
        const { buf, ext } = await downloadDriveImage(id, fetchImpl);
        file = `${id}.${ext}`;
        writeFileSync(resolve(dir, file), buf);
        cached.set(id, file);
        console.log(`[sync] news: downloaded Drive image for "${item.title}"`);
      } catch (err) {
        console.warn(
          `[sync] news: could not download Drive image for "${item.title}" (${err.message}) — using the default image`,
        );
        item.img = "";
        continue;
      }
    }
    used.add(file);
    item.img = `${DRIVE_IMG_PATH}/${file}`;
  }
  for (const file of cached.values()) {
    if (!used.has(file)) rmSync(resolve(dir, file));
  }
  return items;
}

/** Async per-dataset steps that run after the transform (network work). */
const POST_PROCESS = {
  news: (items) => localizeDriveImages(items),
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
  } else if (Object.keys(gidByName ?? {}).length) {
    // Discovery worked but this tab name is not among the sheet's tabs — usually a
    // rename. gviz may still answer from a stale cache under the OLD name, which
    // silently deploys outdated data, so make the mismatch loud.
    console.warn(
      `[sync] tab "${tabName}" not found in the spreadsheet (tabs: ${Object.keys(gidByName)
        .map((n) => `"${n}"`)
        .join(", ")}) — falling back to gviz by name, which may serve stale cached data. ` +
        `Update scripts/sheets.config.json if the tab was renamed.`,
    );
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
      let data = TRANSFORMS[key](rows);
      if (!data.length) throw new Error(`tab "${tabName}" produced 0 rows`);
      if (POST_PROCESS[key]) data = await POST_PROCESS[key](data);
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

export {
  parseCSV,
  transformPeople,
  transformProjects,
  transformPublications,
  transformNews,
  driveFileId,
  localizeDriveImages,
};
