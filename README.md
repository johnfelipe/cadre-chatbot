# Cadre AI Support Chatbot

A support chatbot for Cadre AI's website. It answers common inbound questions from a curated knowledge base,
routes interested prospects to a strategist call, and hands anything it can't answer to the Cadre team.

**Live URL:** https://cadre-chatbot-ebon.vercel.app (Vercel, redeployed on every push to `main`)

## What it handles
1. What Cadre AI does and whether it works with the user's industry
2. Booking a call with an AI strategist
3. Accessing the Cadre client portal
4. The AI Maturity Index and how to get scored
5. Cadre's approach to LLM selection and data security
6. Anything else: says it doesn't know and escalates to a human (collects email, logs the request, optional webhook)

It refuses off-topic requests and prompt-injection attempts, and replies in the user's language.
Facts it doesn't have are marked `[NOT PUBLISHED]` in `knowledge/`, and the bot redirects instead of guessing.

## Run locally
Requires Node 22.18+ (the eval runner uses Node's built-in TypeScript support).

```bash
npm install
# .env.local
#   OPENROUTER_API_KEY=...          required
#   OPENROUTER_MODEL=...            optional, default anthropic/claude-haiku-4.5
#   BOOKING_URL=...                 optional, overrides https://cadreai.com/contact
#   ESCALATION_WEBHOOK_URL=...      optional, receives escalations as JSON
npm run dev                          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | Next route type generation + `tsc --noEmit` |
| `npm run build` | Production build |
| `npm run eval [-- <case-prefix>]` | Behavioural evals against a running server (`EVAL_URL`). Real model calls: spends budget |

## How it works
```
Browser (useChat) ── POST /api/chat ──▶ rate limit ▶ validate ▶ trim history ▶ system prompt (rules + knowledge/*.md)
                                         ▶ OpenRouter (Claude Haiku 4.5, streamed) ─▶ text + tool calls ─▶ UI
Tools: get_booking_link (URL from config)   escalate_to_human (log + optional webhook)
```

- `knowledge/` is the only source of facts; the whole corpus goes into the system prompt (no RAG at this size).
- `lib/prompt.ts` holds behaviour rules only. `lib/config.ts` holds the model, limits and every URL.
- Cost guards for the public endpoint: 10 requests/min per IP, 2000-char messages, 12-message history, 600 output tokens.

Design decisions, scope cuts, budget and the scaling path are in [`plan.md`](plan.md).
Conventions for AI-assisted work are in [`CLAUDE.md`](CLAUDE.md), with subagents and slash commands in `.claude/`.
