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
    <div className="mx-auto max-w-6xl space-y-10 py-2 sm:space-y-12 sm:py-4">
      <header className="rounded-xl border border-line bg-panel px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Modern Trade Workspace
            </p>
            <div className="space-y-3">
              <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                Event tracking dashboard
              </h1>

            </div>
            <p className="font-mono text-xs font-medium leading-6 text-muted">
              {stats.events.length.toLocaleString("th-TH")} records / Google Sheet source
            </p>
          </div>

          <Link
            href="/events/new"
            className="flex min-h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[oklch(0.3_0.01_70)] active:scale-[0.99] lg:min-w-[160px]"
          >
            เพิ่มอีเวนท์
          </Link>
        </div>
      </header>

      {/* Today Section */}
      {todayEvents.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <h2 className="text-xl font-bold tracking-tight">กำลังจัดวันนี้ ({todayEvents.length})</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map(event => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group border-line bg-panel hover:bg-panel-soft flex flex-col justify-between rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: event.channelColor }} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted">{event.channel}</span>
                  </div>
                  <h3 className="mt-2 font-bold leading-snug group-hover:text-accent">{event.name}</h3>
                  <p className="text-muted mt-1 text-xs">{event.location}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
                  <span className="text-[10px] font-bold text-muted">{formatDateRange(event.startDate, event.endDate)}</span>
                  <span className="text-accent text-[10px] font-black uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                    ดูข้อมูล →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="อีเวนท์ทั้งหมด" value={stats.events.length.toLocaleString("th-TH")} detail="รวมข้อมูลปี 2025 และ 2026" icon={CalendarCheck} />
        <StatCard label="กำลังจัดวันนี้" value={todayEvents.length.toLocaleString("th-TH")} detail="เทียบกับวันปัจจุบัน" icon={Store} />
        <StatCard label="เข้าร่วมงาน" value={stats.joining.toLocaleString("th-TH")} detail="รายการที่สถานะเข้าร่วม" icon={Users} />
        <StatCard label="ยอดขายเทียบ target" value={`${targetProgress}%`} detail="พร้อมรองรับ actual sales" icon={CircleDollarSign} />
      </section>

      {stats.events.length === 0 ? (
        <div className="border-line flex flex-col items-center justify-center rounded-2xl border border-dashed bg-panel p-16 text-center">
          <div className="bg-panel-soft grid h-20 w-20 place-items-center rounded-full">
            <CalendarCheck className="h-10 w-10 text-muted" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">ยังไม่มีข้อมูลอีเวนท์</h2>
          <p className="text-muted mt-3 max-w-sm text-lg">
            เริ่มสร้างอีเวนท์แรกของคุณเพื่อดูปฏิทินและสถิติต่างๆ ได้ทันที
          </p>
          <Link
            href="/events/new"
            className="mt-8 flex h-12 items-center justify-center rounded-xl bg-accent px-10 font-bold text-white transition-all hover:scale-[1.02] hover:bg-accent-strong"
          >
            เพิ่มอีเวนท์แรก
          </Link>
        </div>
      ) : (
        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="border-line overflow-hidden rounded-2xl border bg-panel shadow-[var(--shadow-soft)]">
            <div className="border-line flex items-center justify-between gap-4 border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">Upcoming events</h2>
                <p className="text-muted text-sm mt-0.5">5 รายการถัดไปจากข้อมูลทั้งหมด</p>
              </div>
              <Link href="/calendar" className="text-sm font-bold text-accent hover:text-accent-strong transition-colors">
                เปิดปฏิทิน
              </Link>
            </div>
            <div className="divide-line divide-y">
              {stats.upcoming.map((event) => (
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="grid gap-4 px-6 py-5 transition-colors duration-200 hover:bg-panel-soft/60 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: event.channelColor }} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">{event.channel}</span>
                    </div>
                    <p className="mt-1.5 font-semibold text-foreground text-lg">{event.name}</p>
                    <p className="text-muted mt-1 text-sm">{event.location}</p>
                  </div>
                  <div className="text-sm font-medium text-muted sm:text-right self-center">
                    {formatDateRange(event.startDate, event.endDate)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-line rounded-2xl border bg-panel p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-bold">Channel mix</h2>
            <p className="text-muted text-sm mt-0.5 mb-6">สัดส่วนตามช่องทางจำหน่าย</p>
            <div className="space-y-6">
              {stats.channels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                    <span className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: channel.color }} />
                      {channel.name}
                    </span>
                    <span className="text-muted">{channel.eventCount}</span>
                  </div>
                  <div className="bg-panel-soft mt-2.5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${Math.max(8, (channel.eventCount / stats.events.length) * 100)}%` }}
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
