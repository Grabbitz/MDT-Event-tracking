"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { LayoutDashboard, Calendar, Settings, PlusCircle } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Channels", href: "/settings/channels", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-line bg-surface p-6 md:flex flex-col gap-8">
        <div className="h-8 w-32 bg-primary rounded-md" /> {/* Logo Placeholder */}
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                  isActive 
                    ? "bg-primary/5 text-primary border-l-4 border-primary -ml-3 pl-2.5" 
                    : "text-text-muted hover:bg-background"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <Link
            href="/events/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-black hover:scale-[1.02] transition"
          >
            <PlusCircle size={16} />
            New Event
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
