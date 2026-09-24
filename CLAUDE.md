# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Greenfield. No code or stack has been chosen yet. When the stack is picked, fill in **Commands** and **Architecture** below and keep them current. This file is reviewed as a deliverable, so it should stay specific to this repo.

## What this is

A customer-support chatbot for **Cadre AI**, an AI strategy and implementation consultancy. It is being built as a take-home challenge. The brief is intentionally underspecified: scope decisions, and saying clearly what was left out, are part of the evaluation. The full brief is at `../Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf`, outside the repo.

`plan.md` at the repo root is the source of truth for phases and scope. When scope changes, update `plan.md` in the same commit and record what was cut and why.

## Hard constraints

- **LLM access is through OpenRouter only**, using the key provided for this challenge. Read it from the `OPENROUTER_API_KEY` env var.
  - Never commit it. `.env*` must be gitignored.
  - Never send it to the browser. All model calls go through a server-side route.
- **The key has a $5 budget and expires 7 days after it was issued (around 2026-09-24).**
  - Pick a cost-efficient model.
  - Cap `max_tokens` and the length of conversation history sent to the model.
  - Rate-limit the public chat endpoint, because anyone with the URL can spend the budget.
- **The key is for the chatbot's runtime only.** Don't use it for coding help or bulk experiments. Automated tests must mock the LLM call.
- **The app must be deployed on a public URL.** Deploy early and redeploy often, not only at the end.
- **Submission is a zip of the repo that includes `.git`**, without `node_modules`, `dist`, `build` or virtualenvs. Keep the repo to a few MB and don't commit large datasets or binaries.
- **Reviewers read the commit history** for pacing and method. Make small, frequent commits, one logical change each, with descriptive messages.
- **Required files at the repo root:** `CLAUDE.md` and `plan.md` (lowercase, as the brief spells it).

## What the bot must handle (acceptance scenarios)

1. A prospect asks what Cadre AI does and whether Cadre works with their industry.
2. Someone asks how to book a call with an AI strategist.
3. A client asks how to access the Cadre portal to track their AI tools, agents and results.
4. A business leader asks what the AI Maturity Index is and how to get scored.
5. Someone asks about Cadre's approach to LLM selection and data security.
6. A question the bot can't answer: it must **escalate or redirect to a human**, not guess.

Other common inquiries named in the brief: how to get started, service pricing, and case studies.

## Known facts about Cadre (from the brief)

- **Does:** AI strategy, workflow automation, AI agents, leadership facilitation.
- **Serves:** B2B companies, including professional services, PE-backed lower middle market, financial services, real estate, construction, manufacturing and retail.
- **Core services:** AI Strategy, AI Leadership & Facilitation, AI Engineering, AI Agents.
- **Partners:** OpenAI, Anthropic, Google, Microsoft, AWS, Salesforce, Snowflake, and OpenRouter for model access.

The bot's facts about Cadre must come from curated knowledge in this repo, not from the model's general knowledge. Anything the brief doesn't specify, the bot should state as unknown and escalate rather than invent. That includes prices, case-study details, portal URLs, booking links and contact details.

## Evaluation weights (use these to prioritise)

| Dimension | Weight |
|---|---|
| Claude Code workflow: CLAUDE.md, plan.md, subagents, custom commands, context management | 30% |
| System design: data model, API structure, system prompt design, separation of concerns, scaling trade-offs | 25% |
| Speed and scope | 20% |
| Code quality and verification | 15% |
| Communication | 10% |

"3 working features > 8 broken ones." Finish and verify each scenario above before adding features.

## Commands

_TBD once the stack is chosen. List install, dev server, lint, typecheck, test, single-test and deploy commands._

## Architecture

_TBD. Document where these live and how they connect:_
- _the system prompt_
- _the knowledge source_
- _the chat API route, including the OpenRouter client, model choice and limits_
- _escalation handling_
- _the UI_
