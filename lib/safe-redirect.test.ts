import assert from "node:assert/strict";
import test from "node:test";
import { toSafeRedirectPath } from "@/lib/safe-redirect";

test("toSafeRedirectPath falls back to root for null or empty", () => {
  assert.equal(toSafeRedirectPath(null), "/");
  assert.equal(toSafeRedirectPath(""), "/");
});

test("toSafeRedirectPath allows in-app paths", () => {
  assert.equal(toSafeRedirectPath("/"), "/");
  assert.equal(toSafeRedirectPath("/events"), "/events");
  assert.equal(toSafeRedirectPath("/events?id=1"), "/events?id=1");
});

test("toSafeRedirectPath blocks external redirects", () => {
  assert.equal(toSafeRedirectPath("https://evil.example"), "/");
  assert.equal(toSafeRedirectPath("javascript:alert(1)"), "/");
  assert.equal(toSafeRedirectPath("//evil.example/path"), "/");
});
