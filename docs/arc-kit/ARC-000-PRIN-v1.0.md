# Cadre AI Enterprise Architecture Principles

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:principles`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-000-PRIN-v1.0 |
| **Document Type** | Enterprise Architecture Principles |
| **Project** | Cadre AI Support Chatbot — cadre-chatbot (Project 001) |
| **Classification** | OFFICIAL |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-27 |
| **Last Modified** | 2026-09-27 |
| **Review Cycle** | Quarterly |
| **Next Review Date** | 2026-12-27 |
| **Owner** | Jhon Felipe Urrego — Solution Architect, Cadre AI Support Chatbot |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | Cadre AI Engineering team; Cadre AI inbound/strategy team; take-home review panel |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-27 | ArcKit AI | Initial creation from `/arckit:principles` command, grounded in the take-home brief, the recruiter next-steps note, and the as-built `cadre-chatbot` application | PENDING | PENDING |

---

## Executive Summary

This document establishes the principles governing technology architecture decisions for Cadre AI's customer-facing conversational products, starting with the **Cadre AI Support Chatbot**: a website assistant that answers common inbound questions from a curated knowledge base, routes interested prospects to a strategist call, and hands anything it cannot answer to the Cadre team.

The chatbot exists so that "the team can focus on high-value conversations" [CACTHC-C5]. Its audience is prospective and existing clients, from "lower middle market private equity-backed companies to professional services firms and financial services organizations" [CACTHC-C19]. That audience makes **accuracy, trust and a clean handoff to humans** matter more than breadth.

The principles were written **after** a working application existed and were checked against it. Every principle has an **Implementation alignment** block that says how the as-built system meets it, or where it deliberately does not yet. The as-built system is the `cadre-chatbot` repository (see External References, `APP`).

**Scope**: All Cadre AI conversational and AI-assisted customer-facing systems, starting with Project 001.
**Authority**: Cadre AI Engineering (architecture owner for Project 001), reviewed by the Cadre AI engineering lead.
**Compliance**: Mandatory unless an exception is approved through Section VIII.

**Philosophy**: These principles are **technology-agnostic**. They describe WHAT qualities the architecture must have, not HOW to implement them with specific products. Specific model, framework and hosting choices are recorded as decisions (in `plan.md` or ADRs), each with a "revisit when" trigger, and are judged against these principles.

**Principle count**: 23 principles in 6 categories: Business (3), Application and AI (7), Data (2), Security (2), Technology and Quality (5), Development Practice (4).

---

## I. Business Principles

### 1. Focused Scope, Explicitly Bounded

**Principle Statement**:
Every system MUST have an explicit, written scope: what is IN, what is OUT and why, and a small set of acceptance scenarios that define "done". Delivery MUST favour a few features that work end-to-end over broad, partially working coverage.

**Rationale**:
The brief is "intentionally underspecified — how you scope and prioritize is part of the evaluation" [CACTHC-C1], and Cadre's engineering guidance is to "Cut scope aggressively. 3 working features > 8 broken ones" [CACTHC-C10]. A conversational system with fuzzy scope drifts toward a general-purpose assistant, which is costlier, riskier and harder to verify.

**Implications**:

- Scope lives in a version-controlled planning document and changes in the same change-set as the code it affects [CACTHC-C16]
- Out-of-scope items are listed with the reason and the condition that would bring them in
- Acceptance scenarios are testable and are run against the deployed system, not only locally
- The assistant declines requests outside its domain instead of trying to be helpful everywhere

**Validation Gates**:

- [ ] IN/OUT scope lists exist and are current
- [ ] Each OUT item has a stated reason
- [ ] Acceptance scenarios are defined and each maps to at least one automated behavioural check
- [ ] Off-topic requests are declined (verified by behavioural evaluation)

**Example Scenarios**:

- ✅ Good: "Persistent chat history — OUT: no requirement justifies it for MVP; revisit when users ask to resume chats."
- ❌ Bad: Building an admin dashboard, authentication and retrieval infrastructure before the six core scenarios pass in production.

**Common Violations**:

- Scope changes made in code with no update to the plan
- "While we're here" features added with no acceptance scenario

**Implementation alignment** — ✅ Aligned: `plan.md` has explicit IN/OUT lists with reasons, and `CLAUDE.md` defines six acceptance scenarios that must pass on the deployed URL. The system prompt restricts the assistant to Cadre topics ("It is NOT a general-purpose assistant").

---

### 2. Human Handoff Over Guessing

**Principle Statement**:
When the system cannot answer from authoritative information, or the user asks for a person, it MUST hand the conversation to a human through a defined channel instead of guessing, estimating or deflecting. The handoff MUST carry enough context for the team to act without asking the user to repeat themselves.

**Rationale**:
Handling "a question the bot can't answer — and needs to escalate or redirect" is an explicit required scenario [CACTHC-C2]. For a consultancy selling trust in AI, a confident wrong answer does more damage than a handoff.

**Implications**:

- Handoff triggers are defined: user asks for a human, account-specific requests, unknown answers where the user wants a follow-up
- The handoff captures a contact method, the question, a reason category and recent conversation context
- The system never promises outcomes, response times or deliverables on the team's behalf
- If the user declines to share contact details, a public contact route is offered instead

**Validation Gates**:

- [ ] Handoff triggers are documented and covered by behavioural evaluation cases
- [ ] The handoff record includes a reason taxonomy and bounded conversation context
- [ ] No response promises a timeline, quote or outcome (automated check)
- [ ] The handoff is confirmed to the user only after it has succeeded

**Example Scenarios**:

- ✅ Good: The user asks "Can I talk to a real person?" and gives an email. The system records the handoff with the last few turns, then confirms "the team will follow up by email".
- ❌ Bad: "I'm not sure, but pricing is probably around $10k–$20k. The team will get back to you shortly."

**Common Violations**:

- Listing a contact email and calling that a handoff
- Asking the user to restate a question that is already in the conversation

**Implementation alignment** — ✅ Aligned: the `escalate_to_human` tool validates `{ email, name?, question, reason }`, with reason one of `user_requested_human | unknown_answer | account_specific | other`. It attaches the conversation id and the last 6 turns (500 characters each), then logs and posts to a team-channel webhook. Prompt rules forbid promises made before the tool succeeds, and eval cases cover the "person + email" flow.

---

### 3. Route Intent to the Right Conversation

**Principle Statement**:
When a user shows buying or engagement intent (pricing, getting started, fit for their industry), the system SHOULD offer the canonical path to a strategist conversation. The path MUST come from an authoritative, centrally managed source, never be composed by the model.

**Rationale**:
Booking "a call with an AI strategist" is a core scenario [CACTHC-C3]. The chatbot's business value is turning inbound interest into qualified conversations for the team [CACTHC-C5].

**Implications**:

- The booking destination is configuration, overridable per environment, never hard-coded in prompts or knowledge prose
- The UI renders the booking path as a distinct, actionable element rather than a link buried in text
- The system describes what the destination actually is (for example a contact form, not a calendar) and does not overstate it

**Validation Gates**:

- [ ] Booking link is sourced from configuration through a deterministic action (see Principle 7)
- [ ] Behavioural evaluation confirms the booking action fires on booking and pricing intent
- [ ] Rendered booking element is keyboard and touch accessible

**Example Scenarios**:

- ✅ Good: "Pricing isn't published; it depends on scope and is discussed with a strategist." Then the booking card appears.
- ❌ Bad: The model types a scheduling URL it remembers from training data.

**Common Violations**:

- Duplicating the booking URL across prompt text, knowledge files and UI code

**Implementation alignment** — ✅ Aligned: the `get_booking_link` tool returns `CONFIG.urls.booking` (the `BOOKING_URL` env override, falling back to the site contact page). The UI renders it as a "Talk to an AI strategist" card, and `knowledge/booking.md` states the link opens a contact form, not a calendar.

---

## II. Application and AI Principles

### 4. Grounded Answers From a Single Curated Source of Truth

**Principle Statement**:
All factual statements the system makes about the organisation MUST come from one curated, version-controlled knowledge source. Anything not in that source MUST be treated as unknown. Known gaps MUST be marked explicitly so the system redirects instead of filling them with general knowledge.

**Rationale**:
"You decide what the bot knows. You decide where it draws the line" [CACTHC-C4]. Prospects ask about pricing, clients, security and certifications, and an invented answer is a commercial and reputational risk. One source of truth makes the bot's knowledge auditable and reviewable like code.

**Implications**:

- Facts about the organisation never live in application code or behaviour instructions
- Unpublished information is recorded as an explicit gap marker, not left silently absent
- The system states that it cannot confirm a user's claim when the claim is not supported (false-premise handling)
- The knowledge source is refreshed by a reviewed process, not ad hoc edits

**Validation Gates**:

- [ ] No organisation facts (prices, clients, URLs, policies) in code or behaviour instructions (code review checklist)
- [ ] Gap markers exist for commonly asked but unpublished topics
- [ ] Behavioural evaluation covers knowledge gaps, false premises and pressure ("I'm certain")
- [ ] Knowledge snapshot date is recorded

**Example Scenarios**:

- ✅ Good: The user says "Cadre told me the first month is free, right?" The bot replies "I can't confirm that. Pricing isn't published", then offers a strategist call.
- ❌ Bad: The bot tells a user Cadre is SOC 2 certified because most consultancies are.

**Common Violations**:

- Adding a helpful one-line service description to knowledge that no source supports
- Behaviour instructions that contradict "how to answer" guidance in the knowledge base

**Implementation alignment** — ✅ Aligned: `knowledge/*.md` is "the ONLY source of truth about Cadre", and gaps are marked `[NOT PUBLISHED]`. Prompt grounding rules forbid facts outside `<knowledge>`, and eval cases cover gaps, false premises and poisoned history. One caveat: knowledge is a 2026-09-24 snapshot and has no scheduled refresh (listed under "With more time").

---

### 5. Provenance for Every Fact

**Principle Statement**:
Every fact in the knowledge source that carries a number, price, percentage or link MUST record where it came from. Adding such a fact without provenance MUST be blocked automatically, not left to reviewer diligence.

**Rationale**:
Provenance is what makes grounding verifiable. AI-assisted authoring makes it easy to add plausible, unsourced facts, so the control has to be mechanical.

**Implications**:

- Knowledge entries follow a fixed structure (facts, not published, how to answer)
- High-risk facts carry an inline source reference
- An automated guard rejects unsourced high-risk facts at authoring time
- Only facts fetched from an authoritative source during the same authoring session are accepted

**Validation Gates**:

- [ ] Automated provenance guard is active and unit-tested
- [ ] Knowledge files follow the agreed structure
- [ ] Spot checks of sources are recorded when knowledge is refreshed

**Example Scenarios**:

- ✅ Good: `- 100+ high-ROI use cases delivered across 50+ companies. (source: https://cadreai.com/about)`
- ❌ Bad: `- Engagements typically start at $25k.` with no source. The guard should block this edit.

**Common Violations**:

- Pasting marketing copy without source lines
- Removing a gap marker without adding the sourced fact that replaces it

**Implementation alignment** — ✅ Aligned: the `.claude/hooks/guard-knowledge.mjs` PreToolUse hook blocks new `## Facts` bullets containing digits, `$`, `%` or URLs that lack `(source: …)`, and it has unit tests. The `knowledge-writer` subagent must cite a fetched URL for every fact.

---

### 6. Separation of Behaviour, Knowledge and Configuration

**Principle Statement**:
Conversational systems MUST keep three concerns separate: **behaviour** (rules for how the assistant acts), **knowledge** (what it knows) and **configuration** (model choice, limits and every external link). Each has one home, and none leaks into the others.

**Rationale**:
"Separation of concerns" and "system prompt design" are explicitly assessed [CACTHC-C7]. When facts sit in prompts or URLs sit in code, changes become risky and reviews miss contradictions. A rule changed in one place while a knowledge file still says the opposite produces inconsistent answers.

**Implications**:

- Behaviour instructions contain no organisation facts
- Knowledge contains no operational parameters
- One configuration module owns limits, model identifier and all outbound URLs
- When a behaviour rule changes, the knowledge base is searched for contradicting guidance in the same change

**Validation Gates**:

- [ ] Configuration is centralised in one module or environment layer
- [ ] Code review confirms no cross-contamination between the three layers
- [ ] Unit tests assert the parameters actually sent to the model come from configuration

**Example Scenarios**:

- ✅ Good: Changing the output cap is a one-line configuration change covered by an existing test.
- ❌ Bad: A price appears in the system prompt "as an example" and the model repeats it to users.

**Common Violations**:

- Suggested wordings in knowledge that contradict a new behaviour rule

**Implementation alignment** — ✅ Aligned: `lib/prompt.ts` holds behaviour only, `knowledge/` holds facts, and `lib/config.ts` holds model, temperature, limits and URLs. The CLAUDE.md mistakes log records a prompt/knowledge contradiction (portal follow-up promise) that was caught and fixed.

---

### 7. Deterministic Actions Through Typed Tools

**Principle Statement**:
Any output with operational consequences (links, handoffs, records written, notifications sent) MUST come from a typed, schema-validated action with deterministic output. The model MUST NOT generate those values freely. The model decides *whether* to act; the action decides *what* is produced.

**Rationale**:
Language models hallucinate URLs and identifiers. Moving consequential values into code-controlled actions removes that failure mode and makes behaviour unit-testable.

**Implications**:

- Every action has an input schema, and invalid model inputs are rejected
- Action outputs come from configuration or system state, never from model text
- The assistant may only reproduce URLs that appear in the knowledge source or an action result
- Multi-step action use is bounded by a maximum step count

**Validation Gates**:

- [ ] Every action has a validated input schema
- [ ] Unit tests cover action outputs with the model mocked
- [ ] Behavioural evaluation includes action-misuse cases (for example a handoff without an email, or a made-up email)
- [ ] Maximum action steps per turn is configured

**Example Scenarios**:

- ✅ Good: The booking link is always the configured value, whatever the user asks for.
- ❌ Bad: The assistant writes "book here: https://calendly.com/cadre" because it seems plausible.

**Common Violations**:

- Asking the model to "include the booking link" in free text

**Implementation alignment** — ✅ Aligned: two tools, `get_booking_link` (no input, returns the configured URL) and `escalate_to_human` (validated email, bounded name and question, enum reason). Steps are capped at 3 (`stopWhen: isStepCount`), and the prompt forbids URLs not found in knowledge or tool results.

---

### 8. Right-Sized, Replaceable Models

**Principle Statement**:
Model selection MUST be a documented, reversible decision: the least expensive model that passes the behavioural evaluation for the workload, reached through one access gateway, swappable by configuration without code changes, and run with settings that favour consistent answers.

**Rationale**:
The brief gives "full flexibility on model selection" and expects the choice to be explained [CACTHC-C14]. Model access is provided through one brokered gateway that exposes many vendors [NSTCCA-C3]. Support Q&A over a small corpus is dominated by latency and cost, not deep reasoning.

**Implications**:

- The model identifier is configuration with an environment override
- Model choice is recorded with its rationale and the evidence that would trigger a revisit
- Randomness is set low for support workloads, so repeated questions get consistent answers
- Changing the model requires a full behavioural evaluation run before release

**Validation Gates**:

- [ ] Model decision recorded with rationale and "revisit when" trigger
- [ ] Model is switchable by configuration only
- [ ] Behavioural evaluation passes on the selected model
- [ ] Sampling parameters are documented and justified

**Example Scenarios**:

- ✅ Good: The small, fast model tier was chosen for latency and cost. Revisit when evaluations show reasoning failures.
- ❌ Bad: The most capable model is hard-coded "to be safe", burning the budget in a few hundred turns.

**Common Violations**:

- Changing the model and deploying without re-running evaluations

**Implementation alignment** — ✅ Aligned: `CONFIG.model` defaults to a small-tier model, with an `OPENROUTER_MODEL` override. Temperature is 0.2, justified by a flaky eval case at the model default. Both are recorded in `plan.md` Decisions & trade-offs with revisit triggers. All model calls go through the single mandated gateway.

---

### 9. Simplest Knowledge-Access Strategy That Meets Quality

**Principle Statement**:
Systems SHOULD use the simplest knowledge-access strategy that meets quality and cost targets. Full-context injection is preferred while the corpus is small. Retrieval infrastructure is introduced only when a measured size or cost threshold is crossed, and behavioural evaluation stays the release gate either way.

**Rationale**:
Retrieval adds infrastructure, failure modes (missed chunks) and maintenance. For a corpus of a few thousand tokens, full context is more accurate and, with prefix caching, cheap.

**Implications**:

- Corpus size is measured, not estimated
- The threshold for switching strategy is written down
- Static prompt prefixes are structured so they can be cached

**Validation Gates**:

- [ ] Current corpus size measured and recorded
- [ ] Switch threshold documented
- [ ] Prefix caching verified in production telemetry where available

**Example Scenarios**:

- ✅ Good: The corpus is about 5k tokens, all in context, with about 95% of input served from cache. Revisit when the corpus passes about 50k tokens.
- ❌ Bad: Standing up a vector database for nine short markdown files.

**Common Violations**:

- Adding retrieval "for scale" without a measured trigger

**Implementation alignment** — ✅ Aligned: knowledge is loaded once, cached in memory and injected in full. The system prompt is marked for ephemeral prefix caching, and `plan.md` records measured cache reads (13,786 of 14,520 input tokens) and the retrieval trigger (above ~50k tokens). CLAUDE.md forbids adding a vector database.

---

### 10. Behavioural Evaluation as a Release Gate

**Principle Statement**:
AI behaviour MUST be verified by a version-controlled behavioural evaluation suite that runs against a real deployment. Every defect found in the assistant's answers MUST become a regression case. Evaluation results MUST be read, not only counted.

**Rationale**:
Unit tests cannot verify model behaviour. "Catching AI bugs" is explicitly assessed [CACTHC-C8], and so is the discipline to "read and verify" AI output [CACTHC-C13]. Pass/fail rules catch known failure shapes; reading answers finds the ones the rules miss.

**Implications**:

- The suite covers core scenarios, knowledge gaps, false premises, injection, data-leak attempts, action misuse, languages and the API contract
- Assertions target claims, not mentions, so correct refusals are not scored as failures
- Evaluation histories use realistic prior turns, not idealised ones
- Evaluations spend real budget, so they run deliberately and opt-in, never on every commit
- Changes to behaviour, knowledge or actions trigger the relevant evaluation cases

**Validation Gates**:

- [ ] Suite covers all acceptance scenarios
- [ ] Each fixed answer defect has a regression case
- [ ] The latest full run is recorded with pass count and date
- [ ] Assertion patterns are themselves checked against real answers and near-misses

**Example Scenarios**:

- ✅ Good: A contradiction ("hospitality isn't named", then hospitality listed) was found by reading answers. The fix came with a regression case.
- ❌ Bad: Re-running a failing case until it passes and calling it flaky.

**Common Violations**:

- Assertions that match negated wording ("SOC 2 isn't published" failing a "no SOC 2 claim" rule)

**Implementation alignment** — ✅ Aligned: `evals/cases.ts` has 83 cases, and the last recorded full run is 83/83 in 489 s. The `eval-runner` subagent classifies failures by cause (knowledge, prompt, tool, eval too strict). CI runs evals only on manual dispatch. ⚠ Partial: assertions are regex-based, and an LLM-as-judge groundedness check is planned, not built.

---

## III. Data Principles

### 11. Privacy by Design and Data Minimisation

**Principle Statement**:
Systems MUST collect only the personal data needed for the task at hand, MUST NOT persist conversation content unless a documented requirement justifies it, and MUST minimise personal data in logs and downstream notifications. Any retained personal data MUST have a defined purpose and retention period.

**Rationale**:
Prospects share names, emails and business context. Cadre's own positioning covers data security and keeping client data out of model training [CACTHC-C6]. The chatbot must meet the standard Cadre advises clients to meet.

**Implications**:

- Conversation state lives with the user session by default, with nothing persisted server-side and nothing in browser storage
- Contact details are collected only at handoff time, with the user's explicit input
- Log records mask personal identifiers wherever another system of record holds the full value
- Handoff context is bounded (number of turns and characters)
- Retention of any stored personal data is documented

**Validation Gates**:

- [ ] Data inventory lists every place personal data flows or rests
- [ ] No conversation persistence without a recorded requirement
- [ ] Logs mask personal identifiers where a system of record exists
- [ ] Retention period defined for logs and handoff records
- [ ] A privacy impact assessment is completed before production use beyond demo scale

**Example Scenarios**:

- ✅ Good: Reloading the page starts a new conversation, and nothing is in local or session storage.
- ❌ Bad: Every conversation, with emails, is stored "for analytics" with no retention rule.

**Common Violations**:

- Logging full request bodies for debugging

**Implementation alignment** — ⚠ Partial: chat history is not persisted (verified: no local/sessionStorage). Escalation context is capped at 6 turns × 500 characters, and emails are masked in logs when a webhook exists. Gap: without a webhook, the log keeps the full email, which `plan.md` records as acceptable for a demo but not for production. Log retention depends on the hosting platform and is not yet written down. Follow-up: run `/arckit:dpia`.

---

### 12. Single System of Record per Data Domain

**Principle Statement**:
Each data domain MUST have exactly one authoritative home. Derived copies (caches, prompt snapshots, notifications) are read-only and labelled with their origin and freshness.

**Rationale**:
Two copies of "what Cadre offers" or "who asked for a callback" inevitably diverge.

**Data domains (Project 001)**:

| Domain | System of record | Derived copies |
|--------|------------------|----------------|
| Organisation facts | Curated knowledge source (version-controlled) | In-memory knowledge cache; model prompt |
| Operational parameters and links | Central configuration + environment | Action outputs |
| Handoff requests | Team notification channel (target: CRM) | Structured application log |
| Conversation state | User's browser session | Bounded transcript attached to a handoff |

**Validation Gates**:

- [ ] System of record identified for each domain
- [ ] Derived copies documented with freshness (for example, knowledge snapshot date)
- [ ] No bidirectional sync between copies

**Common Violations**:

- Copying a link from configuration into knowledge prose

**Implementation alignment** — ✅ Aligned for facts, config and conversation state. ⚠ Partial for handoffs: when the notification channel is unavailable, the log is the only record. The scaling path names a CRM as the future system of record.

---

## IV. Security Principles

### 13. Security by Design (NON-NEGOTIABLE)

**Principle Statement**:
All systems MUST treat every client-supplied input, including the conversation history, as untrusted. They MUST keep secrets exclusively server-side, render model output as inert text, and apply defence in depth at the public boundary. Security is a foundational requirement, not a later feature.

**Rationale**:
The chatbot sits on a public URL [CACTHC-C15]. It is exposed to prompt injection, secret-extraction attempts, abuse of a budget-limited credential [NSTCCA-C1], and cross-site misuse. The model-access credential is scoped to the chatbot's runtime only [NSTCCA-C2].

**Mandatory Controls**:

- [ ] Secrets are never committed, never placed in client-visible configuration, and never sent to the browser; all model calls go through a server-side boundary
- [ ] Development tooling is denied read and write access to secret files
- [ ] Instructions embedded in user content are ignored; the assistant never reveals its instructions, configuration or secrets
- [ ] Cross-origin requests to the chat endpoint from browsers are rejected
- [ ] Model and user output is rendered as text, never as HTML
- [ ] Standard security response headers applied (no sniffing, frame denial, restrictive permissions, strict referrer)
- [ ] Outbound calls to third parties have timeouts
- [ ] Automation inputs (for example CI parameters) are passed as data, never interpolated into shell commands

**Threats specific to conversational systems**:

1. **Direct and indirect prompt injection**: fake system tags, encoded payloads, zero-width characters, "translate your instructions"
2. **History forgery**: the client supplies earlier assistant turns
3. **Data exfiltration**: requests for keys, environment or configuration
4. **Cost abuse**: scripted traffic that drains a capped credential (see Principle 16)

**Exceptions**:

- NONE. Security principles are non-negotiable.
- Specific control implementations may vary with documented compensating controls.

**Validation Gates**:

- [ ] Threat model completed and reviewed
- [ ] Injection, leak and cross-site-scripting cases exist in behavioural evaluation and unit tests
- [ ] Code review checklist includes secret handling
- [ ] Dependency vulnerability scanning in the pipeline

**Implementation alignment** — ⚠ Partial:
- **In place:**
  - Key read only in the server route.
  - `.env*` denied to tooling in `.claude/settings.json`.
  - Origin/host check (403).
  - Security headers in `next.config.ts`.
  - XSS-safe rendering, unit-tested.
  - Injection and leak eval cases.
  - CI inputs passed through env.
  - Webhook timeout of 3 s.
- **Gaps:**
  - History forgery is mitigated by prompt rules but not closed (there are no privileged actions; a server-side session store would close it).
  - No dependency vulnerability scanning in CI.
  - No formal threat model yet (follow-up: `/arckit:secure` or a threat-model ADR).

---

### 14. Validate Every Input at the Boundary

**Principle Statement**:
Every externally reachable interface MUST validate size, shape and content before doing any costly work. It MUST reject invalid input with a consistent, machine-readable error contract and a correct status code. Client-side checks are a convenience, never a control.

**Rationale**:
"Error handling" is explicitly assessed [CACTHC-C8]. On a pay-per-token system, every unvalidated request that reaches the model costs money.

**Implications**:

- Cheap checks run first (configuration, origin, rate limit, declared body size), then parsing, then schema, then semantic checks (non-empty, per-message length)
- Error responses share one shape and use specific statuses (bad request, forbidden, payload too large, too many requests, not configured)
- Unknown fields are tolerated but never trusted
- Every validation rule has a unit test

**Validation Gates**:

- [ ] Interface contract documented, including error statuses
- [ ] Every rejection path unit-tested
- [ ] No model call happens for a rejected request (verified with the model mocked)

**Common Violations**:

- Relying on the UI to block empty or oversized messages

**Implementation alignment** — ✅ Aligned: the `POST /api/chat` guard order is key → origin (403) → rate limit (429 + `retry-after`) → content-length (413) → JSON parse (400) → schema with a role enum (400) → message count (413) → UI-message validation (400) → per-message length (413) → non-empty latest user message (400). All return `{ error }`, and every path is unit-tested.

---

## V. Technology and Quality Principles

### 15. Loose Coupling Through Standard, Minimal Interfaces

**Principle Statement**:
Components MUST integrate through small, documented interfaces over standard protocols. Integrations with notification or business systems SHOULD use generic, receiver-agnostic payloads, so the downstream system can change without changing the core.

**Rationale**:
Keeping the API surface small and the integrations generic keeps the MVP simple and leaves a clear upgrade path (for example, from a chat channel to a CRM).

**Implications**:

- One conversational endpoint with a documented request, response and error contract
- Responses are streamed so users see output as it is generated
- Outbound notifications use one payload readable by several receivers
- Outbound integrations are best-effort with timeouts, so a failure never blocks the user flow

**Validation Gates**:

- [ ] API contract documented (request, stream, errors)
- [ ] Integration payload format documented and unit-tested
- [ ] Swapping the notification receiver requires configuration only

**Implementation alignment** — ✅ Aligned: one endpoint with a UI message stream, and the contract is documented in `plan.md`. The escalation payload `{ text, content, escalation }` serves two chat-channel formats plus generic JSON receivers, and is truncated to the receiver's message limit. The receiver URL is an env var.

---

### 16. Cost as a First-Class Architectural Constraint

**Principle Statement**:
Systems with usage-based AI costs MUST enforce hard, configurable limits on every cost driver: output length, context size, request rate, action steps and total spend. Spend MUST be measured from production telemetry, not estimated. A spend ceiling SHOULD be enforced by the upstream provider rather than an in-application counter that is not shared across instances.

**Rationale**:
The runtime credential "has a $5 budget and expires in 7 days" [NSTCCA-C1], yet the endpoint is public and must survive reviewer traffic through the live review [CACTHC-C15]. Early estimates missed that a turn with a tool call runs two model steps and sends the prompt prefix twice.

**Implications**:

- Caps on output tokens, history window, message size, request count, body size and steps, all in central configuration
- Per-client rate limiting
- Prefix caching for static prompt content
- Per-request usage telemetry (input, cached and output tokens)
- Automated tests never call the paid model; paid evaluation runs are deliberate and costed beforehand

**Validation Gates**:

- [ ] Every cost driver has a configured cap
- [ ] Measured cost per turn recorded (with and without caching)
- [ ] Upstream spend ceiling configured
- [ ] Test suite runs at zero model cost

**Common Violations**:

- A spend counter held in instance memory that gives false safety across serverless instances

**Implementation alignment** — ✅ Aligned: current caps are 600 output tokens, 12-message history, 2,000 characters per message, 100 messages per request, 256 KB body, 3 steps, and 10 requests per minute per IP. Measured cost is about $0.003 per tool turn with caching versus about $0.015 without. The spend cap is the upstream key credit limit. Unit tests mock the model, and evals are opt-in with a cost estimate stated in the `/eval` command.

---

### 17. Stateless Compute With an Explicit Scaling Path

**Principle Statement**:
Request-handling components SHOULD be stateless so they scale horizontally. Any per-instance state MUST be documented as a known limitation, together with the shared-state replacement and the traffic trigger that justifies it.

**Rationale**:
"Scaling trade-offs" are explicitly assessed [CACTHC-C7]. A stateless core on serverless compute scales without effort. What does not scale is the small amount of instance-local state, which must be named honestly [CACTHC-C17].

**Implications**:

- Conversation state stays on the client; the server keeps no session
- Instance-local caches hold only immutable data (such as the knowledge snapshot) or best-effort controls
- Each best-effort control has a documented shared-state successor
- In-memory structures are bounded, with a maximum number of tracked keys

**Validation Gates**:

- [ ] Server holds no conversation state
- [ ] Instance-local state is listed in known limitations
- [ ] Scaling path documented with triggers

**Implementation alignment** — ⚠ Partial (by design): the server is stateless apart from the per-instance rate-limit map, which is bounded at 10,000 keys with expiry sweeps. `plan.md` lists the limitation and the path: shared cache for the rate limit and a spend counter, a CRM for escalations, and retrieval above the knowledge threshold.

---

### 18. Observability of Every Model Interaction

**Principle Statement**:
Every model interaction MUST emit one structured telemetry record with a correlation identifier, latency, finish reason, actions invoked and token usage (including cache usage). Integration failures MUST be logged with the affected record's identifier. Telemetry MUST NOT contain secrets or unmasked personal data beyond what Principle 11 allows.

**Rationale**:
"Measure, don't estimate". The largest budget error in this project was found only after per-request usage logging existed.

**Implications**:

- Structured, machine-parseable logs with a conversation identifier
- Distinct log channels for chat turns, handoffs and errors
- Metrics suitable for cost and latency tracking are derivable from logs
- Service levels and alerting are defined before production-scale traffic

**Validation Gates**:

- [ ] Structured per-request record in place
- [ ] Handoff success and failure are observable
- [ ] Service Level Objectives defined (latency, error rate, handoff delivery)
- [ ] Alerts configured for spend, error rate and handoff delivery failures

**Implementation alignment** — ⚠ Partial: `[chat]` logs carry conversationId, latencyMs, finishReason, steps, tools and input/cache-read/cache-write/output tokens. `[escalation]` logs carry masked data and webhook failures by id. Gaps: no SLOs, dashboards or alerting yet, and analytics on unanswered questions is planned.

---

### 19. Accessible, Resilient User Experience

**Principle Statement**:
User interfaces MUST work on mobile and desktop, meet accessibility basics (labelled controls, adequate touch targets, keyboard use), show clear error and retry states, and present consequential actions (booking, handoff confirmation) as distinct, recognisable elements.

**Rationale**:
Business leaders often first try a website chatbot on a phone. An error that looks like a hang loses the prospect.

**Implications**:

- Starter prompts show what the assistant can do
- Server error messages are shown to the user in plain language, with a retry option
- Links open safely in a new context
- Long content wraps without horizontal overflow

**Validation Gates**:

- [ ] Mobile viewport check (no horizontal overflow, fixed input)
- [ ] Controls labelled for assistive technology
- [ ] Error and retry states exercised
- [ ] Accessibility audit before wider launch

**Implementation alignment** — ✅ Aligned: starter questions, booking and escalation cards, error text parsed from `{ error }` with a retry, `rel="noopener noreferrer"` on links, a labelled input, and a 390×844 mobile pass with 44 px touch targets. A formal accessibility audit is not yet done.

---

## VI. Development Practice Principles

### 20. AI-Augmented Development With Explicit Context and Guardrails

**Principle Statement**:
When AI coding assistants are used, the project MUST give them explicit, opinionated, version-controlled context: architecture, rules, commands, known pitfalls and a mistakes log. It MUST enforce critical rules mechanically (permissions, pre-edit and post-edit checks) rather than by instruction alone. Independent work SHOULD be delegated to narrowly scoped assistants with least-privilege tool access, and every AI output MUST be verified by a human before it ships.

**Rationale**:
AI-assisted workflow is the most heavily weighted evaluation dimension: "How you set up CLAUDE.md, plan.md, use subagents, custom commands, and manage AI context" [CACTHC-C9]. It should read as "onboarding documentation for an extremely fast but context-limited junior developer" and be opinionated, not boilerplate. Independent tasks should be parallelised with subagents [CACTHC-C18], and a CLAUDE.md (or equivalent) plus PLAN.md are required [NSTCCA-C4].

**Implications**:

- A root context file states hard constraints, architecture, commands, rules and version-specific gotchas
- A mistakes log records each AI error, how it was caught and the rule that now prevents it
- Scoped assistants (knowledge authoring, code review, evaluation) each have a bounded toolset
- Permissions allow safe, repetitive commands; ask for costly or outward-facing ones; deny secrets and destructive operations
- Automated hooks block rule violations before an edit and feed lint and type errors back after an edit

**Validation Gates**:

- [ ] Root context file and plan are present, current and specific to the project
- [ ] Mistakes log maintained
- [ ] Each scoped assistant's tools match its role (read-only reviewer, no-code knowledge writer)
- [ ] Permission policy denies secret access and destructive git operations
- [ ] Hooks are unit-tested

**Implementation alignment** — ✅ Aligned: `CLAUDE.md` (hard constraints, architecture, rules, AI SDK v7 gotchas, a 13-entry mistakes log) and `plan.md`. Three subagents: `knowledge-writer` (no code), `code-reviewer` (read-only), `eval-runner` (proposes, never edits). Four commands: `/add-knowledge`, `/eval`, `/log-decision`, `/ship`. Two hooks: `guard-knowledge` (pre) and `check-edit` (post, lint + typecheck). An allow/ask/deny permission policy.

---

### 21. Automated Verification Before Every Change

**Principle Statement**:
Every change MUST pass automated linting, static type checking, unit tests and a production build before it is merged, in a pipeline that runs on every push. Unit tests MUST be free to run: external paid services are mocked. A bug fix or new validation rule MUST come with a test.

**Rationale**:
Verification has to be cheap enough to run every time. "Knowing what your code does" is assessed [CACTHC-C8].

**Implications**:

- Tests sit next to the code they cover
- The pipeline has a time limit and cancels superseded runs
- Paid behavioural evaluation is a separate, manually triggered pipeline stage
- The local "done" definition mirrors the pipeline

**Validation Gates**:

- [ ] Pipeline runs lint, type check, tests and build on every push
- [ ] No unit test calls a paid external service
- [ ] Each fix commit includes a test or evaluation case

**Implementation alignment** — ✅ Aligned: `.github/workflows/ci.yml` runs lint → typecheck → test → build on push and PR, cancels superseded runs, and has a 10-minute timeout. Evals run as a `workflow_dispatch`-only job. The README reports 39 unit tests with the model mocked.

---

### 22. Continuous Delivery in Small, Traceable Steps

**Principle Statement**:
Systems MUST be deployed to their target environment early and redeployed continuously from the main line. Changes MUST be small, self-contained and described by conventional, descriptive commit messages, so the history explains how the system evolved.

**Rationale**:
"Deploy early. Get something live before you start iterating" [CACTHC-C11], and use "Small, frequent commits with descriptive messages" [CACTHC-C12]. Reviewers read the commit history [NSTCCA-C5].

**Implications**:

- Every push to the main line deploys to production
- Configuration changes are followed by a redeploy, because environment changes apply only to new deployments
- A smoke test of the core flows follows each release
- Unrelated changes are split into separate commits

**Validation Gates**:

- [ ] Automated deploy from the main line
- [ ] Post-deploy smoke test of booking and handoff
- [ ] Commit history uses conventional prefixes and descriptive bodies
- [ ] Rollback path known (redeploy of a previous build)

**Implementation alignment** — ✅ Aligned: git integration deploys every push to `main` (live since phase 1). The history uses `feat:`, `fix:`, `test:`, `docs:`, `ci:` and `chore:` prefixes. The `/ship` command runs verify → review → commit → push → deploy. The pre-submission checklist includes a key switch, a redeploy and a smoke test.

---

### 23. Transparent Decisions and Honest Limitations

**Principle Statement**:
Significant architecture decisions MUST be recorded with their rationale and an explicit **revisit trigger**. Known limitations and deferred work MUST be documented openly alongside the system, not discovered by its users.

**Rationale**:
Cadre values candour about trade-offs: "The best candidates are honest about what's broken and articulate about what they'd do with more time" [CACTHC-C17]. "A focused MVP with clear trade-offs beats an ambitious mess every time" [CACTHC-C20].

**Implications**:

- A decisions log records each decision, why it was made, and when to revisit it
- A known-limitations list is kept current
- A "with more time" backlog records deliberate deferrals
- Larger decisions graduate to formal Architecture Decision Records

**Validation Gates**:

- [ ] Every non-obvious choice has a decision entry with a revisit trigger
- [ ] Known limitations list reviewed at each release
- [ ] Decision entries are updated in place rather than duplicated

**Implementation alignment** — ✅ Aligned: `plan.md` has a 13-row Decisions & trade-offs table with a "Revisit when" column, a Known limitations section (7 items), a With more time backlog, and a `/log-decision` command that edits existing rows instead of duplicating them. Next step: promote key decisions (model, full-context knowledge, handoff channel) to ADRs with `/arckit:adr`.

---

## VII. Exception Process

### Requesting Architecture Exceptions

Principles are mandatory unless a documented exception is approved by the Cadre AI engineering lead (the architecture owner for Project 001).

**Valid Exception Reasons**:

- Technical constraints that prevent compliance
- Contractual or client-imposed requirements (for example, a mandated model gateway)
- Transitional state during a scaling step (for example, instance-local rate limiting before shared state)
- Demo or proof-of-concept deployments with a defined end date

**Exception Request Requirements**:

- [ ] Justification with business and technical rationale
- [ ] Alternative approach and compensating controls
- [ ] Risk assessment and mitigation plan
- [ ] Expiration date (exceptions are time-bound)
- [ ] Remediation plan to achieve compliance

**Approval Process**:

1. Record the exception request in the project's decision log or as an ADR
2. Review by the architecture owner, plus a peer engineer for Security and Privacy principles
3. Engineering lead approval for exceptions to CRITICAL principles (Principle 13 has no exceptions, only compensating controls)
4. Reference the exception from the affected principle's compliance assessment
5. Review open exceptions quarterly and at every production-scale milestone

**Current recorded exceptions (Project 001)**:

| Principle | Exception | Compensating control | Expiry / trigger |
|-----------|-----------|----------------------|------------------|
| 11 Privacy by Design | Full email kept in logs when no webhook is configured | Webhook configured in production, so emails are masked | Before production use beyond demo |
| 12 Single System of Record | Log is the fallback record for failed handoffs | Failure logged with escalation id; user still confirmed | When a CRM or queue is introduced |
| 17 Stateless Compute | Per-instance rate limit | Upstream spend ceiling; bounded map | Real traffic → shared-state limiter |

---

## VIII. Governance and Compliance

### Architecture Review Gates

**Discovery/Alpha**:

- [ ] Architecture principles understood by everyone building the system (human and AI context files)
- [ ] Scope and acceptance scenarios agree with Principle 1
- [ ] No obvious principle violations

**Beta/Design**:

- [ ] Detailed architecture and API contract documented
- [ ] Compliance with each principle validated (`/arckit:principles-compliance`)
- [ ] Exceptions recorded and approved
- [ ] Security (13, 14) and data (11, 12) principles validated; DPIA completed

**Pre-Production**:

- [ ] Implementation matches the approved architecture
- [ ] Behavioural evaluation passes on the release candidate
- [ ] All validation gates passed or covered by an approved exception
- [ ] Operational readiness verified (observability, spend ceiling, handoff delivery)

### Enforcement

- Architecture review is mandatory for every Cadre AI customer-facing AI system
- Mechanical enforcement is preferred over policy: hooks, pipeline gates and permission policies
- Violations of CRITICAL principles must be fixed before a production release
- Approved exceptions are time-bound and reviewed quarterly

---

## IX. Appendix

### Principle Summary Checklist

| # | Principle | Category | Criticality | Validation | Project 001 Status |
|---|-----------|----------|-------------|------------|--------------------|
| 1 | Focused Scope, Explicitly Bounded | Business | HIGH | Scope lists, acceptance scenarios | ✅ Aligned |
| 2 | Human Handoff Over Guessing | Business | CRITICAL | Handoff eval cases | ✅ Aligned |
| 3 | Route Intent to the Right Conversation | Business | HIGH | Booking action eval cases | ✅ Aligned |
| 4 | Grounded Answers From a Single Curated Source of Truth | Application / AI | CRITICAL | Gap and false-premise evals | ✅ Aligned |
| 5 | Provenance for Every Fact | Application / AI | HIGH | Provenance guard + tests | ✅ Aligned |
| 6 | Separation of Behaviour, Knowledge and Configuration | Application / AI | HIGH | Code review, parameter tests | ✅ Aligned |
| 7 | Deterministic Actions Through Typed Tools | Application / AI | CRITICAL | Schema + action-misuse evals | ✅ Aligned |
| 8 | Right-Sized, Replaceable Models | Application / AI | HIGH | Decision record + eval run | ✅ Aligned |
| 9 | Simplest Knowledge-Access Strategy | Application / AI | MEDIUM | Measured corpus size, cache telemetry | ✅ Aligned |
| 10 | Behavioural Evaluation as a Release Gate | Application / AI | CRITICAL | Recorded full run | ⚠ Partial (no LLM judge) |
| 11 | Privacy by Design and Data Minimisation | Data | CRITICAL | Data inventory, DPIA | ⚠ Partial |
| 12 | Single System of Record per Data Domain | Data | HIGH | Domain table | ⚠ Partial (handoffs) |
| 13 | Security by Design | Security | CRITICAL | Threat model, injection/XSS tests | ⚠ Partial |
| 14 | Validate Every Input at the Boundary | Security | CRITICAL | Rejection-path unit tests | ✅ Aligned |
| 15 | Loose Coupling Through Standard, Minimal Interfaces | Technology | MEDIUM | Contract + payload tests | ✅ Aligned |
| 16 | Cost as a First-Class Architectural Constraint | Technology | CRITICAL | Caps, measured cost, upstream ceiling | ✅ Aligned |
| 17 | Stateless Compute With an Explicit Scaling Path | Technology | HIGH | Known limitations, scaling path | ⚠ Partial (by design) |
| 18 | Observability of Every Model Interaction | Technology | HIGH | Structured logs, SLOs, alerts | ⚠ Partial |
| 19 | Accessible, Resilient User Experience | Technology | MEDIUM | Mobile pass, a11y audit | ✅ Aligned |
| 20 | AI-Augmented Development With Explicit Context and Guardrails | Development | CRITICAL | Context files, hooks, permissions | ✅ Aligned |
| 21 | Automated Verification Before Every Change | Development | HIGH | CI pipeline | ✅ Aligned |
| 22 | Continuous Delivery in Small, Traceable Steps | Development | HIGH | Auto-deploy, commit history | ✅ Aligned |
| 23 | Transparent Decisions and Honest Limitations | Development | HIGH | Decision log with triggers | ✅ Aligned |

**Totals**: 23 principles. 16 aligned, 7 partial (all partial items are already recorded as known limitations or deferred work in the application's plan).

### Consistency Notes

These principles pull against each other in three places, and the resolution is stated so the tension does not become a contradiction:

- **Privacy (11) vs Human Handoff (2)**: the handoff needs contact details and context. The resolution is to collect them only at handoff, with the user's explicit input, bounded in size and masked in logs.
- **Cost (16) vs Behavioural Evaluation (10)**: evaluations spend budget. They are therefore opt-in and costed beforehand, and never run automatically on every change.
- **Simplicity (9, 17) vs Scaling**: simplicity is the default, and every simplification carries a documented, measurable trigger for its replacement.

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-27 | ArcKit AI | Initial draft derived from brief, recruiter note and as-built application |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| CACTHC | Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | Product brief / assessment guide | 001-cadre-chatbot/external/ | Cadre AI take-home challenge guide v1.1: brief, required scenarios, deliverables, evaluation weights, engineering tips |
| NSTCCA | Next Steps  Tech Challenge  Cadre AI.txt | Recruiter correspondence | 001-cadre-chatbot/external/ | Timeline, runtime credential constraints (budget, expiry, chatbot-only use), model gateway, submission rules. Contains a live credential, which is deliberately not reproduced here |
| APP | cadre-chatbot (source repository, git-tracked files only; `.gitignore` paths excluded) | Reference implementation | /mnt/g/Users/GAMEMAX/Documents/ENTREVISTAS/gocadre.ai/cadre-chatbot | As-built application used as evidence in each principle's "Implementation alignment" block: `CLAUDE.md`, `plan.md`, `README.md`, `lib/*`, `app/api/chat/route.ts`, `components/Chat.tsx`, `knowledge/*`, `evals/*`, `.claude/*`, `.github/workflows/ci.yml`, `next.config.ts` |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| CACTHC-C1 | CACTHC | p.3, What to Build | Business Requirement | "Build a customer support chatbot for Cadre AI that can handle common inbound inquiries. The prompt is intentionally underspecified — how you scope and prioritize is part of the evaluation." |
| CACTHC-C2 | CACTHC | p.3, What to Build | Functional Requirement | "A user asking a question the bot can't answer — and needs to escalate or redirect" |
| CACTHC-C3 | CACTHC | p.3, What to Build | Functional Requirement | "Someone asking how to book a call with an AI strategist" |
| CACTHC-C4 | CACTHC | p.3, What to Build | Design Decision | "You decide what the bot knows. You decide where it draws the line. You decide what's in scope." |
| CACTHC-C5 | CACTHC | p.2, The Brief | Business Requirement | "Your job is to build a chatbot that handles the most common interactions so the team can focus on high-value conversations." |
| CACTHC-C6 | CACTHC | p.3, What to Build | Security Requirement | "Someone asking about Cadre's approach to LLM selection and data security" |
| CACTHC-C7 | CACTHC | p.5, What We're Looking For | Design Decision | "System Design & Architecture — 25% — Your data model, API structure, system prompt design, separation of concerns, and scaling trade-offs." |
| CACTHC-C8 | CACTHC | p.5, What We're Looking For | Non-Functional Requirement | "Code Quality & Verification — 15% — Clean code, error handling, catching AI bugs, knowing what your code does." |
| CACTHC-C9 | CACTHC | p.5, What We're Looking For | Stakeholder Need | "Claude Code Proficiency — 30% — How you set up CLAUDE.md, plan.md, use subagents, custom commands, and manage AI context. The most important dimension." |
| CACTHC-C10 | CACTHC | p.7, Tips from the Cadre AI Engineering Team | Design Decision | "Cut scope aggressively. 3 working features > 8 broken ones." |
| CACTHC-C11 | CACTHC | p.7, Tips from the Cadre AI Engineering Team | Non-Functional Requirement | "Deploy early. Get something live before you start iterating." |
| CACTHC-C12 | CACTHC | p.7, Tips from the Cadre AI Engineering Team | Non-Functional Requirement | "Small, frequent commits with descriptive messages." |
| CACTHC-C13 | CACTHC | p.7, Tips from the Cadre AI Engineering Team | Non-Functional Requirement | "Read and verify Claude's output. Test as you go." |
| CACTHC-C14 | CACTHC | p.8, FAQ | Design Decision | "You have full flexibility on model selection. Choose what you think is right for the job and be ready to explain why during the review." |
| CACTHC-C15 | CACTHC | p.4, Deliverables | Non-Functional Requirement | "The app must be deployed and accessible on a public URL." |
| CACTHC-C16 | CACTHC | p.7, Tips from the Cadre AI Engineering Team | Design Decision | "Make your scope decisions explicit in plan.md." |
| CACTHC-C17 | CACTHC | p.7 | Stakeholder Need | "We expect trade-offs. We expect incomplete features. The best candidates are honest about what's broken and articulate about what they'd do with more time." |
| CACTHC-C18 | CACTHC | p.5, How to Prepare | Design Decision | "Using subagents to parallelize independent tasks" |
| CACTHC-C19 | CACTHC | p.2, The Brief | Stakeholder Need | "Our clients range from lower middle market private equity-backed companies to professional services firms and financial services organizations." |
| CACTHC-C20 | CACTHC | p.8, FAQ | Design Decision | "Nobody builds everything. A focused MVP with clear trade-offs beats an ambitious mess every time." |
| NSTCCA-C1 | NSTCCA | Paragraph "API Key" | Procurement Constraint | "API Key: You'll need this key to power your chatbot. It has a $5 budget and expires in 7 days, so plan accordingly" (credential value redacted) |
| NSTCCA-C2 | NSTCCA | Paragraph "API Key" | Security Requirement | "Note — this key is for the chatbot only, not for coding assistance. Use it exclusively so your chatbot can respond to users with the model of your choice." |
| NSTCCA-C3 | NSTCCA | Paragraph "Models" | Design Decision | "The API key gives you access to OpenRouter, which means you can use any available model — OpenAI, Gemini, Anthropic, and others." |
| NSTCCA-C4 | NSTCCA | Paragraph "AI Assistant" | Stakeholder Need | "What matters is that you include a CLAUDE.md (or equivalent), a PLAN.md, and that you follow best practices." |
| NSTCCA-C5 | NSTCCA | Paragraph "Submission" | Compliance Constraint | "keep the .git folder so we can review your commit history." |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf:Zone.Identifier | 001-cadre-chatbot/external/ | Windows download metadata, no content |
| README.md | 001-cadre-chatbot/external/ | ArcKit folder placeholder, no content relevant to principles |
| README.md | 000-global/policies/ | ArcKit folder placeholder; no organisational policies provided |

---

**Generated by**: ArcKit `/arckit:principles` command
**Generated on**: 2026-09-27
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**Model**: Claude Opus 5.5 (claude-opus-5-5)
