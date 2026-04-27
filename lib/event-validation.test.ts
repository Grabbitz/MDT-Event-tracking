import assert from "node:assert/strict";
import test from "node:test";
import { hasInvalidDateRange } from "@/lib/event-validation";

test("hasInvalidDateRange returns false when any date is missing", () => {
  assert.equal(hasInvalidDateRange("", "2026-04-01"), false);
  assert.equal(hasInvalidDateRange("2026-04-01", ""), false);
});

test("hasInvalidDateRange allows same day and forward ranges", () => {
  assert.equal(hasInvalidDateRange("2026-04-01", "2026-04-01"), false);
  assert.equal(hasInvalidDateRange("2026-04-01", "2026-04-02"), false);
});

test("hasInvalidDateRange rejects end date before start date", () => {
  assert.equal(hasInvalidDateRange("2026-04-10", "2026-04-09"), true);
});
