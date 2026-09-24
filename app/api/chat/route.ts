import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { CONFIG } from "@/lib/config";
import { loadKnowledge } from "@/lib/knowledge";
import { buildSystemPrompt } from "@/lib/prompt";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { tools, type ChatMessage } from "@/lib/tools";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]) }).loose()).min(1),
});

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return jsonError(500, "The chat is not configured.");

  const limit = checkRateLimit(clientKey(req));
  if (!limit.ok) {
    return jsonError(429, "Too many messages. Please wait a moment and try again.", {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError(400, "Request body must be JSON.");
  }

  const body = bodySchema.safeParse(raw);
  if (!body.success) return jsonError(400, "Invalid request.");
  if (body.data.messages.length > CONFIG.limits.maxRequestMessages) {
    return jsonError(413, "This conversation is too long. Reload the page to start a new one.");
  }

  const validated = await safeValidateUIMessages<ChatMessage>({ messages: body.data.messages, tools });
  if (!validated.success) return jsonError(400, "Invalid messages.");

  const messages = trimHistory(validated.data);
  if (messages.length === 0) return jsonError(400, "The conversation must include a user message.");
  if (messages.some((m) => m.role === "user" && messageText(m).length > CONFIG.limits.maxMessageChars)) {
    return jsonError(413, `Messages are limited to ${CONFIG.limits.maxMessageChars} characters.`);
  }
  const latest = messages.at(-1);
  if (latest?.role !== "user" || !messageText(latest).trim()) {
    return jsonError(400, "The message can't be empty.");
  }

  const openrouter = createOpenRouter({ apiKey });
  const result = streamText({
    model: openrouter(CONFIG.model),
    instructions: buildSystemPrompt(await loadKnowledge()),
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    maxOutputTokens: CONFIG.limits.maxOutputTokens,
    temperature: CONFIG.temperature,
    stopWhen: isStepCount(CONFIG.limits.maxSteps),
    onError: ({ error }) => console.error("[chat] stream error", error),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

// Anthropic models reject conversations that don't start with a user turn.
function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-CONFIG.limits.maxHistoryMessages);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return firstUser === -1 ? [] : recent.slice(firstUser);
}

function messageText(message: ChatMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}
