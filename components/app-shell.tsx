"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { Calendar, LayoutDashboard, PlusCircle, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Channels", href: "/settings/channels", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background px-3 py-3 pb-24 sm:px-6 sm:py-4 sm:pb-4 lg:px-8">
      <header className="frosted-card relative z-40 mx-auto flex max-w-7xl items-center gap-3 rounded-xl px-3 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 px-1 sm:px-2">
          <span className="spectrum-strip h-6 w-6 shrink-0 rounded-md" />
          <span className="text-sm font-semibold tracking-tight text-foreground">MT Event</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 sm:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                href={item.href}
                key={item.href}
                className={clsx(
                  "flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-all sm:px-4",
                  isActive
                    ? "bg-[#171717] text-white"
                    : "text-muted hover:bg-panel-soft hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden className="h-3.5 w-3.5 stroke-[1.7]" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/events/new"
          className="neutral-button ml-auto flex min-h-9 items-center justify-center gap-2 px-4 text-sm font-medium sm:ml-0"
        >
          <PlusCircle aria-hidden className="h-3.5 w-3.5 stroke-[1.7]" />
          <span className="hidden sm:inline">New Event</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-0 py-8 sm:py-12">
        {children}
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 gap-1 rounded-xl bg-white p-2 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_12px] sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              href={item.href}
              key={item.href}
              className={clsx(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-all",
                isActive
                  ? "bg-[#171717] text-white"
                  : "text-muted active:bg-panel-soft active:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon aria-hidden className="h-4 w-4 stroke-[1.7]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
