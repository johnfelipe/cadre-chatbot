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

afterEach(() => vi.unstubAllGlobals());

describe("maskEmail", () => {
  it("keeps the first letter and the domain", async () => {
    const { maskEmail } = await load();
    expect(maskEmail("jane.doe@example.com")).toBe("j***@example.com");
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
    const { recordEscalation } = await load("https://hooks.example/abc");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(recordEscalation(input)).resolves.toMatchObject({ email: input.email });
    expect(error).toHaveBeenCalled();
  });
});
