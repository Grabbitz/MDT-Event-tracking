# UI/UX Improvement: Calendar Refresh Design Spec

## 1. Overview
Redesign the Calendar page to be cleaner, more interactive, and visually polished while maintaining functionality. The core focus is on replacing crowded event bars with "Compact Chips" and adding smooth interactive elements.

## 2. Visual Design (Refined Option B)
### 2.1 Calendar Grid (`FullCalendar`)
- **Day Numbers:** Increase font size and weight for better readability.
- **Event Chips:**
  - Replace full-width bars with rounded "Chips" (`border-radius: 6px`).
  - Text inside chips: `font-size: 0.75rem` (up from default small), `font-weight: 800`.
  - Format: `[Channel] | [Event Name]`.
- **Today Highlight:** Use a soft background circle or a distinct border color instead of a solid block.
- **Selection State:** Use a clear accent border (`border: 2px solid var(--accent)`) to indicate the selected day.

### 2.2 Tooltips (Hover Preview)
- **Library:** Use a custom floating UI or `Radix UI Tooltip` (if available) or a pure CSS/Framer Motion implementation.
- **Content:** Show full Event Name, Channel, and Date.
- **Style:** 
  - Background: `var(--panel)` with strong shadow.
  - Border: `1px solid var(--line)`.
  - Padding: `8px 12px`.
  - Animation: Subtle scale and fade-in.

### 2.3 Sidebar (Detail View)
- **Animations:** Use `Framer Motion` (`AnimatePresence`) for smooth entry/exit when switching events.
- **Typography:** Ensure high contrast and clear hierarchy. Large title for Event Name.

### 2.4 Mobile Optimization
- Auto-switch `initialView` to `listWeek` or `timeGridDay` when screen width `< 768px`.

## 3. Technical Implementation
- **Dependencies:** `framer-motion`, `lucide-react`.
- **Component Changes:**
  - `components/event-calendar.tsx`: Major rewrite of styling and event rendering.
  - `app/globals.css`: Update `.fc` (FullCalendar) class overrides.
- **Custom Event Content:** Use FullCalendar's `eventContent` hook to render custom JSX for chips.

## 4. Success Criteria
- Calendar feels "clean" and not overwhelmed by text.
- Hovering over events provides immediate, beautiful feedback (Tooltips).
- Mobile users have a usable, scrollable list view instead of a squashed grid.
- Transitions between events in the sidebar are smooth.
