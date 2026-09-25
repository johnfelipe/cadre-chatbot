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
import { buildTools, tools, type ChatMessage } from "@/lib/tools";
import type { TranscriptTurn } from "@/lib/escalations";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({
  id: z.string().max(100).optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]) }).loose()).min(1),
});

const TRANSCRIPT_TURNS = 6;
const TRANSCRIPT_TURN_CHARS = 500;

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return jsonError(500, "The chat is not configured.");

  // Browsers send Origin on cross-site POSTs; server-to-server callers (the eval runner) don't.
  const origin = req.headers.get("origin");
  if (origin && URL.canParse(origin) && new URL(origin).host !== req.headers.get("host")) {
    return jsonError(403, "Requests from other sites aren't allowed.");
  }

  const limit = checkRateLimit(clientKey(req));
  if (!limit.ok) {
    return jsonError(429, "Too many messages. Please wait a moment and try again.", {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  if (Number(req.headers.get("content-length")) > CONFIG.limits.maxBodyBytes) {
    return jsonError(413, "The request is too large.");
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

  const conversationId = body.data.id;
  const requestTools = buildTools({ conversationId, transcript: transcriptOf(messages) });
  const openrouter = createOpenRouter({ apiKey });
  const startedAt = Date.now();
  const result = streamText({
    model: openrouter(CONFIG.model),
    // The rules + knowledge prefix is identical on every request, so Anthropic can serve it from cache.
    instructions: {
      role: "system",
      content: buildSystemPrompt(await loadKnowledge()),
      providerOptions: { openrouter: { cacheControl: { type: "ephemeral" } } },
    },
    messages: await convertToModelMessages(messages, { tools: requestTools }),
    tools: requestTools,
    maxOutputTokens: CONFIG.limits.maxOutputTokens,
    temperature: CONFIG.temperature,
    stopWhen: isStepCount(CONFIG.limits.maxSteps),
    onError: ({ error }) => console.error("[chat] stream error", error),
    onEnd: ({ totalUsage, finishReason, steps }) => {
      console.info(
        "[chat]",
        JSON.stringify({
          conversationId,
          latencyMs: Date.now() - startedAt,
          finishReason,
          steps: steps.length,
          tools: steps.flatMap((step) => step.toolCalls.map((call) => call.toolName)),
          inputTokens: totalUsage.inputTokens,
          cacheReadTokens: totalUsage.inputTokenDetails?.cacheReadTokens,
          cacheWriteTokens: totalUsage.inputTokenDetails?.cacheWriteTokens,
          outputTokens: totalUsage.outputTokens,
        }),
      );
    },
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

function transcriptOf(messages: ChatMessage[]): TranscriptTurn[] {
  return messages
    .slice(-TRANSCRIPT_TURNS)
    .map((m) => ({ role: m.role as TranscriptTurn["role"], text: messageText(m).slice(0, TRANSCRIPT_TURN_CHARS) }))
    .filter((turn) => turn.text.trim());
}
