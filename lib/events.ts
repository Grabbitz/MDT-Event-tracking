import legacyEvents from "@/lib/legacy-events.json";
import { isSupabaseConfigured } from "@/lib/env";
export { formatDate, formatDateRange, getStatusClass, getStatusLabel } from "@/lib/event-format";
import { getGoogleSheetEvents, isGoogleSheetConfigured } from "@/lib/google-sheet-events";
import { createOptionalClient } from "@/lib/supabase/server";
import type { ChannelSummary, EventRecord, ParticipationStatus } from "@/lib/types";

type SupabaseEventRow = {
  id: string;
  name: string;
  location: string | null;
  start_date: string;
  end_date: string;
  setup_datetime: string | null;
  teardown_datetime: string | null;
  booth_size: string | null;
  booth_zone: string | null;
  details: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  conditions: string | null;
  participation_status: ParticipationStatus;
  sales_staff_required: boolean;
  sales_target: number | string | null;
  actual_sales: number | string | null;
  notes: string | null;
  channels: { name: string; color: string | null } | null;
  event_files?: { file_name: string; storage_path: string }[] | null;
};

type ChannelRow = {
  name: string;
  color: string | null;
};

export function getLegacyEvents() {
  return (legacyEvents as EventRecord[])
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function getFallbackEvents() {
  if (!isGoogleSheetConfigured()) return getLegacyEvents();

  try {
    return await getGoogleSheetEvents();
  } catch (error) {
    console.warn("Falling back to legacy events:", error instanceof Error ? error.message : error);
    return getLegacyEvents();
  }
}

export async function getEvents() {
  if (!isSupabaseConfigured()) return getFallbackEvents();

  const supabase = await createOptionalClient();
  if (!supabase) return getFallbackEvents();

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,name,location,start_date,end_date,setup_datetime,teardown_datetime,booth_size,booth_zone,details,contact_name,contact_phone,conditions,participation_status,sales_staff_required,sales_target,actual_sales,notes,channels(name,color),event_files(file_name,storage_path)",
    )
    .order("start_date", { ascending: true });

  if (error) {
    console.warn("Falling back to legacy events:", error.message);
    return getFallbackEvents();
  }

  return ((data ?? []) as unknown as SupabaseEventRow[]).map(mapSupabaseEvent);
}

export async function getEventById(id: string) {
  if (!isSupabaseConfigured()) return (await getFallbackEvents()).find((event) => event.id === id);

  const supabase = await createOptionalClient();
  if (!supabase) return (await getFallbackEvents()).find((event) => event.id === id);

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,name,location,start_date,end_date,setup_datetime,teardown_datetime,booth_size,booth_zone,details,contact_name,contact_phone,conditions,participation_status,sales_staff_required,sales_target,actual_sales,notes,channels(name,color),event_files(file_name,storage_path)",
    )
    .eq("id", id)
    .single();

  if (error || !data) return (await getFallbackEvents()).find((event) => event.id === id);
  return mapSupabaseEvent(data as unknown as SupabaseEventRow);
}

export async function getChannels(eventsInput?: EventRecord[]): Promise<ChannelSummary[]> {
  const events = eventsInput ?? (await getEvents());
  const channelRows = isSupabaseConfigured() ? await getChannelRows() : getChannelRowsFromEvents(events);
  const now = new Date().toISOString().slice(0, 10);
  const groups = new Map<string, ChannelSummary>();

  for (const row of channelRows) {
    groups.set(row.name, {
      name: row.name,
      color: row.color ?? "#d95a1f",
      eventCount: 0,
      joiningCount: 0,
    });
  }

  for (const event of events) {
    const item =
      groups.get(event.channel) ??
      ({
        name: event.channel,
        color: event.channelColor,
        eventCount: 0,
        joiningCount: 0,
      } satisfies ChannelSummary);

    item.eventCount += 1;
    if (event.participationStatus === "joining") item.joiningCount += 1;
    if (!item.nextEvent && event.endDate >= now) item.nextEvent = event;
    groups.set(event.channel, item);
  }

  return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getDashboardStats() {
  const events = await getEvents();
  const channels = await getChannels(events);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const activeToday = events.filter((event) => event.startDate <= today && event.endDate >= today);
  const thisMonth = events.filter((event) => event.startDate.startsWith(month) || event.endDate.startsWith(month));
  const upcoming = events.filter((event) => event.endDate >= today).slice(0, 5);
  const totalTarget = events.reduce((sum, event) => sum + (event.salesTarget ?? 0), 0);
  const totalActual = events.reduce((sum, event) => sum + (event.actualSales ?? 0), 0);

  return {
    events,
    activeToday,
    thisMonth,
    upcoming,
    totalTarget,
    totalActual,
    joining: events.filter((event) => event.participationStatus === "joining").length,
    channels,
  };
}

async function getChannelRows(): Promise<ChannelRow[]> {
  const supabase = await createOptionalClient();
  if (!supabase) return [];

  const { data } = await supabase.from("channels").select("name,color").order("name", { ascending: true });
  return ((data ?? []) as ChannelRow[]) || [];
}

function getChannelRowsFromEvents(events: EventRecord[]) {
  const rows = new Map<string, ChannelRow>();
  for (const event of events) rows.set(event.channel, { name: event.channel, color: event.channelColor });
  return Array.from(rows.values());
}

function mapSupabaseEvent(row: SupabaseEventRow): EventRecord {
  const channel = row.channels?.name ?? "Unknown";
  const file = row.event_files?.[0];

  return {
    id: row.id,
    year: Number(row.start_date.slice(0, 4)),
    name: row.name,
    channel,
    channelColor: row.channels?.color ?? "#d95a1f",
    location: row.location ?? "",
    startDate: row.start_date,
    endDate: row.end_date,
    setupDateTime: row.setup_datetime ?? undefined,
    teardownDateTime: row.teardown_datetime ?? undefined,
    boothSize: row.booth_size ?? undefined,
    boothZone: row.booth_zone ?? undefined,
    details: row.details ?? undefined,
    contactName: row.contact_name ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    conditions: row.conditions ?? undefined,
    participationStatus: row.participation_status,
    salesStaffRequired: row.sales_staff_required,
    salesTarget: toNumber(row.sales_target),
    actualSales: toNumber(row.actual_sales),
    fileName: file?.file_name,
    notes: row.notes ?? file?.storage_path,
  };
}

function toNumber(value: number | string | null) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
