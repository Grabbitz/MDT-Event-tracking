import { EventsExplorer } from "@/components/events-explorer";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-[40px] px-1 pb-2 pt-8">
        <div className="spectrum-strip absolute left-0 top-0 h-1.5 w-56 rounded-full" />
        <p className="text-sm font-normal text-muted">
          Workspace / Events
        </p>
        <h1 className="display-title mt-3 max-w-4xl text-4xl text-foreground sm:text-6xl">รายการอีเวนท์ทั้งหมด</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          ค้นหา กรองตามช่องทาง/สถานะ/ปี และ export เฉพาะรายการที่กรองอยู่ได้ทันที
        </p>
      </header>
      <EventsExplorer events={events} />
    </div>
  );
}
