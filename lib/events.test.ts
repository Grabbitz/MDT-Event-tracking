import assert from "node:assert/strict";
import test from "node:test";
import { selectUpcomingEvents } from "@/lib/events";
import type { EventRecord } from "@/lib/types";

function event(overrides: Partial<EventRecord>): EventRecord {
  return {
    id: overrides.id ?? "event",
    year: 2026,
    name: overrides.name ?? "Event",
    channel: "Channel",
    channelColor: "#d95a1f",
    location: "Bangkok",
    startDate: overrides.startDate ?? "2026-05-11",
    endDate: overrides.endDate ?? overrides.startDate ?? "2026-05-11",
    participationStatus: "joining",
    salesStaffRequired: false,
    ...overrides,
  };
}

test("selectUpcomingEvents excludes events that already started", () => {
  const upcoming = selectUpcomingEvents(
    [
      event({ id: "started-but-active", startDate: "2026-05-01", endDate: "2026-05-15" }),
      event({ id: "today", startDate: "2026-05-11", endDate: "2026-05-12" }),
      event({ id: "future", startDate: "2026-05-20", endDate: "2026-05-21" }),
    ],
    "2026-05-11",
  );

  assert.deepEqual(
    upcoming.map((item) => item.id),
    ["today", "future"],
  );
});

test("selectUpcomingEvents sorts by start date and applies the limit", () => {
  const upcoming = selectUpcomingEvents(
    [
      event({ id: "third", startDate: "2026-05-30" }),
      event({ id: "first", startDate: "2026-05-12" }),
      event({ id: "second", startDate: "2026-05-20" }),
    ],
    "2026-05-11",
    2,
  );

  assert.deepEqual(
    upcoming.map((item) => item.id),
    ["first", "second"],
  );
});
