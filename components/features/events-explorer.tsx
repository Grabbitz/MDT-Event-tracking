"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarPlus, Search } from "lucide-react";
import { ExportButton } from "@/components/ui/export-button";
import { formatDateRange, formatEventDuration, getStatusClass, getStatusLabel } from "@/lib/event-format";
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
      <section className="frosted-card rounded-xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_160px_140px_auto]">
          <label className="relative">
            <Search aria-hidden className="text-muted pointer-events-none absolute left-3 top-3 h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-md bg-white px-9 text-sm outline-none shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition focus:shadow-[0px_0px_0px_2px_hsla(212,100%,48%,0.4)]"
              placeholder="ค้นหาชื่องาน สถานที่ ช่องทาง"
              aria-label="ค้นหาอีเวนท์"
            />
          </label>
          <select
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="h-11 rounded-md bg-white px-4 text-sm font-medium outline-none shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition focus:shadow-[0px_0px_0px_2px_hsla(212,100%,48%,0.4)]"
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
            className="h-11 rounded-md bg-white px-4 text-sm font-medium outline-none shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition focus:shadow-[0px_0px_0px_2px_hsla(212,100%,48%,0.4)]"
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
            className="h-11 rounded-md bg-white px-4 text-sm font-medium outline-none shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition focus:shadow-[0px_0px_0px_2px_hsla(212,100%,48%,0.4)]"
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

      <section className="frosted-card overflow-hidden rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <p className="text-sm font-medium">
            พบ {filteredEvents.length.toLocaleString("th-TH")} รายการ
          </p>
          <Link
            href="/events/new"
            className="neutral-button flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm font-medium sm:min-h-10 sm:w-fit"
          >
            <CalendarPlus aria-hidden className="h-4 w-4" />
            เพิ่มอีเวนท์
          </Link>
        </div>

        <div className="divide-y divide-line/70 md:hidden">
          {filteredEvents.map((event) => (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="block px-4 py-4 transition-colors hover:bg-panel-soft sm:px-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-normal text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: event.channelColor }} />
                  {event.channel}
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusClass(event.participationStatus)}`}>
                  {getStatusLabel(event.participationStatus)}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-medium leading-snug text-foreground">{event.name}</h3>
              <p className="mt-2 text-xs leading-5 text-muted">{event.location}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                <span>{formatDateRange(event.startDate, event.endDate)}</span>
                <span>{formatEventDuration(event.startDate, event.endDate)}</span>
                <span>{event.salesStaffRequired ? "ต้องการ PC" : "ไม่ต้องการ PC"}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden overflow-x-auto overscroll-x-contain md:block">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-panel-soft text-left">
              <tr className="text-muted">
                <th className="px-5 py-3 font-medium">งาน</th>
                <th className="px-5 py-3 font-medium">ช่องทาง</th>
                <th className="px-5 py-3 font-medium">ช่วงวัน</th>
                <th className="px-5 py-3 font-medium">จำนวนวัน</th>
                <th className="px-5 py-3 font-medium">สถานที่</th>
                <th className="px-5 py-3 font-medium">สถานะ</th>
                <th className="px-5 py-3 font-medium">PC</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-line border-t align-top transition-colors duration-150 hover:bg-panel-soft/70">
                  <td className="px-5 py-4">
                    <Link href={`/events/${event.id}`} className="font-medium transition-colors duration-150 hover:text-muted">
                      {event.name}
                    </Link>
                    {event.boothSize ? <p className="text-muted mt-1 text-xs">{event.boothSize}</p> : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: event.channelColor }} />
                      {event.channel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted">{formatDateRange(event.startDate, event.endDate)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted">{formatEventDuration(event.startDate, event.endDate)}</td>
                  <td className="px-5 py-4 text-muted">{event.location}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(event.participationStatus)}`}>
                      {getStatusLabel(event.participationStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted">{event.salesStaffRequired ? "ต้องการ PC" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
