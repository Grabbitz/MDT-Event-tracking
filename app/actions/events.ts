"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ParticipationStatus } from "@/lib/types";

const channelColors: Record<string, string> = {
  B2S: "#2f6db2",
  Betrend: "#d95a1f",
  CDS: "#a53f2b",
  OFM: "#6f5cc2",
  PWB: "#1d8f74",
  SB: "#b2822b",
  TWD: "#5f7f36",
};

export type EventActionState = {
  message?: string;
};

export async function createEvent(_state: EventActionState, formData: FormData): Promise<EventActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { message: "กรุณา login ก่อนบันทึกอีเวนท์" };

  const name = text(formData, "name");
  const channel = text(formData, "channel");
  const startDate = text(formData, "startDate");
  const endDate = text(formData, "endDate") || startDate;

  if (!name || !channel || !startDate || !endDate) {
    return { message: "กรอกชื่องาน ช่องทาง วันเริ่มงาน และวันรื้อถอนให้ครบ" };
  }

  const { data: channelRow, error: channelError } = await supabase
    .from("channels")
    .upsert({ name: channel, color: channelColors[channel] ?? "#d95a1f" }, { onConflict: "name" })
    .select("id")
    .single();

  if (channelError || !channelRow) {
    return { message: channelError?.message ?? "สร้างช่องทางไม่สำเร็จ" };
  }

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .insert({
      name,
      channel_id: channelRow.id,
      location: text(formData, "location"),
      start_date: startDate,
      end_date: endDate,
      setup_datetime: dateTime(formData, "setupDateTime"),
      teardown_datetime: dateTime(formData, "teardownDateTime"),
      booth_size: text(formData, "boothSize") || null,
      booth_zone: text(formData, "boothZone") || null,
      details: text(formData, "details") || null,
      contact_name: text(formData, "contactName") || null,
      contact_phone: text(formData, "contactPhone") || null,
      conditions: text(formData, "conditions") || null,
      participation_status: (text(formData, "participationStatus") || "pending") as ParticipationStatus,
      sales_staff_required: formData.get("salesStaffRequired") === "on",
      sales_target: numberOrNull(formData, "salesTarget"),
      actual_sales: numberOrNull(formData, "actualSales"),
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (eventError || !eventRow) {
    return { message: eventError?.message ?? "บันทึกอีเวนท์ไม่สำเร็จ" };
  }

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-");
    const storagePath = `${eventRow.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("event-files").upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      return { message: `บันทึกอีเวนท์แล้ว แต่อัปโหลดไฟล์ไม่สำเร็จ: ${uploadError.message}` };
    }

    const { error: fileError } = await supabase.from("event_files").insert({
      event_id: eventRow.id,
      category: "document",
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.type || null,
      size_bytes: file.size,
      uploaded_by: user.id,
    });

    if (fileError) {
      return { message: `อัปโหลดไฟล์แล้ว แต่บันทึก metadata ไม่สำเร็จ: ${fileError.message}` };
    }
  }

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/events");
  revalidatePath("/settings/channels");
  redirect(`/events/${eventRow.id}`);
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function dateTime(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(value).toISOString() : null;
}

function numberOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
