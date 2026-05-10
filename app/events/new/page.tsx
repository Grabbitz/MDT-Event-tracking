import { EventForm } from "@/components/event-form";
import { isSupabaseConfigured } from "@/lib/env";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[40px] px-1 pt-8">
        <p className="text-sm font-normal text-muted">New event</p>
        <h1 className="display-title mt-3 text-4xl text-foreground sm:text-6xl">เพิ่มอีเวนท์</h1>
        <p className="mt-5 max-w-2xl leading-7 text-muted">
          เวอร์ชันนี้บันทึก draft ลง browser ก่อน เมื่อเชื่อม Supabase แล้วสามารถเปลี่ยนเป็น server action ได้ตรงจุดนี้
        </p>
      </header>
      <EventForm supabaseReady={isSupabaseConfigured()} />
    </div>
  );
}
