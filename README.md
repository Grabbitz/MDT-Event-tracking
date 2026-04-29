# Modern Trade Event Tracking

เว็บแอปสำหรับดูและจัดการอีเวนท์ Modern Trade โดยใช้ Google Sheet เป็นแหล่งข้อมูลหลัก และรองรับ Supabase สำหรับงาน production ที่ต้องมี login, database และ file upload

## Current Status

- Next.js App Router
- Calendar และ event list รองรับข้อมูลปี 2025-2026
- อ่านข้อมูลจาก Google Sheet ผ่าน CSV export
- ใช้ Supabase ได้เมื่อมี environment variables ครบ
- มี local JSON fallback เพื่อให้แอปรันได้แม้ยังไม่ได้ต่อ service จริง

## Data Source Priority

แอปเลือกแหล่งข้อมูลตามลำดับนี้:

1. Supabase ถ้าตั้งค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Google Sheet ถ้าตั้งค่า `GOOGLE_SHEET_URLS` หรือ `GOOGLE_SHEET_URL`
3. Local fallback จาก `lib/legacy-events.json`

## Environment Variables

สร้างไฟล์ `.env.local`:

```env
GOOGLE_SHEET_URLS="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

หมายเหตุ:
- `GOOGLE_SHEET_URLS` รองรับหลายชีทโดยคั่นด้วย comma หรือขึ้นบรรทัดใหม่
- Google Sheet ต้องเปิดสิทธิ์ให้อ่านได้ผ่าน CSV export
- ถ้าไม่ได้ใช้ Supabase สามารถปล่อยค่า Supabase ว่างไว้ได้

## Run Locally

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

ถ้า port 3000 ถูกใช้งานอยู่ Next.js อาจย้ายไป `http://localhost:3001`

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## Supabase Setup

ใช้ Supabase เมื่อต้องการระบบ login, database จริง และ file upload

1. สร้าง Supabase project
2. รัน SQL จาก `supabase/migrations/0001_init.sql`
3. ตั้งค่า env:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

เมื่อ Supabase พร้อม แอปจะอ่านข้อมูลจากตาราง `events` และ `channels` ก่อน fallback source อื่น

## Google Sheet Format

คอลัมน์ที่รองรับหลัก:

- `ชื่องาน` หรือ `Event Name`
- `ช่องทาง` หรือ `Channel`
- `สถานที่` หรือ `Location`
- `วันเริ่มงาน` หรือ `Start Date`
- `วันรื้อถอน` หรือ `End Date`
- `เข้าร่วมงาน` หรือ `Status`
- `รายละเอียดงาน` หรือ `Details`
- `Sales Target`
- `Actual Sales`
- `ไฟล์` หรือ `File`

วันที่รองรับรูปแบบ `YYYY-MM-DD`, `D/M/YYYY`, `D/M/YY` และปี พ.ศ. เช่น `2568`

## Deploy

โปรเจกต์นี้พร้อม deploy บน Vercel

1. เชื่อม GitHub repository กับ Vercel
2. ตั้งค่า environment variables ใน Vercel Project Settings
3. Deploy branch `main`

คำสั่ง build:

```bash
npm run build
```

## Project Structure

```text
app/                         Next.js routes
components/                  UI components
lib/events.ts                Main event data-access layer
lib/google-sheet-events.ts   Google Sheet CSV parser
lib/legacy-events.json       Local fallback data
supabase/migrations/         Supabase schema
```
