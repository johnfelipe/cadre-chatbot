# Architecture Conformance Assessment

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:conformance`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-CONF-v1.0 |
| **Document Type** | Architecture Conformance Assessment |
| **Project** | Cadre AI Support Chatbot — cadre-chatbot (Project 001) |
| **Classification** | OFFICIAL |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-28 |
| **Last Modified** | 2026-09-28 |
| **Review Cycle** | Monthly |
| **Next Review Date** | 2026-10-28 |
| **Owner** | Jhon Felipe Urrego — Solution Architect, Cadre AI Support Chatbot |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | Project Team, Architecture Team |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-28 | ArcKit AI | Initial conformance assessment from `/arckit:conformance` command | PENDING | PENDING |

---

## Executive Summary

**Purpose**: This document checks whether the architecture the project decided on matches the architecture it implemented.

- **Decided architecture**: 8 accepted ADRs and 23 architecture principles.
- **Implemented architecture**: the running code plus the design diagrams.

It is a point-in-time check for the **assessment-window / pre-production** gate. The chatbot is live at a public URL, reviewers are testing it, and it has not yet been used as production on cadreai.com.

**Scope**: 12 conformance checks, run across:

- 8 ADRs (all Accepted)
- 23 principles
- 20 design diagrams (DIAG-001 to DIAG-020)
- the requirements (REQ) and the codebase audit (CDAU)
- the implemented code at HEAD `2058578`

> **Method note: no HLD or DLD exists.** The project has no vendor HLD or DLD, no HLD or DLD reviews, no risk register, no DevOps strategy, no principles-compliance assessment and no traceability matrix. The ADRs were therefore checked against three stand-in sources, each cited by `file:line`:
>
> 1. **The implemented code** of the `cadre-chatbot` repository at HEAD `2058578`. This is what is deployed. Its code is identical to `acbd6a0`; the last commit only adds `docs/arc-kit/`.
> 2. **The design diagrams** ARC-001-DIAG-001 to DIAG-009, which act as the HLD/DLD equivalent.
> 3. **The codebase audit** ARC-001-CDAU-001.
>
> All 8 ADRs are **retrospective**: they were written from the code. ADR-IMPL therefore confirms that the code has not drifted since the ADRs were written, **not** that an independent design was implemented.

**Overall Conformance Score**: **56%** (5 PASS of 9 assessed checks)

| Result | Count | Description |
|--------|-------|-------------|
| ✅ PASS | 5 | Check satisfied with evidence |
| ❌ FAIL | 4 | Conformance violation detected |
| ⚪ NOT ASSESSED | 3 | Insufficient artifacts to check |

**Overall Recommendation**: **NON-CONFORMANT**. There is one RED finding, and the score is below 80%.

**Deviation Tiers** (FAIL findings only):

| Tier | Count | Response |
|------|-------|----------|
| 🔴 RED — Escalate | 1 | Blocks the next gate — escalate to the architecture owner (Cadre AI engineering lead) |
| 🟡 YELLOW — Negotiate | 3 | Remediate within 30 days or agree a fallback |
| 🟢 GREEN — Acceptable | 0 | — |

**Critical Conformance Gaps**:

1. **PRIN-DESIGN**: The implementation violates 8 of 23 principles, including **Principle 13, Security by Design (NON-NEGOTIABLE)**, and Principle 14, Validate Every Input at the Boundary. The main root cause is that client-supplied history is trusted for size and content. This is audit finding F-001 (CRITICAL), with F-002, F-004 and F-005 also contributing. Principle 13 permits **no exceptions**, only compensating controls, and none are recorded.

**Action Required**: Escalate to the architecture owner before the system is used beyond the assessment demo. Decide audit blocking decision **C-1** and fix F-001, F-002 and F-005 (Section "Findings & Remediation Plan").

---

## Conformance Scorecard

| ID | Conformance Check | Severity | Result | Tier | Evidence | Finding Summary |
|----|-------------------|----------|--------|------|----------|-----------------|
| ADR-IMPL | ADR Decision Implementation | HIGH | ✅ | — | 8 ADRs checked | All 8 decisions present in code at HEAD `2058578` (retrospective ADRs; see method note) |
| ADR-CONFL | Cross-ADR Consistency | HIGH | ✅ | — | 28 ADR pairs | No contradictions. ADR baselines differ (`d63c3ac` vs `acbd6a0`) but are reconciled in ADR-005 and ADR-006 §6.4 |
| ADR-SUPER | Superseded ADR Enforcement | MEDIUM | ⚪ | — | 0 superseded | No superseded ADRs exist |
| PRIN-DESIGN | Principles-to-Design Alignment | HIGH | ❌ | 🔴 | 23 principles | 15 satisfied, 8 violated (P-5, P-10, P-11, P-12, P-13, P-14, P-16, P-21) |
| COND-RESOLVE | Review Condition Resolution | HIGH | ⚪ | — | 0 review docs | No HLDR or DLDR exist. Audit blocking decisions C-1 to C-8 are listed for information: all 8 are open |
| EXCPT-EXPIRY | Exception Register Expiry | HIGH | ✅ | — | 3 exceptions | None of the 3 trigger-based expiries has fired |
| EXCPT-REMEDI | Exception Remediation Progress | MEDIUM | ❌ | 🟡 | 3 active | Plans exist in the ADRs, but none of the exceptions is approved or has a dated expiry. P-12's compensating control is the F-003 defect itself |
| DRIFT-TECH | Technology Stack Drift | MEDIUM | ❌ | 🟡 | 17 technologies | The design docs state a 3 s single-attempt webhook, but the code retries (1.7 s × 2). One build-time dependency (`next/font/google`) has no ADR |
| DRIFT-PATTERN | Architecture Pattern Drift | MEDIUM | ✅ | — | 7 patterns | Patterns are applied consistently. The deviations (per-instance limiter, webhook retry, second deploy path) are justified in ADRs |
| RULE-CUSTOM | Custom Constraint Rules | Variable | ⚪ | — | 0 rules | `.arckit/conformance-rules.md` does not exist |
| ATD-KNOWN | Known Technical Debt | LOW | ✅ | — | 24 items | Debt is catalogued in the ADR consequences and PRIN exceptions |
| ATD-UNTRACK | Untracked Technical Debt | MEDIUM | ❌ | 🟡 | 6 potential | Principle violations have no exceptions, design docs are stale, a config URL is duplicated in knowledge, an OFFICIAL-SENSITIVE audit is published, ADRs are missing from the repo, and there is no risk register |

---

## ADR Decision Conformance

### ADR Decision Implementation (ADR-IMPL) — ✅ PASS

Implementation evidence comes from the repository at HEAD `2058578`. The code in this commit is identical to `acbd6a0`.

| ADR | Title | Status | Decision | Implementation Evidence | Result |
|-----|-------|--------|----------|-------------------------|--------|
| ADR-001 | Use Next.js 16 App Router With a Single Streaming Route Handler on Vercel | Accepted (`decisions/ARC-001-ADR-001-v1.0.md:39, 364`) | Next.js 16 App Router, a single `POST /api/chat` on the Node.js runtime, Vercel Git integration | `package.json:19-20` (`next` 16.3.6, `react` 19.2.8); `app/api/chat/route.ts:18-19` (`runtime = "nodejs"`, `maxDuration = 30`), `:33` (`POST`); `next.config.ts:12` (`outputFileTracingIncludes`); `app/` contains only this route | ✅ |
| ADR-002 | Access Claude Haiku 4.5 Through OpenRouter… | Accepted (`ADR-002:39, 370`) | OpenRouter provider, Haiku 4.5, temperature 0.2, 600 tokens, ≤ 3 steps, cached prefix | `package.json:17-18`; `lib/config.ts:2, 4, 6, 11`; `route.ts:82-96` (`createOpenRouter`, `cacheControl`, `stopWhen: isStepCount`) | ✅ |
| ADR-003 | Ground Answers in a Curated Markdown Knowledge Base… | Accepted (`ADR-003:39, 381`) | 9 Markdown files loaded from disk and injected in full; no retrieval | `lib/knowledge.ts:16-27`; `lib/prompt.ts:7, 43` (`<knowledge>` block); 9 files in `knowledge/`; no vector or embedding dependency in `package.json` | ✅ |
| ADR-004 | Keep the Server Stateless… | Accepted (`ADR-004:39, 355`) | History held client-side, a 12-message window, nothing persisted | `components/Chat.tsx:21-30` (`slice(-maxHistoryMessages)`); `route.ts:63-65, 121-126`; `lib/config.ts:7`; no storage APIs or database client | ✅ |
| ADR-005 | Expose Exactly Two Typed Model Tools… | Accepted (`ADR-005:39, 385`) | `get_booking_link` (config URL) and `escalate_to_human` (zod schema) | `lib/tools.ts:9-24` (returns `{ ok: true, id }` at `:22`); `lib/escalations.ts:4-11` | ✅ |
| ADR-006 | Deliver Human Handoffs as a Best-Effort Chat-Platform Webhook… | Accepted (`ADR-006:39, 379`) | Log plus optional best-effort webhook, no queue or CRM | `lib/escalations.ts:84-103` (`recordEscalation`), `:97` (mask when a webhook exists); `lib/config.ts:20`. **At HEAD** the timeout is 1,700 ms with 1 retry (`:28-31, 57-82`), as documented in ADR-006 §6.4 | ✅ |
| ADR-007 | Enforce Ordered Request Guards… | Accepted (`ADR-007:39, 388`) | 11-step guard chain; 2,000-character, 256 KB and 10/min/IP limits; in-memory limiter | `route.ts:34-78`; `lib/config.ts:9-10, 15`; `lib/rate-limit.ts` (module-level `Map`) | ✅ |
| ADR-008 | Layered Quality Assurance… | Accepted (`ADR-008:39, 412`) | Vitest with the model mocked, opt-in evals, CI on push and PR, Git-integration auto-deploy | `.github/workflows/ci.yml:3-7, 9`; `vitest.config.ts`; `evals/cases.ts` (83 ids); README "Verification" (43 tests at HEAD) | ✅ |

**Observation, not a failure**: ADR-001 to ADR-004, ADR-007 and ADR-008 are baselined at `d63c3ac`. ADR-005 was verified at `acbd6a0`, and ADR-006 records the HEAD delta in §6.4. None of the decisions changed. When the ADRs are next revised, rebaseline all of them on one commit.

---

### Cross-ADR Consistency (ADR-CONFL) — ✅ PASS

✅ No contradictions were found between the 8 accepted ADRs (28 pairs checked). These pairs looked like conflicts, but on inspection they are consistent:

| Pair | Apparent tension | Why it is consistent |
|------|------------------|----------------------|
| ADR-002 vs ADR-006 (HEAD) | ADR-002 says "No automatic retry, to avoid double spend"; ADR-006 §6.4 records a webhook retry | They apply to different calls: ADR-002 covers the model call, ADR-006 the team webhook. The retry's duplicate risk is accepted in ADR-006 |
| ADR-004 vs ADR-006 | ADR-004 persists nothing; ADR-006 posts a transcript to a channel and a log | ADR-004 is about conversation state. ADR-006 is about handoff records, resolved by REQ Conflict C-2 (6 × 500 characters) |
| ADR-007 vs ADR-008 | ADR-007 lets origin-less callers through; ADR-008 relies on that for evals | Consistent. The combined risk (F-006) is recorded in both, under C-2 |
| ADR-003 vs ADR-005 | Which URLs the model may write | Both allow URLs from knowledge or tool results only (`lib/prompt.ts:14`) |
| ADR-001 vs ADR-004 / ADR-007 | "Stateless" vs a per-instance rate-limit map | ADR-004 and ADR-007 name the map as the only mutable per-instance state, with PRIN exception P-17 |

---

### Superseded ADR Enforcement (ADR-SUPER) — ⚪ NOT ASSESSED

| Superseded ADR | Superseded By | Design Residue Found | Result |
|----------------|---------------|---------------------|--------|
| — | — | — | ⚪ No ADR has status Superseded |

Future supersessions are expected when audit blocking decisions C-1, C-3 or C-7 are decided (option c of each supersedes ADR-004, ADR-006 or amends ADR-008). Re-run this check then.

---

## Design-Principles Alignment

### Principles-to-Design Alignment (PRIN-DESIGN) — ❌ FAIL 🔴

Each principle's **MUST** statements are checked as a binary constraint against the implementation. The principle line references are `projects/000-global/ARC-000-PRIN-v1.0.md`.

| # | Principle | Constraint Check | Implementation Evidence | Result |
|---|-----------|-----------------|-------------------------|--------|
| 1 | Focused Scope, Explicitly Bounded (`:52`) | Written IN/OUT scope and acceptance scenarios | `plan.md:10-20` (Scope, OUT); `CLAUDE.md` six acceptance scenarios | ✅ |
| 2 | Human Handoff Over Guessing (`:88`) | Hand off through a defined channel, with enough context | `lib/tools.ts:16-24`; `route.ts:132-137` (6 × 500 transcript); `lib/prompt.ts` Escalation rules | ✅ (delivery gap covered by the P-12 exception) |
| 3 | Route Intent to the Right Conversation (`:124`) | The booking path comes from a central source, never composed by the model | `lib/tools.ts:9-14` → `CONFIG.urls.booking` | ✅ |
| 4 | Grounded Answers From a Single Curated Source (`:159`) | Facts only from curated knowledge; gaps marked | `lib/prompt.ts:7`; `[NOT PUBLISHED]` in all 9 files; 15 `ground-`/`gap-` evals | ✅ |
| 5 | Provenance for Every Fact (`:195`) | Adding an unsourced risky fact **MUST be blocked automatically** | `.claude/hooks/guard-knowledge.mjs:10-16` checks only `## Facts`; `knowledge/services.md` has 7 other sections (F-013) | ❌ |
| 6 | Separation of Behaviour, Knowledge and Configuration (`:230`) | Behaviour, knowledge and configuration each live in their own place | `lib/prompt.ts` (rules, no URLs — unit-tested), `lib/config.ts`, `knowledge/` | ✅ |
| 7 | Deterministic Actions Through Typed Tools (`:264`) | Consequential outputs come from typed actions | `lib/tools.ts` (zod schemas, config URL) | ✅ (render-time URL allowlist missing, F-014, LOW) |
| 8 | Right-Sized, Replaceable Models (`:299`) | Documented, configurable, eval-verified model | `lib/config.ts:2, 4`; ADR-002; 83/83 evals | ✅ |
| 9 | Simplest Knowledge-Access Strategy (`:334`) | Full context while the corpus is small; threshold written down | `lib/knowledge.ts`; `plan.md` "Scaling path" (~50k trigger) | ✅ |
| 10 | Behavioural Evaluation as a **Release Gate** (`:367`) | The eval suite gates releases (title; also the P-9 statement "stays the release gate") | `ci.yml:9` (evals only on `workflow_dispatch` with `run_evals`); the Git integration deploys regardless | ❌ |
| 11 | Privacy by Design and Data Minimisation (`:405`) | "Any retained personal data **MUST have a defined purpose and retention period**" | No retention period in `plan.md`, `README.md`, code or config (F-010; REQ DR-005 ❌). The PRIN exception (`:829`) covers only the logging of the unmasked email | ❌ |
| 12 | Single System of Record per Data Domain (`:442`) | One home per domain. The listed common violation is "Copying a link from configuration into knowledge prose" | `knowledge/pricing.md:18` and `knowledge/booking.md:9` hard-code `https://cadreai.com/contact`, which is also `CONFIG.urls.booking` (`lib/config.ts`). If `BOOKING_URL` is overridden, the two disagree | ❌ |
| 13 | **Security by Design (NON-NEGOTIABLE)** (`:475`) | "**MUST treat every client-supplied input, including the conversation history, as untrusted**" | `route.ts:72` caps only user turns (F-001, CRITICAL); `route.ts:128-130` measures text parts only (F-002); `lib/escalations.ts` `webhookPayload` posts client text unsanitised (F-004). No compensating controls recorded, and **exceptions are not permitted** | ❌ |
| 14 | Validate Every Input at the Boundary (`:530`) | "**MUST validate size, shape and content before doing any costly work**" | `route.ts:50` trusts the declared `Content-Length`; absent or `NaN` passes (F-005). Assistant-turn and non-text sizes are unvalidated (F-001, F-002) | ❌ |
| 15 | Loose Coupling Through Standard, Minimal Interfaces (`:561`) | Small documented interfaces; receiver-agnostic payload | One endpoint; `{ text, content, escalation }` | ✅ |
| 16 | Cost as a First-Class Architectural Constraint (`:586`) | "**MUST enforce hard, configurable limits on every cost driver: … context size …**" | The context limit counts messages (12), not size. Assistant turns can fill 256 KB, about 60–100k tokens (F-001). Request rate is per instance (P-17 exception) | ❌ |
| 17 | Stateless Compute With an Explicit Scaling Path (`:617`) | Per-instance state documented, with a successor and a trigger | `lib/rate-limit.ts` comment; `plan.md:111+`; PRIN exception (`:829`) | ✅ (under exception) |
| 18 | Observability of Every Model Interaction (`:642`) | One structured record per interaction; failures logged with the id | `route.ts:98-113` (`[chat]` line); `lib/escalations.ts` failure logs with the id | ✅ (F-009 raw-error PII is inferred, not verified) |
| 19 | Accessible, Resilient User Experience (`:668`) | Mobile, touch targets, error and retry, distinct action cards | `plan.md` phase 5 (390×844, 44 px targets); `Chat.tsx` error and Retry, `LinkCard`, `Notice` | ✅ |
| 20 | AI-Augmented Development With Explicit Context and Guardrails (`:696`) | Version-controlled agent context; critical rules enforced mechanically | `CLAUDE.md`; `.claude/hooks/*`; `.claude/settings.json` deny rules | ✅ (F-020 gaps, LOW) |
| 21 | Automated Verification Before Every Change (`:724`) | "Every change **MUST pass** lint, types, tests and build **before it is merged**" | `ci.yml` runs on push, but nothing requires it. Vercel deploys `main` independently. 69 commits, 0 merges (F-007) | ❌ |
| 22 | Continuous Delivery in Small, Traceable Steps (`:749`) | Early, continuous deploy from main; conventional commits | Vercel Git integration; conventional prefixes across the history | ✅ |
| 23 | Transparent Decisions and Honest Limitations (`:775`) | Decisions recorded with revisit triggers; limitations documented | `plan.md:78+` (every row has "Revisit when"); `plan.md:111+`; ADR-001 to ADR-008 | ✅ |

