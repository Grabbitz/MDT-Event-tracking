import { EventCalendar } from "@/components/features/event-calendar";
import { getEvents } from "@/lib/events";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="space-y-7">
      <header className="border-b border-line pb-10 pt-4">
        <div className="spectrum-strip mb-6 h-px w-full" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Modern Trade / Calendar</p>
            <h1 className="display-title mt-4 text-4xl text-foreground sm:text-5xl">Event calendar</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              ดูอีเวนท์ตามเดือนแบบเรียบ อ่านง่าย และเลือกดูรายละเอียดได้ทันที
            </p>
          </div>
          <p className="ghost-button hidden shrink-0 px-4 py-2 text-xs font-medium text-muted sm:block">
            {events.length.toLocaleString("th-TH")} events
          </p>
        </div>
      </header>
      <EventCalendar events={events} />
    </div>
  );
}
