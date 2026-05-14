# state.md

> **AI**: อ่านแค่ส่วน ⚡ NOW เสมอ — อ่านส่วน 📜 LOG เฉพาะเมื่อถามเรื่อง history
> **Human**: อัปเดต NOW ทุกครั้งที่ทำงานเสร็จ แล้ว archive ลง LOG

---

## ⚡ NOW

- **Status**: Production redeployed after repo cleanup/state alignment
- **Branch**: main | **Commit**: a785af1 — _docs: align repo state_
- **Deploy**: ✅ Production — _Vercel READY; `dpl_3J7AbpJ9QNfMydbCB4utUoyypYHJ`; `/` and `/calendar` return HTTP 200_
- **Blocker**: None
- **Next**: Monitor production calendar UI

---

## 📜 LOG

> ย้าย NOW เก่ามาใส่ที่นี่ทุกครั้งที่อัปเดต — ไม่ต้องลบ

### 🗓️ 2026-05-14
- ✅ Previous NOW: Repo state cleaned up — nested app repo is the source of truth and calendar release app code is current
- ✅ Branch: main | Commit: current docs/state update; latest app release code at `d8450c4` — _docs: update calendar release state_
- ✅ Deploy: Production — _Vercel READY; `https://mdt-event-tracking.vercel.app/calendar` returns HTTP 200_
- ✅ Next: Monitor production calendar UI; keep root wrapper repo for local docs/assets only

### 🗓️ 2026-05-14
- ✅ Previous NOW: Calendar release shipped — timeline event bars, floating day panel, and density control deployed
- ✅ Branch: main | Commit: `1d02c0b` — _feat(ui): refine calendar timeline layout_
- ✅ Deploy: Production — _Vercel READY; `https://mdt-event-tracking.vercel.app/calendar` returns HTTP 200_
- ✅ Next: Monitor production calendar UI

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar release ready — timeline-style event bars, floating day panel, and density control verified
- ✅ Branch: main | Commit: pending — _feat(ui): refine calendar timeline layout_
- ✅ Deploy: Ready — _release checks passed; Vercel production deploy next_
- ✅ Next: Commit, push, and deploy to Vercel production

### 🗓️ 2026-05-11
- ✅ Committed and pushed `1d02c0b` to `origin/main`
- ✅ Deployed Vercel production deployment `dpl_2XYa9ezws9jSmtZfS4LbELHm7C7W`
- ✅ Verified alias `https://mdt-event-tracking.vercel.app` and `/calendar` with HTTP 200
- ✅ Verified Vercel inspect status: Ready

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar UI refined — event bars are thin timeline strokes and app header no longer covers the calendar
- ✅ Branch: main | Commit: `240e2c2` — _feat(ui): apply Vercel design system via DESIGN.md_
- ✅ Deploy: Ready — _local build verified; not deployed in this task_
- ✅ Next: Review and commit calendar floating panel update

### 🗓️ 2026-05-11
- ✅ Calendar release verification passed with `git diff --check`, `npm run lint`, `npm test`, and `npm run build`
- ✅ Confirmed month-grid event names are hidden from bars to prevent overlap while details remain available in floating panels
- ✅ Confirmed calendar density control supports Compact / Comfort / Cozy spacing
- Files: `components/event-calendar.tsx`, `components/app-shell.tsx`, `app/globals.css`, `state.md`

### 🗓️ 2026-05-11
- ✅ Reduced month-grid event bars from heavy blocks to thin timeline strokes
- ✅ Removed sticky behavior from the app header so it does not cover calendar controls while scrolling
- ✅ Verified with `npm run lint`, `npm run build`, browser reload, and `HEAD /calendar 200`
- Files: `components/app-shell.tsx`, `app/globals.css`, `state.md`

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar UI updated — month grid bars no longer render names, preventing overlap
- ✅ Branch: main | Commit: `240e2c2` — _feat(ui): apply Vercel design system via DESIGN.md_
- ✅ Deploy: Ready — _local build verified; not deployed in this task_
- ✅ Next: Review and commit calendar floating panel update

