import { EventCalendar } from "@/components/event-calendar";
import { getEvents } from "@/lib/events";

export const revalidate = 0;

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2 md:space-y-10 md:py-4">
      <header className="space-y-3 md:space-y-4">
        <p className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tracking-wide text-accent-strong uppercase">
          Workspace / Calendar
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">ปฏิทินอีเวนท์</h1>
        <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">
          <span className="block">มือถือใช้ agenda list อ่านวันและช่องทางได้ชัดขึ้น</span>
          <span className="block">จอใหญ่ใช้ปฏิทินเต็ม</span>
        </p>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