**Result**: 15 ✅, 8 ❌. The check fails with a **HIGH** severity principle violated (P-13, NON-NEGOTIABLE).

**Principle Violations**:

**Violation 1**: Principle 13, "Security by Design (NON-NEGOTIABLE)"

- **Principle Statement**: "All systems MUST treat every client-supplied input, including the conversation history, as untrusted…"
- **Implementation Violation**: there are three separate points.
  - `app/api/chat/route.ts:72` checks the length only when `m.role === "user"`.
  - `:128-130` counts only `text` parts.
  - `lib/escalations.ts` `webhookPayload` interpolates `name`, `question` and transcript turns (including forged "assistant" turns) into staff-channel markup without sanitising them.
- **Impact**:
  - One anonymous request can cost roughly 20–60× a normal turn and exhaust the key's credit in about 25–80 requests (CDAU F-001).
  - Staff can be targeted with mass mentions or fabricated statements (CDAU F-004).
- **Resolution**: Change the design. P-13 permits no exceptions, so a documented compensating control is only an interim measure. Decide CDAU C-1 and C-4 and apply the ADR-004 and ADR-006 mitigations.

**Violation 2**: Principle 14, "Validate Every Input at the Boundary"

- **Implementation Violation**:
  - `route.ts:50`: `Number(req.headers.get("content-length")) > CONFIG.limits.maxBodyBytes` is false when the header is absent or non-numeric, so `req.json()` reads the body up to the platform limit (F-005).
  - The per-message cap is also role-limited (F-001 / F-002).
