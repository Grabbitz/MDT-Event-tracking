# Calendar UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Calendar page to be cleaner, interactive, and visually polished with compact event chips, tooltips, and smooth animations.

**Architecture:** Use FullCalendar's `eventContent` hook for custom chip rendering and `framer-motion` for animations and tooltips.

**Tech Stack:** React, Next.js, FullCalendar, Framer Motion, Tailwind CSS, Lucide React, Floating UI.

---

### Task 1: Environment Setup & Dependencies

**Files:**
- Modify: `web-event-tracking/package.json`

- [ ] **Step 1: Add required dependencies**

Run: `npm install framer-motion @floating-ui/react`

- [ ] **Step 2: Commit**

```bash
git add web-event-tracking/package.json
git commit -m "chore: add framer-motion and floating-ui dependencies"
```

### Task 2: Global Styles for FullCalendar Overrides

**Files:**
- Modify: `web-event-tracking/app/globals.css`

- [ ] **Step 1: Update FullCalendar CSS overrides**

```css
/* Update .fc overrides in globals.css */
.fc {
  --fc-border-color: var(--line);
  --fc-button-bg-color: var(--accent);
  --fc-button-border-color: var(--accent);
  --fc-button-hover-bg-color: var(--accent-strong);
  --fc-button-hover-border-color: var(--accent-strong);
  --fc-today-bg-color: transparent !important;
}

/* Today highlight as a soft circle */
.fc .fc-day-today .fc-daygrid-day-number {
  background: var(--accent-soft);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
  color: var(--accent-strong) !important;
}

/* Day numbers */
.fc .fc-daygrid-day-number {
  font-size: 1.1rem; /* Slightly larger as requested */
  font-weight: 800;
  padding: 8px;
}

/* Hide default event styling to use custom chips */
.fc-v-event, .fc-h-event {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Custom tooltip style */
.calendar-tooltip {
  z-index: 1000;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

- [ ] **Step 2: Commit**

```bash
git add web-event-tracking/app/globals.css
git commit -m "style: enhance fullcalendar global styles with larger fonts"
```

### Task 3: Custom Event Chip & Tooltip Component

**Files:**
- Create: `web-event-tracking/components/event-chip.tsx`

- [ ] **Step 1: Implement EventChip with Tooltip and Hover Animation**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import type { EventRecord } from "@/lib/types";

export function EventChip({ event }: { event: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const record = event.extendedProps.record as EventRecord;

  return (
    <>
      <motion.div
        ref={refs.setReference}
        {...getReferenceProps()}
        whileHover={{ scale: 1.02 }}
        className="mb-1 cursor-pointer overflow-hidden rounded-[6px] px-2 py-1.5 text-[0.8rem] font-black text-white shadow-sm"
        style={{ backgroundColor: record.channelColor }}
      >
        <div className="truncate flex items-center gap-1">
          <span className="opacity-80">{record.channel}</span>
          <span className="opacity-40">|</span>
          <span className="truncate">{record.name}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="calendar-tooltip"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: record.channelColor }} />
              <span className="text-[10px] font-black uppercase tracking-wider text-accent-strong">{record.channel}</span>
            </div>
            <p className="text-sm font-black leading-tight text-foreground">{record.name}</p>
            <div className="mt-2 space-y-1">
               <p className="text-[11px] font-bold text-muted flex items-center gap-1">
                 <span className="opacity-60">📍</span> {record.location}
               </p>
               <p className="text-[11px] font-bold text-muted flex items-center gap-1">
                 <span className="opacity-60">📅</span> {record.startDate} - {record.endDate}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add web-event-tracking/components/event-chip.tsx
git commit -m "feat: add animated EventChip component with tooltips"
```

### Task 4: Refactor EventCalendar Component

**Files:**
- Modify: `web-event-tracking/components/event-calendar.tsx`

- [ ] **Step 1: Update imports to include framer-motion and EventChip**
- [ ] **Step 2: Update calendarEvents memo to include full record**
- [ ] **Step 3: Update FullCalendar configuration with eventContent and animations**

```tsx
// Updated EventCalendar implementation
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
import { formatDateRange, getStatusLabel } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";
import { EventChip } from "./event-chip";

export function EventCalendar({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [view, setView] = useState("dayGridMonth");
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView("listWeek");
      } else {
        setView("dayGridMonth");
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
      <section className="border-line bg-panel rounded-xl border p-4 shadow-sm">
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
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight">{selected.name}</h2>
                <p className="text-muted mt-2 text-sm font-bold">{formatDateRange(selected.startDate, selected.endDate)}</p>
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
```

- [ ] **Step 4: Commit**

```bash
git add web-event-tracking/components/event-calendar.tsx
git commit -m "feat: complete calendar refresh with chips, animations, and mobile view"
```
