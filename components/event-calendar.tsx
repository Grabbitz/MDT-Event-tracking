"use client";

import thLocale from "@fullcalendar/core/locales/th";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { formatDateRange, formatEventDuration, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";
import { EventChip } from "./event-chip";

const ALL_CHANNELS = "all";

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [activeChannel, setActiveChannel] = useState(ALL_CHANNELS);
  const calendarRef = useRef<FullCalendar>(null);

  const sortedEvents = useMemo(
    () => events.slice().sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [events],
  );

  const initialDate = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = sortedEvents.find((event) => event.startDate >= now);
    return upcoming ? upcoming.startDate : sortedEvents[0]?.startDate;
  }, [sortedEvents]);

  const channels = useMemo(() => {
    const channelMap = new Map<string, string>();
    for (const event of sortedEvents) channelMap.set(event.channel, event.channelColor);
    return Array.from(channelMap, ([name, color]) => ({ name, color })).sort((a, b) => a.name.localeCompare(b.name));
  }, [sortedEvents]);

  const filteredEvents = useMemo(
    () =>
      activeChannel === ALL_CHANNELS
        ? sortedEvents
        : sortedEvents.filter((event) => event.channel === activeChannel),
    [activeChannel, sortedEvents],
  );

  const groupedEvents = useMemo(() => groupEventsByStartDate(filteredEvents), [filteredEvents]);
  const selected = sortedEvents.find((event) => event.id === selectedId) ?? filteredEvents[0];
  const upcomingCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return filteredEvents.filter((event) => event.endDate >= today).length;
  }, [filteredEvents]);

  const calendarEvents = useMemo(
    () =>
      sortedEvents.map((event) => ({
        id: event.id,
        title: event.name,
        start: event.startDate,
        end: addOneDay(event.endDate),
        extendedProps: { record: event },
      })),
    [sortedEvents],
  );

  function selectEvent(event: EventRecord) {
    setSelectedId(event.id);
    calendarRef.current?.getApi().gotoDate(event.startDate);
  }

  return (
    <div className="space-y-4">
      <section className="md:hidden">
        <div className="border-line bg-panel rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Agenda</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                {initialDate ? formatMobileMonth(initialDate) : "Calendar"}
              </h2>
            </div>
            <div className="border-line rounded-md border bg-panel-soft px-3 py-2 text-right">
              <p className="text-xl font-semibold leading-none text-foreground">{upcomingCount}</p>
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">Upcoming</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <ChannelButton
              active={activeChannel === ALL_CHANNELS}
              label="ทั้งหมด"
              count={sortedEvents.length}
              onClick={() => setActiveChannel(ALL_CHANNELS)}
            />
            {channels.map((channel) => (
              <ChannelButton
                key={channel.name}
                active={activeChannel === channel.name}
                color={channel.color}
                label={channel.name}
                count={sortedEvents.filter((event) => event.channel === channel.name).length}
                onClick={() => setActiveChannel(channel.name)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {groupedEvents.length ? (
            groupedEvents.map((group, groupIndex) => (
              <motion.section
                key={group.date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.035, duration: 0.2 }}
                className="border-line bg-panel rounded-lg border p-3"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-foreground">{formatMobileDateHeading(group.date)}</p>
                  <p className="font-mono text-xs font-semibold text-muted">{group.events.length} งาน</p>
                </div>
                <div className="space-y-2">
                  {group.events.map((event) => (
                    <MobileEventButton
                      key={event.id}
                      event={event}
                      selected={event.id === selected?.id}
                      onClick={() => selectEvent(event)}
                    />
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            <div className="border-line bg-panel rounded-lg border p-6 text-center">
              <p className="text-base font-semibold text-foreground">ยังไม่มีอีเวนท์ในช่องทางนี้</p>
              <p className="mt-2 text-sm leading-6 text-muted">ลองเลือกช่องทางอื่น หรือกลับไปดูทั้งหมด</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <SelectedEventPanel selected={selected} compact />
        </div>
      </section>

      <section className="hidden gap-4 md:grid xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="notion-calendar-shell border-line bg-panel overflow-hidden rounded-lg border">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            initialDate={initialDate}
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
        </div>

        <SelectedEventPanel selected={selected} />
      </section>
    </div>
  );
}

function ChannelButton({
  active,
  color,
  count,
  label,
  onClick,
}: {
  active: boolean;
  color?: string;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition active:scale-[0.98] ${
        active ? "border-foreground bg-foreground" : "border-line bg-panel text-foreground hover:bg-panel-soft"
      }`}
      style={active ? { color: "white" } : undefined}
    >
      {color ? <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> : null}
      <span>{label}</span>
      <span className={active ? "" : "text-muted"} style={active ? { color: "rgba(255, 255, 255, 0.75)" } : undefined}>{count}</span>
    </button>
  );
}

function MobileEventButton({
  event,
  selected,
  onClick,
}: {
  event: EventRecord;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid min-h-[86px] w-full grid-cols-[52px_minmax(0,1fr)] gap-3 rounded-lg border p-3 text-left transition active:scale-[0.99] ${
        selected ? "border-foreground bg-panel-soft" : "border-line bg-panel"
      }`}
    >
      <div className="border-line grid h-13 place-items-center rounded-md border bg-panel text-center">
        <span className="block text-lg font-semibold leading-none text-foreground">{formatDay(event.startDate)}</span>
        <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">{formatShortMonth(event.startDate)}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: event.channelColor }} />
          <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">{event.channel}</span>
        </div>
        <p className="mt-1 line-clamp-2 break-words text-sm font-semibold leading-snug text-foreground">{event.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted">
          <span>{formatEventDuration(event.startDate, event.endDate)}</span>
          <span className="text-muted/50">|</span>
          <span className="truncate">{event.location || "ไม่ระบุสถานที่"}</span>
        </div>
      </div>
    </button>
  );
}

function SelectedEventPanel({ selected, compact = false }: { selected: EventRecord | undefined; compact?: boolean }) {
  return (
    <aside
      className={`border-line bg-panel relative overflow-hidden rounded-lg border p-5 ${
        compact ? "" : "p-6"
      }`}
    >
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: compact ? 0 : 20, y: compact ? 8 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: compact ? 0 : -20, y: compact ? 8 : 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: selected.channelColor }} />
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">{selected.channel}</p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground">{selected.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-muted">{formatDateRange(selected.startDate, selected.endDate)}</p>
                <span className="rounded-full bg-panel-soft px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-muted">
                  {formatEventDuration(selected.startDate, selected.endDate)}
                </span>
              </div>
            </div>

            <dl className="grid gap-4">
              <DetailItem label="สถานที่" value={selected.location} />
              <DetailItem label="สถานะ" value={getStatusLabel(selected.participationStatus)} />
              <DetailItem label="ขนาด / พื้นที่" value={[selected.boothSize, selected.boothZone].filter(Boolean).join(" | ") || "-"} />
              <DetailItem label="ติดต่อ" value={[selected.contactName, selected.contactPhone].filter(Boolean).join(" ") || "-"} />
            </dl>

            <Link
              href={`/events/${selected.id}`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-foreground px-6 text-sm font-semibold transition hover:bg-[oklch(0.3_0.01_70)] active:scale-[0.98]"
              style={{ color: "white" }}
            >
              ดูรายละเอียดแบบเต็ม
            </Link>
          </motion.div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-muted">เลือกอีเวนท์เพื่อดูรายละเอียด</p>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function groupEventsByStartDate(events: EventRecord[]) {
  const groups = new Map<string, EventRecord[]>();
  for (const event of events) {
    const current = groups.get(event.startDate) ?? [];
    current.push(event);
    groups.set(event.startDate, current);
  }
  return Array.from(groups, ([date, groupEvents]) => ({ date, events: groupEvents }));
}

function addOneDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("th-TH", { day: "2-digit" }).format(new Date(`${value}T00:00:00`));
}

function formatShortMonth(value: string) {
  return new Intl.DateTimeFormat("th-TH", { month: "short" }).format(new Date(`${value}T00:00:00`));
}

function formatMobileMonth(value: string) {
  return new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatMobileDateHeading(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