- **Impact**: Large bodies are parsed before any costly-work guard applies to them.
- **Resolution**: Enforce the cap on the bytes actually read, reject a missing or invalid `Content-Length`, and cap every turn (ADR-007 §7.2).

**Violation 3**: Principle 16, "Cost as a First-Class Architectural Constraint"

- **Implementation Violation**: The context-size limit is a message count (`lib/config.ts:7`, `route.ts:122-125`), not a size budget, so it doesn't bound tokens (F-001).
- **Resolution**: Add a total-character (or token) budget across the trimmed window.

**Violation 4**: Principle 21, "Automated Verification Before Every Change"

- **Implementation Violation**: `.github/workflows/ci.yml` has no deploy step and no required-check linkage. Vercel promotes every push to `main` whatever the CI result. There is no merge step at all (0 merge commits).
- **Resolution**: Decide CDAU C-7. Either add deployment protection that requires the `verify` check, or deploy from CI (ADR-008 §7.2).

**Violation 5**: Principle 10, "Behavioural Evaluation as a Release Gate"

- **Implementation Violation**: The suite exists and meets the statement's three MUSTs (version-controlled, runs against a real deployment, defects become cases, results are read). It gates nothing, though: `ci.yml:9` runs it only on manual dispatch. This contradicts the principle's title and the P-9 statement ("behavioural evaluation stays the release gate").
- **Resolution**: Run the affected eval prefixes on a preview deployment before promoting prompt, knowledge or model changes (C-7 option c), or record a PRIN exception with an expiry.

