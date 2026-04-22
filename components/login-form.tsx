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
    <div className="border-line bg-panel grid gap-4 rounded-lg border p-5">
      <label className="grid gap-2 text-sm font-bold">
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="border-line h-11 rounded-md border bg-white px-3 outline-none focus:border-accent"
          placeholder="name@company.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="border-line h-11 rounded-md border bg-white px-3 outline-none focus:border-accent"
          placeholder="ใช้ถ้าเปิด email/password"
        />
      </label>
      {message ? <p className="rounded-md bg-panel-soft px-3 py-2 text-sm font-bold text-muted">{message}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loginWithPassword}
          disabled={busy || !email || !password}
          className="flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 font-black text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn aria-hidden className="h-4 w-4" />
          Login
        </button>
        <button
          type="button"
          onClick={sendMagicLink}
          disabled={busy || !email}
          className="border-line min-h-11 rounded-md border bg-panel px-4 font-black transition hover:bg-panel-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          ส่ง Magic Link
        </button>
      </div>
    </div>
  );
}
