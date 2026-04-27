import { EventCalendar } from "@/components/event-calendar";
import { getEvents } from "@/lib/events";

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4">
      <header className="space-y-4">
        <p className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tracking-wide text-accent-strong uppercase">
          Workspace / Calendar
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">ปฏิทินอีเวนท์</h1>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          ดูภาพรวมแบบ month/week/day คลิกอีเวนท์เพื่อดูข้อมูลย่อและไปหน้ารายละเอียด
        </p>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
