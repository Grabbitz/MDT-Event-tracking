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
