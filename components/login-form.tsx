"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loginWithPassword() {
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/";
  }

  async function sendMagicLink() {
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setBusy(false);

    setMessage(error ? error.message : "ส่ง magic link ไปที่อีเมลแล้ว");
  }

  return (
    <div className="frosted-card grid gap-4 rounded-[30px] p-5">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="h-11 rounded-full border border-line bg-white/85 px-4 outline-none transition focus:border-black"
          placeholder="name@company.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="h-11 rounded-full border border-line bg-white/85 px-4 outline-none transition focus:border-black"
          placeholder="ใช้ถ้าเปิด email/password"
        />
      </label>
      {message ? <p className="rounded-2xl bg-panel-soft px-4 py-3 text-sm font-medium text-muted">{message}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loginWithPassword}
          disabled={busy || !email || !password}
          className="neutral-button flex min-h-11 items-center gap-2 px-4 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn aria-hidden className="h-4 w-4" />
          Login
        </button>
        <button
          type="button"
          onClick={sendMagicLink}
          disabled={busy || !email}
          className="ghost-button min-h-11 px-4 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          ส่ง Magic Link
        </button>
      </div>
    </div>
  );
}
