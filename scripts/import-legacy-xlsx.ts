import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { createClient } from "@supabase/supabase-js";
import type { EventRecord, ParticipationStatus } from "../lib/types";

const workbookPath = path.resolve(process.cwd(), "../2025-26 Moderntrade Event.xlsx");
const outputPath = path.resolve(process.cwd(), "lib/legacy-events.json");
const channelColors: Record<string, string> = {
  B2S: "#2f6db2",
  Betrend: "#d95a1f",
  CDS: "#a53f2b",
  OFM: "#6f5cc2",
  PWB: "#1d8f74",
  SB: "#b2822b",
  TWD: "#5f7f36",
  Sample: "#9a8f84",
};

type LegacyRow = Record<string, string | number | Date | undefined>;

async function main() {
  const events = await readLegacyEvents();

  if (process.argv.includes("--local-json")) {
    await fs.writeFile(outputPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
    console.log(`Wrote ${events.length} events to ${outputPath}`);
    return;
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or run with --local-json");
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  const channels = Array.from(new Set(events.map((event) => event.channel))).map((name) => ({
    name,
    color: channelColors[name] ?? "#d95a1f",
  }));

  const { error: channelError } = await supabase.from("channels").upsert(channels, { onConflict: "name" });
  if (channelError) throw channelError;

  const { data: channelRows, error: channelReadError } = await supabase.from("channels").select("id,name");
  if (channelReadError) throw channelReadError;
  const channelId = new Map(channelRows.map((row) => [row.name, row.id]));

  const payload = events.map((event) => ({
    name: event.name,
    channel_id: channelId.get(event.channel),
    location: event.location,
    start_date: event.startDate,
    end_date: event.endDate,
    setup_datetime: event.setupDateTime ?? null,
    teardown_datetime: event.teardownDateTime ?? null,
    booth_size: event.boothSize ?? null,
    booth_zone: event.boothZone ?? null,
    details: event.details ?? null,
    contact_name: event.contactName ?? null,
    contact_phone: event.contactPhone ?? null,
    conditions: event.conditions ?? null,
    participation_status: event.participationStatus,
    sales_staff_required: event.salesStaffRequired,
    sales_target: event.salesTarget ?? null,
    actual_sales: event.actualSales ?? null,
    notes: event.notes ?? null,
  }));

  const { error: eventError } = await supabase.from("events").insert(payload);
  if (eventError) throw eventError;
  console.log(`Imported ${events.length} events to Supabase`);
}

async function readLegacyEvents(): Promise<EventRecord[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const events: EventRecord[] = [];

  for (const sheet of workbook.worksheets) {
    const sheetName = sheet.name;
    const headers = sheet.getRow(1).values as ExcelJS.CellValue[];
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
      const excelRow = sheet.getRow(rowNumber);
      const row: LegacyRow = {};
      headers.forEach((header, columnIndex) => {
        if (!header || columnIndex === 0) return;
        row[String(header) as keyof LegacyRow] = normalizeCellValue(excelRow.getCell(columnIndex).value);
      });
      const name = clean(row["ชื่องาน"]);
      const channel = clean(row["ช่องทาง"]);
      if (!name || name.toLowerCase() === "example" || !channel) continue;

      const details = clean(row["รายละเอียดงาน"]);
      const parsed = parseDetails(details);
      const startDate = toDateString(row["วันเริ่มงาน"]);
      const endDate = toDateString(row["วันรื้อถอน"]) || startDate;
      if (!startDate || !endDate) continue;

      events.push({
        id: `${sheetName}-${rowNumber}-${slug(name)}`,
        year: Number(sheetName) || Number(startDate.slice(0, 4)),
        name,
        channel,
        channelColor: channelColors[channel] ?? "#d95a1f",
        location: clean(row["สถานที่"]),
        startDate,
        endDate,
        setupDateTime: parsed.setupDateTime,
        teardownDateTime: parsed.teardownDateTime,
        boothSize: parsed.boothSize,
        boothZone: clean(row["แปลนพื้นที่"]),
        details,
        contactName: parsed.contactName,
        contactPhone: parsed.contactPhone,
        conditions: parsed.conditions,
        participationStatus: mapStatus(clean(row["เข้าร่วมงาน"])),
        salesStaffRequired: clean(row["พนักงานขาย"]).includes("ต้องการ"),
        fileName: clean(row["ไฟล์"]) || undefined,
      });
    }
  }

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function parseDetails(details: string) {
  const boothSize = matchLine(details, "ขนาด");
  const setupText = matchLine(details, "วันติดตั้ง");
  const teardownText = matchLine(details, "วันรื้อถอน");
  const contactText = matchLine(details, "เบอร์ติดต่อ");
  const conditions = matchLine(details, "เงื่อนไขเพิ่มเติม");
  const phoneMatch = contactText.match(/(\+?\d[\d\s-]{6,}\d)/);
  const contactPhone = phoneMatch?.[1]?.replace(/\s+/g, " ").trim();
  const contactName = contactPhone ? contactText.replace(contactPhone, "").trim() : contactText;

  return {
    boothSize,
    setupDateTime: normalizeLooseThaiDate(setupText),
    teardownDateTime: normalizeLooseThaiDate(teardownText),
    contactName: contactName || undefined,
    contactPhone,
    conditions,
  };
}

function matchLine(text: string, label: string) {
  const pattern = new RegExp(`${label}:[ \\t]*([^\\n]*)`, "i");
  return clean(text.match(pattern)?.[1]);
}

function normalizeLooseThaiDate(value: string) {
  const match = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\\s*(\d{1,2})[.:](\d{2}))?/);
  if (!match) return undefined;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  const hour = (match[4] ?? "00").padStart(2, "0");
  const minute = (match[5] ?? "00").padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:00+07:00`;
}

function mapStatus(value: string): ParticipationStatus {
  if (value.includes("ไม่")) return "not_joining";
  if (value.includes("เข้า")) return "joining";
  return "pending";
}

function toDateString(value: Date | number | string | undefined) {
  if (!value) return "";
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  if (typeof value === "number") {
    const date = excelSerialToDate(value);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeCellValue(value: ExcelJS.CellValue): string | number | Date | undefined {
  if (value == null) return undefined;
  if (value instanceof Date || typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && "text" in value) return value.text;
  if (typeof value === "object" && "result" in value) return normalizeCellValue(value.result as ExcelJS.CellValue);
  return String(value);
}

function excelSerialToDate(serial: number) {
  return new Date(Date.UTC(1899, 11, 30) + serial * 86_400_000);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
