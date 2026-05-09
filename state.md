# Project State

## Current Status
- Last updated: 2026-05-09
- Branch: `main`
- Target branch: `main`
- Working tree: clean as of the latest check
- Latest shipped commit: `1948e43 feat(ui): apply prism event tracking refresh`
- Remote sync: local `main` matches `origin/main`

## Recent Changes
- 2026-05-09: Renamed project state memory file from `states.md` to `state.md`.
- 2026-05-09: Added project state memory workflow through `state.md` and root `AGENTS.md`.
- 2026-05-06: Shipped Prism UI refresh across app routes, calendar, event views, forms, and shared UI components.
- 2026-05-06: Added `DESIGN.md` with the current UI direction.

## Decisions
- Use `state.md` as lightweight, repo-local memory for future coding sessions.
- Keep `state.md` factual and concise; do not store secrets or environment values.
- Preserve data-source priority: Supabase first, Google Sheet second, local fallback last.
- Keep UI work aligned with the existing minimal 2026 / Prism design direction.

## Next Steps
- Update this file after meaningful implementation, verification, deploy, or data-source changes.
- Run relevant checks before shipping code changes: `npm run lint`, `npm test`, and `npm run build` when scope warrants it.

## Known Issues
- None recorded in this state file yet.

## Verification
- 2026-05-09: Checked worktree and latest commit with `git status --short --branch`, `git log --oneline -n 3`, and `sc worktree status --json`.
- Tests were not run for this documentation-only state setup.
