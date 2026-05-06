"use client";

import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import thLocale from "@fullcalendar/core/locales/th";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EventChip } from "./event-chip";
import { formatDateRange, getStatusLabel } from "@/lib/event-format";
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
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="flex-1 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[thLocale]}
          locale="th"
          height="auto"
          events={calendarEvents}
          eventContent={(info) => <EventChip event={info.event} />}
          eventClick={(info) => setSelectedId(info.event.id)}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,dayGridWeek"
          }}
        />
      </section>

      <aside className="w-full lg:w-80 shrink-0">
        <div className="sticky top-8 rounded-2xl border border-line bg-surface p-6 shadow-sm min-h-[400px]">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col h-full"
              >
                <div className="mb-6">
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white mb-2"
                    style={{ backgroundColor: selected.channelColor }}
                  >
                    {selected.channel}
                  </span>
                  <h2 className="text-xl font-black leading-tight text-text-strong">{selected.name}</h2>
                  <p className="mt-2 text-sm font-bold text-text-muted">{formatDateRange(selected.startDate, selected.endDate)}</p>
                </div>

                <div className="space-y-4 flex-1">
                  <DetailRow label="Location" value={selected.location} />
                  <DetailRow label="Status" value={getStatusLabel(selected.participationStatus)} />
                  <DetailRow label="Sales Target" value={selected.salesTarget?.toLocaleString() || "-"} />
                  <DetailRow label="Actual Sales" value={selected.actualSales?.toLocaleString() || "-"} />
                </div>

                <Link 
                  href={`/events/${selected.id}`}
                  className="mt-8 flex w-full items-center justify-center py-3 bg-primary text-white rounded-xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  Edit Details
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted text-sm font-bold">
                Select an event to see details
              </div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-text-strong">{value}</p>
    </div>
  );
}

function addOneDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}
