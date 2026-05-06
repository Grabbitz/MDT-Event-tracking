# 2026-05-06 UI/UX Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the app into a "Modern Professional" tool with refined typography, a clean OKLCH-based color palette, and enhanced calendar interactivity.

**Architecture:** Centralized design tokens in CSS variables, refactored App Shell for better navigation, and an interactive Calendar-with-Sidebar layout using Framer Motion and Floating UI.

**Tech Stack:** Next.js 15, Tailwind CSS 4, Framer Motion, Floating UI, FullCalendar.

---

### Task 1: Global Styles & Design Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts` (if needed, but Tailwind 4 prefers CSS variables)

- [x] **Step 1: Define OKLCH design tokens**
- [x] **Step 2: Commit**

### Task 2: App Shell & Navigation Refresh

**Files:**
- Modify: `components/app-shell.tsx`

- [x] **Step 1: Implement active states and clean sidebar navigation**
- [x] **Step 2: Commit**

### Task 3: Interactive Event Chip & Tooltip

**Files:**
- Modify: `components/event-chip.tsx`

- [x] **Step 1: Refactor EventChip with Floating UI and professional styling**

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
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  const record = event.extendedProps.record as EventRecord;

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="group relative mb-1 cursor-pointer overflow-hidden rounded-md border border-line bg-surface p-1 shadow-sm transition-all hover:border-primary/30"
      >
        <div 
          className="absolute left-0 top-0 h-full w-1" 
          style={{ backgroundColor: record.channelColor || '#ddd' }} 
        />
        <div className="pl-2 pr-1">
          <p className="truncate text-[10px] font-black uppercase tracking-tighter text-text-muted opacity-70">
            {record.channel}
          </p>
          <p className="truncate text-[11px] font-bold text-text-strong">
            {record.name}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            className="z-50 w-64 rounded-xl border border-line bg-surface p-4 shadow-xl"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: record.channelColor }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{record.channel}</span>
            </div>
            <h4 className="text-sm font-black leading-snug text-text-strong">{record.name}</h4>
            <div className="mt-3 space-y-1.5 border-t border-line pt-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted">
                <span className="opacity-50">📍</span> {record.location}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted">
                <span className="opacity-50">📅</span> {record.startDate} - {record.endDate}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [x] **Step 2: Commit**

### Task 4: Main Calendar & Sidebar Detail Layout

**Files:**
- Modify: `components/event-calendar.tsx`

- [x] **Step 1: Refactor Calendar layout to include professional detail sidebar**

```tsx
"use client";

import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
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
      end: e.endDate, 
      extendedProps: { record: e }
    }))
  , [events]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="flex-1 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
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

                <button className="mt-8 w-full py-3 bg-primary text-white rounded-xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition">
                  Edit Details
                </button>
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
```

- [x] **Step 2: Commit**