**Violation 6**: Principle 11, "Privacy by Design and Data Minimisation"

- **Implementation Violation**: No retention period is defined for `[escalation]` logs, platform logs or handoff messages in the team channel (F-010, DR-005 ❌).
- **Resolution**: Define retention in the DPIA (`/arckit:dpia`) and configure it on the platform and the channel (C-5).

**Violation 7**: Principle 12, "Single System of Record per Data Domain"

- **Implementation Violation**: The configured booking link is duplicated as prose in `knowledge/pricing.md:18` and `knowledge/booking.md:9`. This is exactly the principle's listed common violation.
- **Impact**: Low today, because both values are `https://cadreai.com/contact`. If `BOOKING_URL` is changed, the bot would give two different booking paths.
- **Resolution**: Replace the literal with "use the booking link" guidance so the model calls `get_booking_link`, or add a unit test that asserts knowledge and config agree.

**Violation 8**: Principle 5, "Provenance for Every Fact"

- **Implementation Violation**: `guard-knowledge.mjs:10-16` inspects only `## Facts` sections, so an unsourced figure added to `services.md` topic sections or to `company.md` "Getting started" would not be blocked (F-013).
- **Resolution**: Make the guard check every bullet, or restructure those files under `## Facts`.

---

## Review Condition & Exception Tracker

### Review Condition Resolution (COND-RESOLVE) — ⚪ NOT ASSESSED

No HLD or DLD review (HLDR or DLDR) exists in `projects/001-cadre-chatbot/reviews/`, which is empty.

**For information**: the codebase audit lists 8 **blocking decisions** that behave like review conditions. None is resolved.

| Source | Condition | Status | Resolution Evidence |
|--------|-----------|--------|---------------------|
| CDAU C-1 (`audits/ARC-001-CDAU-001-v1.0.md:362`) | Trust boundary for client-held history | UNRESOLVED | Recorded in ADR-004 §7.2 as blocking; no ADR yet |
| CDAU C-2 (`:369`) | Access and abuse-control model | UNRESOLVED | ADR-007 §7.2; de facto option (d) |
| CDAU C-3 (`:376`) | Handoff delivery guarantee | UNRESOLVED (partially mitigated) | ADR-006 §6.4: a retry at HEAD, confirmation unchanged |
| CDAU C-4 (`:383`) | Sanitising staff notifications | UNRESOLVED | ADR-005 and ADR-006 §7.2 |
| CDAU C-5 (`:390`) | Logging, PII, retention | UNRESOLVED | ADR-002 and ADR-006 §7.2 |
| CDAU C-6 (`:397`) | Inference provider routing and data | UNRESOLVED | ADR-002 §7.2 |
| CDAU C-7 (`:404`) | Release gating and environments | UNRESOLVED | ADR-008 §7.2 |
| CDAU C-8 (`:411`) | Dependency and CI supply chain | UNRESOLVED | ADR-008 §7.2 |

---

### Exception Register Expiry (EXCPT-EXPIRY) — ✅ PASS

Source: `projects/000-global/ARC-000-PRIN-v1.0.md:829` ("Current recorded exceptions (Project 001)").

| Exception ID | Principle/Rule | Approved Date | Expiry Date / Trigger | Status |
|--------------|---------------|---------------|-----------------------|--------|
| EXC-P11 (unnumbered in source) | 11 Privacy: full email in logs when no webhook is configured | Not approved (PRIN is DRAFT; approver PENDING) | Trigger: "Before production use beyond demo" | ACTIVE: trigger not reached (still demo); compensating control in place (Discord webhook configured and confirmed on 2026-09-28) |
| EXC-P12 | 12 System of Record: log is the fallback for failed handoffs | Not approved | Trigger: "When a CRM or queue is introduced" | ACTIVE: trigger not reached |
| EXC-P17 | 17 Stateless: per-instance rate limit | Not approved | Trigger: "Real traffic → shared-state limiter" | ACTIVE: trigger not reached |

None of the three exceptions has expired: none of their triggers has occurred. Using event triggers instead of calendar dates is itself a process gap, covered under EXCPT-REMEDI.

---

### Exception Remediation Progress (EXCPT-REMEDI) — ❌ FAIL 🟡

| Exception ID | Remediation Plan | Progress Evidence | Days to Expiry | Result |
|--------------|-----------------|-------------------|----------------|--------|
| EXC-P11 | EXISTS: ADR-006 §7.2 (mask unconditionally, mandatory webhook in production), decision C-5 | Compensating control active; no code change | n/a (trigger-based) | ❌ Not approved, no date |
| EXC-P12 | EXISTS: ADR-006 §7.2 (C-3 options a, b, c) | Partial: webhook retry at HEAD (`lib/escalations.ts:57-82`) cuts loss from transient failures | n/a | ❌ Compensating control is invalid (see below) |
| EXC-P17 | EXISTS: ADR-007 Option 2 (Upstash Redis), decision C-2 | None | n/a | ❌ Not approved, no date |

**Exceptions Without Adequate Remediation Governance**:

