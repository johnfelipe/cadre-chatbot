# CLAUDE.md

@AGENTS.md

# Cadre AI Support Chatbot

Customer-facing support chatbot for Cadre AI (AI strategy & implementation consultancy).
Audience: prospective clients (PE-backed, professional services, financial services execs) and existing clients.
Goal: answer common inbound questions accurately, route high-intent users to a strategist call,
and escalate anything we can't answer. It is NOT a general-purpose assistant.

Built as a take-home challenge (Staff AI Engineer, Colombia). The brief is `../Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf`
and the recruiter emails are the `.txt` files next to it, all outside the repo.
`plan.md` is the source of truth for phases and scope. When scope changes, update it in the same commit.

## Timeline
- Challenge received 2026-09-24. 3 days of work, project due on day 4, 1-hour live review with an AI engineer on day 5.
- Review agenda: live demo of the deployed app, architecture (system prompt, API, data model, scaling),
  Claude Code workflow (CLAUDE.md, plan.md, subagents, how AI errors were handled), code deep dive
  (what Claude generated vs what was changed, and why), and decisions/trade-offs (what was left out, what's next).

## Hard constraints (from the brief and the recruiter email)
- LLM access is through **OpenRouter only**, with the challenge key in `OPENROUTER_API_KEY`. Any OpenRouter model is allowed.
  Never commit it, never paste it into any repo file, never send it to the browser: every model call goes through a server route.
- The key has a **$5 budget** and expires 7 days after it was issued, around **2026-10-01**. That is after the day-5 review,
  so the deployed bot must keep working until then. Cap `max_tokens`, cap history length and message size,
  and rate-limit `/api/chat`: the URL is public.
- The key is for the bot's runtime only. No coding help or bulk experiments with it. No automated test calls the model.
- The app must be live on a public URL. Deploy early, redeploy after every phase.
- Submission is a zip of the repo with `.git`, without `node_modules`, `.next`, `dist` or `build`. Keep it to a few MB.
- `CLAUDE.md` and `plan.md` must stay at the repo root (the brief spells it `plan.md`; the email writes `PLAN.md`).
  Reviewers read the commit history.

## Acceptance scenarios (all must pass on the deployed URL)
1. What Cadre AI does, and whether it works with the user's industry.
2. How to book a call with an AI strategist.
3. How a client accesses the Cadre portal to track their AI tools, agents and results.
4. What the AI Maturity Index is and how to get scored.
5. Cadre's approach to LLM selection and data security.
6. A question the bot can't answer: it escalates or redirects to a human instead of guessing.

Evaluation weights: Claude Code workflow 30%, system design 25%, speed and scope 20%,
code quality and verification 15%, communication 10%. "3 working features > 8 broken ones."

## Stack
- Next.js (App Router) + TypeScript (strict), deployed on Vercel
- Vercel AI SDK (`ai`, `@openrouter/ai-sdk-provider`, `@ai-sdk/react`) — streaming + tool calling
- Model: Claude Haiku 4.5 through OpenRouter (`anthropic/claude-haiku-4.5`; `OPENROUTER_MODEL` env var overrides).
  Chosen for latency/cost on a support workload.
- zod for all input validation. Tailwind for UI. No database in MVP.

## Commands
- `npm run dev` — local dev on :3000
- `npm run build` — must pass before any commit that touches app/ or lib/
- `npm run lint` — eslint
- `npm run typecheck` — `next typegen` (route types like `LayoutProps`) + `tsc --noEmit`
- `npm test` — Vitest unit tests (`*.test.ts(x)` next to the code). The model is always mocked; costs nothing.
  Single file: `npx vitest run app/api/chat/route.test.ts`.
- `npm run eval [-- <case-id-prefix> ...]` — posts evals/cases.ts to a running `/api/chat` (`EVAL_URL`, default
  localhost:3000, whose server needs `OPENROUTER_API_KEY`). Real model calls: spends budget, run deliberately.

## Env vars (`.env.local` locally, Vercel project settings in prod)
- `OPENROUTER_API_KEY` (required), `OPENROUTER_MODEL` (optional, defaults to `anthropic/claude-haiku-4.5`).
- `BOOKING_URL` (optional): overrides the booking link, which defaults to https://cadreai.com/contact (where every "Talk to an AI Strategist" button on the site leads).
- `ESCALATION_WEBHOOK_URL` (optional): a Slack or Discord incoming webhook (or any JSON receiver) that gets each
  escalation with its conversation id and last turns. Unset → escalations are only logged, with the full email.

## Architecture (read before editing)
- `knowledge/*.md` — the ONLY source of truth about Cadre. Facts live here, never in code.
- `lib/knowledge.ts` — loads + caches all knowledge files into one string.
- `lib/prompt.ts` — builds the system prompt (behavior rules + injected knowledge). Behavior only, no facts.
- `lib/tools.ts` — `get_booking_link`, `escalate_to_human`, and the `ChatMessage` type the UI uses. Tool outputs come from `lib/config.ts`.
- `lib/escalations.ts` — escalation zod schema, `Escalation` record, log + optional webhook.
- `lib/rate-limit.ts` — fixed-window limit per IP, in memory (per serverless instance).
- `lib/config.ts` — model, limits and every external URL. The model must never invent URLs; it gets them from tools/knowledge.
- `app/api/chat/route.ts` — single endpoint: key check → rate limit → validate → trim history → length cap → streamText (OpenRouter, `maxOutputTokens` capped) → UI message stream.
- `components/Chat.tsx` — `useChat` client; renders text parts and tool parts (booking card, escalation notice).
- `evals/` — behavioral regression tests. Add a case for every bug found in the bot's answers.
- `.claude/` — permissions, subagents (`knowledge-writer`, `code-reviewer`, `eval-runner`) and slash commands.

## Rules
- NEVER add facts about Cadre (pricing, clients, certifications, URLs) that aren't in `knowledge/`.
  Unknown facts are marked `[NOT PUBLISHED]` and the bot must redirect/escalate.
- Knowledge in prompt, not RAG: corpus is < 10k tokens. Don't add a vector DB. Revisit if > 50k tokens.
- Every API input is validated with zod or explicit checks; errors return JSON `{ error }` with proper status.
- Don't add dependencies without asking. Don't touch `.env*`.
- Small commits, conventional prefixes: feat:, fix:, chore:, docs:, test:, refactor:. Write the title and body in English.
- Before saying a task is done: `npm run lint && npm run typecheck && npm test && npm run build`. If prompt/knowledge changed: `npm run eval`.
- A new validation rule or bug fix in `app/` or `lib/` comes with a unit test; a new bot behaviour comes with an eval case.
- Prefer editing existing files over creating new ones. No barrel files. No classes where functions suffice.

## AI SDK gotchas (verified in this repo: ai 7, @ai-sdk/react 4, zod 4, Next 16)
- Docs for the installed versions ship in `node_modules/ai/docs/` and `node_modules/next/dist/docs/`. Read them before
  copying examples from memory: most examples online are v4/v5.
- v7 names: `instructions` (not `system`), `inputSchema` (not `parameters`), `maxOutputTokens` (not `maxTokens`),
  `isStepCount` (`stepCountIs` is a deprecated alias), `await convertToModelMessages(...)` (async),
  `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`.
- `useChat` has no `input`/`handleSubmit`: keep input in state, call `sendMessage({ text })`. `DefaultChatTransport` is imported from `ai`.
- Multi-step tool use requires `stopWhen: isStepCount(n)`; the default is 1 step, so the model stops after the tool call.
- `knowledge/` is read with fs → must be listed in `outputFileTracingIncludes` in next.config.ts
  or it's missing on Vercel.
- Anthropic models require the first message to be from the user, also through OpenRouter:
  after trimming history, drop leading non-user messages.

## Claude mistakes log (update as they happen)
- Rewrote the docs around `@ai-sdk/anthropic` + `ANTHROPIC_API_KEY`, which breaks the OpenRouter-only rule. Caught in review, fixed in 756b151.
- Gave each core service a one-line description the brief doesn't contain (knowledge/services.md). Caught before commit; now names only.
- The first gotchas in this file were AI SDK v5 (`stepCountIs`, `system`), but npm installed v7. A subagent read the bundled v7 docs before the route was written, and the gotchas were rewritten.
- `npm run typecheck` failed on `LayoutProps` because Next 16 generates route types; the script now runs `next typegen` first.
- Assumed a ~10k-token system prompt when estimating budget; measured ~1.9k. plan.md budget updated.
- knowledge/industries.md kept two industry lists (brief and website); the bot said hospitality "isn't named" and then
  listed it. Caught by reading eval answers, not by the pass/fail line: always read the answers. Fixed with one list + regression case.
- The prompt forbade Markdown but the model kept **bold** labels. Fixed in the UI (renders bold) instead of fighting the model.
- Two eval false failures: a URL regex that swallowed "**", and a SOC 2 rule that rejected "SOC 2 isn't published". Rules now target claims, not mentions.
- `vercel link` appended `.vercel` and `.env*` to .gitignore; the trailing `.env*` would have re-ignored `.env.example`. Reverted.
- Added a "don't promise what the team will do" rule to the prompt but left knowledge/portal.md saying "say the team will follow up".
  The bot kept promising ("they'll get you sorted") until the knowledge file was fixed. When a rule changes, grep knowledge/ for "How to answer" lines that contradict it.
- The first "asks for the user's email" eval regex also matched the bot giving out Cadre's own address ("email hello@…"),
  and the access-promise guard missed the bot's real wording. Caught by the code-reviewer subagent; eval regexes are now
  tested in node against the real answer and near-misses before committing.
