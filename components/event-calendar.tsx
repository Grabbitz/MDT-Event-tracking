"use client";

import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import thLocale from "@fullcalendar/core/locales/th";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EventChip } from "./event-chip";
import { formatDateRange, formatEventDuration, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id || null);
  const selected = events.find((e) => e.id === selectedId);

  const calendarEvents = useMemo(() => 
    events.map(e => ({
      id: e.id,
      title: e.name,
      start: e.startDate,
      end: addOneDay(e.endDate), 
      extendedProps: { record: e }
    }))
  , [events]);

  return (
    <div className="space-y-5">
      <section className="frosted-card calendar-surface rounded-[30px] p-3 sm:p-5">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[thLocale]}
          locale="th"
          height="auto"
          events={calendarEvents}
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventContent={(info) => <EventChip event={info.event} />}
          eventClick={(info) => setSelectedId(info.event.id)}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,dayGridWeek"
          }}
        />
      </section>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="frosted-card grid gap-5 rounded-[30px] p-5 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(110px,1fr))_auto] lg:items-center"
          >
            <div className="min-w-0">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
                style={{ backgroundColor: selected.channelColor }}
              >
                {selected.channel}
              </span>
              <h2 className="truncate text-lg font-medium leading-tight text-foreground">{selected.name}</h2>
              <p className="mt-2 text-sm text-muted">{formatDateRange(selected.startDate, selected.endDate)}</p>
            </div>
            <DetailRow label="Location" value={selected.location} />
            <DetailRow label="Duration" value={formatEventDuration(selected.startDate, selected.endDate)} />
            <DetailRow label="Status" value={getStatusLabel(selected.participationStatus)} />
            <DetailRow label="Target" value={selected.salesTarget?.toLocaleString() || "-"} />
            <DetailRow label="Actual" value={selected.actualSales?.toLocaleString() || "-"} />
            <Link
              href={`/events/${selected.id}`}
              className="neutral-button flex min-h-11 items-center justify-center px-5 text-sm font-medium"
            >
              Details
            </Link>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function addOneDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}
