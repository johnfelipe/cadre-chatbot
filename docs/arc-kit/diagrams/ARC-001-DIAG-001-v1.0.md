# Architecture Diagram: C4 Level 1 — System Context

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:diagram`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-DIAG-001-v1.0 |
| **Document Type** | Architecture Diagram |
| **Project** | Cadre AI Support Chatbot — cadre-chatbot (Project 001) |
| **Classification** | OFFICIAL |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-27 |
| **Last Modified** | 2026-09-27 |
| **Review Cycle** | Monthly |
| **Next Review Date** | 2026-10-27 |
| **Owner** | Jhon Felipe Urrego — Solution Architect, Cadre AI Support Chatbot |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | Project Team, Architecture Team |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-27 | ArcKit AI | Initial creation from `/arckit:diagram` command | [PENDING] | [PENDING] |

---

## Diagram Set

This document is part of a nine-view set describing the **as-built** application (repository `johnfelipe/cadre-chatbot`, commit `d63c3ac`):

| ID | View | Format |
|----|------|--------|
| **ARC-001-DIAG-001** | **C4 Level 1 — System Context (this document)** | PlantUML |
| ARC-001-DIAG-002 | C4 Level 2 — Container | PlantUML |
| ARC-001-DIAG-003 | C4 Level 3 — Component (Chat API) | PlantUML |
| ARC-001-DIAG-004 | C4 Level 4 — Code (class-level) | PlantUML |
| ARC-001-DIAG-005 | Sequence — escalation turn | Mermaid |
| ARC-001-DIAG-006 | Deployment | Mermaid |
| ARC-001-DIAG-007 | Entity-Relationship (logical data model) | Mermaid |
| ARC-001-DIAG-008 | State — handoff lifecycle and UI request status | Mermaid |
| ARC-001-DIAG-009 | Flowchart — request pipeline and generation loop | Mermaid |

---

## Diagram

**Type**: C4 System Context (Level 1). **Audience**: stakeholders and reviewers. **Layout**: top-down: users on top, the system in the middle, external systems to the sides and below.

### PlantUML C4 Format

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title System Context - Cadre AI Support Chatbot (as built, commit d63c3ac)

' Tier 1: people who use the system
Person(prospect, "Prospective client", "Executive at a PE-backed, professional services or financial services firm")
Person(client, "Existing client", "Uses the Cadre client portal and needs account help")
Person_Ext(visitor, "General visitor", "Job seeker, researcher, press or off-topic user")

' Tier 2: the system
System(chatbot, "Cadre AI Support Chatbot", "Answers common questions from a curated knowledge base, routes intent to a strategist call, hands anything else to the Cadre team")

' Side and lower tiers: external systems and the receiving team
System_Ext(llm, "Model gateway and LLM", "OpenRouter; default model Claude Haiku 4.5")
System_Ext(site, "Cadre website", "cadreai.com contact page, the booking destination")
System_Ext(ami, "AI Maturity Index portal", "portal.gocadre.ai free online assessment")
System_Ext(chat, "Team chat platform", "Discord or Slack incoming webhook")
Person(team, "Cadre inbound team", "Reads handoffs and follows up by email")

' Directional relationships
Rel_Down(prospect, chatbot, "Asks questions, requests a strategist call", "HTTPS")
Rel_Down(client, chatbot, "Asks how to reach the portal", "HTTPS")
Rel_Down(visitor, chatbot, "Asks questions", "HTTPS")
Rel_Right(chatbot, llm, "Generates answers and tool calls", "HTTPS, bearer key")
Rel_Left(chatbot, site, "Shares booking link", "Hyperlink")
Rel_Left(chatbot, ami, "Shares assessment link", "Hyperlink")
Rel_Down(chatbot, chat, "Posts handoff with email, question and last turns", "HTTPS webhook, JSON")
Rel_Up(team, chat, "Reads handoffs")

' Layout constraints (consistent with every Rel_* above)
Lay_Right(prospect, client)
Lay_Right(client, visitor)
Lay_Right(chatbot, llm)
Lay_Left(chatbot, site)
Lay_Down(site, ami)
Lay_Down(chat, team)

SHOW_LEGEND()
@enduml
```

**View this diagram** (PlantUML does NOT render in GitHub markdown):

- **Online**: https://www.plantuml.com/plantuml/uml/ (paste code above)
- **VS Code**: Install PlantUML extension (jebbs.plantuml)
- **CLI**: `java -jar plantuml.jar diagram.puml`
- **Export**: Use PlantUML Server to export as PNG/SVG/PDF

**Legend**: `SHOW_LEGEND()` renders the standard C4 key (person, external person, system, external system). Blue elements are inside Cadre's ownership, and grey elements are external.

