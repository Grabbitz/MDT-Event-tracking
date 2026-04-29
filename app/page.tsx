import Link from "next/link";
import { CalendarCheck, CircleDollarSign, Store, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { formatDateRange } from "@/lib/events";
import { getDashboardStats } from "@/lib/events";

export const revalidate = 0;

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const targetProgress = stats.totalTarget > 0 ? Math.round((stats.totalActual / stats.totalTarget) * 100) : 0;
  const todayEvents = stats.activeToday;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-1">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted">Modern Trade</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Event tracking</h1>
        </div>
        <Link
          href="/events/new"
          className="flex min-h-8 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          + เพิ่มอีเวนท์
        </Link>
      </div>

      {/* Today Section */}
      {todayEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            <h2 className="text-sm font-semibold text-foreground">กำลังจัดวันนี้ ({todayEvents.length})</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group border-line bg-panel rounded-lg border p-4 transition-colors hover:bg-panel-soft"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: event.channelColor }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{event.channel}</span>
                </div>
                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-accent">{event.name}</h3>
                <p className="text-muted mt-1 text-xs">{event.location}</p>
                <p className="text-[10px] text-muted mt-3">{formatDateRange(event.startDate, event.endDate)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="อีเวนท์ทั้งหมด" value={stats.events.length.toLocaleString("th-TH")} detail="รวมข้อมูลปี 2025 และ 2026" icon={CalendarCheck} />
        <StatCard label="กำลังจัดวันนี้" value={todayEvents.length.toLocaleString("th-TH")} detail="เทียบกับวันปัจจุบัน" icon={Store} />
        <StatCard label="เข้าร่วมงาน" value={stats.joining.toLocaleString("th-TH")} detail="รายการที่สถานะเข้าร่วม" icon={Users} />
        <StatCard label="ยอดขายเทียบ target" value={`${targetProgress}%`} detail="พร้อมรองรับ actual sales" icon={CircleDollarSign} />
      </section>

      {stats.events.length === 0 ? (
        <div className="border-line flex flex-col items-center justify-center rounded-lg border border-dashed bg-panel p-16 text-center">
          <div className="bg-accent-soft grid h-14 w-14 place-items-center rounded-full mb-4">
            <CalendarCheck className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-base font-semibold text-foreground">ยังไม่มีข้อมูลอีเวนท์</h2>
          <p className="text-muted mt-2 max-w-sm text-sm leading-relaxed">
            เริ่มสร้างอีเวนท์แรกของคุณเพื่อดูปฏิทินและสถิติต่างๆ ได้ทันที
          </p>
          <Link
            href="/events/new"
            className="mt-6 flex h-9 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            เพิ่มอีเวนท์แรก
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Upcoming events */}
          <div className="border-line overflow-hidden rounded-lg border bg-panel">
            <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Upcoming events</h2>
                <p className="text-muted text-xs mt-0.5">5 รายการถัดไปจากข้อมูลทั้งหมด</p>
              </div>
              <Link href="/calendar" className="text-xs font-medium text-accent hover:text-accent-strong transition-colors">
                เปิดปฏิทิน →
              </Link>
            </div>
            <div className="divide-line divide-y">
              {stats.upcoming.map((event) => (
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-panel-soft sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: event.channelColor }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{event.channel}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{event.name}</p>
                    <p className="text-muted mt-0.5 text-xs">{event.location}</p>
                  </div>
                  <div className="text-xs text-muted sm:text-right self-center">
                    {formatDateRange(event.startDate, event.endDate)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Channel mix */}
          <div className="border-line rounded-lg border bg-panel p-5">
            <h2 className="text-sm font-semibold text-foreground">Channel mix</h2>
            <p className="text-muted text-xs mt-0.5 mb-5">สัดส่วนตามช่องทางจำหน่าย</p>
            <div className="space-y-4">
              {stats.channels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: channel.color }} />
                      {channel.name}
                    </span>
                    <span className="text-muted tabular-nums">{channel.eventCount}</span>
                  </div>
                  <div className="bg-panel-soft mt-1.5 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
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
