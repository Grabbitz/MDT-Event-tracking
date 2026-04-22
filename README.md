# Modern Trade Event Tracking

เว็บแอปสำหรับดูและจัดการอีเวนท์ Modern Trade จากไฟล์ legacy Excel `2025-26 Moderntrade Event.xlsx`

## Run locally

```bash
npm run seed:legacy
npm run dev
```

เปิด `http://localhost:3000`

ถ้ายังไม่ได้ตั้งค่า Supabase env แอปจะเป็น demo mode อ่านจาก `lib/legacy-events.json`

## Supabase

1. สร้าง Supabase project
2. รัน SQL ใน `supabase/migrations/0001_init.sql`
3. เปิด Auth provider ที่ต้องการ เช่น Email/Password หรือ Magic Link
4. ตั้ง Site URL และ Redirect URLs ให้ตรงกับ production URL เช่น `https://your-app.vercel.app/auth/callback`
5. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า Supabase
6. Import legacy data:

```bash
npm run import:legacy
```

## Current mode

เมื่อมี Supabase env แอปจะบังคับ login, อ่านข้อมูลจาก Supabase, สร้างอีเวนท์จริง และอัปโหลดไฟล์เข้า Storage bucket `event-files`