### Layout conflict check

| Lay_* constraint | Rel_* on the same pair | Compatible |
|------------------|------------------------|------------|
| `Lay_Right(chatbot, llm)` | `Rel_Right(chatbot, llm)` | ✅ |
| `Lay_Left(chatbot, site)` | `Rel_Left(chatbot, site)` | ✅ |
| `Lay_Down(chat, team)` | `Rel_Up(team, chat)` | ✅ (Lay_Down(a,b) ↔ Rel_Up(b,a)) |
| `Lay_Right(prospect, client)`, `Lay_Right(client, visitor)`, `Lay_Down(site, ami)` | none | ✅ |

### Diagram Quality Gate

| # | Criterion | Target | Result | Status |
|---|-----------|--------|--------|--------|
| 1 | Edge crossings | 0 for simple | 0 expected: users above, links left, gateway right, channel below | PASS |
| 2 | Visual hierarchy | System most prominent | Single `System` element, centred | PASS |
| 3 | Grouping | Related elements proximate | Users in one row, link targets stacked left | PASS |
| 4 | Flow direction | Consistent | Top-down with lateral integrations | PASS |
| 5 | Relationship traceability | Unambiguous lines | One line per pair, all labelled | PASS |
| 6 | Abstraction level | One C4 level | Context only (no containers) | PASS |
| 7 | Edge label readability | Legible | Short labels plus protocol | PASS |
| 8 | Node placement | No long edges | All neighbours adjacent | PASS |
| 9 | Element count | ≤ 10 | 9/10 | PASS |

---

## Component Inventory

| Component | Type | Technology | Responsibility | Evolution Stage (indicative) | Build/Buy |
|-----------|------|------------|----------------|------------------------------|-----------|
| Cadre AI Support Chatbot | Software system | Next.js 16, React 19, AI SDK 7, TypeScript | Grounded answers, strategist routing, human handoff | Custom (0.35) | BUILD |
| Prospective client | Person | Browser | Asks about services, industries, pricing, security | — | — |
| Existing client | Person | Browser | Asks for portal access and account help | — | — |
| General visitor | External person | Browser | Incidental or off-topic use | — | — |
| Cadre inbound team | Person | Team chat + email | Acts on handoffs | — | — |
| Model gateway and LLM | External system | OpenRouter, Claude Haiku 4.5 | Text generation and tool calling | Commodity (0.80) | USE |
| Cadre website | External system | cadreai.com | Contact form used for strategist calls | Product (0.70) | USE (existing) |
| AI Maturity Index portal | External system | portal.gocadre.ai | Free assessment | Product (0.60) | USE (existing) |
| Team chat platform | External system | Discord or Slack webhook | Handoff notification channel | Commodity (0.90) | USE |

**Evolution Stage Legend**:

- **Genesis (0.0-0.25)**: Novel, unproven, rapidly changing
- **Custom (0.25-0.50)**: Bespoke, emerging practices
- **Product (0.50-0.75)**: Commercial products with feature differentiation
- **Commodity (0.75-1.0)**: Utility services, standardized

> No Wardley Map exists for this project yet; the stages above are indicative. Run `/arckit:wardley` to position them formally.

---

## Architecture Decisions

### Key Design Decisions

**Decision 1**: One public, anonymous system boundary

- **Context**: The audience is prospective and existing clients on a public website [CACTHC-C1].
- **Decision**: No login. Anyone can chat; account-specific needs are handed to humans.
- **Rationale**: This keeps the MVP scope tight (`plan.md` "OUT: Auth / portal integration").
- **Consequences**: There is no caller identity, so abuse controls rely on rate limits and gateway credit (ARC-001-CDAU-001 F-006).

**Decision 2**: Humans stay in the loop through a team-chat channel, not a CRM

- **Context**: Unanswerable questions must be escalated or redirected [CACTHC-C2].
- **Decision**: Handoffs go to a Discord or Slack webhook, and the team follows up by email.
- **Rationale**: Zero infrastructure; the team already watches the channel (`plan.md` decision "Escalation = log + webhook").
- **Consequences**: Delivery is best-effort (CDAU F-003). A CRM is the recorded scaling path (INT-006).

### Technology Choices

| Technology | Purpose | Rationale | Evolution Stage |
|------------|---------|-----------|-----------------|
| OpenRouter (model gateway) | Single LLM transport | Mandated by the brief's credential; model swappable by env var | Product |
| Claude Haiku 4.5 | Default model | Latency and cost on a small-corpus support workload | Commodity |
| Discord/Slack incoming webhook | Handoff channel | No build; `{ text, content }` payload serves both | Commodity |

---

## Requirements Traceability

