import { EventsExplorer } from "@/components/events-explorer";
import { getEvents } from "@/lib/events";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-black text-accent-strong">Events</p>
        <h1 className="mt-2 text-4xl font-black">รายการอีเวนท์ทั้งหมด</h1>
        <p className="text-muted mt-3 max-w-2xl leading-7">
          ค้นหา กรองตามช่องทาง/สถานะ/ปี และ export เฉพาะรายการที่กรองอยู่ได้ทันที
        </p>
      </header>
      <EventsExplorer events={events} />
    </div>
  );
}
