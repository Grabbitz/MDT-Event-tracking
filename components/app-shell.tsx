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
  { href: "/events/new", label: "New Event", icon: Plus },
  { href: "/settings/channels", label: "Channels", icon: Settings2 },
];

export function AppShell({
  children,
  userEmail,
  sourceLabel,
}: {
  children: ReactNode;
  userEmail: string | null;
  sourceLabel: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-line bg-background sticky top-0 z-20 border-b lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-1 px-3 py-4 lg:h-full lg:flex-col lg:px-3 lg:py-5">

          {/* Workspace header */}
          <Link href="/" className="group mb-3 flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-panel-soft">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-[11px] font-bold text-white">
              MT
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-foreground">MT Workspace</span>
              <span className="block text-[10px] text-muted">Event Tracking</span>
            </span>
          </Link>

          <div className="border-line mb-1 border-t" />

          {/* Nav */}
          <nav className="flex max-w-full gap-0.5 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`flex min-h-[34px] shrink-0 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-accent-soft font-semibold text-accent"
                      : "font-medium text-muted hover:bg-panel-soft hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon aria-hidden className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User card */}
          <div className="border-line hidden border-t pt-3 lg:block">
            {isSupabaseConfigured() ? (
              <div className="space-y-2">
                <div className="px-2">
                  <p className="truncate text-xs font-semibold text-foreground">{userEmail ?? "Guest"}</p>
                  <p className="text-[10px] text-muted">Manager Access</p>
                </div>
                {userEmail ? (
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex min-h-8 w-full items-center gap-2 rounded-md px-2.5 text-xs font-medium text-muted transition-colors hover:bg-panel-soft hover:text-foreground"
                    >
                      <LogOut aria-hidden className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    className="flex min-h-8 w-full items-center gap-2 rounded-md bg-accent px-2.5 text-xs font-semibold text-white transition-colors hover:bg-accent-strong"
                  >
                    <LogIn aria-hidden className="h-3.5 w-3.5" />
                    Sign in
                  </Link>
                )}
              </div>
            ) : (
              <div className="px-2 space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Local Mode</p>
                <p className="text-[11px] text-muted leading-normal">{sourceLabel} source</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
