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
    <div className="min-h-screen bg-background px-4 py-4 sm:px-6 lg:px-8">
      <header className="frosted-card sticky top-4 z-40 mx-auto flex max-w-7xl items-center gap-3 rounded-[30px] px-3 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 px-2">
          <span className="spectrum-strip h-8 w-8 shrink-0 rounded-full" />
          <span className="hidden text-sm font-medium text-foreground sm:block">MT Event Tracking</span>
        </Link>
        
        <nav className="ml-auto flex items-center gap-1">
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
          className="neutral-button flex min-h-10 items-center justify-center gap-2 px-4 text-sm font-medium"
        >
          <PlusCircle aria-hidden className="h-4 w-4 stroke-[1.7]" />
          <span className="hidden sm:inline">New Event</span>
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-0 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
