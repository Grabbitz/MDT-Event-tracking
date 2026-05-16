# Web Event Tracking — AI Start Guide
> วางไฟล์นี้ไว้ที่ root เพื่อให้ AI เข้าใจ context, workflow, และมาตรฐานการทำงานของ repo นี้ตั้งแต่แรก

---

## 📌 Start Rule

เมื่อเริ่มงานใหม่กับ AI ให้ใช้กติกานี้เสมอ:

1. อ่าน `state.md` ส่วน `## ⚡ NOW` ก่อน เพื่อเข้าใจสถานะล่าสุด
2. อ่าน `AGENTS.md` เพื่อเข้าใจกติกาและ workflow ของ repo นี้
3. อ่านไฟล์ที่เกี่ยวข้องกับงาน เช่น `docs/DESIGN.md`, `docs/TODO.md`, `README.md`
4. เช็ก `git status` ก่อนแก้ไฟล์เสมอ
5. แก้เฉพาะ scope ของงาน ไม่แตะ unrelated changes
6. หลังจบงานให้อัปเดต `state.md` ส่วน NOW/LOG

Prompt เริ่มงานที่แนะนำ:

```text
อ่าน state.md ส่วน NOW ก่อน แล้วอ่าน AGENTS.md และไฟล์ที่เกี่ยวข้องกับงานนี้ จากนั้นสรุปสิ่งที่ต้องทำต่อแบบสั้นๆ
```

---

## 📁 Project Files ใน Repo นี้

| ไฟล์ | หน้าที่ |
|------|--------|
| `AGENTS.md` | กติกาหลักของ AI — goal, workflow, requirements, constraints, response style |
| `AGENTS.override.md` | override สั้นๆ สำหรับ session เฉพาะ — ใช้แทน AGENTS.md บางส่วนชั่วคราว |
| `state.md` | สถานะล่าสุด (⚡ NOW) และประวัติงาน (📜 LOG) |
| `docs/DESIGN.md` | UI/UX direction — Prism/minimal 2026, layout, spacing, color, component, animation |
| `docs/TODO.md` | รายการงานย่อยและ checklist สำหรับ feature ปัจจุบัน |
| `README.md` | overview ของโปรเจคสำหรับ developer ใหม่ |
| `docs/` | เอกสารเพิ่มเติม เช่น schema, migration, ADR |
| `.env.example` | ตัวอย่าง environment variables ที่ต้องการ (ไม่มี secrets) |

---

## 🏗️ Stack และ Key Files

```
Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4
Supabase (primary DB) + Google Sheet CSV (fallback) + local JSON (dev fallback)
Vercel (deploy) + Node 22
```

| Path | หน้าที่ |
|------|--------|
| `app/` | routes และ pages (App Router) |
| `components/` | reusable UI — `event-calendar.tsx`, `app-shell.tsx`, etc. |
| `lib/events.ts` | data-source selector: Supabase → Google Sheet → local |
| `lib/google-sheet-events.ts` | Google Sheet CSV parser |
| `supabase/` | migrations และ seed data |
| `scripts/` | utility scripts เช่น import XLSX |
| `public/` | static assets |

**Data-source priority (อย่าเปลี่ยนโดยไม่ตั้งใจ):** Supabase → Google Sheet CSV → local fallback

---

## 🔄 Workflow การทำงานร่วมกับ AI

```text
1. เช็กสถานะ    → อ่าน state.md ⚡ NOW + git status
2. เข้าใจ scope  → อ่าน AGENTS.md, docs/DESIGN.md, docs/TODO.md ที่เกี่ยวข้อง
3. ลงมือแก้      → ทำทีละ scope และรักษา unrelated changes
4. ตรวจสอบ      → npm run lint / npm test / npm run build
5. บันทึกสถานะ  → อัปเดต state.md ส่วน NOW และ archive เก่าลง LOG
6. Deploy         → git push origin main → Vercel auto-deploy
```

> หลักการสำคัญ: ทำงานเป็นชิ้นเล็ก ตรวจสอบได้ บันทึก state หลังจบงานเสมอ

---

## 💬 Prompt Templates ที่ใช้บ่อย

### 🟢 เริ่มงานใหม่

```text
อ่าน state.md ส่วน NOW ก่อน แล้วอ่าน AGENTS.md, docs/DESIGN.md, docs/TODO.md จากนั้นสรุปสถานะล่าสุดกับงานถัดไปแบบสั้นๆ
```

### 🟡 ให้ทำงานจาก TODO