- **All three** fail the PRIN exception process (`ARC-000-PRIN-v1.0.md:800+`), which requires:
  - an **expiration date** ("exceptions are time-bound");
  - **approval** by the Cadre AI engineering lead;
  - a record in the decision log or an ADR.

  None has a date or an approval. The ADRs describe the remediation, but do not record the exceptions.
- **EXC-P12's compensating control reads "Failure logged with escalation id; user still confirmed".** Telling the user that the handoff succeeded when it failed is not a control; it is audit defect F-003.
- **Action**: Record each exception in an ADR (or in the `plan.md` decisions log) with:
  - a calendar expiry (recommended: the day before any use beyond the demo, and no later than 2026-10-31);
  - the engineering lead's approval;
  - for P-12, a real compensating control: an alert on `[escalation] webhook failed/error`, plus a fallback contact shown to the user.

---

## Architecture Drift Analysis

### Technology Stack Drift (DRIFT-TECH) — ❌ FAIL 🟡

**Decided Technologies** (from ADRs):

| Technology | ADR Source | Category | Implementation / Design Reference | Status |
|-----------|-----------|----------|-----------------------------------|--------|
| Next.js 16.3.6 (App Router) | ADR-001 | Framework | `package.json:19` | ✅ Aligned |
| React 19.2.8 | ADR-001 | Framework | `package.json:20` | ✅ Aligned |
| TypeScript (strict), Tailwind 4 | ADR-001 | Language / UI | `tsconfig.json`, `package.json` devDependencies | ✅ Aligned |
| Vercel (Git integration, Node runtime) | ADR-001, ADR-008 | Cloud | `route.ts:18-19`; README live URL | ✅ Aligned |
| OpenRouter via `@openrouter/ai-sdk-provider` 3.1.0 | ADR-002 | Integration | `package.json:17` | ✅ Aligned |
| AI SDK `ai` 7 / `@ai-sdk/react` 4 | ADR-002, ADR-004 | Library | `package.json:16, 18` | ✅ Aligned |
| Claude Haiku 4.5 | ADR-002 | Model | `lib/config.ts:2` | ✅ Aligned |
| Markdown knowledge (no vector DB) | ADR-003 | Data | `knowledge/*.md`; no vector dependency | ✅ Aligned |
| zod 4 | ADR-005, ADR-007 | Library | `lib/escalations.ts:4`, `route.ts:21` | ✅ Aligned |
| Discord/Slack incoming webhook | ADR-006 | Integration | `lib/config.ts:20` | ✅ Aligned (code) / ❌ **Drifted** (design docs, see below) |
| In-memory `Map` rate limiter | ADR-007 | Pattern/tool | `lib/rate-limit.ts` | ✅ Aligned |
| Vitest 5 | ADR-008 | Tool | `vitest.config.ts` | ✅ Aligned |
| GitHub Actions | ADR-008 | Tool | `.github/workflows/ci.yml` | ✅ Aligned |
| ESLint 9 | ADR-008 (lint step) | Tool | `eslint.config.mjs` | ✅ Aligned |
| Claude Code hooks and subagents | ADR-008 | Dev tooling | `.claude/` | ✅ Aligned |

**Undocumented Technologies** (found in the implementation but in no ADR):

| Technology | Found In | Category | Risk |
|-----------|----------|----------|------|
| `next/font/google` (Geist, Geist Mono) | `app/layout.tsx:2, 5, 10` | Build-time external dependency | Low. Fonts are fetched from Google at build time and self-hosted by Next.js. A build depends on an external service, and this has no governance record |

**Technology Drift Findings**:

- **Webhook delivery parameters: design says X, implementation uses Y.** Several design and requirement documents still state a single attempt with a 3 s timeout:
  - `diagrams/ARC-001-DIAG-003-v1.0.md:84, 152, 225, 273` (including "3 s timeout; no re[try]")
  - `DIAG-001:217`, `DIAG-002:69, 219, 272`
  - `DIAG-004:141` (`WEBHOOK_TIMEOUT_MS = 3000`)
  - `DIAG-005:67, 138, 167, 197`, `DIAG-006:75`
  - `ARC-001-REQ-v1.0.md` INT-002 ("3-second timeout … ❌ No retry queue")

  The implementation at HEAD uses **1,700 ms per attempt with one retry** on a network error, timeout, 429 or 5xx (`lib/escalations.ts:28-31, 57-82`). ADR-006 §6.4 records the change, but the design diagrams and requirements were not updated. The same stale copies were **published today** in the app repository under `docs/arc-kit/` (commit `2058578`).
- `next/font/google` is used with no ADR (low risk).

**Drift Score**: 15 of 17 technology or parameter items aligned (88%).

---

### Architecture Pattern Drift (DRIFT-PATTERN) — ✅ PASS

**Decided Patterns** (from ADRs and diagrams):

| Pattern | Source | Components Using | Components Deviating | Status |
|---------|--------|-----------------|---------------------|--------|
| Single stateless streaming endpoint | ADR-001, ADR-004; DIAG-002 | `app/api/chat/route.ts` | Rate-limit map (justified: ADR-007, PRIN exception P-17) | ✅ |
| Validate-before-spend guard chain | ADR-007; DIAG-009 | `route.ts:34-78` | None | ✅ |
| Full-context knowledge injection | ADR-003; DIAG-003 | `lib/knowledge.ts`, `lib/prompt.ts` | None | ✅ |
| Typed tools for consequential outputs | ADR-005; DIAG-004 | `lib/tools.ts` | None | ✅ |
| Best-effort, never-throw notification | ADR-006; DIAG-005/008 | `lib/escalations.ts` | Retry added at HEAD (justified in ADR-006 §6.4) | ✅ |
| Client-held conversation state | ADR-004; DIAG-007/008 | `components/Chat.tsx` | None | ✅ |
| Continuous deploy from `main` | ADR-008; DIAG-006 | Vercel Git integration | A second path, `/ship` running `npx vercel --prod` (recorded in ADR-008) | ✅ |

Every deviation is justified in an ADR. The staleness of the design documents is reported under DRIFT-TECH and ATD-UNTRACK.

---

## Custom Constraint Rules

### Custom Constraint Rules (RULE-CUSTOM) — ⚪ NOT ASSESSED

⚪ No custom constraint rules are defined: `.arckit/conformance-rules.md` does not exist in `/home/felipe/cadre-chatbot/`. Candidate rules taken from this assessment:

- "Every request-size check MUST apply to bytes read, not declared headers."
- "Every conversation turn MUST be length-capped regardless of role."
- "User-supplied text MUST NOT be posted to staff channels without mention and link neutralisation."
- "Production MUST NOT be promoted unless the CI `verify` job has passed."

---

## Architecture Technical Debt Register

### Known Technical Debt (ATD-KNOWN) — ✅ PASS

