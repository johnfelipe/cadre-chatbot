# Plan — Cadre AI Support Chatbot

## Goal
A deployed chatbot a prospective or existing Cadre client could realistically use: accurate answers,
clear routing to a strategist, graceful escalation. Time budget: ~5 hours.

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
- [ ] 0. CLAUDE.md, plan.md, .claude/ agents + commands  → commit
- [ ] 1. Scaffold Next.js + minimal streaming chat + deploy to Vercel  → live URL
- [ ] 2. Knowledge base (knowledge-writer subagent, in parallel with phase 3 UI work)
- [ ] 3. System prompt + tools (booking, escalation) + input validation + rate limit
- [ ] 4. Evals (15 cases incl. injection, pricing, off-topic) → fix failures
- [ ] 5. UI polish: starter questions, tool result cards, error/retry states, mobile
- [ ] 6. README, update CLAUDE.md mistakes log, zip (with .git, without node_modules/.next)

## Decisions & trade-offs
| Decision | Why | Revisit when |
|---|---|---|
| Haiku 4.5 over Sonnet | Support Q&A over small corpus; latency and cost dominate | Evals show reasoning failures |
| Full knowledge in system prompt | < 10k tokens; no retrieval misses; prompt caching makes it cheap | Corpus > ~50k tokens |
| Tools return URLs from config | Model can't hallucinate links | — |
| In-memory rate limit | Zero infra for MVP | Real traffic → Upstash Redis |
| Escalation = log + webhook | Team gets notified without building a CRM | Volume justifies HubSpot/Salesforce integration |

## Known limitations
- In-memory rate limit resets per serverless instance.
- Escalation logs contain PII (email) in Vercel logs — acceptable for demo, not production.
- Knowledge accuracy depends on the public website snapshot (date: ____).

## With more time
Prompt caching metrics, LLM-as-judge evals, CRM integration, analytics on unanswered questions
(to prioritize new knowledge), embeddable widget script.