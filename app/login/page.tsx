import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isSupabaseConfigured } from "@/lib/env";
import { createOptionalClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createOptionalClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) redirect("/");

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center">
      <div className="w-full space-y-5">
        <div>
          <p className="text-sm font-normal text-muted">Team access</p>
          <h1 className="display-title mt-3 text-5xl text-foreground">เข้าสู่ระบบ</h1>
          <p className="text-muted mt-3 leading-7">
            {isSupabaseConfigured()
              ? "Login เพื่อจัดการอีเวนท์และไฟล์แนบร่วมกับทีม"
              : "ยังไม่ได้ตั้งค่า Supabase env ตอนนี้แอปจะอ่านจาก Google Sheet หรือ local fallback"}
          </p>
        </div>
        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <div className="frosted-card rounded-[30px] p-5 text-sm font-medium text-muted">
            ตั้งค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ก่อนใช้งาน login จริง
          </div>
        )}
      </div>
    </div>
  );
}
