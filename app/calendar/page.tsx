import { EventCalendar } from "@/components/event-calendar";
import { getEvents } from "@/lib/events";

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-black text-accent-strong">Calendar</p>
        <h1 className="mt-2 text-4xl font-black">ปฏิทินอีเวนท์</h1>
        <p className="text-muted mt-3 max-w-2xl leading-7">
          ดูภาพรวมแบบ month/week/day คลิกอีเวนท์เพื่อดูข้อมูลย่อและไปหน้ารายละเอียด
        </p>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
