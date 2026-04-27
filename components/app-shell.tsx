"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Gauge, ListFilter, LogIn, LogOut, Plus, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/env";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/events", label: "Events", icon: ListFilter },
  { href: "/events/new", label: "New", icon: Plus },
  { href: "/settings/channels", label: "Channels", icon: Settings2 },
];

export function AppShell({ 
  children,
  userEmail
}: { 
  children: ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="border-line bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-20 border-b backdrop-blur-md lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:h-full lg:flex-col lg:items-stretch lg:px-6 lg:py-7">
          <Link href="/" className="flex items-center gap-3.5 group">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-transform duration-200 group-hover:scale-105">
              MT
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-foreground">Workspace</span>
              <span className="text-muted block text-xs font-semibold uppercase tracking-wider">Event Tracking</span>
            </span>
          </Link>

          <nav className="flex gap-1.5 overflow-x-auto py-1 lg:flex-1 lg:flex-col lg:pt-9">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);

              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`flex min-h-[44px] shrink-0 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-white shadow-[var(--shadow-soft)]"
                      : "text-muted hover:bg-panel-soft hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon aria-hidden className={`h-[18px] w-[18px] ${isActive ? "text-white" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-line hidden rounded-2xl border bg-panel p-4 text-xs text-muted shadow-[var(--shadow-soft)] lg:block">
            {isSupabaseConfigured() ? (
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{userEmail ?? "Guest User"}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5 opacity-60">Manager Access</p>
                </div>
                {userEmail ? (
                  <form action={signOut}>
                    <button type="submit" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground/5 py-2 font-bold text-foreground transition hover:bg-foreground/10">
                      <LogOut aria-hidden className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent py-2 font-bold text-white transition hover:bg-accent-strong">
                    <LogIn aria-hidden className="h-3.5 w-3.5" />
                    Login
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-foreground">Local Mode</p>
                <p className="leading-normal opacity-80">Using Excel seed data for planning.</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</main>
    </div>
  );
}
