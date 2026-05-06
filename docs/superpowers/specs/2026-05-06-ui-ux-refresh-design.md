# Design Spec: UI/UX Refresh - Modern Professional Calendar

**Date:** 2026-05-06
**Status:** Draft
**Topic:** UI/UX Refresh for Modern Trade Event Tracking

## 1. Vision & Goals
The goal is to elevate the current Modern Trade Event Tracking application into a production-grade, professional tool. The design focuses on clarity, efficiency, and a refined "Modern Professional" aesthetic using the established orange corporate identity (CI).

### Key Objectives:
- **Professionalism:** Clean layouts, consistent spacing, and a restricted, purposeful color palette.
- **Calendar-Centricity:** The calendar remains the primary navigation and information hub, with enhanced interactivity.
- **Visual Harmony:** Align all components (stats, lists, forms) with the new design system.
- **Responsiveness:** Ensure a seamless experience across desktop and mobile.

## 2. Design System (Modern Professional)

### Color Palette
- **Primary (Orange):** `#FF6B00` (Brand color)
- **Background (Light):** `oklch(0.98 0.01 65)` (Very soft warm grey)
- **Surface (Panel):** `oklch(1 0 0)` (White)
- **Lines/Borders:** `oklch(0.92 0.01 65)`
- **Text (Strong):** `oklch(0.25 0.02 65)` (Deep charcoal)
- **Text (Muted):** `oklch(0.55 0.02 65)` (Soft grey)

### Typography
- **Font Family:** `Noto Sans Thai` (Primary), `Inter` (Fallback for numerals/English).
- **Headings:** Heavy weights (Bold/Black), tight letter-spacing for a modern feel.
- **Body:** Regular/Medium weight, clear line height for readability.

### Shape & Spacing
- **Radius:** `12px` for large containers (Cards, Sidebar), `6px` for small elements (Chips, Buttons).
- **Spacing Scale:** Multiples of `4px` (8, 16, 24, 32).

## 3. Architecture & Components

### 3.1. App Shell & Navigation
- **Navigation:** Vertical sidebar on desktop, bottom navigation or drawer on mobile.
- **Active States:** Clear visual indicator (Orange border/background) for the current route using `usePathname`.

### 3.2. Dashboard (Calendar Centric)
- **Main Area:** Large FullCalendar instance.
- **Sidebar (Event Detail):** A persistent or slide-in panel showing detailed information of the selected event (Location, Status, Contact, Sales).
- **Interactivity:**
    - `EventChip`: Custom rendered component with a subtle border and channel color indicator.
    - `Tooltip`: Floating UI powered tooltips for quick event previews on hover.
    - `Framer Motion`: Smooth transitions when switching between events or views.

### 3.3. Statistics & Cards
- **Bento Style:** Stats cards placed at the top or in a secondary grid section.
- **Sales Tracking:** Clear visual distinction between Target and Actual sales using semantic coloring (Green/Grey).

## 4. Mobile Responsiveness
- **Calendar Switch:** Automatic transition to `listWeek` or `dayGridDay` view on screens < 768px.
- **Layout:** Stacked layout where the calendar is followed by the detail view/sidebar content.

## 5. Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Calendar:** FullCalendar
- **Interactions:** Floating UI (@floating-ui/react)

## 6. Self-Review Check
- [x] No "TBD" or placeholders.
- [x] Internal consistency: Colors and fonts are explicitly defined.
- [x] Scope: Focused on UI/UX refresh of existing features.
- [x] Ambiguity: Layout structure (Calendar + Sidebar) is clearly defined.
