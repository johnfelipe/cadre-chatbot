export const CONFIG = {
  model: process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-4.5",
  limits: {
    maxOutputTokens: 600,
    maxHistoryMessages: 12,
    maxMessageChars: 2000,
    maxSteps: 3,
  },
  rateLimit: {
    windowMs: 60_000,
    maxRequests: 10,
  },
  urls: {
    website: "https://cadreai.com",
    booking: process.env.BOOKING_URL || "https://cadreai.com/contact",
    escalationWebhook: process.env.ESCALATION_WEBHOOK_URL || null,
  },
} as const;
