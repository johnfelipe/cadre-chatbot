import { describe, expect, it } from "vitest";
import { CONFIG } from "@/lib/config";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  const { maxRequests, windowMs } = CONFIG.rateLimit;

  it("allows maxRequests per window, then returns retry-after", () => {
    const key = `ip-${Math.random()}`;
    const now = 1_000_000;
    for (let i = 0; i < maxRequests; i++) expect(checkRateLimit(key, now + i)).toEqual({ ok: true });

    const blocked = checkRateLimit(key, now + maxRequests);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.retryAfterSeconds).toBe(Math.ceil((windowMs - maxRequests) / 1000));
  });

  it("opens a new window after windowMs", () => {
    const key = `ip-${Math.random()}`;
    for (let i = 0; i <= maxRequests; i++) checkRateLimit(key, 0);
    expect(checkRateLimit(key, windowMs).ok).toBe(true);
  });

  it("keeps separate counters per key", () => {
    const a = `ip-${Math.random()}`;
    const b = `ip-${Math.random()}`;
    for (let i = 0; i < maxRequests; i++) checkRateLimit(a, 0);
    expect(checkRateLimit(a, 0).ok).toBe(false);
    expect(checkRateLimit(b, 0).ok).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first x-forwarded-for address", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" } });
    expect(clientKey(req)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to a shared key", () => {
    expect(clientKey(new Request("http://x", { headers: { "x-real-ip": "198.51.100.2" } }))).toBe("198.51.100.2");
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });
});
