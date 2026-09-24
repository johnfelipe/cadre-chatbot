# plan.md — Cadre AI Support Chatbot

## Goal

Ship a deployed, publicly accessible support chatbot that handles Cadre AI's common inbound questions from knowledge it can cite. When it can't answer, it hands the person off to a human cleanly.

Time budget: **4–6 hours of build**, spread over 3 days. The project is due on day 4 and the live review is on day 5.

## Success criteria

The MVP is done when all six scenarios pass on the **deployed** URL:

| # | Scenario | Passes when |
|---|---|---|
| S1 | "What does Cadre do? Do you work with [industry]?" | The bot describes the services accurately and answers about the industry from the curated list. Unlisted industries get a hedged answer and are pointed to a strategy call. |
| S2 | "How do I book a call with an AI strategist?" | The bot gives the real booking path (a link or steps) taken from the knowledge base. |
| S3 | "How do I access the Cadre portal?" | The bot gives the documented access steps, or escalates if they aren't publicly documented. It never invents a URL. |
| S4 | "What is the AI Maturity Index and how do I get scored?" | The bot explains the index and the next step to get scored, using only facts from the knowledge base. |
| S5 | "How do you choose LLMs? What about data security?" | The bot states Cadre's documented stance and doesn't fill gaps with generic claims. |
| S6 | An unanswerable or out-of-scope question | The bot says it doesn't know, offers a human handoff, and captures the person's contact details and question. |

## Architecture decisions

| Decision | Choice | Why / trade-off |
|---|---|---|
| Framework | **Next.js (App Router, TypeScript) on Vercel** | One repo for the UI and API routes, fast deploys, and a preview URL for every push. |
| LLM transport | **OpenRouter** through the Vercel AI SDK (`ai` plus an OpenRouter provider) | Streaming and `useChat` come built in. The model is swappable with one env var. |
| Model | A cheap, fast model that follows instructions well, set by `OPENROUTER_MODEL` | The $5 budget is the binding constraint. Pick it in Phase 2 after checking current prices on openrouter.ai/models. Rough ceiling: about 3k input and 300 output tokens per turn works out to about $0.005 per turn on a Haiku-class model, so roughly 1,000 turns. |
| Knowledge | **A few curated Markdown files in the repo, loaded whole into the system prompt.** No RAG and no vector DB. | The corpus is a few pages. Stuffing the whole thing in is simpler, deterministic and easy to review. RAG is the scaling path once the corpus outgrows the context window, which is a talking point for the review. |
| Grounding | Every fact in the knowledge files carries a source URL. The system prompt says: answer only from the knowledge base, otherwise escalate. | Hallucinated prices, links or portal URLs are the worst failure a support bot can have. |
| Escalation | The model calls an `escalate_to_human` tool. The UI then shows a contact form, which posts to `/api/escalations`. | This is structured and testable, and it doesn't rely on regex over free text. |
| Storage | **Upstash Redis** (Vercel Marketplace) | One dependency covers both the rate limiter and escalation records. In-memory rate limiting doesn't work across serverless instances. |
| Abuse and cost control | Per-IP rate limit, message length cap, history window (last N turns) and `max_tokens` cap | The endpoint is public, and anyone could otherwise drain the key. |
| Tests | Vitest unit tests with the LLM mocked, plus a manual scenario eval script against the real model | Unit tests are free and deterministic. The eval costs budget, so it runs deliberately, about 12 calls per run. |

### Data model

```ts
// Redis key: escalation:{id}   plus an index in the sorted set escalations (score = createdAt)
type Escalation = {
  id: string;            // uuid
  createdAt: string;     // ISO
  name: string;
  email: string;
  company?: string;
  question: string;      // what the user needed
  reason: string;        // model-provided: why it escalated
  transcript: { role: "user" | "assistant"; content: string }[]; // last N turns
};
```

### Request flow

```
Browser (useChat) ──POST /api/chat──▶ rate limit ▶ validate & trim history ▶ system prompt + knowledge
                                              ▶ OpenRouter (stream) ──▶ tokens / tool call ──▶ UI
UI (on escalate tool call) ──POST /api/escalations──▶ validate (zod) ▶ Redis
```

## Phases

Each phase ends with a commit, and after Phase 1 with a deploy. Don't start the next phase until the current phase's **Done when** holds.

### Phase 0: Planning (≈20 min)
- [ ] Write `CLAUDE.md`, `plan.md` and `.gitignore` (which excludes `.env*`, `node_modules`, `.next` and `.vercel`).
- **Done when:** these are committed as the first commit.

