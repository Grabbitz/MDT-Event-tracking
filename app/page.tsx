import Link from "next/link";
import { CalendarCheck, CircleDollarSign, Store, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { formatDateRange } from "@/lib/events";
import { getDashboardStats } from "@/lib/events";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const targetProgress = stats.totalTarget > 0 ? Math.round((stats.totalActual / stats.totalTarget) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="font-black text-accent-strong">Modern Trade Workspace</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Event calendar, sales target, and file-ready planning in one view.
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-base leading-7">
            ข้อมูลตั้งต้นมาจากไฟล์ Excel ปี 2025-26 และจัดให้อยู่ในรูปแบบที่ทีมดูตาราง ปฏิทิน และ export ต่อได้ทันที
          </p>
        </div>
        <Link
          href="/events/new"
          className="flex min-h-11 w-fit items-center justify-center rounded-md bg-accent px-5 font-black text-white transition hover:bg-accent-strong"
        >
          เพิ่มอีเวนท์
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="อีเวนท์ทั้งหมด" value={stats.events.length.toLocaleString("th-TH")} detail="รวมข้อมูลปี 2025 และ 2026" icon={CalendarCheck} />
        <StatCard label="กำลังจัดวันนี้" value={stats.activeToday.length.toLocaleString("th-TH")} detail="เทียบกับวันที่เครื่องปัจจุบัน" icon={Store} />
        <StatCard label="เข้าร่วมงาน" value={stats.joining.toLocaleString("th-TH")} detail="รายการที่สถานะเข้าร่วม" icon={Users} />
        <StatCard label="ยอดขายเทียบ target" value={`${targetProgress}%`} detail="พร้อมรองรับ actual sales เมื่อกรอกเพิ่ม" icon={CircleDollarSign} />
      </section>

      {stats.events.length === 0 ? (
        <div className="border-line flex flex-col items-center justify-center rounded-lg border border-dashed bg-panel p-12 text-center">
          <div className="bg-panel-soft grid h-16 w-16 place-items-center rounded-full">
            <CalendarCheck className="h-8 w-8 text-muted" />
          </div>
          <h2 className="mt-4 text-xl font-black">ยังไม่มีข้อมูลอีเวนท์</h2>
          <p className="text-muted mt-2 max-w-sm">
            เริ่มสร้างอีเวนท์แรกของคุณเพื่อดูปฏิทินและสถิติต่างๆ ได้ทันที
          </p>
          <Link
            href="/events/new"
            className="mt-6 flex min-h-11 items-center justify-center rounded-md bg-accent px-8 font-black text-white transition hover:bg-accent-strong"
          >
            เพิ่มอีเวนท์แรก
          </Link>
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border-line overflow-hidden rounded-lg border bg-panel">
            <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-black">Upcoming events</h2>
                <p className="text-muted text-sm">5 รายการถัดไปจากข้อมูลทั้งหมด</p>
              </div>
              <Link href="/calendar" className="text-sm font-black text-accent-strong hover:underline">
                เปิดปฏิทิน
              </Link>
            </div>
            <div className="divide-line divide-y">
              {stats.upcoming.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="grid gap-3 px-5 py-4 transition hover:bg-panel-soft sm:grid-cols-[1fr_180px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: event.channelColor }} />
                      <span className="text-sm font-black text-accent-strong">{event.channel}</span>
                    </div>
                    <p className="mt-1 font-black">{event.name}</p>
                    <p className="text-muted mt-1 text-sm">{event.location}</p>
                  </div>
                  <p className="text-sm font-bold sm:text-right">{formatDateRange(event.startDate, event.endDate)}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-line rounded-lg border bg-panel p-5">
            <h2 className="text-xl font-black">Channel mix</h2>
            <div className="mt-5 space-y-4">
              {stats.channels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between gap-3 text-sm font-bold">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: channel.color }} />
                      {channel.name}
                    </span>
                    <span>{channel.eventCount}</span>
                  </div>
                  <div className="bg-panel-soft mt-2 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-accent"
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
