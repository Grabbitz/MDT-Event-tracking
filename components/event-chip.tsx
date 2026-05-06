"use client";

import type { EventApi } from "@fullcalendar/core";
import type { EventRecord } from "@/lib/types";

export function EventChip({ event }: { event: EventApi }) {
  const record = event.extendedProps.record as EventRecord;

  return (
    <div className="calendar-event-chip group">
      <span className="calendar-event-dot" style={{ backgroundColor: record.channelColor || "#aeaeae" }} />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium leading-4 text-foreground">{record.name}</p>
        <p className="truncate text-[9px] font-medium uppercase leading-3 text-muted">{record.channel}</p>
      </div>
    </div>
  );
}