| Requirement ID | Description | Component(s) | Coverage Status |
|----------------|-------------|--------------|-----------------|
| BR-001 | Answer the six common inquiry scenarios | Chatbot, Model gateway | ⚠️ (capability met; self-resolution metric absent) |
| BR-002 | Zero ungrounded commercial claims | Chatbot | ⚠️ |
| BR-003 | Route intent to a strategist call | Chatbot → Cadre website | ⚠️ (offer met; attribution absent) |
| BR-004 | Human handoff for anything unanswerable | Chatbot → Team chat → Inbound team | ⚠️ (CDAU F-003) |
| FR-010 | AI Maturity Index explanation and link | Chatbot → AI Maturity Index portal | ✅ |
| INT-001 | Model gateway | Model gateway and LLM | ✅ |
| INT-002 | Team notification webhook | Team chat platform | ⚠️ |
| INT-003 | Cadre contact/booking page | Cadre website | ✅ |
| INT-004 | AI Maturity Index assessment | AI Maturity Index portal | ✅ |
| INT-006 | CRM integration | — (not shown; deferred) | ❌ |

**Coverage Summary** (requirements visible at this level):

- Total Requirements: 10
- Covered: 4 (40%)
- Partially Covered: 5
- Not Covered: 1 (INT-006, deferred by design)

---

## Integration Points

### External Systems

| External System | Interface | Protocol | Responsibility | SLA |
|----------------|-----------|----------|----------------|-----|
| OpenRouter (Claude Haiku 4.5) | Chat completions with tools, streaming | HTTPS, bearer key | Answer and tool-call generation | Provider-dependent; bounded by 30 s function limit |
| Discord/Slack webhook | Incoming webhook | HTTPS POST, JSON | Deliver handoffs to the team | Best-effort, 3 s timeout, no retry |
| cadreai.com contact page | Hyperlink | HTTPS | Strategist call requests | n/a (link-out) |
| portal.gocadre.ai | Hyperlink | HTTPS | AI Maturity Index assessment | n/a (link-out) |

### APIs and Endpoints

| API | Endpoint | Method | Purpose | Authentication |
|-----|----------|--------|---------|----------------|
| Chat API | `/api/chat` | POST | Conversation turn; UI message stream response | None (public). Origin check for browser requests; per-IP rate limit |

---

## Data Flow

### Data Sources

| Data Source | Type | Data Format | Update Frequency | Owner |
|-------------|------|-------------|------------------|-------|
| Visitor messages | User input | Text (UI message parts) | Per turn | Visitor |
| Knowledge base | Curated content | Markdown (9 files) | Manual refresh; snapshot 2026-09-24 | Marketing (content), Engineering (repo) |

### Data Sinks

| Data Sink | Type | Data Format | Retention | Backup |
|-----------|------|-------------|-----------|--------|
| Team chat channel | Handoff notification | Formatted text + JSON record | Channel policy (not defined) | Platform-managed |
| Platform runtime logs | Telemetry and handoff log | JSON lines | Platform default (not defined, CDAU F-010) | None |

### PII Handling (GDPR / applicable privacy law)

| Component | PII Type | Processing | Legal Basis | Retention | Deletion |
|-----------|----------|------------|-------------|-----------|----------|
| Chatbot (handoff) | Email, optional name, free-text question and last 6 turns | Sent to the team channel; logged (masked when a webhook exists) | Consent (user-initiated request) — to confirm in DPIA | Not defined | Not defined |
| Model gateway | Any personal data typed in the last 12 turns | Inference | To confirm in DPIA | Provider/account settings (CDAU F-011) | Provider-managed |

**DPIA Required**: Yes (recommended before production traffic; run `/arckit:dpia`)
**DPO Consulted**: N/A (not yet)

---

## Security Architecture

### Security Zones

| Zone | Components | Security Level | Controls |
|------|------------|----------------|----------|
| Public internet | Visitors | Untrusted | All input treated as untrusted |
| Cadre-owned system | Chatbot | Controlled | Guards, secrets server-side, security headers |
| Third-party SaaS | Gateway, team chat, Cadre sites | Trusted suppliers | HTTPS; secrets in environment variables |

### Security Controls

| Control | Type | Component(s) | Implementation |
|---------|------|--------------|----------------|
| Input validation and caps | Preventive | Chatbot | Guard sequence in `app/api/chat/route.ts:33-78` (gaps: CDAU F-001, F-002, F-005) |
| Rate limiting | Preventive | Chatbot | 10 requests/min per IP, per instance |
| Prompt-injection rules | Preventive | Chatbot | `lib/prompt.ts:31-32`; 18 adversarial eval cases |

### Authentication & Authorization

