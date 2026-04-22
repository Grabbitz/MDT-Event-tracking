# Modern Trade Event Tracking

เว็บแอปสำหรับดูและจัดการอีเวนท์ Modern Trade เชื่อมต่อข้อมูลจาก Google Sheet และ Supabase

## Features
- **Dashboard**: ดูภาพรวมอีเวนท์ที่กำลังจัดวันนี้ และอีเวนท์ที่กำลังจะมาถึง
- **Calendar**: ปฏิทินอีเวนท์แยกตามช่องทาง (Channel) รองรับการแสดงผลปี 2025-2026
- **Google Sheet Integration**: เชื่อมต่อข้อมูลจาก Google Sheet ได้โดยตรง
- **Supabase Support**: จัดการข้อมูลและไฟล์แนบผ่านฐานข้อมูลจริง

## Run locally

1. ตั้งค่า `.env.local`:
```env
GOOGLE_SHEET_URLS="YOUR_GOOGLE_SHEET_EDIT_URL"
```

2. รันแอป:
```bash
npm install
npm run dev
```

เปิด `http://localhost:3000` (หรือ 3001)

## Supabase Setup (Optional)

1. สร้าง Supabase project
2. รัน SQL ใน `supabase/migrations/0001_init.sql`
3. ตั้งค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ใน `.env.local`
