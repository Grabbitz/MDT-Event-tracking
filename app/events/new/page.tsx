import { EventForm } from "@/components/event-form";
import { isSupabaseConfigured } from "@/lib/env";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-black text-accent-strong">New event</p>
        <h1 className="mt-2 text-4xl font-black">เพิ่มอีเวนท์</h1>
        <p className="text-muted mt-3 max-w-2xl leading-7">
          เวอร์ชันนี้บันทึก draft ลง browser ก่อน เมื่อเชื่อม Supabase แล้วสามารถเปลี่ยนเป็น server action ได้ตรงจุดนี้
        </p>
      </header>
      <EventForm supabaseReady={isSupabaseConfigured()} />
    </div>
  );
}
