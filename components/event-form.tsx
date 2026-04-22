"use client";

import { useActionState } from "react";
import { Save, Upload } from "lucide-react";
import { createEvent, type EventActionState } from "@/app/actions/events";

const initialState: EventActionState = {};

export function EventForm({ supabaseReady }: { supabaseReady: boolean }) {
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  return (
    <form action={formAction} className="border-line bg-panel grid gap-5 rounded-lg border p-5">
      {!supabaseReady ? (
        <p className="rounded-md bg-panel-soft px-3 py-2 text-sm font-bold text-muted">
          Demo mode: ตั้งค่า Supabase env ก่อนจึงจะบันทึกข้อมูลจริงได้
        </p>
      ) : null}
      {state.message ? <p className="rounded-md bg-accent-soft px-3 py-2 text-sm font-bold text-accent-strong">{state.message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="ชื่องาน" name="name" required disabled={!supabaseReady} />
        <Field label="ช่องทาง" name="channel" placeholder="Betrend, CDS, OFM..." required disabled={!supabaseReady} />
        <Field label="วันเริ่มงาน" name="startDate" type="date" required disabled={!supabaseReady} />
        <Field label="วันรื้อถอน" name="endDate" type="date" required disabled={!supabaseReady} />
        <Field label="สถานที่" name="location" required disabled={!supabaseReady} />
        <Field label="ขนาดบูธ" name="boothSize" placeholder="เช่น 3x3 m." disabled={!supabaseReady} />
        <Field label="วันติดตั้ง" name="setupDateTime" type="datetime-local" disabled={!supabaseReady} />
        <Field label="วันรื้อถอนจริง" name="teardownDateTime" type="datetime-local" disabled={!supabaseReady} />
        <Field label="แปลนพื้นที่ / โซน" name="boothZone" disabled={!supabaseReady} />
        <Field label="ชื่อผู้ติดต่อ" name="contactName" disabled={!supabaseReady} />
        <Field label="เบอร์ติดต่อ" name="contactPhone" disabled={!supabaseReady} />
        <Field label="ยอด target" name="salesTarget" type="number" disabled={!supabaseReady} />
        <Field label="ยอดขายจริง" name="actualSales" type="number" disabled={!supabaseReady} />
        <label className="grid gap-2 text-sm font-bold">
          สถานะ
          <select
            name="participationStatus"
            disabled={!supabaseReady}
            className="border-line h-11 rounded-md border bg-white px-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="joining">เข้าร่วม</option>
            <option value="pending">รอตัดสินใจ</option>
            <option value="not_joining">ไม่เข้าร่วม</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-bold">
        <input
          name="salesStaffRequired"
          type="checkbox"
          className="h-4 w-4 accent-[oklch(0.68_0.18_46)]"
          defaultChecked
          disabled={!supabaseReady}
        />
        ต้องการ PC / พนักงานขาย
      </label>

      <label className="grid gap-2 text-sm font-bold">
        รายละเอียดงาน
        <textarea
          name="details"
          rows={5}
          disabled={!supabaseReady}
          className="border-line rounded-md border bg-white p-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        เงื่อนไขเพิ่มเติม
        <textarea
          name="conditions"
          rows={3}
          disabled={!supabaseReady}
          className="border-line rounded-md border bg-white p-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="border-line flex min-h-24 items-center justify-center gap-3 rounded-lg border border-dashed bg-panel-soft p-4 text-sm font-bold text-muted">
        <Upload aria-hidden className="h-5 w-5" />
        แนบไฟล์แปลนพื้นที่ / PPT / รูป
        <input name="file" type="file" className="sr-only" disabled={!supabaseReady} />
      </label>

      <button
        type="submit"
        disabled={!supabaseReady || pending}
        className="flex min-h-11 w-fit items-center gap-2 rounded-md bg-accent px-5 font-black text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save aria-hidden className="h-4 w-4" />
        {pending ? "กำลังบันทึก..." : "บันทึกอีเวนท์"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="border-line h-11 rounded-md border bg-white px-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
