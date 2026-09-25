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

export type TranscriptTurn = { role: "user" | "assistant"; text: string };

export type EscalationContext = {
  conversationId?: string;
  transcript?: TranscriptTurn[];
};

export type Escalation = EscalationInput &
  EscalationContext & {
    id: string;
    createdAt: string;
  };

const WEBHOOK_TIMEOUT_MS = 3000;

export function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

// Discord rejects messages over 2000 characters.
const CHAT_MESSAGE_LIMIT = 2000;

export function webhookPayload(escalation: Escalation) {
  const who = escalation.name ? `${escalation.name} <${escalation.email}>` : escalation.email;
  const lines = [
    `**New chatbot escalation** (${escalation.reason}) from ${who}`,
    `Question: ${escalation.question}`,
    escalation.conversationId ? `Conversation: ${escalation.conversationId}` : "",
    ...(escalation.transcript?.length
      ? ["Last turns:", ...escalation.transcript.map((t) => `> ${t.role}: ${t.text.replace(/\s+/g, " ")}`)]
      : []),
  ].filter(Boolean);
  let message = lines.join("\n");
  if (message.length > CHAT_MESSAGE_LIMIT) message = `${message.slice(0, CHAT_MESSAGE_LIMIT - 1)}…`;
  // Slack reads `text`, Discord reads `content`; other receivers get the full record.
  return { text: message, content: message, escalation };
}

export async function recordEscalation(
  input: EscalationInput,
  context: EscalationContext = {},
): Promise<Escalation> {
  const escalation: Escalation = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
    ...context,
  };

  const webhook = CONFIG.urls.escalationWebhook;
  // Without a webhook the log is the only record, so it keeps the full email.
  const logged = webhook ? { ...escalation, email: maskEmail(escalation.email) } : escalation;
  console.info("[escalation]", JSON.stringify(logged));

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(webhookPayload(escalation)),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });
      if (!res.ok) console.error("[escalation] webhook failed", escalation.id, res.status);
    } catch (error) {
      console.error("[escalation] webhook error", escalation.id, error);
    }
  }

  return escalation;
}
