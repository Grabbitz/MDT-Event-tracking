"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import thLocale from "@fullcalendar/core/locales/th";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDateRange, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const selected = events.find((event) => event.id === selectedId);
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: `${event.channel} | ${event.name}`,
        start: event.startDate,
        end: addOneDay(event.endDate),
        backgroundColor: event.channelColor,
        borderColor: event.channelColor,
      })),
    [events],
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="border-line bg-panel rounded-lg border p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[thLocale]}
          locale="th"
          height="auto"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventDisplay="block"
        />
      </section>

      <aside className="border-line bg-panel rounded-lg border p-5">
        {selected ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: selected.channelColor }} />
                <p className="text-sm font-black text-accent-strong">{selected.channel}</p>
              </div>
              <h2 className="mt-2 text-2xl font-black leading-tight">{selected.name}</h2>
              <p className="text-muted mt-2 text-sm">{formatDateRange(selected.startDate, selected.endDate)}</p>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted font-semibold">สถานที่</dt>
                <dd className="font-bold">{selected.location}</dd>
              </div>
              <div>
                <dt className="text-muted font-semibold">สถานะ</dt>
                <dd className="font-bold">{getStatusLabel(selected.participationStatus)}</dd>
              </div>
              <div>
                <dt className="text-muted font-semibold">ขนาด / พื้นที่</dt>
                <dd className="font-bold">{[selected.boothSize, selected.boothZone].filter(Boolean).join(" | ") || "-"}</dd>
              </div>
              <div>
                <dt className="text-muted font-semibold">ติดต่อ</dt>
                <dd className="font-bold">{[selected.contactName, selected.contactPhone].filter(Boolean).join(" ") || "-"}</dd>
              </div>
            </dl>
            <Link
              href={`/events/${selected.id}`}
              className="inline-flex min-h-10 items-center rounded-md bg-accent px-4 text-sm font-black text-white transition hover:bg-accent-strong"
            >
              ดูรายละเอียด
            </Link>
          </div>
        ) : (
          <p className="text-muted text-sm">เลือกอีเวนท์บนปฏิทินเพื่อดูรายละเอียด</p>
        )}
      </aside>
    </div>
  );
}

function addOneDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}