| Component | Authentication | Authorization | Session Management |
|-----------|----------------|---------------|-------------------|
| Chatbot (public) | None (anonymous by design) | None (no privileged actions) | None; conversation held in the browser |
| Gateway / webhook | Bearer key / secret URL (env vars) | Account-level | n/a |

---

## Deployment Architecture

See **ARC-001-DIAG-006** (Deployment): Vercel serverless deployment, GitHub CI, and third-party SaaS.

---

## Non-Functional Requirements

| Requirement | Target | Component(s) | How Achieved |
|-------------|--------|--------------|--------------|
| Availability during assessment window (NFR-A-001) | Live through ~2026-10-01 | Chatbot | Serverless hosting, deploy on push; no monitoring (CDAU F-012) |
| Cost bound (NFR-F-001/003) | ≤ $5 challenge credit | Chatbot, Gateway | Caps + gateway credit limit (amplification gap CDAU F-001) |
| Grounding (BR-002) | 0 ungrounded claims | Chatbot | Knowledge-only prompt rules + evals |

---

## UK Government Compliance (if applicable)

Not applicable. Cadre AI is a private US consultancy, so TCoP, GOV.UK services and the UK AI Playbook do not apply.

### AI Playbook Compliance (for AI systems)

**AI Risk Level**: LOW-RISK (customer-support Q&A over public information; no decisions about individuals).

- **Human Oversight**: Human-on-the-loop: unanswerable or account-specific requests are handed to the team.
- **ATRS Required**: No (not a UK public-sector algorithmic tool)
- **Bias Testing**: No formal testing; multilingual eval cases exist
- **Explainability**: Partial: answers are restricted to published information.

---

## Wardley Map Integration

**Related Wardley Map**: N/A (none created yet)

| Component | Visibility | Evolution | Stage | Strategic Action |
|-----------|-----------|-----------|-------|------------------|
| Cadre AI Support Chatbot | 0.90 | 0.35 | Custom | BUILD |
| Model gateway and LLM | 0.30 | 0.80 | Commodity | USE |
| Team chat platform | 0.40 | 0.90 | Commodity | USE |

### Strategic Alignment

- [x] All BUILD decisions align with Genesis/Custom stage
- [x] All BUY decisions align with Product stage (none bought)
- [x] All USE decisions align with Commodity stage
- [x] No commodity components being built at this level (the in-memory rate limiter is a Level 2 concern; see DIAG-002)
- [x] No Genesis components being bought

---

## Linked Artifacts

**Requirements**: `projects/001-cadre-chatbot/ARC-001-REQ-v1.0.md`
**Architecture Principles**: `projects/000-global/ARC-000-PRIN-v1.0.md`
**Stakeholders**: `projects/001-cadre-chatbot/ARC-001-STKE-v1.0.md`
**Codebase Audit**: `projects/001-cadre-chatbot/audits/ARC-001-CDAU-001-v1.0.md`
**Wardley Map**: N/A
**HLD / DLD**: N/A (the as-built code and this diagram set stand in for them)
**TCoP / AI Playbook / ATRS**: N/A

---

## Change Log

| Version | Date | Author | Changes | Rationale |
|---------|------|--------|---------|-----------|
| v1.0 | 2026-09-27 | ArcKit AI | Initial diagram | Document the as-built system at commit `d63c3ac` |

**Next Review Date**: 2026-10-27

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| CACTHC | Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | Product brief | 001-cadre-chatbot/external/ | Take-home brief: audience, scenarios |
| APP | cadre-chatbot repository at `d63c3ac` | Reference implementation | github.com/johnfelipe/cadre-chatbot | Source of every element and relationship |
| CDAU | ARC-001-CDAU-001-v1.0.md | Codebase audit | 001-cadre-chatbot/audits/ | Finding IDs referenced as gaps |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| CACTHC-C1 | CACTHC | p.2, The Brief | Stakeholder Need | "Our clients range from lower middle market private equity-backed companies to professional services firms and financial services organizations." |
| CACTHC-C2 | CACTHC | p.3, What to Build | Functional Requirement | "A user asking a question the bot can't answer — and needs to escalate or redirect" |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Next Steps  Tech Challenge  Cadre AI.txt | 001-cadre-chatbot/external/ | Process and credential constraints; no context-level elements (contains a live credential, not reproduced) |

---

**Generated by**: ArcKit `/arckit:diagram` command
**Generated on**: 2026-09-27 GMT
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**AI Model**: Claude Opus 5.5 (claude-opus-5-5)
**Generation Context**: As-built repository at commit `d63c3ac`, ARC-001-REQ-v1.0, ARC-001-CDAU-001-v1.0, take-home brief
