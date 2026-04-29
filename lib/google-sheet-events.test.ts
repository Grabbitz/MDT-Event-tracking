import assert from "node:assert/strict";
import test from "node:test";
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
