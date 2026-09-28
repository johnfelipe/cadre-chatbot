import { afterEach, describe, expect, it, vi } from "vitest";
import type { EscalationInput } from "@/lib/escalations";

const input: EscalationInput = {
  email: "jane.doe@example.com",
  name: "Jane",
  question: "Can Cadre sign our NDA?",
  reason: "unknown_answer",
};
const context = {
  conversationId: "chat-123",
  transcript: [{ role: "user" as const, text: "Can Cadre sign our NDA?" }],
};

// CONFIG reads env at import time, so each case imports a fresh copy.
async function load(webhook?: string) {
  vi.resetModules();
  if (webhook) vi.stubEnv("ESCALATION_WEBHOOK_URL", webhook);
  return import("@/lib/escalations");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("maskEmail", () => {
  it("keeps the first letter and the domain", async () => {
    const { maskEmail } = await load();
    expect(maskEmail("jane.doe@example.com")).toBe("j***@example.com");
  });
});

describe("webhookPayload", () => {
  it("puts the question, conversation and last turns in the chat message", async () => {
    const { webhookPayload } = await load();
    const payload = webhookPayload({ ...input, ...context, id: "e1", createdAt: "2026-09-25T00:00:00Z" });
    expect(payload.content).toContain("Question: Can Cadre sign our NDA?");
    expect(payload.content).toContain("Conversation: chat-123");
    expect(payload.content).toContain("> user: Can Cadre sign our NDA?");
  });

  it("stays within Discord's 2000-character message limit", async () => {
    const { webhookPayload } = await load();
    const transcript = Array.from({ length: 6 }, () => ({ role: "user" as const, text: "x".repeat(500) }));
    const payload = webhookPayload({ ...input, transcript, id: "e1", createdAt: "2026-09-25T00:00:00Z" });
    expect(payload.content.length).toBeLessThanOrEqual(2000);
  });
});

describe("recordEscalation", () => {
  it("without a webhook, logs the full record as the only copy", async () => {
    const { recordEscalation } = await load();
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const escalation = await recordEscalation(input, context);

    expect(escalation).toMatchObject({ ...input, ...context });
    expect(escalation.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(log.mock.calls[0]?.[1]).toContain("jane.doe@example.com");
  });

  it("with a webhook, posts a Slack/Discord payload and masks the email in the log", async () => {
    const { recordEscalation } = await load("https://hooks.example/abc");
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await recordEscalation(input, context);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://hooks.example/abc");
    const body = JSON.parse(init.body);
    expect(body.text).toContain("Jane <jane.doe@example.com>");
    expect(body.content).toBe(body.text);
    expect(body.escalation).toMatchObject({ conversationId: "chat-123", transcript: context.transcript });
    expect(log.mock.calls[0]?.[1]).not.toContain("jane.doe@example.com");
    expect(log.mock.calls[0]?.[1]).toContain("j***@example.com");
  });

  it("never throws when the webhook fails", async () => {
    vi.useFakeTimers();
    const { recordEscalation } = await load("https://hooks.example/abc");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const result = recordEscalation(input);
    await vi.advanceTimersByTimeAsync(500);

    await expect(result).resolves.toMatchObject({ email: input.email });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it("retries once after 500 ms on a 5xx and succeeds", async () => {
    vi.useFakeTimers();
    const { recordEscalation } = await load("https://hooks.example/abc");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = recordEscalation(input);
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(500);
    await result;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(error).not.toHaveBeenCalled();
  });

  it("does not retry on a 4xx", async () => {
    vi.useFakeTimers();
    const { recordEscalation } = await load("https://hooks.example/abc");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = recordEscalation(input);
    await vi.advanceTimersByTimeAsync(500);
    await result;

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("[escalation] webhook failed", expect.any(String), 400);
  });

  it("gives up and logs the error after two 5xx", async () => {
    vi.useFakeTimers();
    const { recordEscalation } = await load("https://hooks.example/abc");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockImplementation(async () => new Response(null, { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = recordEscalation(input);
    await vi.advanceTimersByTimeAsync(500);

    await expect(result).resolves.toMatchObject({ email: input.email });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("[escalation] webhook failed", expect.any(String), 502);
  });
});
