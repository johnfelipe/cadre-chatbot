# Stakeholder Drivers & Goals Analysis: Cadre AI Support Chatbot

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:stakeholders`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-STKE-v1.0 |
| **Document Type** | Stakeholder Drivers & Goals Analysis |
| **Project** | Cadre AI Support Chatbot — cadre-chatbot (Project 001) |
| **Classification** | OFFICIAL |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-27 |
| **Last Modified** | 2026-09-27 |
| **Review Cycle** | Monthly |
| **Next Review Date** | 2026-10-27 |
| **Owner** | Jhon Felipe Urrego — Solution Architect, Cadre AI Support Chatbot |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | Cadre AI Engineering team; Cadre AI inbound/strategy team; take-home review panel |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-27 | ArcKit AI | Initial creation from `/arckit:stakeholders` command | PENDING | PENDING |

---

## Executive Summary

### Purpose

This document identifies the key stakeholders of the Cadre AI Support Chatbot, their underlying drivers (motivations, concerns, needs), how those drivers become goals, and the measurable outcomes that will satisfy them. It gives traceability from individual concerns to project success metrics.

The project has **two stakeholder layers** that must both be served:

1. **Product layer**: the people who would own, use and be affected by a support chatbot on Cadre AI's website, in production.
2. **Assessment layer**: the chatbot is being built as a Staff AI Engineer take-home challenge [NSTCCA-C1]. Cadre's review panel judges it on the deployed app, the architecture, the AI-assisted workflow, the code and the reasoning [CACTHC-C7].

Both layers want the same thing: a focused, trustworthy bot that can plausibly go into production. So the analysis treats the assessment panel as proxies for Cadre's future product owners.

### Key Findings

Every stakeholder converges on **trust over breadth**. Cadre leadership and the strategists need the bot never to misstate prices, clients or security posture to executives who buy on credibility. Prospects need fast, correct answers and a clear path to a human. The review panel explicitly rewards tight scope and honesty about trade-offs [CACTHC-C10][CACTHC-C12].

The main tensions are:
- **Conversion vs accuracy**: marketing wants to capture every lead, while grounding means refusing to guess.
- **Budget vs verification**: the $5 runtime budget [NSTCCA-C2] competes with paid evaluation runs and reviewer traffic.
- **Handoff context vs privacy**: the inbound team wants rich handoff context, while privacy calls for minimal data.

### Critical Success Factors

- **Zero ungrounded commercial claims**: no invented price, client, certification or URL in any answer. The acceptance scenarios and the grounding eval cases pass on the deployed URL.
- **Every conversation has an exit to a human**: booking or handoff is available on every path, and handoffs reach the team with enough context to act.
- **Live and affordable through the review**: the public URL stays up and within budget until the credential expires around 2026-10-01 [NSTCCA-C2].
- **Explainable decisions**: every scope cut and design choice is recorded with a rationale and a revisit trigger, so reviewers and future owners can follow it [CACTHC-C11].

### Stakeholder Alignment Score

**Overall Alignment**: HIGH

The drivers mostly reinforce each other. The same qualities that make the bot safe to put in front of PE-backed executives (grounding, handoff, bounded cost) are the qualities the review panel scores. The remaining conflicts are real but have documented resolutions (see Conflict Analysis). The largest open item: the product-layer stakeholders at Cadre have not been interviewed. Their drivers are inferred from the brief and Cadre's public materials and must be validated (see R-1).

---

## Stakeholder Identification

### Internal Stakeholders

| Stakeholder | Role/Department | Influence | Interest | Engagement Strategy |
|-------------|----------------|-----------|----------|---------------------|
| Cadre AI Executive Leadership (Founder/CEO, President) | Executive sponsor of the website and inbound funnel | HIGH | MEDIUM | Outcome summaries; approve brand-risk and go-live decisions |
| Client Strategy (Chief Strategy Officer, VP of Client Strategy, AI strategists) | Receives booked strategist calls | HIGH | HIGH | Co-define "qualified conversation"; review booking flow and handoff content |
| Inbound / Client Success (Chief Client Officer, inbound team) | Handles inquiries and escalations today; supports portal users | MEDIUM | HIGH | Day-to-day collaboration on handoff format, channel and knowledge gaps |
| AI Engineering (Chief AI Officer, AI engineers) | Future technical owner; sets engineering standards | HIGH | HIGH | Architecture reviews, code walkthroughs, evaluation results |
| Take-home Review Panel (AI Engineer interviewer, engineering reviewers) | Assesses the build against five weighted dimensions [CACTHC-C7] | HIGH | HIGH | Live URL, repo with history, 1-hour review with demo and architecture walkthrough [CACTHC-C8] |
| Talent / Recruiting team | Runs the hiring process, deadlines and submission [NSTCCA-C3] | MEDIUM | MEDIUM | Meet submission rules and timeline; single point of contact |
| Marketing / Website owner | Owns brand voice, website content and lead capture | MEDIUM | MEDIUM | Tone review; the source of knowledge refreshes |
| Finance (CFO) | Owns run costs (LLM, hosting) | MEDIUM | LOW | Cost-per-conversation reporting; spend ceiling |
| Privacy / Legal (privacy contact) | Personal-data handling on the website | HIGH | LOW | Data-flow summary, retention, DPIA before production |
| Solution Architect / Builder (candidate) | Designs, builds and operates the MVP | MEDIUM | HIGH | Owns this analysis; keeps `plan.md` and the decisions log current |

### External Stakeholders

| Stakeholder | Organization | Relationship | Influence | Interest |
|-------------|--------------|--------------|-----------|----------|
| Prospective clients (executives at lower-middle-market PE-backed companies, professional services and financial services firms) [CACTHC-C4] | Prospect companies | Primary users / beneficiaries | MEDIUM (collectively decide whether the bot helps revenue) | HIGH |
| Existing clients (portal users) | Cadre clients | Users needing account-specific help | MEDIUM | HIGH |
| PE operating partners / portfolio sponsors | PE firms | Influencers who refer portfolio companies | MEDIUM | LOW |
| General visitors (job seekers, researchers, partners, press) | Public | Incidental users | LOW | LOW |
| Model access gateway and model vendor | LLM providers | Supplier (runtime credential, model) [NSTCCA-C4] | MEDIUM | LOW |
| Hosting and team-chat platforms | Infrastructure providers | Supplier (deploy, handoff notifications) | LOW | LOW |
| Data-protection and consumer-protection regulators (for example the California privacy regulator for a San Diego company; other regimes depending on visitor location) | Regulators | Oversight | HIGH | LOW |
| Adversarial users (prompt injectors, scrapers, budget drainers) | — | Threat actors (not engaged; designed against) | MEDIUM (can take the bot offline by exhausting budget) | HIGH |

### UK Government Digital Roles (GovS 005)

Not applicable. Cadre AI is a private US consultancy and the chatbot is not a UK Government service. The equivalent accountabilities map as follows: service owner → Chief Client Officer (inbound experience); senior responsible owner → Executive Leadership; spend control → Finance.

### UK Government Security Roles (GovS 007)

Not applicable, for the same reason. Information-risk ownership (the SIRO-equivalent) sits with Privacy / Legal together with AI Engineering. Security gating follows Principle 13 of ARC-000-PRIN-v1.0.

### Stakeholder Power-Interest Grid

```text
                          INTEREST
              Low                         High
        ┌─────────────────────┬─────────────────────┐
        │                     │                     │
        │   KEEP SATISFIED    │   MANAGE CLOSELY    │
   High │                     │                     │
        │  • Privacy / Legal  │  • Review Panel     │
        │  • Regulators       │  • Client Strategy  │
        │  • Exec Leadership* │  • AI Engineering   │
 P      │                     │                     │
 O      ├─────────────────────┼─────────────────────┤
 W      │                     │                     │
 E      │      MONITOR        │    KEEP INFORMED    │
 R      │                     │                     │
   Low  │  • Finance          │  • Prospects        │
        │  • PE Partners      │  • Existing Clients │
        │  • LLM / Hosting    │  • Inbound / CS     │
        │    suppliers        │  • Marketing        │
        │  • General visitors │  • Talent team      │
        │                     │  • Builder          │
        └─────────────────────┴─────────────────────┘
  * Executive Leadership sits on the boundary (MEDIUM interest):
    interest rises sharply the moment a wrong answer reaches a prospect.
