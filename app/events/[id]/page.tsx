import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { formatDateRange, formatEventDuration, getEventById, getStatusLabel } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <header className="grid gap-5 rounded-[40px] px-1 pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-normal text-muted">{event.channel}</p>
          <h1 className="display-title mt-3 max-w-4xl text-4xl text-foreground sm:text-6xl">{event.name}</h1>
          <p className="mt-4 text-muted">{formatDateRange(event.startDate, event.endDate)}</p>
        </div>
        <Link href="/events" className="ghost-button flex min-h-11 w-full items-center justify-center px-4 text-sm font-medium sm:w-fit">
          กลับไปรายการ
        </Link>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="frosted-card rounded-[26px] p-5 sm:rounded-[30px] sm:p-6">
          <h2 className="text-xl font-medium">รายละเอียดงาน</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Info label="สถานที่" value={event.location} />
            <Info label="จำนวนวันจัดงาน" value={formatEventDuration(event.startDate, event.endDate)} />
            <Info label="สถานะ" value={getStatusLabel(event.participationStatus)} />
            <Info label="พนักงานขาย" value={event.salesStaffRequired ? "ต้องการ PC" : "ไม่ต้องการ PC"} />
            <Info label="ขนาดบูธ" value={event.boothSize} />
            <Info label="แปลนพื้นที่ / โซน" value={event.boothZone} />
            <Info label="วันติดตั้ง" value={event.setupDateTime} />
            <Info label="วันรื้อถอนจริง" value={event.teardownDateTime} />
            <Info label="ติดต่อ" value={[event.contactName, event.contactPhone].filter(Boolean).join(" ")} />
          </dl>
          {event.details ? <TextBlock title="ข้อมูลจาก Excel" value={event.details} /> : null}
          {event.conditions ? <TextBlock title="เงื่อนไขเพิ่มเติม" value={event.conditions} /> : null}
        </article>

        <aside className="space-y-5">
          <section className="frosted-card rounded-[26px] p-5 sm:rounded-[30px] sm:p-6">
            <h2 className="text-xl font-medium">Sales</h2>
            <dl className="mt-4 space-y-3">
              <Info label="Target" value={event.salesTarget != null ? event.salesTarget.toLocaleString("th-TH") : "-"} />
              <Info label="Actual" value={event.actualSales != null ? event.actualSales.toLocaleString("th-TH") : "-"} />
            </dl>
          </section>

          <section className="frosted-card rounded-[26px] p-5 sm:rounded-[30px] sm:p-6">
            <h2 className="text-xl font-medium">ไฟล์แนบ</h2>
            {event.fileName ? (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-panel-soft p-3 text-sm font-medium">
                <FileText aria-hidden className="h-4 w-4 text-foreground" />
                {event.fileName}
              </p>
            ) : (
              <p className="text-muted mt-4 text-sm">ยังไม่มีไฟล์แนบในข้อมูล legacy</p>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap font-medium">{value || "-"}</dd>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="border-line mt-6 border-t pt-5">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{value}</p>
    </section>
  );
}