### 🗓️ 2026-05-11
- ✅ Removed event names from month-grid multi-day bars to prevent overlap completely
- ✅ Kept event names available through hover title and floating day/event panels
- ✅ Verified with `npm run lint`, `npm run build`, and `HEAD /calendar 200`
- ✅ Restarted dev server after clearing `.next` to avoid stale chunk errors
- Files: `components/event-calendar.tsx`, `app/globals.css`, `state.md`

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar UI updated — event labels no longer overlap and density toggle is available
- ✅ Branch: main | Commit: `240e2c2` — _feat(ui): apply Vercel design system via DESIGN.md_
- ✅ Deploy: Ready — _local build verified; not deployed in this task_
- ✅ Next: Review and commit calendar floating panel update

### 🗓️ 2026-05-11
- ✅ Reworked calendar event rendering so multi-day bars use clipped custom labels instead of overlapping default text
- ✅ Added `Compact / Comfort / Cozy` spacing controls for calendar density
- ✅ Verified with `npm run lint`, `npm run build`, and local browser check at `http://localhost:3002/calendar`
- Files: `components/event-calendar.tsx`, `app/globals.css`, `state.md`

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar UI updated — floating panels close on outside click
- ✅ Branch: main | Commit: `240e2c2` — _feat(ui): apply Vercel design system via DESIGN.md_
- ✅ Deploy: Ready — _local build verified; not deployed in this task_
- ✅ Next: Review and commit calendar floating panel update

### 🗓️ 2026-05-11
- ✅ Added outside-click close behavior for calendar floating panels
- ✅ Preserved calendar date/event clicks so users can switch panels without closing manually
- ✅ Verified with `npm run lint` and `npm run build`
- Files: `components/event-calendar.tsx`, `state.md`

### 🗓️ 2026-05-11
- ✅ Previous NOW: Calendar UI updated — multi-day events render as compact lines and date clicks open a floating day panel
- ✅ Branch: main | Commit: `240e2c2` — _feat(ui): apply Vercel design system via DESIGN.md_
- ✅ Deploy: Ready — _local build verified; not deployed in this task_
- ✅ Next: Review and commit calendar floating panel update

### 🗓️ 2026-05-11
- ✅ Updated calendar month view so multi-day events display as compact colored lines
- ✅ Kept single-day events visually lighter to reduce month-view density
- ✅ Added floating date/event panels with close actions and event detail links
- ✅ Verified with `npm run lint`, `npm test`, `npm run build`, and local browser check at `http://localhost:3002/calendar`
- Files: `components/event-calendar.tsx`, `app/globals.css`, `state.md`

### 🗓️ 2026-05-11
- ✅ Previous NOW: Idle — no active task
- ✅ Branch: main | Commit: current — _fix: refine upcoming event selection_
- ✅ Deploy: Ready — _Vercel production_
- ✅ Next: Commit upcoming events logic update done

### 🗓️ 2026-05-11
- ✅ Updated dashboard Upcoming events to show only events that have not started yet
- ✅ Added `selectUpcomingEvents()` with start-date sorting and limit support
- ✅ Added tests for excluding already-started events, sorting, and limit behavior
- ✅ Verified with `npm test` and `npm run lint`
- Files: `app/page.tsx`, `lib/events.ts`, `lib/events.test.ts`

### 🗓️ 2026-05-09
- ✅ ปรับ state.md ให้ใช้ format ⚡ NOW / 📜 LOG
- ✅ อัปเดต AGENTS.md ให้ระบุ workflow อ่าน NOW ก่อนเริ่มงาน และ archive ลง LOG หลังจบ
- ✅ Renamed project state memory file from `states.md` to `state.md`
- ✅ Added project state memory workflow through `state.md` and root `AGENTS.md`
- Files: `state.md`, `AGENTS.md`

### 🗓️ 2026-05-06
- ✅ Shipped Prism UI refresh across app routes, calendar, event views, forms, and shared UI components
- ✅ Added `DESIGN.md` with the current UI direction
- Files: `app/`, `components/`, `DESIGN.md`
