"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import thLocale from "@fullcalendar/core/locales/th";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange, formatEventDuration, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";
import { EventChip } from "./event-chip";

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [view, setView] = useState("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const handleResize = () => {
      const newView = window.innerWidth < 768 ? "listWeek" : "dayGridMonth";
      setView(newView);
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView(newView);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selected = events.find((event) => event.id === selectedId);
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.name,
        start: event.startDate,
        end: addOneDay(event.endDate),
        extendedProps: { record: event },
      })),
    [events],
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="border-line bg-panel rounded-xl border p-4 shadow-sm overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={view}
          locales={[thLocale]}
          locale="th"
          height="auto"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,listWeek",
          }}
          events={calendarEvents}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventContent={(eventInfo) => <EventChip event={eventInfo.event} />}
        />
      </section>

      <aside className="border-line bg-panel rounded-xl border p-6 shadow-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: selected.channelColor }} />
                  <p className="text-xs font-black uppercase tracking-widest text-accent-strong">{selected.channel}</p>
                </div>
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-foreground">{selected.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <p className="text-muted text-sm font-bold">{formatDateRange(selected.startDate, selected.endDate)}</p>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-black tracking-wide text-accent-strong">
                    {formatEventDuration(selected.startDate, selected.endDate)}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4">
                <DetailItem label="สถานที่" value={selected.location} />
                <DetailItem label="สถานะ" value={getStatusLabel(selected.participationStatus)} />
                <DetailItem label="ขนาด / พื้นที่" value={[selected.boothSize, selected.boothZone].filter(Boolean).join(" | ") || "-"} />
                <DetailItem label="ติดต่อ" value={[selected.contactName, selected.contactPhone].filter(Boolean).join(" ") || "-"} />
              </div>

              <Link
                href={`/events/${selected.id}`}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-6 text-sm font-black text-white transition hover:bg-accent-strong hover:scale-[1.02] active:scale-[0.98]"
              >
                ดูรายละเอียดแบบเต็ม
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <p className="text-muted text-sm font-bold">เลือกอีเวนท์บนปฏิทิน<br/>เพื่อดูรายละเอียด</p>
            </div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-black uppercase tracking-wider text-muted mb-0.5">{label}</dt>
      <dd className="text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}

function addOneDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}
