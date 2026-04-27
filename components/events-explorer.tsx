"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarPlus, Search } from "lucide-react";
import { ExportButton } from "@/components/export-button";
import { formatDateRange, getStatusClass, getStatusLabel } from "@/lib/event-format";
import type { EventRecord, ParticipationStatus } from "@/lib/types";

export function EventsExplorer({ events }: { events: EventRecord[] }) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState<ParticipationStatus | "all">("all");
  const [year, setYear] = useState("all");
  const allEvents = events;
  const channels = useMemo(() => Array.from(new Set(allEvents.map((event) => event.channel))).sort(), [allEvents]);
  const years = useMemo(() => Array.from(new Set(allEvents.map((event) => String(event.year)))).sort(), [allEvents]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents.filter((event) => {
      const text = [event.name, event.channel, event.location, event.boothZone, event.contactName, event.contactPhone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (channel === "all" || event.channel === channel) &&
        (status === "all" || event.participationStatus === status) &&
        (year === "all" || String(event.year) === year)
      );
    });
  }, [allEvents, channel, query, status, year]);

  return (
    <div className="space-y-5">
      <section className="border-line rounded-2xl border bg-panel p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_160px_140px_auto]">
          <label className="relative">
            <Search aria-hidden className="text-muted pointer-events-none absolute left-3 top-3 h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-line h-11 w-full rounded-md border bg-white px-9 text-sm outline-none focus:border-accent"
              placeholder="ค้นหาชื่องาน สถานที่ ช่องทาง"
              aria-label="ค้นหาอีเวนท์"
            />
          </label>
          <select
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="border-line h-11 rounded-md border bg-white px-3 text-sm font-semibold outline-none focus:border-accent"
            aria-label="กรองตามช่องทาง"
          >
            <option value="all">ทุกช่องทาง</option>
            {channels.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ParticipationStatus | "all")}
            className="border-line h-11 rounded-md border bg-white px-3 text-sm font-semibold outline-none focus:border-accent"
            aria-label="กรองตามสถานะ"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="joining">เข้าร่วม</option>
            <option value="not_joining">ไม่เข้าร่วม</option>
            <option value="pending">รอตัดสินใจ</option>
          </select>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="border-line h-11 rounded-md border bg-white px-3 text-sm font-semibold outline-none focus:border-accent"
            aria-label="กรองตามปี"
          >
            <option value="all">ทุกปี</option>
            {years.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <ExportButton events={filteredEvents} />
        </div>
      </section>

      <section className="border-line overflow-hidden rounded-2xl border bg-panel shadow-[var(--shadow-soft)]">
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <p className="text-sm font-bold">
            พบ {filteredEvents.length.toLocaleString("th-TH")} รายการ
          </p>
          <Link
            href="/events/new"
            className="flex min-h-10 items-center gap-2 rounded-md bg-accent px-3 text-sm font-black text-white transition-colors duration-200 hover:bg-accent-strong"
          >
            <CalendarPlus aria-hidden className="h-4 w-4" />
            เพิ่มอีเวนท์
          </Link>
        </div>

        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-panel-soft text-left">
              <tr className="text-muted">
                <th className="px-4 py-3 font-black">งาน</th>
                <th className="px-4 py-3 font-black">ช่องทาง</th>
                <th className="px-4 py-3 font-black">ช่วงวัน</th>
                <th className="px-4 py-3 font-black">สถานที่</th>
                <th className="px-4 py-3 font-black">สถานะ</th>
                <th className="px-4 py-3 font-black">PC</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-line border-t align-top transition-colors duration-150 hover:bg-panel-soft/70">
                  <td className="px-4 py-3">
                    <Link href={`/events/${event.id}`} className="font-black transition-colors duration-150 hover:text-accent-strong">
                      {event.name}
                    </Link>
                    {event.boothSize ? <p className="text-muted mt-1 text-xs">{event.boothSize}</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-bold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: event.channelColor }} />
                      {event.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateRange(event.startDate, event.endDate)}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-black ${getStatusClass(event.participationStatus)}`}>
                      {getStatusLabel(event.participationStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{event.salesStaffRequired ? "ต้องการ PC" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
