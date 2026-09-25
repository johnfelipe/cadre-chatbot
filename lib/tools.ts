import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import { CONFIG } from "@/lib/config";
import { escalationInputSchema, recordEscalation, type EscalationContext } from "@/lib/escalations";

// Built per request so an escalation carries its conversation id and recent turns.
export function buildTools(context: EscalationContext = {}) {
  return {
    get_booking_link: tool({
      description:
        "Get the link to book a strategy call with a Cadre AI strategist. Call this whenever you share how to book a call.",
      inputSchema: z.object({}),
      execute: async () => ({ url: CONFIG.urls.booking }),
    }),

    escalate_to_human: tool({
      description:
        "Hand the conversation off to the Cadre team, who will follow up by email. Only call this after the user has given their email.",
      inputSchema: escalationInputSchema,
      execute: async (input) => {
        const escalation = await recordEscalation(input, context);
        return { ok: true as const, id: escalation.id };
      },
    }),
  };
}

export const tools = buildTools();

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<unknown, UIDataTypes, ChatTools>;