```

| Stakeholder | Power | Interest | Quadrant | Engagement Strategy |
|-------------|-------|----------|----------|---------------------|
| Take-home Review Panel | HIGH | HIGH | Manage Closely | Live URL + repo before the review; 1-hour walkthrough; honest limitations list |
| Client Strategy | HIGH | HIGH | Manage Closely | Agree qualification signals and booking path; monthly review of booked-call quality |
| AI Engineering | HIGH | HIGH | Manage Closely | Architecture and eval reviews at each phase; ADRs for key decisions |
| Executive Leadership | HIGH | MEDIUM | Keep Satisfied | Monthly one-page outcome summary; approval for go-live and brand-risk items |
| Privacy / Legal | HIGH | LOW | Keep Satisfied | DPIA and data-flow sign-off before production traffic |
| Regulators | HIGH | LOW | Keep Satisfied | Compliance by design (disclosure that it's an AI, privacy notice, minimisation) |
| Prospective clients | MEDIUM | HIGH | Keep Informed | In-product: starter questions, clear AI disclosure, fast handoff |
| Existing clients | MEDIUM | HIGH | Keep Informed | Portal-access handoff; support contact always visible |
| Inbound / Client Success | MEDIUM | HIGH | Keep Informed | Weekly handoff digest; co-own handoff format |
| Marketing / Website owner | MEDIUM | MEDIUM | Keep Informed | Tone review; knowledge refresh cadence |
| Talent / Recruiting | MEDIUM | MEDIUM | Keep Informed | Submission on time with required contents |
| Solution Architect / Builder | MEDIUM | HIGH | Keep Informed | Owns the living documents |
| Finance | MEDIUM | LOW | Monitor | Monthly cost-per-conversation line; alert on spend ceiling |
| PE operating partners | MEDIUM | LOW | Monitor | None directly; served through prospect experience |
| LLM / hosting / team-chat suppliers | MEDIUM / LOW | LOW | Monitor | Status pages; credit limits; failure logging |
| General visitors | LOW | LOW | Monitor | Polite scope boundary; public contact route |

**Quadrant Interpretation:**

- **Manage Closely** (High Power, High Interest): Key decision-makers requiring active engagement
- **Keep Satisfied** (High Power, Low Interest): Influential stakeholders needing periodic updates
- **Keep Informed** (Low Power, High Interest): Engaged stakeholders needing regular communication
- **Monitor** (Low Power, Low Interest): Minimal engagement required

---

## Stakeholder Drivers Analysis

### SD-1: Executive Leadership - Protect Credibility as an AI Authority

**Stakeholder**: Cadre AI Executive Leadership (Founder/CEO, President)

**Driver Category**: STRATEGIC / RISK

**Driver Statement**: Cadre sells AI confidence ("from AI confusion to AI confidence") [CACTHC-C5]. A Cadre-branded AI assistant that hallucinates a price, invents a client or leaks its instructions would publicly contradict the company's core promise.

**Context & Background**: The company has recently become an official service partner of a major model vendor and advises clients on LLM selection and data security. Its own website bot is a live demonstration of what it sells. Prospects are senior buyers (PE-backed executives) who judge competence quickly.

**Driver Intensity**: CRITICAL

**Enablers**:

- Answers restricted to a curated, sourced knowledge base with explicit "not published" gaps (ARC-000-PRIN Principles 4, 5)
- Adversarial evaluation (injection, false premises, leak attempts) before release

**Blockers**:

- Stale knowledge after website changes
- Pressure to "just answer" pricing questions

**Related Stakeholders**:

- Marketing (aligned on brand), Client Strategy (aligned), Prospects (aligned on accuracy)

---

### SD-2: Executive Leadership - Scale Inbound Without Adding Headcount

**Stakeholder**: Cadre AI Executive Leadership

**Driver Category**: FINANCIAL / OPERATIONAL

**Driver Statement**: The inbound team faces "a growing volume of inquiries" [CACTHC-C6]. Leadership wants to absorb that growth without hiring in proportion, so the team can "focus on high-value conversations" [CACTHC-C6].

**Context & Background**: Cadre's own positioning is about scaling with less overhead through AI. Handling repetitive questions (what Cadre does, industries, how to book, the Maturity Index) by automation is the internal version of what Cadre sells.

**Driver Intensity**: HIGH

**Enablers**:

- Coverage of the six common inquiry types from the brief [CACTHC-C2]
- Measurable deflection (conversations resolved without a human)

**Blockers**:

- No baseline for current inquiry volume or handling time
- Over-escalation, where the bot hands everything to humans

**Related Stakeholders**:

- Inbound / Client Success (benefits), Finance (cost lens)

---

### SD-3: Client Strategy - Receive More, Better-Qualified Strategist Calls

**Stakeholder**: Chief Strategy Officer, VP of Client Strategy, AI strategists

**Driver Category**: CUSTOMER / FINANCIAL

**Driver Statement**: Strategists' time is the scarcest sales resource. They want more strategy calls from genuinely interested prospects, arriving with context (industry, need), and fewer calls from people who only wanted basic information.

**Context & Background**: Every "Talk to an AI Strategist" and "Get started" button on the site leads to one contact form. Booking a strategist call is a required scenario [CACTHC-C2]. The strategy call is Cadre's primary conversion event.

**Driver Intensity**: HIGH

**Enablers**:

- Booking path offered at intent moments (pricing, fit, getting started) through a canonical link
- Basic questions answered before the call

**Blockers**:

- The booking path is a contact form, not a calendar, which adds friction and can't be attributed to the chatbot today
- No attribution of calls that came from the chatbot

**Related Stakeholders**:

- Marketing (lead capture), Prospects (want quick access to an expert)

---

### SD-4: Inbound / Client Success - Receive Actionable Handoffs, Not Noise

**Stakeholder**: Chief Client Officer and inbound team

**Driver Category**: OPERATIONAL / PERSONAL

**Driver Statement**: The team wants escalations that arrive with who, what, why and the conversation context, in a channel they already watch, so they can act without re-asking. They do not want spam, duplicates or promises made on their behalf.

**Context & Background**: The team is the human fallback for everything the bot can't answer, including existing clients' portal access [CACTHC-C2]. If the bot promises "the team will call you today", the team inherits a commitment it never made.

**Driver Intensity**: HIGH

**Enablers**:

- A structured handoff record (email, question, reason, last turns) sent to the team channel
- A no-promises rule (ARC-000-PRIN Principle 2)

**Blockers**:

- Silent notification failures (only in logs)
- No deduplication or spam filtering of handoffs

**Related Stakeholders**:

- Existing clients (need the handoff), Privacy / Legal (tension over context size)

---

### SD-5: AI Engineering - A Maintainable, Verifiable System That Meets Cadre's Bar

**Stakeholder**: Chief AI Officer and AI engineers (future owners)

**Driver Category**: OPERATIONAL / STRATEGIC

**Driver Statement**: Engineering wants a system it can own: clear separation of concerns, tests that run for free, behavioural evaluations that catch regressions, and a documented path to scale. It must not become a black box that only its author understands.

**Context & Background**: Cadre engineers "build production AI systems every day using Claude Code as their primary development tool" [CACTHC-C1], and they value engineers who can "direct and verify a system that codes with you" [CACTHC-C9].

**Driver Intensity**: HIGH

**Enablers**:

- Context files, subagents, hooks and a mistakes log that transfer knowledge (ARC-000-PRIN Principle 20)
- CI on every push; an eval suite with regression cases

**Blockers**:

- Regex-based evals miss subtle ungrounded claims
- Instance-local state (rate limiting) that doesn't scale

**Related Stakeholders**:

- Review Panel (same values), Builder

---

### SD-6: Review Panel - Evidence of Senior Judgment in AI-Augmented Delivery

**Stakeholder**: Take-home Review Panel (AI Engineer interviewer and reviewers)

**Driver Category**: STRATEGIC (hiring decision)

**Driver Statement**: The panel must decide whether the candidate can take an underspecified brief, scope it deliberately, build and ship it with AI tooling, and explain every decision. The weights are: AI-assisted workflow 30%, system design 25%, speed and scope 20%, code quality and verification 15%, communication 10% [CACTHC-C7].

**Context & Background**: A wrong hire at Staff level is expensive. The panel reviews the live URL, the zipped repo with `.git` history, `CLAUDE.md` and `plan.md` [CACTHC-C8][NSTCCA-C3], then runs a 1-hour live review.

**Driver Intensity**: CRITICAL

**Enablers**:

- Small, descriptive commits; explicit scope in `plan.md`; an honest limitations list [CACTHC-C11][CACTHC-C12]
- A demo script covering the six scenarios, grounding under pressure, an attack and a live escalation

**Blockers**:

- Deployment failure or exhausted budget on review day
- Docs that disagree with the code

**Related Stakeholders**:

- Talent team (process), AI Engineering (future colleagues)

---

### SD-7: Talent / Recruiting - A Complete, On-Time, Reviewable Submission

**Stakeholder**: Talent / Recruiting team

**Driver Category**: OPERATIONAL

**Driver Statement**: Recruiting needs the submission on time (day 4) with the required contents, so the day-5 review can go ahead as scheduled [NSTCCA-C1][NSTCCA-C3].

**Context & Background**: This is a structured process with fixed timing: 3 days to build, submission due on day 4, a live review on day 5. The submission is a lightweight zip that includes `.git` and excludes dependency folders [NSTCCA-C3].

**Driver Intensity**: MEDIUM

**Enablers**:

- A pre-submission checklist in `plan.md` phase 6

**Blockers**:

- Oversized zip; missing `.git`; late submission

**Related Stakeholders**:

- Review Panel

---

### SD-8: Finance - Predictable, Bounded Run Cost

**Stakeholder**: Finance (CFO)

**Driver Category**: FINANCIAL

**Driver Statement**: Usage-based LLM cost on a public URL must be bounded and predictable, with cost per conversation known before scaling.

**Context & Background**: The runtime credential has a **$5 budget and expires in 7 days** [NSTCCA-C2]. In production, cost would scale with traffic and could spike from abuse.

**Driver Intensity**: MEDIUM (HIGH during the assessment window)

**Enablers**:

- Hard caps on tokens, history, steps and rate; an upstream credit limit; prompt caching (measured at about $0.003 per tool turn)

**Blockers**:

- Per-instance rate limiting; scripted abuse from rotating IPs

**Related Stakeholders**:

- Adversarial users (conflict), AI Engineering (evaluation spend)

---

### SD-9: Privacy / Legal - Lawful, Minimal Handling of Personal Data

**Stakeholder**: Privacy / Legal

**Driver Category**: COMPLIANCE / RISK

**Driver Statement**: Any personal data the bot collects (names, emails, business context in free text) must be collected transparently, minimised, secured and kept only as long as needed. Users should know they are talking to an AI.

**Context & Background**: The website privacy policy states a retention practice for website personal data. Cadre advises clients on keeping data out of model training and off personal LLM accounts, so its own bot must follow the same standard [CACTHC-C3].

**Driver Intensity**: HIGH (before production), MEDIUM (demo)

**Enablers**:

- No persisted chat history; email collected only at handoff; masked logs

**Blockers**:

- Full email in logs when no webhook is configured
- Free-text transcripts may contain unexpected sensitive data
- Third-party processors (model gateway, chat platform) in the data path

**Related Stakeholders**:

- Inbound (tension over context), Regulators

---

### SD-10: Prospective Clients - Fast, Credible Answers and an Easy Path to an Expert

**Stakeholder**: Executives at PE-backed lower-middle-market companies, professional services and financial services firms [CACTHC-C4]

**Driver Category**: CUSTOMER

**Driver Statement**: Busy executives want to find out in under a minute whether Cadre works with their industry, what it does, what the AI Maturity Index is, and how it treats data security [CACTHC-C2]. Then they want to reach a human easily, without a sales ambush or vague marketing.

**Context & Background**: Their personal driver is reputational: bringing in the wrong AI partner is career risk, especially under PE scrutiny. They test credibility with pointed questions (pricing, security certifications) and notice evasive answers.

**Driver Intensity**: HIGH

**Enablers**:

- Concise answers (2–5 sentences); replies in the user's language; honest "not published" answers with a next step

**Blockers**:

- No published pricing; the booking link is a form, not a calendar; security specifics (SOC 2, data residency) are unpublished

**Related Stakeholders**:

- Client Strategy (aligned), Marketing (partly in tension over lead capture)

---

### SD-11: Existing Clients - Get Account Help Without Friction

**Stakeholder**: Existing Cadre clients (portal users)

**Driver Category**: CUSTOMER / OPERATIONAL

**Driver Statement**: Clients want to reach the portal where they "track their AI tools, agents, and results" [CACTHC-C2], and to get unstuck quickly when they can't.

**Context & Background**: The portal login URL and access steps are not published, so the bot cannot self-serve this. It has to hand off.

**Driver Intensity**: MEDIUM

**Enablers**:

- An immediate handoff with the email requested in the same reply, plus the support contact

**Blockers**:

- No authenticated context; the bot can't verify identity or account state

**Related Stakeholders**:

- Inbound / Client Success

---

### SD-12: Marketing / Website Owner - On-Brand Experience and Lead Capture

**Stakeholder**: Marketing / Website owner

**Driver Category**: CUSTOMER / STRATEGIC

**Driver Statement**: The bot should sound like Cadre (confident, plain-spoken, no hype), reflect current website content, and capture interest that would otherwise leave the site.

**Context & Background**: Company values ("growth mindset, extreme ownership, team first, scrappy") and the "Find. Prepare. Implement." approach define the voice. Marketing is also the upstream owner of the facts the knowledge base mirrors.

**Driver Intensity**: MEDIUM

**Enablers**:

- Knowledge sourced from the website with source URLs; concise-style rules; no marketing superlatives

**Blockers**:

- No scheduled knowledge refresh; no analytics on unanswered questions

**Related Stakeholders**:

- Executive Leadership, Prospects

---

### SD-13: Solution Architect / Builder - Ship a Credible MVP Within Time and Budget

**Stakeholder**: Solution Architect / Builder (candidate)

**Driver Category**: PERSONAL / OPERATIONAL

**Driver Statement**: Deliver a working, deployed MVP within the recommended 4–6 hours of build [CACTHC-C13] and the 3-day window, stay within the $5 credential for all bot traffic, and be able to defend every decision in the review.

**Context & Background**: This is a career-defining assessment for a Staff role. The credential must not be used for coding help [NSTCCA-C2], so AI coding assistance runs on separate tooling.

**Driver Intensity**: CRITICAL

**Enablers**:

- Early deployment; phased `plan.md`; subagents for parallel work; zero-cost unit tests

**Blockers**:

- Budget consumed by evals; AI-generated errors (the mistakes log records 13)

**Related Stakeholders**:

- Review Panel, Talent team

---

### SD-14: Regulators - Transparent, Non-Deceptive Automated Interactions

**Stakeholder**: Data-protection and consumer-protection regulators (jurisdiction depends on visitor location; the company is based in California)

**Driver Category**: COMPLIANCE

**Driver Statement**: Automated systems must not deceive users (for example by posing as a human), must handle personal information under applicable privacy law, and must honour data-subject rights.

**Context & Background**: Scrutiny of AI chatbots is rising. The prompt already forbids the bot from pretending to be a human or a Cadre employee.

**Driver Intensity**: MEDIUM

**Enablers**:

- AI disclosure; no-human-impersonation rule; data minimisation

**Blockers**:

- No privacy notice or AI disclosure text reviewed by legal in the chat UI yet

**Related Stakeholders**:

- Privacy / Legal

---

## Driver-to-Goal Mapping

### Goal G-1: Zero Ungrounded Commercial Claims

**Derived From Drivers**: SD-1, SD-9, SD-10, SD-12, SD-14

**Goal Owner**: AI Engineering (Chief AI Officer)

**Goal Statement**: From the day-4 submission onward, 100% of grounding, false-premise, knowledge-gap and injection eval cases pass on the deployed release. No production answer states a price, client name, certification or URL that is absent from the knowledge base.

**Why This Matters**: This protects Cadre's credibility (SD-1) and gives prospects answers they can rely on (SD-10).

**Success Metrics**:

- **Primary Metric**: Pass rate of the grounding and safety eval subset on the release candidate
- **Secondary Metrics**:
  - Ungrounded claims found in a monthly manual sample of 50 production answers
  - URLs in answers that did not come from the knowledge base or a tool (automated scan)

**Baseline**: Full suite 83/83 on the last recorded run (plan.md, 2026-09-25)

**Target**: 100% on every release; 0 ungrounded claims per 50-answer sample

**Measurement Method**: `npm run eval` against the deployed URL; manual review of logged answers (requires opt-in answer logging, see G-6)

**Dependencies**:

- Knowledge base kept current; eval suite extended for every defect

**Risks to Achievement**:

- Regex assertions miss subtle paraphrased claims
- Model change without a re-evaluation run

---

### Goal G-2: Resolve Common Inquiries Without a Human

**Derived From Drivers**: SD-2, SD-4, SD-10

**Goal Owner**: Chief Client Officer

**Goal Statement**: Within 3 months of production launch, at least 60% of chatbot conversations end without a human handoff and without the user leaving mid-question, across the six common inquiry types.

**Why This Matters**: Absorbing repetitive volume is the headcount-scaling driver (SD-2), while the team keeps high-value conversations (SD-4).

**Success Metrics**:

- **Primary Metric**: Self-resolution rate = conversations with no escalation, no clarification loop, and a user message after the last answer or a booking click, divided by all conversations
- **Secondary Metrics**:
  - Clarification-loop rate (more than 2 clarifying questions in a row)
  - Share of questions hitting `[NOT PUBLISHED]` topics

**Baseline**: Not measured. There is no production analytics today; the demo has conversation-level logs only.

**Target**: ≥ 60% self-resolution at 3 months; ≥ 70% at 6 months (targets to validate with the inbound team)

**Measurement Method**: Conversation-level events derived from the structured `[chat]` logs (tools called, finish reason), plus a lightweight client event for booking-card clicks

**Dependencies**:

- Anonymised conversation analytics (G-6); knowledge gap backlog process

**Risks to Achievement**:

- Scope rules make the bot decline too much, pushing users to escalation
- Unpublished pricing drives escalation volume

---

### Goal G-3: Convert Intent to Strategist Conversations

**Derived From Drivers**: SD-3, SD-10, SD-12

**Goal Owner**: VP of Client Strategy

**Goal Statement**: 100% of conversations showing booking intent (pricing, getting started, fit) are offered the canonical booking path within the same reply. Within 3 months of launch, chatbot-sourced strategist requests are attributable and at least 50% are rated "qualified" by strategists.

**Why This Matters**: Strategists get more of the right calls (SD-3), and prospects reach an expert without friction (SD-10).

**Success Metrics**:

- **Primary Metric**: Booking-offer rate on intent turns (eval-verified) and booking-card click-through rate
- **Secondary Metrics**:
  - Chatbot-attributed contact-form submissions per month
  - Strategist-rated qualification rate

**Baseline**: Booking offer verified by eval cases; click-through and attribution not measured; the booking destination is a contact form without source tagging

**Target**: 100% offer rate; ≥ 15% click-through on intent conversations; ≥ 50% qualified (to validate with Client Strategy)

**Measurement Method**: Eval suite; tagged booking link (for example a source parameter on the configured URL); CRM field on the form

**Dependencies**:

- Marketing adds source attribution to the contact form

**Risks to Achievement**:

- Form friction; inability to attribute leads without CRM integration

---

### Goal G-4: Every Handoff Delivered, Actionable and Promise-Free

**Derived From Drivers**: SD-4, SD-11, SD-1

**Goal Owner**: Chief Client Officer

**Goal Statement**: From launch, ≥ 99% of handoffs reach the team channel with email, question, reason and recent context. 0 answers promise timelines, quotes or outcomes. The median time to first human response on handoffs is under 1 business day.

**Why This Matters**: Handoffs are the bot's safety net. Lost or over-promised handoffs damage both client trust (SD-11) and team workload (SD-4).

**Success Metrics**:

- **Primary Metric**: Handoff delivery rate = successful webhook posts ÷ handoffs recorded
- **Secondary Metrics**:
  - Promise-violation eval cases passing (100%)
  - Time to first human response (team-reported)

**Baseline**: Webhook delivery verified live (2026-09-25); failures logged by escalation id; no retry queue; response time not measured

**Target**: ≥ 99% delivery; 0 promise violations; median first response under 1 business day

**Measurement Method**: `[escalation]` log vs webhook-failure log lines; eval suite; team channel timestamps

**Dependencies**:

- A team member watching the channel; a retry/queue mechanism for production

**Risks to Achievement**:

- Chat-platform outage; handoff spam flooding the channel

---

### Goal G-5: Stay Live and Within Budget Through the Assessment Window

**Derived From Drivers**: SD-6, SD-8, SD-13, SD-7

**Goal Owner**: Solution Architect / Builder

**Goal Statement**: The public URL answers all six acceptance scenarios from submission (day 4, 2026-09-27) through credential expiry (~2026-10-01), with total spend on the challenge credential ≤ $5 and at least 30% of it held in reserve for reviewer traffic on review day.

**Why This Matters**: A dead or exhausted bot on review day overrides every other merit (SD-6). Bounded cost is Finance's concern in miniature (SD-8).

**Success Metrics**:

- **Primary Metric**: Smoke test of the six scenarios passing on the live URL (post-deploy and on review morning)
- **Secondary Metrics**:
  - Remaining credit on the credential (gateway dashboard)
  - 429 rate-limit responses per day (abuse signal)

**Baseline**: Production moved to a personal key from 2026-09-24 17:43 to protect the challenge budget; challenge spend before that is about $1.2–1.9 (plan.md estimate)

**Target**: Challenge key restored and smoke-tested before submission; ≥ $1.50 credit remaining on review morning

**Measurement Method**: Manual smoke test using the demo script; gateway dashboard balance

**Dependencies**:

- Key switch plus a **redeploy** (env changes apply only to new deployments)

**Risks to Achievement**:

- Scripted abuse; forgetting the redeploy after the key switch

---

### Goal G-6: Measure What Stakeholders Care About, Privately

**Derived From Drivers**: SD-2, SD-3, SD-8, SD-9, SD-12

**Goal Owner**: AI Engineering, with sign-off from Privacy / Legal

**Goal Statement**: Before production traffic, ship anonymised conversation analytics (topics, tool calls, `[NOT PUBLISHED]` hits, escalation reasons, cost per conversation), with no raw email or free-text PII retained beyond a documented period (≤ 30 days for operational logs, pending legal review). Completed DPIA.

**Why This Matters**: G-2, G-3 and cost reporting can't be proven without measurement (SD-2, SD-3, SD-8), and measurement must not undermine privacy (SD-9).

**Success Metrics**:

- **Primary Metric**: Weekly dashboard available with the listed metrics
- **Secondary Metrics**:
  - DPIA signed off
  - 0 unmasked emails in logs when a webhook is configured

**Baseline**: Structured per-request logs (latency, tools, tokens, cache hits) exist; no dashboard; no DPIA; full email logged when no webhook is configured

**Target**: Dashboard + DPIA before production launch

**Measurement Method**: Log-derived dashboard; `/arckit:dpia` artefact

**Dependencies**:

- Hosting log retention settings; legal review capacity

**Risks to Achievement**:

- Analytics scope creep, where more data is collected than needed

---

### Goal G-7: Hand Over a System Engineering Can Own

**Derived From Drivers**: SD-5, SD-6, SD-13

**Goal Statement**: At submission, every change passes lint, typecheck, unit tests and build in CI. Every significant decision has a rationale and revisit trigger. A new engineer can run tests and make a knowledge change end-to-end within 1 hour using only the repo docs.

**Goal Owner**: AI Engineering (Chief AI Officer)

**Why This Matters**: This is what "production-ready" means to future owners (SD-5), and it is directly scored by the panel (SD-6).

**Success Metrics**:

- **Primary Metric**: CI green on `main`; decision entries with a revisit trigger (13 of 13 today)
- **Secondary Metrics**:
  - Onboarding time trial (new engineer, knowledge change + eval)
  - Unit test count covering every API rejection path

**Baseline**: CI green; 39 unit tests (README); 13 decisions; 13-entry mistakes log

**Target**: Maintained at 100%; onboarding trial ≤ 1 hour

**Measurement Method**: CI status; review of `plan.md`; timed onboarding trial

**Dependencies**:

- Docs kept in sync in the same commit as code (the `/log-decision` and `/ship` commands)

**Risks to Achievement**:

- Doc drift after the assessment

---

### Goal G-8: Communicate Decisions and Limitations Clearly in the Review

**Derived From Drivers**: SD-6, SD-13, SD-7

**Goal Owner**: Solution Architect / Builder

**Goal Statement**: On review day (day 5), cover the full agenda (demo 10 min, architecture 15, AI workflow 15, code deep dive 10, trade-offs 10) [CACTHC-C8]. Demonstrate the six scenarios, one grounding-under-pressure case, one attack and one live escalation, and state every known limitation before being asked.

**Why This Matters**: Communication is 10% of the score directly and shapes how the other 90% is perceived [CACTHC-C7][CACTHC-C12].

**Success Metrics**:

- **Primary Metric**: Demo script completed within 10 minutes without failure
- **Secondary Metrics**:
  - Each limitation in `plan.md` Known limitations explained with its fix

**Baseline**: Demo script written (plan.md)

**Target**: Complete; 0 limitations raised first by the reviewer

**Measurement Method**: Rehearsal timing; self-review after the session

**Dependencies**:

- G-5 (bot live)

**Risks to Achievement**:

- Live model variability during the demo (mitigated by temperature 0.2 and rehearsal)

---

## Goal-to-Outcome Mapping

### Outcome O-1: Trusted AI Front Door

**Supported Goals**: G-1, G-4, G-6

**Outcome Statement**: Cadre's website assistant has zero public incidents of fabricated commercial claims, instruction leakage or personal-data exposure in its first 12 months.

**Measurement Details**:

- **KPI**: Trust incidents (confirmed ungrounded claim reaching a user, prompt/secret leak, PII exposure)
- **Current Value**: 0 known (demo scale)
- **Target Value**: 0 per quarter
- **Measurement Frequency**: Monthly sample review; per-release evals
- **Data Source**: Eval runs, 50-answer monthly sample, incident log
- **Report Owner**: AI Engineering

**Business Value**:

- **Financial Impact**: Avoids lost deals from credibility damage (unquantified; one lost PE-portfolio engagement is material)
- **Strategic Impact**: A live proof point of Cadre's own "secure, grounded AI" advice
- **Operational Impact**: Fewer corrections by strategists on calls
- **Customer Impact**: Prospects can rely on what the bot says

**Timeline**:

- **Phase 1 (Months 1-3)**: 100% eval pass per release; monthly sampling begins
- **Phase 2 (Months 4-6)**: LLM-as-judge groundedness check on sampled answers
- **Phase 3 (Months 7-12)**: 0 incidents sustained; knowledge refresh cadence live
- **Sustainment (Year 2+)**: Quarterly adversarial red-team review

**Stakeholder Benefits**:

- **Executive Leadership**: Brand protected
- **Prospects**: Reliable answers
- **Privacy / Legal**: Demonstrable control

**Leading Indicators**:

- Eval pass rate per release; `[NOT PUBLISHED]` hit rate handled correctly

**Lagging Indicators**:

- Incident count; strategist feedback about misinformed prospects

---

### Outcome O-2: Inbound Capacity Freed for High-Value Conversations

**Supported Goals**: G-2, G-4

**Outcome Statement**: The inbound team spends at least 30% less time on repetitive informational inquiries within 6 months, with no drop in response quality for escalated cases.

**Measurement Details**:

- **KPI**: Team hours per month on informational inquiries (self-reported time sample or ticket tags)
- **Current Value**: Not measured (baseline to be captured in month 0)
- **Target Value**: −30% at 6 months
- **Measurement Frequency**: Monthly
- **Data Source**: Team time sample / inbox tagging; chatbot self-resolution rate
- **Report Owner**: Chief Client Officer

**Business Value**:

- **Financial Impact**: Growth absorbed without proportional inbound hiring
- **Strategic Impact**: Team focus shifts to qualified and client-specific work
- **Operational Impact**: Faster human responses on the escalations that matter
- **Customer Impact**: 24/7 answers to common questions

**Timeline**:

- **Phase 1 (Months 1-3)**: Baseline captured; ≥ 60% self-resolution
- **Phase 2 (Months 4-6)**: −30% informational workload
- **Phase 3 (Months 7-12)**: Knowledge gaps closed from analytics; ≥ 70% self-resolution
- **Sustainment (Year 2+)**: CRM-integrated handoffs

**Stakeholder Benefits**:

- **Inbound team**: Less repetitive work, better handoffs
- **Executive Leadership**: Scale without headcount

**Leading Indicators**:

- Self-resolution rate; clarification-loop rate

**Lagging Indicators**:

- Inbound hours; team satisfaction

---

### Outcome O-3: More Qualified Strategist Pipeline

**Supported Goals**: G-3

**Outcome Statement**: Within 6 months, chatbot-sourced strategist requests are at least 10% of all strategy-call requests, with a qualification rate at least equal to other web channels.

**Measurement Details**:

- **KPI**: Chatbot-attributed strategy-call requests ÷ all strategy-call requests; qualification rate
- **Current Value**: 0 (not attributed)
- **Target Value**: ≥ 10% share; qualification ≥ web-form baseline
- **Measurement Frequency**: Monthly
- **Data Source**: Tagged booking link → contact form → CRM
- **Report Owner**: VP of Client Strategy

**Business Value**:

- **Financial Impact**: Incremental pipeline (value per engagement not published; to be modelled in `/arckit:sobc`)
- **Strategic Impact**: Captures intent from visitors who would not fill in a cold form
- **Operational Impact**: Strategists get pre-informed prospects
- **Customer Impact**: Faster path to an expert

**Timeline**:

- **Phase 1 (Months 1-3)**: Attribution live; baseline share
- **Phase 2 (Months 4-6)**: ≥ 10% share
- **Phase 3 (Months 7-12)**: Consider a self-serve calendar if form friction dominates
- **Sustainment (Year 2+)**: Qualification signals passed into the CRM

**Stakeholder Benefits**:

- **Client Strategy**: Better calls
- **Prospects**: Less friction
- **Marketing**: Measurable lead source

**Leading Indicators**:

- Booking-card click-through

**Lagging Indicators**:

- Qualified-call share; closed engagements

---

### Outcome O-4: Predictable Cost per Conversation

**Supported Goals**: G-5, G-6

**Outcome Statement**: The cost per conversation is known, stays within a documented ceiling, and no spend incident takes the bot offline.

**Measurement Details**:

- **KPI**: Average model cost per conversation; days with spend-limit outages
- **Current Value**: About $0.003 per tool turn with caching, about $0.015 without (measured 2026-09-25)
- **Target Value**: ≤ $0.02 per conversation average; 0 outage days
- **Measurement Frequency**: Weekly
- **Data Source**: Per-request token logs × published model prices; gateway dashboard
- **Report Owner**: Finance, with data from AI Engineering

**Business Value**:

- **Financial Impact**: Bounded opex; cost-to-serve comparable to minutes of staff time
- **Strategic Impact**: A demonstrable FinOps discipline for clients
- **Operational Impact**: No surprise outages
- **Customer Impact**: The bot is available when prospects visit

**Timeline**:

- **Phase 1 (Months 1-3)**: Weekly cost line; upstream ceiling set
- **Phase 2 (Months 4-6)**: Shared-state rate limit and daily spend counter
- **Phase 3 (Months 7-12)**: Cost per resolved conversation reported alongside O-2
- **Sustainment (Year 2+)**: Model re-selection review on price changes

**Stakeholder Benefits**:

- **Finance**: Predictability
- **Builder / AI Engineering**: No budget firefighting

**Leading Indicators**:

- Cache-hit ratio; 429 rate

**Lagging Indicators**:

- Monthly spend vs ceiling

---

### Outcome O-5: Successful Assessment and Hire Decision

**Supported Goals**: G-5, G-7, G-8

**Outcome Statement**: The review panel reaches a confident hiring decision based on a live, working product and clearly explained engineering judgment across all five dimensions.

**Measurement Details**:

- **KPI**: Panel evaluation across five weighted dimensions [CACTHC-C7]
- **Current Value**: Submission pending (day 4)
- **Target Value**: Positive decision; no dimension flagged as a blocker
- **Measurement Frequency**: Once (review day)
- **Data Source**: Panel feedback via Talent team
- **Report Owner**: Talent / Recruiting

**Business Value**:

- **Financial Impact**: For Cadre, a lower cost of a wrong Staff hire
- **Strategic Impact**: A reusable reference architecture for client chatbot engagements
- **Operational Impact**: Artefacts (plan, context files, evals) reusable as templates
- **Customer Impact**: Indirect

**Timeline**:

- **Phase 1**: Submission day 4 (2026-09-27)
- **Phase 2**: Live review day 5
- **Phase 3**: Decision
- **Sustainment**: If adopted, transition to the product layer (O-1 to O-4)

**Stakeholder Benefits**:

- **Review Panel**: Evidence-based decision
- **Builder**: Career outcome
- **AI Engineering**: A colleague whose working style is already visible

**Leading Indicators**:

- Smoke test green on review morning; rehearsal completed on time

**Lagging Indicators**:

- Hiring decision

---

### Outcome O-6: Compliance-Ready for Production Traffic

**Supported Goals**: G-1, G-6

**Outcome Statement**: Before public launch on cadreai.com, the chatbot has a signed-off DPIA, an AI disclosure and privacy notice in the UI, documented retention, and masked PII in all logs.

**Measurement Details**:

- **KPI**: Compliance checklist completion
- **Current Value**: About 40%. Minimisation and masking with a webhook are in place; DPIA, disclosure text and retention documentation are missing.
- **Target Value**: 100% before launch
- **Measurement Frequency**: At each release gate
- **Data Source**: Checklist in `/arckit:dpia` and `/arckit:principles-compliance` artefacts
- **Report Owner**: Privacy / Legal

**Business Value**:

- **Financial Impact**: Avoids regulatory and remediation cost
- **Strategic Impact**: Consistent with the data-security advice Cadre sells
- **Operational Impact**: Clear retention and deletion practice
- **Customer Impact**: Users know what happens to their data

**Timeline**:

- **Phase 1 (Months 1-3)**: DPIA; disclosure; retention config
- **Phase 2+**: Annual review

**Stakeholder Benefits**:

- **Privacy / Legal**: Sign-off confidence
- **Regulators**: Transparency
- **Prospects**: Trust

**Leading Indicators**:

- DPIA draft complete

**Lagging Indicators**:

- Zero complaints or data-subject requests left unanswered

---

## Complete Traceability Matrix

### Stakeholder → Driver → Goal → Outcome

| Stakeholder | Driver ID | Driver Summary | Goal ID | Goal Summary | Outcome ID | Outcome Summary |
|-------------|-----------|----------------|---------|--------------|------------|-----------------|
| Executive Leadership | SD-1 | Protect credibility as an AI authority | G-1 | Zero ungrounded claims | O-1 | Trusted AI front door |
| Executive Leadership | SD-1 | Protect credibility | G-4 | Promise-free handoffs | O-1 | Trusted AI front door |
| Executive Leadership | SD-2 | Scale inbound without headcount | G-2 | ≥ 60% self-resolution | O-2 | −30% inbound informational workload |
| Executive Leadership | SD-2 | Scale inbound | G-6 | Private analytics | O-2 | −30% inbound informational workload |
| Client Strategy | SD-3 | More qualified strategist calls | G-3 | Booking offered on 100% of intent turns | O-3 | ≥ 10% qualified pipeline share |
| Inbound / CS | SD-4 | Actionable handoffs, no noise | G-4 | ≥ 99% handoff delivery | O-2 | Capacity freed |
| Inbound / CS | SD-4 | Actionable handoffs | G-2 | Self-resolution | O-2 | Capacity freed |
| AI Engineering | SD-5 | Maintainable, verifiable system | G-7 | CI green, decisions logged, 1-hour onboarding | O-5 | Assessment success / reusable reference |
| AI Engineering | SD-5 | Maintainable system | G-1 | Eval gate | O-1 | Trusted AI front door |
| Review Panel | SD-6 | Evidence of senior judgment | G-5 | Live and within budget | O-5 | Confident hiring decision |
| Review Panel | SD-6 | Evidence of senior judgment | G-7 | Ownable system | O-5 | Confident hiring decision |
| Review Panel | SD-6 | Evidence of senior judgment | G-8 | Clear review communication | O-5 | Confident hiring decision |
| Talent / Recruiting | SD-7 | Complete, on-time submission | G-5 | Live through review | O-5 | Confident hiring decision |
| Finance | SD-8 | Bounded run cost | G-5 | ≤ $5 challenge spend | O-4 | Predictable cost per conversation |
| Finance | SD-8 | Bounded run cost | G-6 | Cost analytics | O-4 | Predictable cost per conversation |
| Privacy / Legal | SD-9 | Lawful minimal PII | G-6 | Analytics without PII; DPIA | O-6 | Compliance-ready |
| Privacy / Legal | SD-9 | Lawful minimal PII | G-1 | No leakage | O-1 | Trusted AI front door |
| Prospects | SD-10 | Fast, credible answers + expert path | G-1 | Grounded answers | O-1 | Trusted AI front door |
| Prospects | SD-10 | Expert path | G-3 | Booking offered | O-3 | Qualified pipeline |
| Existing clients | SD-11 | Account help without friction | G-4 | Handoff delivered | O-2 | Capacity freed |
| Marketing | SD-12 | On-brand + lead capture | G-3 | Attribution | O-3 | Qualified pipeline |
| Marketing | SD-12 | Current content | G-1 | Grounded knowledge | O-1 | Trusted AI front door |
| Builder | SD-13 | Ship credible MVP in time and budget | G-5, G-7, G-8 | Live, ownable, explained | O-5 | Confident hiring decision |
| Regulators | SD-14 | Transparent, non-deceptive AI | G-6 | DPIA, disclosure | O-6 | Compliance-ready |

### Conflict Analysis

**Competing Drivers**:

- **Conflict 1 — Lead capture vs grounding**: Marketing and Client Strategy (SD-12, SD-3) want every pricing or "how much" conversation to convert. Grounding (SD-1, SD-10) means the bot must say pricing isn't published and never estimate, and prospects may bounce on a non-answer.
  - **Resolution Strategy**: Treat "not published" as a conversion moment, not a dead end. Pair every gap answer with the booking path, and never state a range. Measure bounce after pricing answers (G-6). If it is high, Cadre can publish indicative pricing in the knowledge base, which is a business decision, not a bot change.

- **Conflict 2 — Rich handoff context vs data minimisation**: The inbound team (SD-4) wants the full conversation. Privacy (SD-9) wants the minimum.
  - **Resolution Strategy**: The current compromise is the last 6 turns × 500 characters, the email collected only with explicit user input, and masking in logs when a webhook is the system of record. Confirm retention and processor terms in the DPIA before production. Revisit when a CRM becomes the system of record.

- **Conflict 3 — Verification spend vs runtime budget**: AI Engineering and the Builder (SD-5, SD-13) want frequent eval runs. Finance and the Builder (SD-8, SD-13) must keep the $5 credential alive for reviewers.
  - **Resolution Strategy**: Unit tests are free (model mocked). Evals are opt-in, prefix-filtered and costed before running. Development eval runs used a separate personal key, and the challenge key is restored and smoke-tested before submission. Keep at least 30% reserve (G-5).

- **Conflict 4 — Breadth of answers vs focused scope**: Prospects and Marketing (SD-10, SD-12) may expect the bot to discuss competitors, general AI advice or anything else. The panel and Engineering (SD-6, SD-5) reward tight scope [CACTHC-C10].
  - **Resolution Strategy**: Decline in one sentence and steer back to Cadre topics or a strategist. Log declined topics (G-6) so that demand can drive future scope additions through `plan.md`.

- **Conflict 5 — Open public access vs abuse protection**: The public URL [CACTHC-C14] invites reviewers and prospects but also budget drainers (adversarial users vs SD-8).
  - **Resolution Strategy**: Per-IP rate limit, origin check, size caps and an upstream spend ceiling today. Before production, add a shared-state limiter and a daily spend counter, and consider a bot-challenge check if abuse appears.

**Synergies**:

- **Synergy 1**: Leadership's credibility driver (SD-1) and the Review Panel's judgment driver (SD-6) are both satisfied by the same artefacts: grounded knowledge, adversarial evals and honest limitations.
- **Synergy 2**: Client Strategy (SD-3) and Prospects (SD-10) both want a fast path to a strategist. The booking tool serves both at no extra cost.
- **Synergy 3**: Finance (SD-8) and Engineering (SD-5) both benefit from per-request usage telemetry, which proves cost and diagnoses behaviour.
- **Synergy 4**: Privacy (SD-9) and Engineering simplicity (SD-5) align. No database, no stored chat history and no auth means less to secure and less to maintain.

---

## Communication & Engagement Plan

### Stakeholder-Specific Messaging

#### Take-home Review Panel

**Primary Message**: A focused, deployed MVP whose every decision, limitation and AI error is documented and verifiable in the repo.

**Key Talking Points**:

- Six acceptance scenarios pass on the live URL; 83/83 evals on the last full run
- Claude Code workflow: `CLAUDE.md`, `plan.md`, three scoped subagents, four commands, two hooks, a 13-entry mistakes log
- Explicit scope cuts (no RAG, no DB, no auth), each with a revisit trigger; measured costs, not estimates

**Communication Frequency**: Once at submission (day 4) and in the live review (day 5)

**Preferred Channel**: Repo + live URL; 1-hour video review

**Success Story**: "They showed us an eval catching a real bug, then the fix, and told us the known limitations before we asked."

**Influence Strategy**: Lead with evidence (commit history, eval results, measured cost) rather than claims. Surface weaknesses proactively [CACTHC-C12].

---

#### Executive Leadership

**Primary Message**: A website assistant that never embarrasses Cadre, absorbs repetitive questions and hands prospects to strategists.

**Key Talking Points**:

- Answers only from Cadre's published information; says "not published" rather than guessing
- Every conversation ends in an answer, a booking link or a handoff
- Cost per conversation measured in cents

**Communication Frequency**: Monthly one-page outcome summary

**Preferred Channel**: Email summary + dashboard link

**Success Story**: "A PE operating partner told us the bot answered honestly and got them to a strategist in two messages."

**Influence Strategy**: Frame the bot as a live proof of Cadre's own advice on secure, grounded AI.

---

#### Client Strategy

**Primary Message**: More prospects arrive at your calls already informed, and you can see which ones came from the bot.

**Key Talking Points**:

- Booking offered at pricing, fit and getting-started moments
- Basic questions (services, industries, Maturity Index) handled before the call
- Attribution and qualification feedback loop proposed

**Communication Frequency**: Monthly

**Preferred Channel**: Pipeline review meeting

**Success Story**: "Chatbot-sourced calls are as qualified as referrals."

**Influence Strategy**: Ask strategists to define "qualified" and co-own the booking-intent triggers.

---

#### AI Engineering

**Primary Message**: A small, conventional codebase with free tests, a behavioural eval gate, and documented scaling triggers.

**Key Talking Points**:

- Behaviour, knowledge and configuration are separated; tools produce all links
- CI on every push; evals opt-in on dispatch
- Known gaps: per-instance rate limit, regex evals, no retry queue for handoffs

**Communication Frequency**: At each phase and release; ADRs for key decisions

**Preferred Channel**: Pull requests, ADRs, architecture review

**Success Story**: "A new engineer added a knowledge fact, ran the eval and shipped in under an hour."

**Influence Strategy**: Invite them to challenge the decisions table and the scaling path.

---

#### Inbound / Client Success

**Primary Message**: You'll receive fewer repetitive questions, and every handoff arrives with who, what, why and the last few turns.

**Key Talking Points**:

- The bot never promises what you'll do or when
- Portal-access requests are handed off, not guessed
- Channel and format can be adjusted to your workflow

**Communication Frequency**: Weekly handoff digest during the pilot, then monthly

**Preferred Channel**: Team chat channel

**Success Story**: "We answer escalations without having to go back to the user for context."

**Influence Strategy**: Co-design the handoff message and reason categories.

---

#### Privacy / Legal

**Primary Message**: Minimal data by design: no stored chats, email only at handoff, masked logs. A DPIA is proposed before launch.

**Key Talking Points**:

- Data flows: browser → server → model gateway; handoff → team channel
- Open items: retention documentation, AI disclosure text, processor terms

**Communication Frequency**: At DPIA milestones; before launch

**Preferred Channel**: Written data-flow summary + DPIA document

**Success Story**: "DPIA signed off with no high residual risks."

**Influence Strategy**: Bring the open items first; ask for guidance on disclosure wording.

---

#### Finance

**Primary Message**: Run cost is capped and measured, at cents per conversation.

**Key Talking Points**:

- About $0.003 per tool turn with caching; hard caps; upstream credit ceiling

**Communication Frequency**: Monthly cost line

**Preferred Channel**: Email / dashboard

**Success Story**: "Spend stayed under the ceiling every month."

**Influence Strategy**: Report cost per resolved conversation next to staff-time saved.

---

#### Prospective and Existing Clients

**Primary Message**: (In product) "I'm Cadre's AI assistant. I answer from Cadre's published information and can connect you with a strategist or the team."

**Key Talking Points**:

- Starter questions show what it can do
- Honest "not published" answers with a next step
- A human is always one message away

**Communication Frequency**: Every conversation

**Preferred Channel**: Chat UI

**Success Story**: "I got my answer and booked a call in under two minutes."

**Influence Strategy**: Earn trust by being honest about limits; don't sell.

---

#### Talent / Recruiting, Marketing, Regulators

**Primary Message**: Talent gets an on-time, complete submission. Marketing gets on-brand, sourced content with a refresh process. Regulators see transparent, non-deceptive AI.

**Communication Frequency**: Talent: at submission. Marketing: monthly knowledge review. Regulators: no direct engagement; compliance by design.

**Preferred Channel**: Email (Talent); content review meeting (Marketing)

**Success Story**: Submission accepted without follow-up questions; knowledge matches the website.

**Influence Strategy**: Meet stated requirements exactly; make the knowledge-refresh path easy for Marketing to trigger.

---

## Change Impact Assessment

### Impact on Stakeholders

| Stakeholder | Current State | Future State | Change Magnitude | Resistance Risk | Mitigation Strategy |
|-------------|---------------|--------------|------------------|-----------------|---------------------|
| Inbound / CS | Answers every inquiry via form/email/phone | Receives only handoffs with context | MEDIUM | LOW | Co-design the handoff format; weekly digest in the pilot |
| Client Strategy | Calls from the contact form with little context | Calls from informed prospects, attributed | LOW | LOW | Qualification feedback loop |
| Marketing | Website content is the only source | Website content is mirrored in the bot's knowledge; changes need a refresh | MEDIUM | MEDIUM | Scheduled knowledge refresh through the knowledge-writer subagent, reviewed like code |
| AI Engineering | No chatbot to own | Owns a production AI service, evals and cost | MEDIUM | LOW | Reuse of existing practices; ADRs; onboarding trial |
| Privacy / Legal | Website forms only | New processor chain (model gateway, chat platform) | MEDIUM | MEDIUM | Early DPIA; minimisation evidence |
| Prospects | Browse pages or fill in a form | Ask directly; get routed | LOW | LOW | Clear AI disclosure; easy human path |
| Existing clients | Email/phone support | Chat handoff as an extra channel | LOW | LOW | Support contact always shown |
| Finance | No LLM cost line | New usage-based line | LOW | LOW | Ceiling and monthly report |

### Change Readiness

**Champions** (Enthusiastic supporters):

- Client Strategy: more informed calls at no cost to them
- AI Engineering: the bot reflects the practices they advocate
- Builder: owns the delivery

**Fence-sitters** (Neutral, need convincing):

- Executive Leadership: supportive of AI, but needs evidence the bot won't embarrass the brand (show the adversarial eval results)
- Inbound / CS: welcome less volume, but wary of bad handoffs (show the handoff format and the no-promises rule)

**Resisters** (Opposed or skeptical):

- Privacy / Legal: skeptical of new processors and free-text PII. Address with a DPIA, minimisation and retention limits before launch.
- Marketing (potential): may see the refusal to discuss pricing or competitors as lost opportunity. Address with bounce and booking data (Conflict 1 resolution) and ownership of the knowledge content.

---

## Risk Register (Stakeholder-Related)

### Risk R-1: Product-Layer Drivers Not Validated

**Related Stakeholders**: Executive Leadership, Client Strategy, Inbound / CS, Marketing

**Risk Description**: Product-layer drivers and targets (G-2, G-3, O-2, O-3) are inferred from the brief and public materials, not from interviews. Actual priorities may differ.

**Impact on Goals**: G-2, G-3, G-6

**Probability**: HIGH

**Impact**: MEDIUM

**Mitigation Strategy**: Treat targets as proposals. Validate them in the review conversation and in 30-minute interviews with the inbound and strategy leads before any production commitment.

**Contingency Plan**: Re-baseline goals and issue v1.1 of this document.

---

### Risk R-2: Bot Unavailable or Out of Budget on Review Day

**Related Stakeholders**: Review Panel, Builder, Talent

**Risk Description**: Credential exhausted by abuse or eval runs, deployment regression, or the key switched without a redeploy.

**Impact on Goals**: G-5, G-8, O-5

**Probability**: LOW

**Impact**: HIGH

**Mitigation Strategy**: Rate limit and caps; reserve ≥ 30% credit; key switch + redeploy + smoke test on day 4; re-check on review morning.

**Contingency Plan**: Show recorded eval runs and logs. Ask the interviewer for platform help, which the brief allows for configuration issues but not code [CACTHC-C15].

---

### Risk R-3: A Wrong Answer Reaches a Senior Prospect

**Related Stakeholders**: Executive Leadership, Prospects, Client Strategy

**Risk Description**: A subtle ungrounded claim (a paraphrased certification, an implied timeline) passes the regex evals and reaches a prospect.

**Impact on Goals**: G-1, O-1

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Temperature 0.2; claim-targeted assertions; monthly manual sample; LLM-as-judge groundedness check in Phase 2.

**Contingency Plan**: Hot-fix the knowledge or a prompt rule, add a regression case, and have the strategy team follow up with the affected prospect if known.

---

### Risk R-4: Handoffs Lost or Ignored

**Related Stakeholders**: Inbound / CS, Existing clients

**Risk Description**: A webhook failure means the handoff exists only in logs, or no one owns watching the channel.

**Impact on Goals**: G-4, O-2

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Name a channel owner; alert on webhook failure log lines; add a retry queue before production.

**Contingency Plan**: Daily reconciliation of `[escalation]` logs against channel messages.

---

### Risk R-5: Privacy Sign-off Blocks Launch

**Related Stakeholders**: Privacy / Legal, Executive Leadership

**Risk Description**: DPIA findings (processor terms, retention, free-text PII) delay production.

**Impact on Goals**: G-6, O-6

**Probability**: MEDIUM

**Impact**: MEDIUM

**Mitigation Strategy**: Start the DPIA now (`/arckit:dpia`); fix the known gap (full email in logs without a webhook) first.

**Contingency Plan**: Launch with handoff disabled (booking and public contact only) until sign-off.

---

### Risk R-6: Knowledge Drifts From the Website

**Related Stakeholders**: Marketing, Prospects, Executive Leadership

**Risk Description**: The knowledge base is a 2026-09-24 snapshot. Website changes make answers stale or contradictory.

**Impact on Goals**: G-1, O-1

**Probability**: HIGH (over 6+ months)

**Impact**: MEDIUM

**Mitigation Strategy**: Monthly scheduled refresh through the knowledge-writer subagent, diffed and reviewed; Marketing notifies Engineering of material site changes.

**Contingency Plan**: Mark affected topics `[NOT PUBLISHED]` until refreshed.

---

## Governance & Decision Rights

### Decision Authority Matrix (RACI)

| Decision Type | Responsible | Accountable | Consulted | Informed |
|---------------|-------------|-------------|-----------|----------|
| MVP scope (IN/OUT) and acceptance scenarios | Builder | AI Engineering lead | Client Strategy, Inbound / CS | Review Panel |
| Knowledge base content and refresh | Builder / knowledge-writer subagent | Marketing | Client Strategy, Privacy / Legal | AI Engineering |
| Model selection and sampling settings | Builder | AI Engineering lead | Finance | Review Panel |
| Architecture decisions and ADRs | Builder | AI Engineering lead | Privacy / Legal (data), Finance (cost) | Executive Leadership |
| Handoff channel, format and ownership | Builder | Chief Client Officer | Privacy / Legal | Client Strategy |
| Personal-data handling, retention, DPIA | AI Engineering | Privacy / Legal | Inbound / CS | Executive Leadership |
| Spend ceiling and cost reporting | Builder | Finance | AI Engineering | Executive Leadership |
| Take-home submission (day 4) | Builder | Builder | — | Talent / Recruiting |
| Go/No-go for production launch on cadreai.com | AI Engineering | Executive Leadership | Privacy / Legal, Client Strategy, Inbound / CS, Marketing | All stakeholders |
| Hiring decision | Review Panel | Cadre hiring manager | AI Engineering | Talent / Recruiting |

### Escalation Path

1. **Level 1**: Builder / AI Engineering lead: day-to-day technical and scope decisions, recorded in `plan.md`
2. **Level 2**: AI Engineering lead + Chief Client Officer + Privacy / Legal: cross-functional conflicts (handoff data, launch readiness, budget overrun)
3. **Level 3**: Executive Leadership: brand-risk decisions, go-live, publishing currently unpublished information (for example pricing)

---

## Validation & Sign-off

### Stakeholder Review

| Stakeholder | Review Date | Comments | Status |
|-------------|-------------|----------|--------|
| Take-home Review Panel | Pending (review day) | — | PENDING |
| AI Engineering lead | Pending | — | PENDING |
| Chief Client Officer | Pending | — | PENDING |
| Privacy / Legal | Pending | — | PENDING |

### Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | PENDING | | |
| Business Owner | PENDING | | |
| Enterprise Architect | Jhon Felipe Urrego (author) | | |

---

## Appendices

### Appendix A: Stakeholder Interview Summaries

No stakeholder interviews have been conducted. Product-layer drivers are inferred from the brief [CACTHC], the recruiter note [NSTCCA], Cadre's public website content captured in the application's `knowledge/` directory, and the as-built application's `plan.md` and `CLAUDE.md`. See Risk R-1.

**Proposed interviews (30 min each)**: Chief Client Officer (handoff workflow, volume baseline); VP of Client Strategy (qualification criteria); Privacy contact (retention, processors); Marketing (knowledge ownership).

---

### Appendix B: Survey Results

No surveys conducted.

---

### Appendix C: References

- ARC-000-PRIN-v1.0: Cadre AI Enterprise Architecture Principles (Principles 2, 4, 11, 13, 16 and 20 are most relevant to these stakeholders)
- Application `plan.md`: scope, decisions & trade-offs, budget, known limitations, demo script
- Application `CLAUDE.md`: hard constraints, acceptance scenarios, mistakes log
- Business case: not yet created (`/arckit:sobc`)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-27 | ArcKit AI | Initial draft from brief, recruiter note, principles and as-built application |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| CACTHC | Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | Product brief / assessment guide | 001-cadre-chatbot/external/ | Cadre AI take-home challenge guide v1.1 |
| NSTCCA | Next Steps  Tech Challenge  Cadre AI.txt | Recruiter correspondence | 001-cadre-chatbot/external/ | Timeline, credential constraints, submission rules. Contains a live credential, which is deliberately not reproduced |
| PRIN | ARC-000-PRIN-v1.0.md | Architecture principles | 000-global/ | Principles referenced for enablers and governance |
| APP | cadre-chatbot repository (git-tracked files; `.gitignore` paths excluded) | Reference implementation | /mnt/g/Users/GAMEMAX/Documents/ENTREVISTAS/gocadre.ai/cadre-chatbot | Source of baselines: eval results, measured cost, caps, decisions, limitations, knowledge snapshot |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| CACTHC-C1 | CACTHC | p.1, Welcome | Stakeholder Need | "Our engineers build production AI systems every day using Claude Code as their primary development tool." |
| CACTHC-C2 | CACTHC | p.3, What to Build | Functional Requirement | Scenario list: what Cadre does and industry fit; booking a strategist call; client portal access "to track their AI tools, agents, and results"; the AI Maturity Index; LLM selection and data security; escalation of unanswerable questions |
| CACTHC-C3 | CACTHC | p.3, What to Build | Security Requirement | "Someone asking about Cadre's approach to LLM selection and data security" |
| CACTHC-C4 | CACTHC | p.2, The Brief | Stakeholder Need | "Our clients range from lower middle market private equity-backed companies to professional services firms and financial services organizations." |
| CACTHC-C5 | CACTHC | p.2, The Brief | Business Requirement | "We help businesses move from AI confusion to AI confidence — going department by department to identify high-ROI AI opportunities, build workflows and agents, and train teams so the changes actually stick." |
| CACTHC-C6 | CACTHC | p.2, The Brief | Business Requirement | "Cadre's inbound team is receiving a growing volume of inquiries from prospective clients, existing clients, and people who want to learn more about what we do. Your job is to build a chatbot that handles the most common interactions so the team can focus on high-value conversations." |
| CACTHC-C7 | CACTHC | p.5, What We're Looking For | Stakeholder Need | Weighted dimensions table: Claude Code Proficiency 30%, System Design & Architecture 25%, Development Speed & Scope 20%, Code Quality & Verification 15%, Communication & Reasoning 10% |
| CACTHC-C8 | CACTHC | p.4 Deliverables; p.6 What Happens in the Review | Stakeholder Need | Deliverables: public URL, zip with `.git`, CLAUDE.md, plan.md. Review agenda table: Live Demo 10 min, Architecture 15, Claude Code Workflow 15, Code Deep Dive 10, Decisions & Trade-offs 10 |
| CACTHC-C9 | CACTHC | p.5 | Stakeholder Need | "We're not testing whether you can code. We're testing whether you can think clearly enough to direct and verify a system that codes with you." |
| CACTHC-C10 | CACTHC | p.7, Tips | Design Decision | "Cut scope aggressively. 3 working features > 8 broken ones." |
| CACTHC-C11 | CACTHC | p.7, Tips | Design Decision | "Make your scope decisions explicit in plan.md." |
| CACTHC-C12 | CACTHC | p.7 | Stakeholder Need | "We expect trade-offs. We expect incomplete features. The best candidates are honest about what's broken and articulate about what they'd do with more time." |
| CACTHC-C13 | CACTHC | p.2, Challenge Format | Business Requirement | "We recommend budgeting 4–6 hours. Build, deploy, and prepare your submission." |
| CACTHC-C14 | CACTHC | p.4, Deliverables | Non-Functional Requirement | "The app must be deployed and accessible on a public URL." |
| CACTHC-C15 | CACTHC | p.8, FAQ | Risk Factor | "Deployment issues happen. How you handle them is part of the evaluation. Your interviewer can help with platform configuration but not code issues." |
| NSTCCA-C1 | NSTCCA | Opening paragraphs | Stakeholder Need | "you'll have 3 days to work on the challenge, with your project due on day 4 for the team to review. On day 5, you'll meet with one of our AI Engineers to walk them through your process and decisions." |
| NSTCCA-C2 | NSTCCA | Paragraph "API Key" | Procurement Constraint | "It has a $5 budget and expires in 7 days, so plan accordingly" … "Note — this key is for the chatbot only, not for coding assistance." (credential value redacted) |
| NSTCCA-C3 | NSTCCA | Paragraph "Submission" | Compliance Constraint | "Exclude node_modules, dist, build, or your virtual environment, but keep the .git folder so we can review your commit history. The zip should stay lightweight, just a few MB." |
| NSTCCA-C4 | NSTCCA | Paragraph "Models" | Design Decision | "The API key gives you access to OpenRouter, which means you can use any available model — OpenAI, Gemini, Anthropic, and others." |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf:Zone.Identifier | 001-cadre-chatbot/external/ | Windows download metadata, no content |
| README.md | 001-cadre-chatbot/external/ | ArcKit folder placeholder |
| README.md | 000-global/policies/ | ArcKit folder placeholder; no organisational policies or org charts provided |

---

**Generated by**: ArcKit `/arckit:stakeholders` command
**Generated on**: 2026-09-27
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**Model**: Claude Opus 5.5 (claude-opus-5-5)
