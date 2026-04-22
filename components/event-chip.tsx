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
import type { EventApi } from "@fullcalendar/core";
import type { EventRecord } from "@/lib/types";

export function EventChip({ event }: { event: EventApi }) {
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
