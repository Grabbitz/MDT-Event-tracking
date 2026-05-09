# Web Event Tracking

## Goal
Build and maintain a production-oriented Modern Trade event tracking web app with a clean, usable, modern UI.

## Context
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, Google Sheet CSV export.
- Key files:
  - `app/` for routes and pages
  - `components/` for reusable UI
  - `lib/events.ts` for runtime data-source selection
  - `lib/google-sheet-events.ts` for Google Sheet CSV parsing
  - `state.md` for project state memory
- Dependencies: FullCalendar, Supabase, Framer Motion, Lucide React, Excel tooling.

## Project Memory
- Read `state.md` at the start of repo work when it exists.
- Treat `state.md` as lightweight project memory for current status, recent decisions, known issues, and next steps.
- Update `state.md` after meaningful implementation, verification, deploy, data-source, or workflow changes.
- Keep entries concise, dated, factual, and easy to scan.
- Do not store secrets, credentials, private URLs with tokens, or environment variable values in `state.md`.

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
