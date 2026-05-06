import { EventCalendar } from "@/components/event-calendar";
import { getEvents } from "@/lib/events";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="space-y-7">
      <header className="grid gap-5 rounded-[40px] px-1 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-3">
          <p className="text-sm font-normal text-muted">
            Modern Trade / Calendar
          </p>
          <h1 className="display-title text-5xl text-foreground sm:text-6xl">Event calendar</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">
            ดูอีเวนท์ตามเดือนแบบเรียบ อ่านง่าย และเลือกดูรายละเอียดได้ทันที
          </p>
        </div>
        <p className="ghost-button w-fit px-4 py-2 text-xs font-medium text-muted">
          {events.length.toLocaleString("th-TH")} events
        </p>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
