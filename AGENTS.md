# Web Event Tracking

## Goal
Build and maintain a production-oriented Modern Trade event tracking web app with a clean, usable, modern UI.

## Context
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, Google Sheet CSV export.
- Key files:
  - `app/` for routes and pages
  - `components/layout/` for app shell and navigation
  - `components/features/` for event-calendar, events-explorer
  - `components/forms/` for event-form, login-form
  - `components/ui/` for event-chip, stat-card, export-button
  - `lib/events.ts` for runtime data-source selection
  - `lib/google-sheet-events.ts` for Google Sheet CSV parsing
  - `state.md` for project state memory
  - `docs/DESIGN.md` for UI/UX direction
  - `docs/TODO.md` for current task list
- Dependencies: FullCalendar, Supabase, Framer Motion, Lucide React, Excel tooling.

## Project Memory (`state.md`)

`state.md` uses a two-section format:
- **⚡ NOW** — current status snapshot (branch, commit, deploy, blocker, next task)
- **📜 LOG** — chronological archive of completed work

### Workflow for AI agents

**Before starting any task:**
1. Read the **⚡ NOW** section of `state.md` to get current status, blockers, and next steps.
2. Read **📜 LOG** only when the user asks about history or past decisions.

**After completing a task:**
1. Move the old ⚡ NOW content to the top of 📜 LOG (dated `YYYY-MM-DD`).
2. Write a new ⚡ NOW reflecting the current state (branch, latest commit hash, deploy status, any blocker, and next task).
3. Keep LOG entries concise: bullet points with ✅ for done, ⚠️ for issues, and `Files:` listing changed paths.
4. Do not store secrets, credentials, private URLs with tokens, or environment variable values in `state.md`.

## Requirements
- Preserve working data-source priority: Supabase, then Google Sheet, then local fallback.
- Keep UI changes aligned with the existing Prism/minimal 2026 design direction.
- Maintain clear hierarchy, spacing, alignment, and usability before adding visual effects.
- Keep components modular, readable, and maintainable.
- Verify meaningful changes with the most relevant checks before reporting completion.

## Constraints
- Avoid unrelated refactors.
- Avoid storing secrets in docs, state files, or examples.
- Watch out for data-source drift between Supabase, Google Sheet, and local fallback.
- Watch out for Vercel framework/runtime assumptions; this project targets Node 22.

## Expected Output
- Production-oriented code changes with concise Thai explanations.
- Mention verification commands run, or clearly say when checks were not run.
- Update `state.md` when the work changes project state.

## Response Style
- Prefer Thai explanations.
- Start with the solution or result.
- Keep explanations short, direct, and practical.
- Recommend the best approach first.
- State assumptions briefly when needed.
