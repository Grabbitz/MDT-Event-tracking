# UI/UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile responsiveness of the calendar, add active states to the navigation, and implement empty states for better user guidance.

**Architecture:** Use `usePathname` for navigation state, implement a resize listener or CSS-based media queries for FullCalendar view switching, and add conditional rendering for empty states.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS 4, Lucide React, FullCalendar.

---

### Task 1: Navigation Active State

**Files:**
- Modify: `components/app-shell.tsx`

- [ ] **Step 1: Update `AppShell` to include `usePathname`**

```tsx
"use client"; // Add this since we need client hooks

import { usePathname } from "next/navigation";
// ... other imports

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // ...
}
```

- [ ] **Step 2: Apply active styles to nav items**

```tsx
{navItems.map((item) => {
  const Icon = item.icon;
  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      key={item.href}
      className={clsx(
        "flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-bold transition",
        isActive 
          ? "bg-panel-soft text-accent-strong" 
          : "text-[oklch(0.34_0.03_65)] hover:bg-panel-soft"
      )}
    >
      <Icon aria-hidden className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  );
})}
```

- [ ] **Step 3: Commit**

```bash
git add web-event-tracking/components/app-shell.tsx
git commit -m "feat: add active state to navigation links"
```

### Task 2: Mobile Calendar Responsiveness

**Files:**
- Modify: `components/event-calendar.tsx`

- [ ] **Step 1: Add state for calendar view**

```tsx
const [view, setView] = useState("dayGridMonth");

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setView("listWeek");
    } else {
      setView("dayGridMonth");
    }
  };
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

- [ ] **Step 2: Pass `view` to FullCalendar**

```tsx
<FullCalendar
  key={view} // Force re-render on view change
  initialView={view}
  // ... rest of props
/>
```

- [ ] **Step 3: Commit**

```bash
git add web-event-tracking/components/event-calendar.tsx
git commit -m "feat: make calendar responsive on mobile by switching views"
```

### Task 3: Dashboard Empty State

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Check for empty events and show message**

```tsx
{stats.events.length === 0 ? (
  <div className="border-line flex flex-col items-center justify-center rounded-lg border border-dashed bg-panel p-12 text-center">
    <div className="bg-panel-soft grid h-16 w-16 place-items-center rounded-full">
      <CalendarCheck className="h-8 w-8 text-muted" />
    </div>
    <h2 className="mt-4 text-xl font-black">ยังไม่มีข้อมูลอีเวนท์</h2>
    <p className="text-muted mt-2 max-w-sm">
      เริ่มสร้างอีเวนท์แรกของคุณเพื่อดูปฏิทินและสถิติต่างๆ ได้ทันที
    </p>
    <Link
      href="/events/new"
      className="mt-6 flex min-h-11 items-center justify-center rounded-md bg-accent px-8 font-black text-white transition hover:bg-accent-strong"
    >
      เพิ่มอีเวนท์แรก
    </Link>
  </div>
) : (
  <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    {/* Existing content */}
  </section>
)}
```

- [ ] **Step 2: Commit**

```bash
git add web-event-tracking/app/page.tsx
git commit -m "feat: add empty state to dashboard"
```
