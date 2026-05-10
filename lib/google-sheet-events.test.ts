import assert from "node:assert/strict";
import test from "node:test";
import { addDaysToDateOnly, formatDate, getEventDurationDays } from "./event-format";
import { parseGoogleSheetCsv } from "./google-sheet-events";

test("parseGoogleSheetCsv creates URL-safe ids for Thai event names", () => {
  const csv = [
    "ชื่องาน,ช่องทาง,สถานที่,วันเริ่มงาน,วันรื้อถอน,เข้าร่วมงาน",
    "เดอะมอลบางแค,Betrend,The Mall Bangkae,30/4/26,6/5/26,เข้าร่วม",
  ].join("\n");

  const [event] = parseGoogleSheetCsv(csv, 1);

  assert.equal(event.id, "sheet-2-2-event");
  assert.match(event.id, /^[a-z0-9-]+$/);
});

test("parseGoogleSheetCsv keeps an ASCII hint when the event name has one", () => {
  const csv = [
    "ชื่องาน,ช่องทาง,สถานที่,วันเริ่มงาน,วันรื้อถอน,เข้าร่วมงาน",
    "CDS: MG เมกะบางนา,CDS,MEGA Bang Na,7/3/26,17/3/26,เข้าร่วม",
  ].join("\n");

  const [event] = parseGoogleSheetCsv(csv, 1);

  assert.equal(event.id, "sheet-2-2-cds-mg");
});

test("parseGoogleSheetCsv handles short Buddhist years from sheet date templates", () => {
  const csv = [
    "ชื่องาน,ช่องทาง,สถานที่,วันเริ่มงาน,วันรื้อถอน,เข้าร่วมงาน,รายละเอียดงาน",
    [
      "ศ.ราชการ",
      "Betrend",
      "Government Complex",
      "27/4/69",
      "1/5/69",
      "เข้าร่วม",
      "\"วันติดตั้ง: 26/4/69 11.00\nวันรื้อถอน: 1/5/69 17.00\"",
    ].join(","),
  ].join("\n");

  const [event] = parseGoogleSheetCsv(csv, 1);

  assert.equal(event.startDate, "2026-04-27");
  assert.equal(event.endDate, "2026-05-01");
  assert.equal(event.setupDateTime, "2026-04-26T11:00:00+07:00");
  assert.equal(event.teardownDateTime, "2026-05-01T17:00:00+07:00");
});

test("date-only helpers stay on the calendar date in positive timezones", () => {
  assert.equal(addDaysToDateOnly("2026-05-06", 1), "2026-05-07");
  assert.equal(getEventDurationDays("2026-05-06", "2026-05-07"), 2);
});

test("formatDate uses the sheet's Gregorian year", () => {
  assert.equal(formatDate("2026-05-06"), "06 พ.ค. 2026");
});
