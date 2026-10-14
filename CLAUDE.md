# Working in this repo

## Branch workflow: `dev` first, then `main`

- `main` is production (https://idlearning.org). `dev` is staging
  (https://dev.idlearning.org, deployed by `.github/workflows/deploy-dev.yml`).
  Full details: `docs/DEV_SITE.md`.
- **Base all code work on `dev`, not `main`.** Before making changes, start the
  working branch from the latest `dev`:
  `git fetch origin dev && git checkout -B <your-branch> origin/dev`.
  If the branch already has unmerged commits, rebase/merge them onto `origin/dev`
  instead of discarding them.
- **Open pull requests against `dev`** (base: `dev`), never directly against `main`.
- Only open a `dev` → `main` PR when the user asks to release to production. That
  PR must be merged with a merge commit (not squash), so remind the user of that.
- If something was committed straight to `main` (a hotfix), merge `main` back into
  `dev`.
- Never change the repository's default branch away from `main`: the hourly
  scheduled production deploy runs from the default branch.

## Checks before pushing

Run `bun run type-check`, `bun run lint`, and `bun run build` (the same steps
the deploy workflows run).

## Language

The site maintainers are Korean speakers; reply to them in Korean unless they
write in another language.
