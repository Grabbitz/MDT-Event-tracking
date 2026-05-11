# state.md

> **AI**: อ่านแค่ส่วน ⚡ NOW เสมอ — อ่านส่วน 📜 LOG เฉพาะเมื่อถามเรื่อง history
> **Human**: อัปเดต NOW ทุกครั้งที่ทำงานเสร็จ แล้ว archive ลง LOG

---

## ⚡ NOW

- **Status**: Idle — no active task
- **Branch**: main | **Commit**: current — _fix: refine upcoming event selection_
- **Deploy**: ✅ Ready — _Vercel production_
- **Blocker**: None
- **Next**: Commit upcoming events logic update ✅ Done

---

## 📜 LOG

> ย้าย NOW เก่ามาใส่ที่นี่ทุกครั้งที่อัปเดต — ไม่ต้องลบ

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
