"use client";

import { useActionState } from "react";
import { Save, Upload } from "lucide-react";
import { createEvent, type EventActionState } from "@/app/actions/events";

const initialState: EventActionState = {};

export function EventForm({ supabaseReady }: { supabaseReady: boolean }) {
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  return (
    <form action={formAction} className="frosted-card grid gap-5 rounded-[30px] p-5 sm:p-6">
      {!supabaseReady ? (
        <p className="rounded-2xl bg-panel-soft px-4 py-3 text-sm font-medium text-muted">
          Demo mode: ตั้งค่า Supabase env ก่อนจึงจะบันทึกข้อมูลจริงได้
        </p>
      ) : null}
      {state.message ? <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">{state.message}</p> : null}

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
        <label className="grid gap-2 text-sm font-medium">
          สถานะ
          <select
            name="participationStatus"
            disabled={!supabaseReady}
            className="h-11 rounded-full border border-line bg-white/85 px-4 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="joining">เข้าร่วม</option>
            <option value="pending">รอตัดสินใจ</option>
            <option value="not_joining">ไม่เข้าร่วม</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          name="salesStaffRequired"
          type="checkbox"
          className="h-4 w-4 accent-black"
          defaultChecked
          disabled={!supabaseReady}
        />
        ต้องการ PC / พนักงานขาย
      </label>

      <label className="grid gap-2 text-sm font-medium">
        รายละเอียดงาน
        <textarea
          name="details"
          rows={5}
          disabled={!supabaseReady}
          className="rounded-[20px] border border-line bg-white/85 p-4 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        เงื่อนไขเพิ่มเติม
        <textarea
          name="conditions"
          rows={3}
          disabled={!supabaseReady}
          className="rounded-[20px] border border-line bg-white/85 p-4 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="flex min-h-24 items-center justify-center gap-3 rounded-[24px] border border-dashed border-line bg-panel-soft p-4 text-sm font-medium text-muted">
        <Upload aria-hidden className="h-5 w-5" />
        แนบไฟล์แปลนพื้นที่ / PPT / รูป
        <input name="file" type="file" className="sr-only" disabled={!supabaseReady} />
      </label>

      <button
        type="submit"
        disabled={!supabaseReady || pending}
        className="neutral-button flex min-h-11 w-full items-center justify-center gap-2 px-5 font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
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
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="h-11 rounded-full border border-line bg-white/85 px-4 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