Catalogued from the ADR §7.2 "Negative Consequences" sections and the PRIN exceptions. All items are acknowledged in at least one governed artefact.

| ATD ID | Description | Category | Source | Severity | Owner | Target Resolution |
|--------|-------------|----------|--------|----------|-------|-------------------|
| ATD-001 | Assistant turns and history size not capped (F-001) | DEFERRED-FIX | ADR-004:397+, ADR-007:430+ | HIGH | AI Engineering | Before use beyond demo (C-1) |
| ATD-002 | Non-text UI parts not measured (F-002) | DEFERRED-FIX | ADR-004:397+ | HIGH | AI Engineering | With ATD-001 |
| ATD-003 | Handoff confirmed regardless of delivery (F-003) | ACCEPTED-RISK | ADR-005:427+, ADR-006:435+ | HIGH | AI Engineering | C-3 |
| ATD-004 | Client text unsanitised in staff channel; no escalation cap (F-004) | DEFERRED-FIX | ADR-005, ADR-006 §7.2 | HIGH | AI Engineering | C-4 |
| ATD-005 | Body cap trusts `Content-Length` (F-005) | DEFERRED-FIX | ADR-007:430+ | MEDIUM | AI Engineering | 30 days |
| ATD-006 | Per-instance rate limit; origin-less callers pass (F-006) | EXCEPTION (P-17) | ADR-007 §7.2; PRIN:829 | MEDIUM | AI Engineering | C-2 |
| ATD-007 | Deploy not gated by CI (F-007) | ACCEPTED-RISK | ADR-008:459+ | MEDIUM | AI Engineering | C-7 |
| ATD-008 | No dependency scanning; mutable action tags; no `permissions:` (F-008) | DEFERRED-FIX | ADR-008 §7.2 | MEDIUM | AI Engineering | C-8 |
| ATD-009 | Raw provider errors logged (F-009) | DEFERRED-FIX | ADR-002:417+ | MEDIUM | AI Engineering | C-5 |
| ATD-010 | No retention; full email logged without webhook (F-010) | EXCEPTION (P-11, partial) | ADR-006 §7.2; PRIN:829 | MEDIUM | AI Engineering / Privacy | C-5, DPIA |
| ATD-011 | Inference routing and data policy not pinned (F-011) | DEFERRED-FIX | ADR-002 §7.2 | MEDIUM | AI Engineering / Privacy | C-6 |
| ATD-012 | No health endpoint, alerts or SLOs (F-012) | SCOPE-REDUCTION | ADR-001, ADR-006, ADR-008 | MEDIUM | AI Engineering | Before production |
| ATD-013 | Provenance guard scope limited to `## Facts` (F-013) | DEFERRED-FIX | ADR-003:427+ | LOW | AI Engineering | 30 days |
| ATD-014 | URLs linkified without allowlist (F-014) | DEFERRED-FIX | ADR-003, ADR-005 | LOW | AI Engineering | Next quarter |
| ATD-015 | No abort signal on generation (F-015) | DEFERRED-FIX | ADR-001, ADR-002 | LOW | AI Engineering | 30 days (one line) |
| ATD-016 | Knowledge-load failure breaks JSON error contract (F-016) | DEFERRED-FIX | ADR-001, ADR-003 | LOW | AI Engineering | 30 days |
| ATD-017 | No CSP or HSTS in code; frame denial blocks embedding (F-017) | DEFERRED-FIX | ADR-001 §7.2 | LOW | AI Engineering | Before embedding |
| ATD-018 | Hosting configuration only in the platform UI; no `.env.example`, `engines` or licence (F-018) | DEFERRED-FIX | ADR-001 §7.2 | LOW | AI Engineering | Handover |
| ATD-019 | Evals hit production and create real handoffs (F-019) | WORKAROUND | ADR-005, ADR-006, ADR-008 | LOW | Builder | C-7 |
| ATD-020 | Documentation drift in eval cost and guard claims (F-021) | DEFERRED-FIX | ADR-003, ADR-007, ADR-008 | LOW | Builder | 30 days |
| ATD-021 | Spoofable `X-Forwarded-For` rate-limit key (F-022) | DEFERRED-FIX | ADR-007 §7.2 | LOW | AI Engineering | C-2 |
| ATD-022 | Knowledge snapshot with no refresh schedule (DR-006) | SCOPE-REDUCTION | ADR-003 §7.2 | MEDIUM | AI Engineering / Marketing | Monthly refresh |
| ATD-023 | Retry can post duplicate handoffs (HEAD) | ACCEPTED-RISK | ADR-006 §6.4 | LOW | Inbound | Accepted |
| ATD-024 | Evals are regex-based; no LLM judge | SCOPE-REDUCTION | ADR-008 Option 4; `plan.md` "Known limitations" | MEDIUM | AI Engineering | Next quarter |

**ATD Category Summary**:

| Category | Count | Description |
|----------|-------|-------------|
| DEFERRED-FIX | 15 | Known deficiency deferred to a later phase |
| ACCEPTED-RISK | 3 | Risk consciously accepted as a trade-off |
| WORKAROUND | 1 | Temporary solution deviating from the intended pattern |
| DEPRECATED-PATTERN | 0 | Superseded pattern not yet migrated |
| SCOPE-REDUCTION | 3 | Quality or feature removed for timeline or budget |
| EXCEPTION | 2 | Principle exception (P-17 in full; P-11 in part) |
| **Total Known ATD** | **24** | |

---

### Untracked Technical Debt (ATD-UNTRACK) — ❌ FAIL 🟡

