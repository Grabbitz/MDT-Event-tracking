import { EventsExplorer } from "@/components/events-explorer";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-3 sm:space-y-10 sm:py-4">
      <header className="space-y-4 rounded-3xl border border-line bg-panel px-5 py-6 shadow-[var(--shadow-soft)] sm:px-7 sm:py-7">
        <p className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-strong">
          Workspace / Events
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">รายการอีเวนท์ทั้งหมด</h1>
        <p className="text-muted max-w-2xl text-base leading-relaxed sm:text-lg">
          ค้นหา กรองตามช่องทาง/สถานะ/ปี และ export เฉพาะรายการที่กรองอยู่ได้ทันที
        </p>
      </header>
      <EventsExplorer events={events} />
    </div>
  );
}
