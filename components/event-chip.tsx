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
  FloatingPortal,
  safePolygon,
} from "@floating-ui/react";
import type { EventApi } from "@fullcalendar/core";
import { formatDateRange, formatEventDuration } from "@/lib/event-format";
import type { EventRecord } from "@/lib/types";

export function EventChip({ event }: { event: EventApi }) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: "fixed",
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: 80, close: 40 },
    handleClose: safePolygon(),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const record = event.extendedProps.record as EventRecord;

  return (
    <>
      <motion.div
        ref={refs.setReference}
        {...getReferenceProps()}
        whileHover={{ scale: 1.01 }}
        className="cursor-pointer overflow-hidden rounded-md px-2 py-0.5 text-[11px] leading-4 font-black text-white"
        style={{ backgroundColor: record.channelColor }}
      >
        <div className="flex min-w-0 items-center gap-1 truncate">
          <span className="shrink-0 opacity-80">{record.channel}</span>
          <span className="opacity-40">|</span>
          <span className="truncate">{record.name}</span>
        </div>
      </motion.div>

      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              className="calendar-tooltip"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: record.channelColor }} />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent-strong">{record.channel}</span>
              </div>
              <p className="text-sm font-black leading-tight text-foreground">{record.name}</p>
              <div className="mt-3 space-y-1.5">
                <p className="flex items-start gap-1.5 text-[11px] font-bold text-muted">
                  <span className="opacity-60">📍</span>
                  <span className="break-words">{record.location || "-"}</span>
                </p>
                <p className="flex items-start gap-1.5 text-[11px] font-bold text-muted">
                  <span className="opacity-60">📅</span>
                  <span>{formatDateRange(record.startDate, record.endDate)}</span>
                </p>
                <p className="pl-5 text-[11px] font-bold text-muted">{formatEventDuration(record.startDate, record.endDate)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}