```text
ดู docs/TODO.md แล้วทำงานรายการถัดไปที่ยังไม่เสร็จ อ้างอิง state.md, AGENTS.md, docs/DESIGN.md และ architecture ถ้าเกี่ยวข้อง
```

### 🔵 ปรับ UI

```text
อ่าน docs/DESIGN.md และไฟล์ UI ที่เกี่ยวข้องก่อน แล้วปรับ layout, spacing, hierarchy, alignment และ clarity โดยไม่ลด functionality เดิม อ้างอิง Prism/minimal 2026 direction
```

### 🟣 ตรวจงาน

```text
รีวิวงานนี้แบบ code review: หา bug, regression, missing test, data-source drift, และ accessibility issue สรุปเฉพาะสิ่งที่ต้องแก้จริง
```

### 🟤 อัปเดตสถานะ

```text
อัปเดต state.md จากสิ่งที่ทำล่าสุด โดยแก้ NOW และย้ายสถานะเก่าลง LOG พร้อมระบุไฟล์ที่แก้
```

---

## ✅ Checklist ก่อนเริ่มงาน

- [ ] อ่าน `state.md` ส่วน `## ⚡ NOW`
- [ ] อ่าน `AGENTS.md`
- [ ] อ่านไฟล์ที่เกี่ยวข้องกับ scope งาน (`docs/DESIGN.md`, `docs/TODO.md`, etc.)
- [ ] เช็ก `git status`
- [ ] เข้าใจ requirement และ definition of done
- [ ] ระบุ assumption สั้นๆ ถ้ามีข้อมูลไม่ครบ

---

## ✅ Checklist หลังจบงาน

- [ ] งานตรง requirement ที่ผู้ใช้ขอ
- [ ] แก้เฉพาะไฟล์ที่อยู่ใน scope
- [ ] ไม่มี unrelated changes
- [ ] `npm run lint` ผ่าน
- [ ] `npm test` ผ่าน (ถ้ามี test ที่เกี่ยวข้อง)
- [ ] `npm run build` ผ่าน
- [ ] ตรวจ UI/responsive ใน browser ถ้าเป็น frontend change
- [ ] ไม่มี data-source drift (Supabase → Sheet → local ยังทำงานถูก)
- [ ] อัปเดต `state.md` ส่วน NOW/LOG
- [ ] สรุปไฟล์ที่แก้และผลการตรวจสอบให้ผู้ใช้

---

## 🎨 UI Direction (Prism / Minimal 2026)

- Clean layout, strong visual hierarchy, generous spacing
- Calm and elegant — ไม่มี clutter หรือ decoration ที่ไม่จำเป็น
- Responsive structure — ป้องกัน text overlap และ layout shift
- Prioritize usability, clarity, alignment, readability
- ไม่ลด functionality เดิมเว้นแต่ผู้ใช้ขอ
- อ้างอิง `docs/DESIGN.md` สำหรับรายละเอียด token, color, spacing

---

## 🧑‍💻 Code Preferences

- Clean, modular, readable — component เล็ก data flow ง่าย
- Consistent naming ตาม pattern ที่มีอยู่ใน repo
- Avoid unnecessary abstraction
- ใช้ pattern ที่มีอยู่แล้วก่อนสร้างใหม่
- Comment เฉพาะเมื่อ WHY ไม่ชัดจาก code
- Node 22 target — ระวัง Vercel runtime assumption

---

## ⚠️ Constraints ที่ต้องระวังเสมอ

- **Data-source priority**: Supabase → Google Sheet CSV → local — ห้ามเปลี่ยนโดยไม่ตั้งใจ
- **Secrets**: ห้ามเก็บ credentials, token, หรือ env value ใน docs หรือ state files
- **Scope**: ห้าม refactor ที่ไม่เกี่ยวกับงาน
- **Vercel/Node**: เป้าหมาย Node 22 — ระวัง runtime assumption ที่ผิด

---

## 🗣️ Response Style

- ตอบภาษาไทยเป็นหลัก
- เริ่มด้วย solution หรือ status ล่าสุด
- อธิบายสั้น กระชับ และ practical
- ถ้ามีทางเลือกที่ดีที่สุดชัดเจน ให้เลือกแนวนั้นก่อน
- ถ้าต้องเดา assumption ให้บอกสั้นๆ
- หลังแก้งาน ให้สรุปว่าแก้อะไร ไฟล์ไหน และตรวจสอบอะไรแล้ว

---