### Phase 1: Scaffold and deploy (≈45 min)
- [ ] Run `create-next-app` with TypeScript, App Router, Tailwind, ESLint, `src/` and npm.
- [ ] Add Vitest and one trivial test. Add a `typecheck` script.
- [ ] Deploy the placeholder page with `npx vercel` (the user runs `! npx vercel login`). Record the public URL at the top of this file.
- [ ] Update the **Commands** section of `CLAUDE.md` with the actual scripts.
- **Done when:** the placeholder page is live on a public URL, and `lint`, `typecheck` and `test` all pass.

### Phase 2: Chat vertical slice (≈75 min)
- [ ] Build the `/api/chat` route: OpenRouter streaming, with the model read from env.
- [ ] Add a zod-validated request, a message length cap, a history window and `max_tokens`.
- [ ] Add the Upstash rate limiter to `/api/chat`, returning 429 with a friendly message.
- [ ] Build a minimal chat UI with `useChat`: message list, input, and loading and error states.
- [ ] Choose the model and write the choice and reasoning into this file.
- [ ] Write unit tests for request validation, history trimming and the rate-limit response, with the LLM mocked.
- **Done when:** a deployed chat streams replies, and the 11th rapid request gets a 429.

### Phase 3: Knowledge base and system prompt (≈60 min). Can run **in parallel with Phase 2** as a subagent.
- [ ] Research subagent: collect public facts from cadreai.com for S1–S5 (services, industries, booking, portal, AI Maturity Index, LLM and security stance). Each fact gets its source URL. Record gaps explicitly rather than filling them.
- [ ] Write the facts into `src/knowledge/*.md`.
- [ ] Write the system prompt: persona, scope, grounding rules, tone, when to escalate, and a rule never to invent links or prices.
- [ ] Unit test: the prompt builder includes every knowledge file.
- **Done when:** S1–S5 pass a manual check on the deployed URL.

### Phase 4: Escalation (≈60 min)
- [ ] Define the `escalate_to_human` tool (with a `reason` parameter), and have the UI render a contact form when it's called.
- [ ] Build `/api/escalations`: zod validation, then write to Redis, then confirm to the user.
- [ ] Write unit tests for the escalation schema and route, with Redis mocked.
- **Done when:** S6 passes end to end on the deployed URL and the record is visible in the Upstash console.

### Phase 5: Claude Code tooling and evals (≈30 min)
- [ ] Add `evals/scenarios.json` with 2 prompts per scenario, and `npm run eval` to hit the deployed or local API and print the answers.
- [ ] Add `.claude/commands/eval.md`, which runs the eval and checks the answers against the knowledge base.
- [ ] Add `.claude/commands/verify.md`, which runs lint, typecheck and tests and summarises the result.
- [ ] Add `.claude/agents/grounding-auditor.md`, a subagent that flags any bot claim not supported by `src/knowledge/`.
- **Done when:** `/eval` runs and the auditor reports no unsupported claims.

### Phase 6: Polish and submit (≈45 min)
- [ ] Add suggested-question chips for S1–S5, Markdown rendering for replies, a mobile layout and a Cadre-neutral look. No logo or brand impersonation.
- [ ] Write the README: what it is, the live URL, how to run it, and the env vars.
- [ ] Do a final eval pass and deploy, then fill in **What's broken / what's next** below.
- [ ] Zip the repo with `.git` included and without `node_modules` or `.next`.
- **Done when:** all six scenarios pass on production and the zip is under a few MB.

## Out of scope (deliberate)

- **User accounts and auth.** The bot serves anonymous visitors. Portal questions are answered or redirected, and there's no real portal integration.
- **Calendar or booking API integration.** The bot links out to the booking path.
- **RAG, embeddings or a vector DB.** The corpus is too small to justify them. This is the documented scaling path.
- **An admin UI for escalations.** For the MVP they're read in the Upstash console.
- **Saving conversation history across sessions, and analytics.**
- **Multilingual support.** The model may answer in the user's language, but it isn't tested.

## Stretch (only if all phases are done)

- Log conversations, anonymised, to spot knowledge gaps.
- A read-only `/admin/escalations` page behind a shared secret.
- A Playwright end-to-end test of the S6 escalation flow.
- A spend guard that disables the chat when a daily token counter in Redis passes a threshold.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| The key's budget or expiry runs out before the review | Strict caps, the rate limit and a cheap model. Spend on the eval is budgeted. Check the balance in the OpenRouter dashboard daily. |
| cadreai.com doesn't document the portal or the scoring process | Treat that as a gap: the bot escalates instead of guessing (S3 and S4 both allow this). |
| Deploy problems late in the build | Deploy in Phase 1 and redeploy after every phase. |
| The model ignores the grounding rules | Run the eval and the grounding auditor, tighten the prompt, and switch models through env if needed. |

## What's broken / what's next

_Fill in at submission._
