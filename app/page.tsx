import Link from "next/link";
import { CalendarCheck, CircleDollarSign, Store, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatDateRange, formatEventDuration } from "@/lib/events";
import { getDashboardStats } from "@/lib/events";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const targetProgress = stats.totalTarget > 0 ? Math.round((stats.totalActual / stats.totalTarget) * 100) : 0;
  const todayEvents = stats.activeToday;

  return (
    <div className="space-y-8">

      <div className="border-b border-line pb-10 pt-4">
        <div className="spectrum-strip mb-6 h-px w-full" />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Modern Trade workspace</p>
            <h1 className="display-title mt-4 max-w-4xl text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Event tracking
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Dashboard สำหรับดูอีเวนท์ ช่องทาง และจังหวะงานที่กำลังเกิดขึ้นแบบอ่านง่ายในหน้าเดียว
            </p>
          </div>
          <Link
            href="/events/new"
            className="neutral-button flex min-h-10 w-full items-center justify-center px-5 text-sm font-medium sm:w-fit"
          >
            + เพิ่มอีเวนท์
          </Link>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="อีเวนท์ทั้งหมด" value={stats.events.length.toLocaleString("th-TH")} detail="รวมข้อมูลปี 2025 และ 2026" icon={CalendarCheck} />
        <StatCard label="กำลังจัดวันนี้" value={todayEvents.length.toLocaleString("th-TH")} detail="เทียบกับวันปัจจุบัน" icon={Store} />
        <StatCard label="เข้าร่วมงาน" value={stats.joining.toLocaleString("th-TH")} detail="รายการที่สถานะเข้าร่วม" icon={Users} />
        <StatCard label="ยอดขายเทียบ target" value={`${targetProgress}%`} detail="พร้อมรองรับ actual sales" icon={CircleDollarSign} />
      </section>

      {todayEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="spectrum-strip h-1.5 w-6 rounded-full" />
            <h2 className="text-sm font-semibold tracking-tight text-foreground">กำลังจัดวันนี้ ({todayEvents.length})</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="frosted-card group rounded-xl p-5 transition-shadow duration-200 hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px,rgba(0,0,0,0.06)_0px_4px_8px,inset_#fafafa_0px_0px_0px_1px]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: event.channelColor }} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{event.channel}</span>
                </div>
                <h3 className="text-base font-medium leading-snug text-foreground">{event.name}</h3>
                <p className="mt-2 text-sm text-muted">{event.location}</p>
                <p className="mt-5 text-xs text-muted">
                  {formatDateRange(event.startDate, event.endDate)} · {formatEventDuration(event.startDate, event.endDate)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {stats.events.length === 0 ? (
        <div className="frosted-card flex flex-col items-center justify-center rounded-xl p-16 text-center">
          <div className="spectrum-strip mb-5 grid h-12 w-12 place-items-center rounded-lg">
            <CalendarCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-medium text-foreground">ยังไม่มีข้อมูลอีเวนท์</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            เริ่มสร้างอีเวนท์แรกของคุณเพื่อดูปฏิทินและสถิติต่างๆ ได้ทันที
          </p>
          <Link
            href="/events/new"
            className="neutral-button mt-6 flex h-11 items-center justify-center px-6 text-sm font-medium"
          >
            เพิ่มอีเวนท์แรก
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          <div className="frosted-card overflow-hidden rounded-xl">
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Upcoming events</h2>
                <p className="mt-0.5 text-xs text-muted">5 งานถัดไปที่ยังไม่เริ่ม</p>
              </div>
              <Link href="/calendar" className="ghost-button px-4 py-2 text-xs font-medium">
                เปิดปฏิทิน
              </Link>
            </div>
            <div className="divide-y divide-line/70">
              {stats.upcoming.map((event) => (
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="grid gap-3 px-6 py-4 transition-colors hover:bg-panel-soft sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: event.channelColor }} />
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{event.channel}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{event.name}</p>
                    <p className="mt-1 text-xs text-muted">{event.location}</p>
                  </div>
                  <div className="self-center text-xs text-muted sm:text-right">
                    <p>{formatDateRange(event.startDate, event.endDate)}</p>
                    <p className="mt-1">{formatEventDuration(event.startDate, event.endDate)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="frosted-card rounded-xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Channel mix</h2>
            <p className="mb-6 mt-0.5 text-xs text-muted">สัดส่วนตามช่องทางจำหน่าย</p>
            <div className="space-y-5">
              {stats.channels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: channel.color }} />
                      {channel.name}
                    </span>
                    <span className="text-muted tabular-nums">{channel.eventCount}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-soft">
                    <div
                      className="spectrum-strip h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, (channel.eventCount / stats.events.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}
    </div>
  );
}
