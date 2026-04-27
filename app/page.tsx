import Link from "next/link";
import { CalendarCheck, CircleDollarSign, Store, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { formatDateRange } from "@/lib/events";
import { getDashboardStats } from "@/lib/events";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const targetProgress = stats.totalTarget > 0 ? Math.round((stats.totalActual / stats.totalTarget) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-2 sm:space-y-12 sm:py-4">
      <header className="space-y-5 rounded-3xl border border-line bg-panel px-5 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="inline-flex items-center rounded-full bg-accent-soft px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-accent-strong">
          Modern Trade Workspace
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <h1 className="max-w-4xl text-[clamp(2.1rem,6vw,4.7rem)] font-black leading-[0.97] tracking-[-0.04em] text-foreground">
              Event calendar, sales target, and file-ready planning.
            </h1>
            <div className="max-w-3xl space-y-3">
              <p className="max-w-2xl text-base font-semibold leading-8 text-[oklch(0.4_0.02_62)] sm:text-[1.25rem]">
                ข้อมูลตั้งต้นมาจากไฟล์ Excel ปี 2025-26 และจัดให้อยู่ในรูปแบบที่ทีมดูตาราง ปฏิทิน และ export ต่อได้ทันที
              </p>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                ใช้พื้นที่นี้สำหรับดูภาพรวมงานที่กำลังจะเกิดขึ้น เช็กสถานะการเข้าร่วม และเตรียมไฟล์ทำงานต่อได้จากชุดข้อมูลเดียวกัน
              </p>
            </div>
          </div>

          <Link
            href="/events/new"
            className="flex min-h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-accent-strong active:scale-[0.99] lg:min-w-[180px]"
          >
            เพิ่มอีเวนท์
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="อีเวนท์ทั้งหมด" value={stats.events.length.toLocaleString("th-TH")} detail="รวมข้อมูลปี 2025 และ 2026" icon={CalendarCheck} />
        <StatCard label="กำลังจัดวันนี้" value={stats.activeToday.length.toLocaleString("th-TH")} detail="เทียบกับวันปัจจุบัน" icon={Store} />
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
