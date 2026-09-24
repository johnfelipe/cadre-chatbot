import { z } from "zod";
import { CONFIG } from "@/lib/config";

export const escalationInputSchema = z.object({
  email: z.email().describe("The user's email, exactly as they gave it"),
  name: z.string().max(100).optional().describe("The user's name, if they gave it"),
  question: z.string().min(1).max(1000).describe("What the user needs, in one or two sentences"),
  reason: z
    .enum(["user_requested_human", "unknown_answer", "account_specific", "other"])
    .describe("Why this is being handed off"),
});

export type EscalationInput = z.infer<typeof escalationInputSchema>;

export type Escalation = EscalationInput & {
  id: string;
  createdAt: string;
};

const WEBHOOK_TIMEOUT_MS = 3000;

export async function recordEscalation(input: EscalationInput): Promise<Escalation> {
  const escalation: Escalation = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  // Vercel logs are the system of record until a webhook is configured.
  console.info("[escalation]", JSON.stringify(escalation));

  if (CONFIG.urls.escalationWebhook) {
    try {
      const res = await fetch(CONFIG.urls.escalationWebhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(escalation),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });
      if (!res.ok) console.error("[escalation] webhook failed", escalation.id, res.status);
    } catch (error) {
      console.error("[escalation] webhook error", escalation.id, error);
    }
  }

  return escalation;
}
