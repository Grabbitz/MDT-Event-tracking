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
  useClientPoint,
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
    middleware: [offset(16), flip({ padding: 12 }), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 80, close: 40 },
    handleClose: safePolygon(),
  });
  const clientPoint = useClientPoint(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, clientPoint]);

  const record = event.extendedProps.record as EventRecord;

  return (
    <>
      <motion.div
        ref={refs.setReference}
        {...getReferenceProps()}
        whileHover={{ opacity: 0.88 }}
        className="cursor-pointer overflow-hidden rounded-sm px-1.5 py-0.5 text-[11px] leading-4 font-semibold text-white"
        style={{ backgroundColor: record.channelColor }}
      >
        <div className="flex min-w-0 items-center gap-1 truncate">
          <span className="shrink-0 text-white/85">{record.channel}</span>
          <span className="text-white/45">/</span>
          <span className="truncate">{record.name}</span>
        </div>
      </motion.div>

      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                visibility: context.isPositioned ? "visible" : "hidden",
              }}
              {...getFloatingProps()}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              className="calendar-tooltip"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: record.channelColor }} />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{record.channel}</span>
              </div>
              <p className="text-sm font-semibold leading-tight text-foreground">{record.name}</p>
              <div className="mt-3 space-y-1.5">
                <p className="flex items-start gap-1.5 text-[11px] font-medium text-muted">
                  <span className="min-w-9 font-mono text-[10px] font-semibold uppercase tracking-wider opacity-60">Loc</span>
                  <span className="break-words">{record.location || "-"}</span>
                </p>
                <p className="flex items-start gap-1.5 text-[11px] font-medium text-muted">
                  <span className="min-w-9 font-mono text-[10px] font-semibold uppercase tracking-wider opacity-60">Date</span>
                  <span>{formatDateRange(record.startDate, record.endDate)}</span>
                </p>
                <p className="pl-10 text-[11px] font-medium text-muted">{formatEventDuration(record.startDate, record.endDate)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}
