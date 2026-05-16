"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import thLocale from "@fullcalendar/core/locales/th";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ExternalLink, MapPin, Plus, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { EventChip } from "@/components/ui/event-chip";
import { addDaysToDateOnly, formatDateRange, formatEventDuration, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";

const thaiGregorianLocale = {
  ...thLocale,
  code: "th-u-ca-gregory",
};

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatThaiDate(date: Date): string {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function isMultiDayEvent(event: EventRecord): boolean {
  return event.startDate !== event.endDate;
}

type PanelMode =
  | { kind: "event"; id: string; anchor?: FloatingAnchor }
  | { kind: "day"; date: Date; anchor?: FloatingAnchor }
  | null;

type FloatingAnchor = {
  top: number;
  left: number;
};

type CalendarDensity = "compact" | "comfort" | "cozy";

const densityOptions: Array<{ value: CalendarDensity; label: string; maxEvents: number }> = [
  { value: "compact", label: "Compact", maxEvents: 3 },
  { value: "comfort", label: "Comfort", maxEvents: 4 },
  { value: "cozy", label: "Cozy", maxEvents: 6 },
];

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [panel, setPanel] = useState<PanelMode>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [density, setDensity] = useState<CalendarDensity>("comfort");
  const floatingPanelRef = useRef<HTMLElement | null>(null);

  const selectedEvent = panel?.kind === "event" ? events.find((e) => e.id === panel.id) : undefined;

  const selectedDayEvents = useMemo(() => {
    if (panel?.kind !== "day") return [];
    const dateStr = toDateStr(panel.date);
    return events.filter((e) => e.startDate <= dateStr && e.endDate >= dateStr);
  }, [panel, events]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!panel) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (floatingPanelRef.current?.contains(target)) return;
      if (target.closest(".fc-daygrid-day, .fc-event, .fc-daygrid-more-link, .fc-more-popover")) return;

      setPanel(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [panel]);

  const calendarEvents = useMemo(() =>
    events.map((e) => ({
      id: e.id,
      title: e.name,
      start: e.startDate,
      end: addDaysToDateOnly(e.endDate, 1),
      backgroundColor: e.channelColor || "#808080",
      borderColor: e.channelColor || "#808080",
      display: isMultiDayEvent(e) ? "block" : "list-item",
      classNames: [
        isMultiDayEvent(e) ? "calendar-line-event" : "calendar-dot-event",
        `calendar-channel-${e.channel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      ],
      extendedProps: { record: e },
    }))
  , [events]);

  const resolveAnchor = (element: HTMLElement): FloatingAnchor => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + 10,
      left: rect.left + rect.width - 12,
    };
  };

  const floatingStyle = panel?.anchor
    ? ({
        "--floating-top": `${panel.anchor.top}px`,
        "--floating-left": `${panel.anchor.left}px`,
      } as CSSProperties)
    : undefined;

  const dayMaxEvents = isCompact ? 1 : densityOptions.find((option) => option.value === density)?.maxEvents ?? 4;

  const renderEventContent = (info: EventContentArg) => {
    if (isCompact) return <EventChip event={info.event} />;

    const record = info.event.extendedProps.record as EventRecord;

    if (!isMultiDayEvent(record)) {
      return (
        <span
          className="calendar-dot-marker"
          style={{ backgroundColor: record.channelColor || "#aeaeae" }}
          title={record.name}
        />
      );
    }

    return (
      <span
        className="calendar-line-fill"
        aria-label={record.name}
        title={record.name}
      />
    );
  };

  return (
    <div className="relative space-y-4">
      <section className={`frosted-card calendar-surface calendar-density-${density} rounded-xl p-3 sm:p-5`}>
        {!isCompact ? (
          <div className="calendar-density-control" aria-label="Calendar spacing">
            <SlidersHorizontal size={15} />
            <div className="calendar-density-tabs">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={density === option.value ? "is-active" : undefined}
                  onClick={() => setDensity(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView={isCompact ? "listMonth" : "dayGridMonth"}
          key={isCompact ? "compact-calendar" : "full-calendar"}
          locales={[thaiGregorianLocale]}
          locale="th-u-ca-gregory"
          height="auto"
          events={calendarEvents}
          eventOrder="start,-duration,title"
          dayMaxEvents={dayMaxEvents}
          moreLinkClick="popover"
          eventContent={renderEventContent}
          dateClick={(info) => setPanel({ kind: "day", date: info.date, anchor: resolveAnchor(info.dayEl) })}
          eventClick={(info) => {
            info.jsEvent.stopPropagation();
            setPanel({ kind: "event", id: info.event.id, anchor: resolveAnchor(info.el) });
          }}
          headerToolbar={
            isCompact
              ? { start: "prev,next", center: "title", end: "today" }
              : { start: "prev,next today", center: "title", end: "dayGridMonth,dayGridWeek" }
          }
        />
      </section>

      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.aside
            ref={floatingPanelRef}
            key={`event-${selectedEvent.id}`}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
            style={floatingStyle}
            className="calendar-floating-panel frosted-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span
                  className="mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
                  style={{ backgroundColor: selectedEvent.channelColor }}
                >
                  {selectedEvent.channel}
                </span>
                <h2 className="text-base font-semibold leading-tight tracking-tight text-foreground">
                  {selectedEvent.name}
                </h2>
                <p className="mt-1.5 text-sm text-muted">{formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}</p>
              </div>
              <button
                type="button"
                aria-label="ปิดรายละเอียด"
                className="calendar-floating-close"
                onClick={() => setPanel(null)}
              >
                <X size={15} />
              </button>
            </div>
            <div className="calendar-floating-meta">
              <DetailRow label="สถานที่" value={selectedEvent.location} />
              <DetailRow label="ระยะเวลา" value={formatEventDuration(selectedEvent.startDate, selectedEvent.endDate)} />
              <DetailRow label="สถานะ" value={getStatusLabel(selectedEvent.participationStatus)} />
              <DetailRow label="Target" value={selectedEvent.salesTarget?.toLocaleString() || "—"} />
              <DetailRow label="Actual" value={selectedEvent.actualSales?.toLocaleString() || "—"} />
            </div>
            <Link
              href={`/events/${selectedEvent.id}`}
              className="neutral-button mt-4 flex min-h-10 items-center justify-center gap-2 px-5 text-sm font-medium"
            >
              <ExternalLink size={15} />
              ดูรายละเอียด
            </Link>
          </motion.aside>
        ) : panel?.kind === "day" ? (
          <motion.aside
            ref={floatingPanelRef}
            key={`day-${panel.date.toISOString()}`}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
            style={floatingStyle}
            className="calendar-floating-panel frosted-card"
          >
            <div className="calendar-floating-header">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted">
                  <CalendarDays size={14} />
                  {formatThaiDate(panel.date)}
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
                  {selectedDayEvents.length === 0
                    ? "ไม่มีงาน"
                    : `${selectedDayEvents.length} งาน`}
                </p>
              </div>
              <button
                type="button"
                aria-label="ปิดรายการอีเวนท์"
                className="calendar-floating-close"
                onClick={() => setPanel(null)}
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-muted">กดรายการเพื่อเปิดรายละเอียด</span>
              <Link
                href="/events/new"
                className="ghost-button flex min-h-9 shrink-0 items-center gap-1.5 px-3 text-xs font-medium"
              >
                <Plus size={14} />
                เพิ่มงาน
              </Link>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="calendar-day-list">
                {selectedDayEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="calendar-day-list-item"
                  >
                    <span
                      className="calendar-day-list-color"
                      style={{ backgroundColor: event.channelColor }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {event.name}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted">
                        <MapPin size={12} />
                        {event.location || event.channel}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-panel-soft px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                      {formatEventDuration(event.startDate, event.endDate)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-panel-soft px-5 py-8 text-center text-sm text-muted">
                ไม่มีงานในวันนี้
              </p>
            )}
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
