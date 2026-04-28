import { getChannelColor } from "@/lib/channel-colors";
import type { EventRecord, ParticipationStatus } from "@/lib/types";

type SheetRow = Record<string, string>;

export function isGoogleSheetConfigured() {
  return getGoogleSheetUrls().length > 0;
}

export async function getGoogleSheetEvents(): Promise<EventRecord[]> {
  const urls = getGoogleSheetUrls();
  const eventGroups = await Promise.all(urls.map((url, index) => fetchSheetEvents(url, index)));

  return eventGroups
    .flat()
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getGoogleSheetUrls() {
  const raw = process.env.GOOGLE_SHEET_URLS ?? process.env.GOOGLE_SHEET_URL ?? "";
  return raw
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

export function toGoogleSheetCsvUrl(input: string) {
  const url = new URL(input);
  if (url.searchParams.get("output") === "csv" || url.searchParams.get("format") === "csv") return url.toString();

  const id = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1];
  if (!id) return url.toString();

  const gid = url.searchParams.get("gid") ?? url.hash.match(/gid=(\d+)/)?.[1] ?? "0";
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

export function parseGoogleSheetCsv(csv: string, sourceIndex = 0): EventRecord[] {
  const [headers = [], ...rows] = parseCsv(csv);
  const normalizedHeaders = headers.map(clean);

  return rows
    .map((cells, rowIndex) => {
      const row = toRow(normalizedHeaders, cells);
      const name = clean(row["ชื่องาน"] ?? row["Event Name"] ?? row["name"]);
      const channel = clean(row["ช่องทาง"] ?? row["Channel"] ?? row["channel"]);
      if (!name || name.toLowerCase() === "example" || !channel) return null;

      const details = clean(row["รายละเอียดงาน"] ?? row["Details"] ?? row["details"]);
      const parsed = parseDetails(details);
      const startDate = toDateString(row["วันเริ่มงาน"] ?? row["Start Date"] ?? row["startDate"]);
      const endDate = toDateString(row["วันรื้อถอน"] ?? row["End Date"] ?? row["endDate"]) || startDate;
      if (!startDate || !endDate) return null;

      const salesTarget = toNumber(row["Sales Target"] ?? row["salesTarget"] ?? row["Target"]);
      const actualSales = toNumber(row["Actual Sales"] ?? row["actualSales"] ?? row["Actual"]);

      return {
        id: `sheet-${sourceIndex + 1}-${rowIndex + 2}-${slug(name)}`,
        year: Number(startDate.slice(0, 4)),
        name,
        channel,
        channelColor: getChannelColor(channel),
        location: clean(row["สถานที่"] ?? row["Location"] ?? row["location"]),
        startDate,
        endDate,
        setupDateTime: parsed.setupDateTime,
        teardownDateTime: parsed.teardownDateTime,
        boothSize: parsed.boothSize,
        boothZone: clean(row["แปลนพื้นที่"] ?? row["Booth Zone"] ?? row["boothZone"]) || undefined,
        details,
        contactName: parsed.contactName,
        contactPhone: parsed.contactPhone,
        conditions: parsed.conditions,
        participationStatus: mapStatus(clean(row["เข้าร่วมงาน"] ?? row["Status"] ?? row["participationStatus"])),
        salesStaffRequired: clean(row["พนักงานขาย"] ?? row["Sales Staff"] ?? row["salesStaffRequired"]).includes("ต้องการ"),
        salesTarget,
        actualSales,
        fileName: clean(row["ไฟล์"] ?? row["File"] ?? row["fileName"]) || undefined,
      } satisfies EventRecord;
    })
    .filter((event): event is EventRecord => Boolean(event));
}

async function fetchSheetEvents(sheetUrl: string, sourceIndex: number) {
  const csvUrl = toGoogleSheetCsvUrl(sheetUrl);
  const response = await fetch(csvUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Google Sheet fetch failed: ${response.status} ${response.statusText}`);
  }

  return parseGoogleSheetCsv(await response.text(), sourceIndex);
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function toRow(headers: string[], cells: string[]): SheetRow {
  return headers.reduce<SheetRow>((row, header, index) => {
    if (header) row[header] = clean(cells[index]);
    return row;
  }, {});
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
  const match = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s*(\d{1,2})[.:](\d{2}))?/);
  if (!match) return undefined;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  let year = Number(match[3]);
  
  // Handle short years (25 -> 2025) and Thai years (2568 -> 2025)
  if (year < 100) year += 2000;
  if (year > 2500) year -= 543;
  
  const hour = (match[4] ?? "00").padStart(2, "0");
  const minute = (match[5] ?? "00").padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:00+07:00`;
}

function mapStatus(value: string): ParticipationStatus {
  if (value === "not_joining") return "not_joining";
  if (value === "joining") return "joining";
  if (value.includes("ไม่")) return "not_joining";
  if (value.includes("เข้า")) return "joining";
  return "pending";
}

function toDateString(value: string | undefined) {
  if (!value) return "";
  const text = clean(value);
  
  // 1. Handle ISO format (YYYY-MM-DD)
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;

  // 2. Handle Day/Month/Year (D/M/YYYY or D/M/YY)
  const thaiDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (thaiDate) {
    const day = thaiDate[1].padStart(2, "0");
    const month = thaiDate[2].padStart(2, "0");
    let year = Number(thaiDate[3]);
    
    // Logic: 
    // If 25 or 26 -> 2025/2026
    // If 2568 or 2569 -> 2025/2026
    // If 2025 or 2026 -> 2025/2026
    if (year < 100) year += 2000;
    if (year > 2500) year -= 543;
    
    return `${year}-${month}-${day}`;
  }

  // 3. Fallback to native Date
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";
  
  let year = date.getFullYear();
  if (year > 2500) year -= 543;
  
  // Use local components to avoid UTC shifts
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function toNumber(value: string | undefined) {
  const parsed = Number(clean(value).replace(/,/g, ""));
  return Number.isFinite(parsed) && clean(value) ? parsed : undefined;
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
