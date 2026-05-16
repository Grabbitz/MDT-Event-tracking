import { EventsExplorer } from "@/components/features/events-explorer";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-10 pt-4">
        <div className="spectrum-strip mb-6 h-px w-full" />
        <p className="text-xs font-medium uppercase tracking-widest text-muted">Workspace / Events</p>
        <h1 className="display-title mt-4 max-w-4xl text-4xl text-foreground sm:text-5xl">รายการอีเวนท์ทั้งหมด</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          ค้นหา กรองตามช่องทาง/สถานะ/ปี และ export เฉพาะรายการที่กรองอยู่ได้ทันที
        </p>
      </header>
      <EventsExplorer events={events} />
    </div>
  );
}
