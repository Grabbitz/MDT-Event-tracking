"use client";

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import thLocale from "@fullcalendar/core/locales/th";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EventChip } from "./event-chip";
import { addDaysToDateOnly, formatDateRange, formatEventDuration, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";

const thaiGregorianLocale = {
  ...thLocale,
  code: "th-u-ca-gregory",
};

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id || null);
  const [isCompact, setIsCompact] = useState(false);
  const selected = events.find((e) => e.id === selectedId);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsCompact(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const calendarEvents = useMemo(() => 
    events.map(e => ({
      id: e.id,
      title: e.name,
      start: e.startDate,
      end: addDaysToDateOnly(e.endDate, 1),
      extendedProps: { record: e }
    }))
  , [events]);

  return (
    <div className="space-y-5">
      <section className="frosted-card calendar-surface rounded-[30px] p-3 sm:p-5">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView={isCompact ? "listMonth" : "dayGridMonth"}
          key={isCompact ? "compact-calendar" : "full-calendar"}
          locales={[thaiGregorianLocale]}
          locale="th-u-ca-gregory"
          height="auto"
          events={calendarEvents}
          dayMaxEvents={isCompact ? 1 : 3}
          moreLinkClick="popover"
          eventContent={(info) => <EventChip event={info.event} />}
          eventClick={(info) => setSelectedId(info.event.id)}
          headerToolbar={
            isCompact
              ? {
                  start: "prev,next",
                  center: "title",
                  end: "today",
                }
              : {
                  start: "prev,next today",
                  center: "title",
                  end: "dayGridMonth,dayGridWeek",
                }
          }
        />
      </section>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="frosted-card grid gap-4 rounded-[26px] p-4 sm:gap-5 sm:rounded-[30px] sm:p-5 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(110px,1fr))_auto] lg:items-center"
          >
            <div className="min-w-0">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
                style={{ backgroundColor: selected.channelColor }}
              >
                {selected.channel}
              </span>
              <h2 className="text-base font-medium leading-tight text-foreground sm:truncate sm:text-lg">{selected.name}</h2>
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
