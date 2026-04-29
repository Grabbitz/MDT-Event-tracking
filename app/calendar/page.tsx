import { EventCalendar } from "@/components/event-calendar";
import { getEvents } from "@/lib/events";

export const revalidate = 0;

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-1 md:space-y-8 md:py-3">
      <header className="grid gap-4 border-b border-line pb-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-3">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Modern Trade / Calendar
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">Event calendar</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">
            ดูอีเวนท์ตามเดือนแบบเรียบ อ่านง่าย และเลือกดูรายละเอียดได้ทันที
          </p>
        </div>
        <p className="w-fit border border-line bg-panel px-3 py-2 font-mono text-xs font-semibold text-muted">
          {events.length.toLocaleString("th-TH")} events
        </p>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
