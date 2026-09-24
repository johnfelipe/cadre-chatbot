# CLAUDE.md

# Cadre AI Support Chatbot

Customer-facing support chatbot for Cadre AI (AI strategy & implementation consultancy).
Audience: prospective clients (PE-backed, professional services, financial services execs) and existing clients.
Goal: answer common inbound questions accurately, route high-intent users to a strategist call,
and escalate anything we can't answer. It is NOT a general-purpose assistant.

## Stack
- Next.js (App Router) + TypeScript (strict), deployed on Vercel
- Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) — streaming + tool calling
- Model: Claude Haiku 4.5 (`CHAT_MODEL` env var overrides). Chosen for latency/cost on a support workload.
- zod for all input validation. Tailwind for UI. No database in MVP.

## Commands
- `npm run dev` — local dev on :3000
- `npm run build` — must pass before any commit that touches app/ or lib/
- `npm run lint` — eslint
- `npm run eval` — runs evals/run.ts against the real model (needs ANTHROPIC_API_KEY)

## Architecture (read before editing)
- `knowledge/*.md` — the ONLY source of truth about Cadre. Facts live here, never in code.
- `lib/knowledge.ts` — loads + caches all knowledge files into one string.
- `lib/prompt.ts` — builds the system prompt (behavior rules + injected knowledge). Behavior only, no facts.
- `lib/tools.ts` — `get_booking_link`, `escalate_to_human`. Tool outputs come from `lib/config.ts`.
- `lib/config.ts` — every external URL. The model must never invent URLs; it gets them from tools/knowledge.
- `app/api/chat/route.ts` — single endpoint: validate → rate limit → streamText → stream response.
- `evals/` — behavioral regression tests. Add a case for every bug found in the bot's answers.

## Rules
- NEVER add facts about Cadre (pricing, clients, certifications, URLs) that aren't in `knowledge/`.
  Unknown facts are marked `[NOT PUBLISHED]` and the bot must redirect/escalate.
- Knowledge in prompt, not RAG: corpus is < 10k tokens. Don't add a vector DB. Revisit if > 50k tokens.
- Every API input is validated with zod or explicit checks; errors return JSON `{ error }` with proper status.
- Don't add dependencies without asking. Don't touch `.env*`.
- Small commits, conventional prefixes: feat:, fix:, chore:, docs:, test:, refactor:.
- Before saying a task is done: `npm run build && npm run lint`. If prompt/knowledge changed: `npm run eval`.
- Prefer editing existing files over creating new ones. No barrel files. No classes where functions suffice.

## AI SDK gotchas (verified in this repo)
- Tools use `inputSchema` (not `parameters`) in AI SDK v5+. Check installed version before copying examples.
- Multi-step tool use requires `stopWhen: stepCountIs(n)`; without it the model stops after the tool call.
- `knowledge/` is read with fs → must be listed in `outputFileTracingIncludes` in next.config.ts
  or it's missing on Vercel.
- Anthropic requires the first message to be from the user: after trimming history, drop leading non-user messages.

## Claude mistakes log (update as they happen)
- <!-- e.g. "Invented a /pricing URL in knowledge/booking.md — caught in review, removed." -->