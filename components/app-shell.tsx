import Link from "next/link";
import { CalendarDays, Gauge, ListFilter, LogIn, LogOut, Plus, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createOptionalClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/events", label: "Events", icon: ListFilter },
  { href: "/events/new", label: "New", icon: Plus },
  { href: "/settings/channels", label: "Channels", icon: Settings2 },
];

export async function AppShell({ children }: { children: ReactNode }) {
  const supabase = await createOptionalClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-line bg-panel/90 sticky top-0 z-20 border-b backdrop-blur lg:h-screen lg:border-b-0 lg:border-r">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:h-full lg:flex-col lg:items-stretch lg:px-5 lg:py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-accent text-sm font-black text-white">
              MT
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-black">Event Tracking</span>
              <span className="text-muted block text-xs font-semibold">Modern Trade</span>
            </span>
          </Link>

          <nav className="flex gap-1 overflow-x-auto lg:flex-1 lg:flex-col lg:pt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="hover:bg-panel-soft flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-bold text-[oklch(0.34_0.03_65)] transition"
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-line hidden rounded-md border bg-panel-soft p-3 text-xs text-muted lg:block">
            {isSupabaseConfigured() ? (
              <div className="space-y-3">
                <p className="font-bold text-foreground">{user?.email ?? "Not signed in"}</p>
                {user ? (
                  <form action={signOut}>
                    <button type="submit" className="flex items-center gap-2 font-black text-accent-strong">
                      <LogOut aria-hidden className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 font-black text-accent-strong">
                    <LogIn aria-hidden className="h-3.5 w-3.5" />
                    Login
                  </Link>
                )}
              </div>
            ) : (
              "Demo mode: legacy Excel seed. Add Supabase env for team sync."
            )}
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
