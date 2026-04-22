"use client";

import { Download } from "lucide-react";
import writeXlsxFile from "write-excel-file/browser";
import type { EventRecord } from "@/lib/types";

function rows(events: EventRecord[]) {
  return events.map((event) => ({
    "ชื่องาน": event.name,
    "ช่องทาง": event.channel,
    "วันเริ่มงาน": event.startDate,
    "วันรื้อถอน": event.endDate,
    "สถานที่": event.location,
    "สถานะ": event.participationStatus,
    "พนักงานขาย": event.salesStaffRequired ? "ต้องการ PC" : "ไม่ต้องการ PC",
    "ขนาดบูธ": event.boothSize ?? "",
    "แปลนพื้นที่": event.boothZone ?? "",
    "ติดต่อ": [event.contactName, event.contactPhone].filter(Boolean).join(" "),
    "เงื่อนไข": event.conditions ?? "",
    "ไฟล์": event.fileName ?? "",
  }));
}

export function ExportButton({ events }: { events: EventRecord[] }) {
  async function exportXlsx() {
    const data = rows(events);
    const headers = Object.keys(data[0] ?? rows([emptyEvent()])[0]);
    await writeXlsxFile(
      [
        headers.map((header) => ({ value: header, fontWeight: "bold" })),
        ...data.map((row) => headers.map((header) => ({ value: String(row[header as keyof typeof row] ?? "") }))),
      ],
      {
        fileName: `modern-trade-events-${new Date().toISOString().slice(0, 10)}.xlsx`,
      },
    );
  }

  function exportCsv() {
    const data = rows(events);
    const headers = Object.keys(data[0] ?? rows([emptyEvent()])[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => csvEscape(String(row[header as keyof typeof row] ?? ""))).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `modern-trade-events-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportXlsx}
        className="flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-black text-white transition hover:bg-accent-strong"
      >
        <Download aria-hidden className="h-4 w-4" />
        XLSX
      </button>
      <button
        type="button"
        onClick={exportCsv}
        className="border-line flex min-h-10 items-center gap-2 rounded-md border bg-panel px-4 text-sm font-black transition hover:bg-panel-soft"
      >
        <Download aria-hidden className="h-4 w-4" />
        CSV
      </button>
    </div>
  );
}

function csvEscape(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function emptyEvent(): EventRecord {
  return {
    id: "",
    year: new Date().getFullYear(),
    name: "",
    channel: "",
    channelColor: "",
    location: "",
    startDate: "",
    endDate: "",
    participationStatus: "pending",
    salesStaffRequired: false,
  };
}