| # | Potential Debt | Found At | Why Suspected | Recommended Action |
|---|---------------|----------|---------------|-------------------|
| 1 | Principle violations with no exception or compensating control on record (P-5, P-10, P-11 retention, P-12 URL duplication, P-13, P-14, P-16, P-21) | PRIN:829 lists only P-11, P-12 and P-17 | The ADRs record the defects, but the PRIN exception process is not followed. P-13 needs compensating controls, because exceptions are not allowed | Record exceptions (P-5, P-10, P-11 retention, P-12 URL, P-14, P-16, P-21) or compensating controls (P-13) with owners and dates |
| 2 | Design and requirements documents stale against the implementation (webhook 3 s, no retry) | DIAG-001, 002, 003, 004, 005, 006; REQ INT-002 (see DRIFT-TECH) | The implementation changed on 2026-09-28 (`5980503`, `414773c`); only ADR-006 was updated | Revise the DIAG set and REQ to v1.1; add a "rebaseline docs" step to `/ship` |
| 3 | Booking URL duplicated between configuration and knowledge prose | `knowledge/pricing.md:18`, `knowledge/booking.md:9` vs `lib/config.ts` (`urls.booking`) | Matches P-12's listed common violation; not in any ADR | Remove the literal or test for consistency (see Violation 7) |
| 4 | **OFFICIAL-SENSITIVE codebase audit published in the application repository** | App repo `docs/arc-kit/audits/ARC-001-CDAU-001-v1.0.md:12` (Classification OFFICIAL-SENSITIVE), commit `2058578`, pushed to `origin/main` | The audit gives step-by-step detail of unfixed, exploitable issues (F-001 cost amplification with request counts, F-004, F-005, F-006). The repository is **PUBLIC** (verified with `gh repo view`, 2026-09-28), so this hands anyone a budget-drain recipe for a live, unfixed endpoint. No secret patterns were found in the pack | Decide immediately. Either remove the audit from the public repo (and history, if needed) until F-001, F-005 and F-006 are fixed, or confirm that the repository is private. Record the classification-handling decision |
| 5 | ADRs are not in the application repository | App repo `docs/arc-kit/` contains PRIN, REQ, STKE, CDAU and DIAG, but not `decisions/` | Two decision logs (`plan.md` and ADRs) can diverge; reviewers see the audit gaps but not the accepted trade-offs | Add ADR-001 to ADR-008 (and this CONF) to `docs/arc-kit/`, or link them |
| 6 | No risk register: about 45 risks across ADR §7.4 tables are unregistered | `decisions/*.md` §7.4; no `ARC-001-RISK` | Risks have owners and mitigations but no single register, scoring or review cadence | Run `/arckit:risk` |

**Action Required**: Review these items with the architecture owner. Item 4 is time-sensitive.

---

### ATD Metrics

| Metric | Value |
|--------|-------|
| Total Known ATD Items | 24 |
| Total Potential Untracked ATD | 6 |
| ATD with Remediation Plans | 24 of 24 (100%): each has a mitigation in its ADR §7.2 |
| ATD Approaching Deadline | 4: ATD-001, 002, 005, 015, which should be fixed before the challenge key expires (~2026-10-01) and before use beyond the demo |
| ATD Overdue | 0 (no dated deadlines exist; see EXCPT-REMEDI) |

No previous conformance assessment exists, so there is no trend comparison.

---

## Findings & Remediation Plan

### 🔴 RED — Escalate (Blocks Next Gate)

| # | Check | Finding | Impact | Alternative Approach | Escalation Path | Owner | Deadline |
|---|-------|---------|--------|---------------------|-----------------|-------|----------|
| 1 | PRIN-DESIGN | P-13 (NON-NEGOTIABLE) and P-14 violated: client history trusted for size and content; declared-size check (`route.ts:50, 72, 128-130`; `lib/escalations.ts` payload) | Budget exhaustion and outage of the live bot in minutes (F-001); staff-channel abuse (F-004); large-body parsing (F-005) | Keep client-held history but treat it as untrusted (CDAU C-1 option a): cap every turn, allowlist part types per role, total-character budget, bounded body reader, sanitised notifications. Estimated at under a day with tests | Cadre AI engineering lead (architecture owner, per PRIN exception process) | Solution Architect / Builder | 2026-09-30, before the challenge key expires (~2026-10-01) and before any use beyond the demo |

**Architecture risk**: P-13 is the only principle with no exception route. Until the fix ships, the only controls are the upstream credit limit and the per-instance rate limiter.

### 🟡 YELLOW — Negotiate (Remediate or Agree Fallback)

| # | Check | Finding | Impact | Remediation Steps | Fallback Position | Owner | Deadline |
|---|-------|---------|--------|-------------------|-------------------|-------|----------|
| 1 | EXCPT-REMEDI | The 3 PRIN exceptions have no approval or dated expiry; P-12's compensating control is the F-003 defect | Exceptions can't be enforced or reviewed; users are told handoffs succeeded when they didn't | Record the exceptions in an ADR with the engineering lead's approval and calendar expiries. Replace the P-12 control with an alert on webhook failure plus a fallback contact in the UI (C-3 option a) | Keep trigger-based expiries, but add a review date (2026-10-28) and the failure alert | Solution Architect / Builder | 2026-10-28 |
| 2 | DRIFT-TECH | Diagrams and REQ state a 3 s single-attempt webhook; code retries at 1.7 s × 2. `next/font/google` has no ADR | Readers, including reviewers reading `docs/arc-kit/`, get an inaccurate design | Revise DIAG-001 to 006 and REQ INT-002 / NFR-A-003 to v1.1; add a one-line note on `next/font` to ADR-001 | Add an "as of `d63c3ac`" banner to the affected diagrams and point to ADR-006 §6.4 | Solution Architect / Builder | 2026-10-05 |
| 3 | ATD-UNTRACK | 6 untracked items, including the OFFICIAL-SENSITIVE audit published in the app repo | Exposure of exploit detail; governance gaps | Item 4 first: remove or restrict the audit. Then record exceptions (item 1), add the ADRs to the repo (item 5), and create the risk register (item 6) | Downgrade the published audit to a summary without reproduction detail until the fixes ship | Solution Architect / Builder | Item 4: 2026-09-29; others 2026-10-28 |

### 🟢 GREEN — Acceptable (Document and Monitor)

No GREEN findings.

---

## Recommendations

### 🔴 RED — Immediate Actions (before next gate)

1. Decide **CDAU C-1** in a Proposed ADR and implement option (a): cap every turn, allowlist part types, add a total-character budget, and add unit tests and an eval for an oversized **assistant** turn and a `file` part. Owner: Solution Architect / Builder. Deadline: 2026-09-30.
2. Fix **F-005**: use a bounded body reader and reject a missing or invalid `Content-Length`, with tests. Owner: Solution Architect / Builder. Deadline: 2026-09-30.
3. Record a **P-13 compensating control** until the fixes ship: a low credit limit on the serving key, confirmed in the OpenRouter dashboard. Owner: Solution Architect / Builder. Deadline: 2026-09-29.

### 🟡 YELLOW — Short-Term Actions (within 30 days)

1. **Resolve the audit publication**: remove `docs/arc-kit/audits/` from the public repository or confirm the repository is private. Owner: Solution Architect / Builder. Deadline: 2026-09-29.
2. **Formalise the exceptions** (P-11, P-12, P-17, plus any new ones) with approval, calendar expiry and a valid P-12 control. Owner: Solution Architect / Builder. Deadline: 2026-10-28.
3. **Rebaseline the documents**: DIAG v1.1, REQ v1.1, ADR-006 v1.1 at HEAD, with all ADRs on one commit. Owner: Solution Architect / Builder. Deadline: 2026-10-05.
4. **Decide C-3 and C-4**: handoff confirmation semantics and notification sanitisation (F-003, F-004). Owner: AI Engineering. Deadline: 2026-10-28.
5. **Decide C-7**: gate production on the CI `verify` job and run evals on a preview deployment (P-10, P-21). Owner: AI Engineering. Deadline: 2026-10-28.
6. **Define retention** in a DPIA (`/arckit:dpia`) (P-11). Owner: AI Engineering / Privacy. Deadline: 2026-10-28.

