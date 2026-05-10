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
      <header className="frosted-card sticky top-3 z-40 mx-auto flex max-w-7xl items-center gap-3 rounded-[26px] px-3 py-3 sm:top-4 sm:rounded-[30px]">
        <Link href="/" className="flex min-w-0 items-center gap-3 px-1 sm:px-2">
          <span className="spectrum-strip h-8 w-8 shrink-0 rounded-full" />
          <span className="text-sm font-medium text-foreground">MT Event</span>
        </Link>
        
        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                href={item.href}
                key={item.href}
                className={clsx(
                  "flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-all sm:px-4",
                  isActive 
                    ? "bg-black text-white"
                    : "text-muted hover:bg-panel-soft hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden className="h-4 w-4 stroke-[1.7]" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <Link
          href="/events/new"
          className="neutral-button ml-auto flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-medium sm:ml-0 sm:min-h-10"
        >
          <PlusCircle aria-hidden className="h-4 w-4 stroke-[1.7]" />
          <span className="hidden sm:inline">New Event</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-0 py-6 sm:py-10">
        {children}
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 gap-1 rounded-[26px] border border-white/70 bg-white/95 p-2 shadow-[rgba(0,0,0,0.08)_0_0_8px_0] backdrop-blur-2xl sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              href={item.href}
              key={item.href}
              className={clsx(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-[20px] text-[11px] font-medium transition-all",
                isActive
                  ? "bg-black text-white"
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
