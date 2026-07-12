## IDL Lab — multi-page site clone

Build a static 5-page marketing/academic site cloning the provided HTMLs (from `stitch_homepage_clone_implementation.zip`), preserving layout, copy (Korean + English), and CDN image URLs.

### Routes
- `/` — Home (hero intro + featured research project card + News grid)
- `/people` — People page
- `/projects` — Projects page
- `/publications` — Publications page
- `/news` — News page

Each becomes a file under `src/routes/` (`index.tsx`, `people.tsx`, `projects.tsx`, `publications.tsx`, `news.tsx`) with its own `head()` metadata (unique title + description + og fields).

### Shared layout
- `SiteHeader` component (sticky white bar, logo, nav links using TanStack `<Link>` with active state = idl-blue underline).
- Rendered inside `__root.tsx` above `<Outlet />` so it appears on all pages.
- Update `__root.tsx` head defaults (title "IDL Lab — Interaction Design for Learning", matching description/og/twitter).

### Design tokens
Apply the Academic Clarity system to `src/styles.css`:
- Add custom colors `--idl-blue: #84a5ff`, `--text-main: #333`, `--text-muted: #666` mapped to Tailwind via `@theme` (`bg-idl-blue`, `text-idl-blue`, etc.).
- Load Pretendard via a `<link rel="stylesheet">` in `__root.tsx` head (per Tailwind v4 rule: no remote @import in styles.css).
- Set body font stack to Pretendard.

### Content & images
- Hotlink all `lh3.googleusercontent.com/aida-public/...` image URLs directly from the HTMLs — no re-hosting.
- Preserve all Korean text verbatim.
- Convert `<a href="#">` nav to `<Link to="/...">`.
- Convert `<a>` and `<button>` used purely for layout into semantic React equivalents; keep classes.

### Per-page composition (from the provided HTMLs)
1. **Home**: 2-column hero (intro text left, "Research Projects" card with carousel dot indicators right) + 5-column News grid of 5 cards.
2. **People**: Team grid from `people_idl_lab_exact_replica/code.html`.
3. **Projects**: Project cards/list from `projects_idl_lab_exact_replica/code.html`.
4. **Publications**: Clean-row publication list from `publications_idl_lab_exact_replica/code.html`.
5. **News**: Full news grid from `news_idl_lab_exact_replica/code.html`.

Static markup only — no interactivity beyond hover states and nav; carousel dots are decorative (non-functional) to match source.

### Out of scope
- No backend, no auth, no CMS.
- No functional carousel/search/pagination unless already interactive in the source (they aren't).
- No design deviations from source HTMLs.