### 🟢 GREEN — Monitoring Actions (next quarter)

1. Extend the knowledge guard to every bullet (P-5, F-013). Target: 2026-12-31.
2. Remove the booking-URL literal from knowledge, or add a consistency test (P-12). Target: 2026-12-31.
3. Add an allowlist of link domains in the chat UI (F-014). Target: 2026-12-31.

### Governance Recommendations

- Schedule the next conformance check **after the C-1 fix ships**, and again before any cadreai.com embedding or production traffic.
- Create `.arckit/conformance-rules.md` with the four candidate rules above.
- Create the risk register (`/arckit:risk`) and review the ATD register quarterly.
- Keep ADRs, diagrams and REQ on the same baseline commit, and update them in the same change as the code (P-23).
- Run `/arckit:principles-compliance` for RAG scoring and remediation depth on the 8 violated principles.

---

## Artifacts Reviewed

**Architecture Principles** (conformance authority):

- ✅ `projects/000-global/ARC-000-PRIN-v1.0.md`: 2026-09-27, 23 principles, 3 recorded exceptions

**Architecture Decision Records**:

- ✅ `projects/001-cadre-chatbot/decisions/ARC-001-ADR-001..008-v1.0.md`: 8 ADRs (8 Accepted, 0 Superseded, 0 Other)

**Design Documents**:

- ❌ `vendors/{vendor}/hld-v*.md`: not available (`vendors/` is empty)
- ❌ `vendors/{vendor}/dld-v*.md`: not available
- ✅ Substitute: `diagrams/ARC-001-DIAG-001..020` (C4 context, container, component and code; sequence, deployment, ER, state, flowchart; Archify renders)
- ✅ Substitute: the implemented code, repository `cadre-chatbot` at HEAD `2058578` (code identical to `acbd6a0`)

**Review Documents**:

- ❌ `reviews/ARC-*-HLDR-*.md`: not available
- ❌ `reviews/ARC-*-DLDR-*.md`: not available
- ✅ Substitute: `audits/ARC-001-CDAU-001-v1.0.md` (codebase audit; findings F-001 to F-022, blocking decisions C-1 to C-8)

**Other Artifacts**:

- ✅ `ARC-001-REQ-v1.0.md`: available
- ✅ `ARC-001-STKE-v1.0.md`: available
- ❌ `ARC-*-PRIN-COMP-*.md`: not available
- ❌ `ARC-*-TRAC-*.md`: not available
- ❌ `ARC-*-RISK-*.md`: not available
- ❌ `ARC-*-DEVOPS-*.md`: not available

**Custom Rules**:

- ❌ `.arckit/conformance-rules.md`: not available

**Assessment Limitations**:

- There is no independent HLD or DLD, and the ADRs are retrospective. ADR-IMPL and DRIFT-PATTERN therefore measure the stability of the decisions against the code, not whether a design was implemented faithfully.
- Hosting and branch-protection settings are not visible in the repository. F-007 remains *inferred* from the absence of CI–deploy linkage and of merges.
- No test, eval or application code was executed. All evidence is static.
- Repository visibility verified as PUBLIC (`gh repo view`, 2026-09-28).
- No previous CONF exists, so there is no trend.

---

## Appendix: Conformance Check Methodology

### Check Severity Levels

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **HIGH** | Critical conformance violation — architecture integrity at risk | Immediate remediation before the next gate |
| **MEDIUM** | Notable deviation — architecture drift detected | Remediation within 30 days or by the next gate |
| **LOW** | Informational — acknowledged debt being tracked | Monitor and review quarterly |

### ATD Categories

| Category | Description | Typical Source |
|----------|-------------|---------------|
| DEFERRED-FIX | Known deficiency deferred to a later phase | ADR consequences, review conditions |
| ACCEPTED-RISK | Risk consciously accepted as a trade-off | Risk register, ADR trade-offs |
| WORKAROUND | Temporary solution deviating from the intended pattern | DLD, DevOps strategy |
| DEPRECATED-PATTERN | Superseded pattern not yet migrated | Superseded ADRs |
| SCOPE-REDUCTION | Quality or feature removed for timeline or budget | Requirements changes, sprint reviews |
| EXCEPTION | Approved principle exception with expiry | Exception register, compliance assessments |

### Deviation Tiers

| Tier | Criteria | Required Response |
|------|----------|-------------------|
| 🔴 RED — Escalate | FAIL + HIGH severity | Explain the risk, provide an alternative approach, escalate to the architecture board or CTO |
| 🟡 YELLOW — Negotiate | FAIL + MEDIUM severity | Specific remediation steps and timeline, plus a fallback position if deferred |
| 🟢 GREEN — Acceptable | FAIL + LOW severity | Document the deviation rationale, set a review date, no blocking action |

### Conformance Scoring

- **CONFORMANT** (100%): All checks PASS or NOT ASSESSED
- **CONFORMANT WITH CONDITIONS** (>= 80%): No RED findings; YELLOW and GREEN findings have remediation plans
- **NON-CONFORMANT** (< 80%, or any RED finding): Critical gaps requiring immediate action

Score for this assessment: 5 PASS / (5 PASS + 4 FAIL) = **55.6%, rounded to 56%**. The 3 NOT ASSESSED checks are excluded from the denominator.

### Evidence Referencing Convention

Findings reference sources as `file:line`:

- **ArcKit artefacts**: paths are relative to `projects/001-cadre-chatbot/` (or `projects/000-global/` for PRIN).
- **Application code**: paths are relative to the `cadre-chatbot` repository root at HEAD `2058578`.

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| APP | cadre-chatbot repository at HEAD `2058578` | Implementation (design substitute) | github.com/johnfelipe/cadre-chatbot | Code, config, CI, tests, evals, `plan.md`, `CLAUDE.md`, `docs/arc-kit/` |
| CDAU | ARC-001-CDAU-001-v1.0.md | Codebase audit (review substitute) | 001-cadre-chatbot/audits/ | F-001 … F-022; C-1 … C-8 |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | No external-document passages quoted in this assessment |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | 001-cadre-chatbot/external/ | No conformance-relevant content beyond what the ADRs already cite |
| Next Steps  Tech Challenge  Cadre AI.txt | 001-cadre-chatbot/external/ | No conformance content (credential not reproduced) |
| README.md | 001-cadre-chatbot/external/ | Folder placeholder |

---

**Generated by**: ArcKit `/arckit:conformance` command
**Generated on**: 2026-09-28 GMT
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**Model**: Claude Opus 5.5 (claude-opus-5-5)
