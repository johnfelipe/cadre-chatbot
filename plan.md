# Plan — Cadre AI Support Chatbot

## Goal
A deployed chatbot a prospective or existing Cadre client could realistically use: accurate answers,
clear routing to a strategist, graceful escalation. Time budget: 4–6 hours of build (the brief's guidance),
spread over the 3 working days. Received 2026-09-24; due day 4; live review day 5; key expires ~2026-10-01.

Done when the six acceptance scenarios in `CLAUDE.md` pass on the deployed URL.

## Scope
IN
- Company overview, services, industries served
- Booking a strategist call (tool → canonical link)
- Client portal access guidance
- AI Maturity Index: what it is, how to get scored
- LLM selection approach + data security posture
- Escalation: capture name/email/question → log + optional webhook
- Refusal of off-topic / prompt-injection; answers in user's language

OUT (intentional)
- Auth / portal integration — the bot explains access, it doesn't log you in
- RAG / vector DB — corpus is tiny; full-context is simpler, cheaper to maintain, and more accurate
- Persistent chat history / DB — no requirement justifies it for MVP
- Admin dashboard for escalations — webhook to Slack/email covers it
- Pricing quotes — not published; always routed to a strategist

## Phases
- [x] 0. CLAUDE.md, plan.md, .claude/ agents + commands  → commit
- [x] 1. Scaffold Next.js + minimal streaming chat + deploy to Vercel → https://cadre-chatbot-ebon.vercel.app
      (Git integration: every push to `main` deploys to production).
- [x] 2. Knowledge base: knowledge-writer subagent researched cadreai.com (2026-09-24), one source URL per fact;
      key facts spot-checked by hand.
- [x] 3. System prompt + tools (booking, escalation) + input validation + rate limit + `max_tokens` and history caps
- [x] 4. Evals: 17 cases against production. Run 1: 15/17 (one bot bug, one runner bug, one rule too strict).
      Run 2: 15/17 (Markdown bold in list labels). After the fixes, the 2 failing cases pass; see the mistakes log.
- [x] 5. UI polish: starter questions, tool result cards, error/retry states, bold and clickable links, mobile pass
      (390×844: no horizontal overflow, fixed header and input, long URLs wrap, 44px touch targets)
- [ ] 6. README, update CLAUDE.md mistakes log, zip (with .git, without node_modules/.next)

## API and data model
- `POST /api/chat`: body `{ messages: UIMessage[] }` as sent by `useChat` (extra fields such as `id` and `trigger` are ignored).
  Response: AI SDK UI message stream (SSE). Errors: JSON `{ error }` with 400 (bad body), 413 (message too long),
  429 (rate limited, with `retry-after`) or 500 (not configured).
- Tools: `get_booking_link() → { url }` (cadreai.com/contact unless `BOOKING_URL` overrides it);
  `escalate_to_human({ email, name?, question, reason }) → { ok, id }`.
- `Escalation = { id, createdAt, email, name?, question, reason }`, reason one of `user_requested_human`,
  `unknown_answer`, `account_specific`, `other`. Stored as a JSON log line, optionally POSTed to a webhook. No database.
- Conversation state lives in the browser; the server is stateless apart from the per-instance rate-limit map.

## Scaling path
- Rate limit and escalations → Upstash Redis (shared across instances), then a CRM (HubSpot/Salesforce) for escalations.
- Knowledge > ~50k tokens → retrieval (embeddings + top-k per question) instead of full context; keep evals as the gate.
- Cost at volume → Anthropic prompt caching through OpenRouter for the static system prompt; per-day spend cap.
- Quality at volume → log anonymised unanswered questions to decide which knowledge to add next; LLM-as-judge evals in CI.

## Decisions & trade-offs
| Decision | Why | Revisit when |
|---|---|---|
| OpenRouter as the only LLM transport | Required by the brief; one key, model swappable via `OPENROUTER_MODEL` | — |
| Haiku 4.5 over Sonnet | Support Q&A over small corpus; latency and cost dominate | Evals show reasoning failures |
| Full knowledge in system prompt | < 10k tokens; no retrieval misses; prompt caching can make it cheaper | Corpus > ~50k tokens |
| Tools return URLs from config | Model can't hallucinate links | — |
| In-memory rate limit | Zero infra for MVP | Real traffic → Upstash Redis |
| Escalation = log + webhook | Team gets notified without building a CRM | Volume justifies HubSpot/Salesforce integration |

## Budget ($5 OpenRouter key)
- System prompt (rules + knowledge): ~5k tokens after the cadreai.com research (was ~1.9k from the brief alone).
  With tool schemas and history, a turn is ~6k input + ≤600 output tokens. At Haiku 4.5 list prices ($1/M input,
  $5/M output) that is ≈ $0.009 per turn, so ~500 turns. Verify prices on OpenRouter before relying on this.
- Spent so far (2026-09-24): 3 full eval runs + 2 re-runs + 1 manual check ≈ 54 turns ≈ $0.50 at the estimate above.
- A full eval run is 17 turns (≈ $0.10). Evals, manual checks and reviewer traffic all share the budget.
- Guards: per-IP rate limit (10/min), 2000-char message cap, 12-message history window, 600-token output cap, 3 steps max.
- No automated test calls the model. Only `npm run eval` and manual checks spend budget.
- Check the balance in the OpenRouter dashboard before each eval run and before submitting.

## Known limitations
- In-memory rate limit resets per serverless instance.
- Escalation logs contain PII (email) in Vercel logs — acceptable for demo, not production.
- Knowledge is a snapshot of cadreai.com taken 2026-09-24; it goes stale when the site changes.
- The portal login URL and security specifics (SOC 2, data residency, NDAs) aren't published, so those answers
  escalate or redirect by design.
- The client sends the full history, so a user could forge earlier assistant turns. Acceptable for a public FAQ bot
  with no privileged actions; a server-side session store would close it.

## With more time
Prompt caching metrics, LLM-as-judge evals, CRM integration, analytics on unanswered questions
(to prioritize new knowledge), embeddable widget script.