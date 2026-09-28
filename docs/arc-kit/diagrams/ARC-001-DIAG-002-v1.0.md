# Architecture Diagram: C4 Level 2 — Container

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:diagram`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-DIAG-002-v1.0 |
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

## Diagram

**Type**: C4 Container (Level 2). **Scope**: the Cadre AI Support Chatbot system boundary as built at commit `d63c3ac`. **Layout**: top-down tiers: people → Chat UI and Chat API → data stores and outbound integrations. Part of the set ARC-001-DIAG-001…009 (index in DIAG-001).

### PlantUML C4 Format

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title Container Diagram - Cadre AI Support Chatbot (as built, commit d63c3ac)

' Tier 1: people
Person(user, "Website visitor", "Prospect, existing client or general visitor")

' Tier 2 and 3: containers inside the system boundary
System_Boundary(sys, "Cadre AI Support Chatbot - serverless deployment") {
    Container(ui, "Chat UI", "Next.js 16 App Router page, React 19 client component, AI SDK useChat", "Chat, starter questions, booking card, handoff notice; conversation kept in browser memory")
    Container(api, "Chat API", "Next.js route handler POST /api/chat, Node.js runtime, AI SDK 7 streamText", "Request guards, prompt assembly, tool execution, streaming, usage telemetry")
    ContainerDb(kb, "Knowledge base", "9 Markdown files bundled with the function", "Only source of facts about Cadre; read with fs and cached per instance")
    ContainerDb(rl, "Rate-limit windows", "In-memory Map, one per function instance", "10 requests per 60 s per client IP; max 10,000 keys")
}

' External systems
System_Ext(site, "Cadre website and AI Maturity Index", "cadreai.com/contact and portal.gocadre.ai link-outs")
System_Ext(llm, "Model gateway", "OpenRouter; default model anthropic/claude-haiku-4.5")
System_Ext(hook, "Team chat webhook", "Discord or Slack incoming webhook")
System_Ext(logs, "Platform runtime logs", "[chat] usage and [escalation] JSON lines")
Person(team, "Cadre inbound team", "Reads handoffs and follows up by email")

' Directional relationships
Rel_Down(user, ui, "Uses", "HTTPS")
Rel_Right(ui, api, "POSTs last 12 messages, receives UI message stream", "JSON / SSE")
Rel_Left(ui, site, "Opens booking and assessment links", "HTTPS")
Rel_Right(api, llm, "streamText with 2 tools, cached system prefix", "HTTPS, bearer key")
Rel_Down(api, kb, "Reads once per instance", "fs")
Rel_Down(api, rl, "Checks and increments", "in-process")
Rel_Down(api, hook, "POSTs escalation, 3 s timeout", "HTTPS, JSON")
Rel_Down(api, logs, "console.info / console.error", "stdout")
Rel_Up(team, hook, "Reads handoffs")

' Layout constraints (consistent with every Rel_* above)
Lay_Down(user, ui)
Lay_Right(ui, api)
Lay_Left(ui, site)
Lay_Right(api, llm)
Lay_Right(kb, rl)
Lay_Right(rl, hook)
Lay_Right(hook, logs)
Lay_Down(hook, team)

SHOW_LEGEND()
@enduml
```

**View this diagram** (PlantUML does NOT render in GitHub markdown):

- **Online**: https://www.plantuml.com/plantuml/uml/ (paste code above)
- **VS Code**: Install PlantUML extension (jebbs.plantuml)
- **CLI**: `java -jar plantuml.jar diagram.puml`
- **Export**: Use PlantUML Server to export as PNG/SVG/PDF

**Legend**: `SHOW_LEGEND()` renders the C4 key. Cylinders are data stores. Both are ephemeral: nothing in this system persists beyond a function instance except logs and team-channel messages.

### Layout conflict check

| Lay_* constraint | Rel_* on the same pair | Compatible |
|------------------|------------------------|------------|
| `Lay_Down(user, ui)` | `Rel_Down(user, ui)` | ✅ |
| `Lay_Right(ui, api)` | `Rel_Right(ui, api)` | ✅ |
| `Lay_Left(ui, site)` | `Rel_Left(ui, site)` | ✅ |
| `Lay_Right(api, llm)` | `Rel_Right(api, llm)` | ✅ |
| `Lay_Down(hook, team)` | `Rel_Up(team, hook)` | ✅ |
| `Lay_Right(kb, rl)`, `Lay_Right(rl, hook)`, `Lay_Right(hook, logs)` | none between these pairs | ✅ |

### Diagram Quality Gate

| # | Criterion | Target | Result | Status |
|---|-----------|--------|--------|--------|
| 1 | Edge crossings | < 5 | 0 expected: API fans down to a single aligned row (kb, rl, hook, logs) | PASS |
| 2 | Visual hierarchy | Boundary most prominent | `System_Boundary` holds all four containers | PASS |
| 3 | Grouping | Related elements proximate | Stores inside boundary; outbound integrations in the same bottom row | PASS |
| 4 | Flow direction | Consistent | Top-down with left/right lateral links | PASS |
| 5 | Relationship traceability | Unambiguous | One line per pair | PASS |
| 6 | Abstraction level | One C4 level | Containers only | PASS |
| 7 | Edge label readability | Legible | Labels ≤ 8 words plus protocol | PASS |
| 8 | Node placement | No long edges | Longest edge api→logs spans one tier | PASS |
| 9 | Element count | ≤ 15 | 10/15 | PASS |

---

## Component Inventory

| Component | Type | Technology | Responsibility | Evolution Stage (indicative) | Build/Buy |
|-----------|------|------------|----------------|------------------------------|-----------|
| Chat UI | Container (web front end) | Next.js 16 App Router, React 19, `@ai-sdk/react` `useChat`, Tailwind 4 | Renders conversation, starter questions, booking card, handoff notice, errors with Retry | Custom (0.40) on Product frameworks | BUILD (thin) |
| Chat API | Container (serverless function) | Next.js route handler, Node.js runtime, AI SDK 7, `@openrouter/ai-sdk-provider`, zod 4 | Guards, prompt assembly, tools, streaming, telemetry | Custom (0.35) | BUILD |
| Knowledge base | Data store (files) | Markdown, bundled via `outputFileTracingIncludes` | Curated facts with sources and `[NOT PUBLISHED]` gaps | Custom (0.30) | BUILD (content) |
| Rate-limit windows | Data store (memory) | JavaScript `Map` per instance | Per-IP fixed window | Commodity (0.85) capability built in-house | BUILD today; recorded path: USE a shared store (`plan.md` scaling path) |
| Model gateway | External system | OpenRouter → Claude Haiku 4.5 | Inference | Commodity (0.80) | USE |
| Team chat webhook | External system | Discord / Slack | Handoff delivery | Commodity (0.90) | USE |
| Platform runtime logs | External system | Hosting platform logs | Telemetry and handoff fallback record | Commodity (0.90) | USE |
| Cadre website and AI Maturity Index | External system | cadreai.com, portal.gocadre.ai | Link-out destinations | Product (0.65) | USE (existing) |

**Evolution Stage Legend**:

- **Genesis (0.0-0.25)**: Novel, unproven, rapidly changing
- **Custom (0.25-0.50)**: Bespoke, emerging practices
- **Product (0.50-0.75)**: Commercial products with feature differentiation
- **Commodity (0.75-1.0)**: Utility services, standardized

---

## Architecture Decisions

### Key Design Decisions

**Decision 1**: Two containers in one deployable (UI + route handler)

- **Context**: A 4–6 hour MVP brief that needed a public URL.
- **Decision**: A single Next.js app: the page and the `/api/chat` route are deployed together.
- **Rationale**: One repo, one deploy, the model key stays server-side.
- **Consequences**: UI and API scale and release together. There is one API surface (`POST /api/chat`).

**Decision 2**: Full-context knowledge, no retrieval store

- **Context**: The corpus is about 5k tokens (`plan.md:83`).
- **Decision**: Inject all 9 knowledge files into the cached system prefix.
- **Rationale**: No retrieval misses; prompt caching makes it cheap (about $0.003 per tool turn measured).
- **Consequences**: Revisit above about 50k tokens (NFR-S-002).

**Decision 3**: Stateless server; conversation state in the browser

- **Context**: No persistence requirement for the MVP.
- **Decision**: The client sends the last 12 messages, and the server keeps no session.
- **Rationale**: Privacy and zero infrastructure.
- **Consequences**: Client history is untrusted input (CDAU F-001, blocking decision C-1). The rate limiter is per instance (CDAU F-006).

### Technology Choices

| Technology | Purpose | Rationale | Evolution Stage |
|------------|---------|-----------|-----------------|
| Next.js 16.3.6 (App Router) | UI + API hosting model | Fast serverless deploy; one codebase | Product |
| AI SDK 7 (`ai`, `@ai-sdk/react`) | Streaming, tool calling, UI message protocol | Standard protocol between `useChat` and `streamText` | Product |
| `@openrouter/ai-sdk-provider` 3.1.0 | Gateway client | Brief mandates OpenRouter | Product |
| zod 4 | Input and tool schemas | Declarative validation | Commodity |
| Markdown files | Knowledge store | Reviewable as code; provenance hook | Commodity |

---

## Requirements Traceability

| Requirement ID | Description | Component(s) | Coverage Status |
|----------------|-------------|--------------|-----------------|
| FR-001 | Web chat with streaming | Chat UI, Chat API | ✅ |
| FR-003 | Grounded answers from knowledge only | Chat API, Knowledge base | ✅ |
| FR-007 | Booking tool and card | Chat API → Chat UI | ✅ |
| FR-014 | Escalation tool | Chat API → Team chat webhook | ✅ |
| FR-015 | Truthful handoff confirmation | Chat API, Chat UI | ⚠️ (CDAU F-003) |
| FR-024 | Ephemeral conversations | Chat UI | ✅ |
| NFR-P-002 | Per-client rate limit | Rate-limit windows | ⚠️ (per instance) |
| NFR-P-003 | Bounded work per request | Chat API | ⚠️ (CDAU F-001, F-002) |
| NFR-SEC-002 | Secrets server-side only | Chat API | ✅ |
| NFR-SEC-003 | Input validation | Chat API | ⚠️ |
| NFR-M-001 | Observability | Chat API → Platform logs | ⚠️ |
| NFR-S-002 | Knowledge volume strategy | Knowledge base | ✅ |
| INT-001 | Model gateway | Chat API → Model gateway | ✅ |
| INT-002 | Team webhook | Chat API → Team chat webhook | ⚠️ |
| INT-003 / INT-004 | Link-outs | Chat UI → Cadre website and AI Maturity Index | ✅ |
| DR-003 | No persistence | All containers | ✅ |

**Coverage Summary** (container-level requirements):

- Total Requirements: 17 (INT-003 and INT-004 counted separately)
- Covered: 10 (59%)
- Partially Covered: 7
- Not Covered: 0

---

## Integration Points

### External Systems

| External System | Interface | Protocol | Responsibility | SLA |
|----------------|-----------|----------|----------------|-----|
| OpenRouter | `streamText` via provider; `cacheControl: ephemeral` on the system prefix | HTTPS, bearer key (`OPENROUTER_API_KEY`) | Generation, tool calls, usage metrics | Provider-dependent; function limit 30 s |
| Team chat webhook | POST `{ text, content, escalation }` | HTTPS, secret URL (`ESCALATION_WEBHOOK_URL`) | Handoff delivery | Best-effort; 3 s timeout; failures logged only |
| Platform logs | `console.info` / `console.error` | stdout | Telemetry and handoff fallback | Platform retention (not defined) |
| cadreai.com / portal.gocadre.ai | Hyperlinks | HTTPS | Booking and assessment | n/a |

### APIs and Endpoints

| API | Endpoint | Method | Purpose | Authentication |
|-----|----------|--------|---------|----------------|
| Chat API | `/api/chat` | POST | Body `{ id?, messages }` in UI message format, returns a UI message stream (SSE). Errors return JSON `{ error }` with 400, 403, 413, 429 (+ `retry-after`) or 500 | None; Origin check (browsers only); rate limit |

---

## Data Flow

### Data Sources

| Data Source | Type | Data Format | Update Frequency | Owner |
|-------------|------|-------------|------------------|-------|
| Browser conversation | Client state | UI messages (last 12 per request) | Per turn | Visitor |
| Knowledge base | Bundled files | Markdown | Per deploy | Marketing / Engineering |
| Config and secrets | Environment variables | Strings | Per deploy (env changes need a redeploy) | Engineering |

### Data Sinks

| Data Sink | Type | Data Format | Retention | Backup |
|-----------|------|-------------|-----------|--------|
| Platform runtime logs | Logs | JSON lines (`[chat]`, `[escalation]`) | Not defined (CDAU F-010) | None |
| Team chat channel | Messages | Text ≤ 2,000 chars + JSON record | Channel policy (not defined) | Platform |
| Model gateway | Inference request | Prompt + last 12 turns | Provider/account policy (CDAU F-011) | n/a |

### PII Handling (GDPR / applicable privacy law)

| Component | PII Type | Processing | Legal Basis | Retention | Deletion |
|-----------|----------|------------|-------------|-----------|----------|
| Chat UI | Anything the user types | Browser memory only; not stored | n/a (not stored) | Until reload | Page reload |
| Chat API | Last 12 turns; email/name at handoff | Forwarded to gateway; escalation record | Consent (user-initiated) — confirm in DPIA | Not stored | n/a |
| Rate-limit windows | Client IP | In-memory counter | Legitimate interest (abuse prevention) | 60 s window / instance lifetime | Automatic |
| Platform logs | Email (masked only when a webhook is set), conversation id; possibly conversation content in raw error objects (CDAU F-009) | Logging | To define | Not defined | Not defined |
| Team chat channel | Email, name, question, last 6 turns | Handoff | Consent | Not defined | Manual |

**DPIA Required**: Yes (before production traffic)
**DPO Consulted**: N/A (not yet)

---

## Security Architecture

### Security Zones

| Zone | Components | Security Level | Controls |
|------|------------|----------------|----------|
| Browser (untrusted) | Chat UI runtime, conversation history | Untrusted | Output rendered as text; only http(s) links; `noopener noreferrer` |
| Serverless function (trusted) | Chat API, Knowledge base, Rate-limit windows | Trusted | Guard sequence; secrets in env; security headers |
| Third-party SaaS | Gateway, team chat, logs | Supplier-trusted | HTTPS; secret key/URL; 3 s webhook timeout |

### Security Controls

| Control | Type | Component(s) | Implementation |
|---------|------|--------------|----------------|
| Guard sequence (key → origin → rate limit → size → JSON → schema → count → UI validation → trim → user-turn length → non-empty) | Preventive | Chat API | `app/api/chat/route.ts:33-78`; gaps CDAU F-001, F-002, F-005 |
| Deterministic tools | Preventive | Chat API | Booking URL from config; escalation input zod-validated |
| Prompt-injection and confidentiality rules | Preventive | Chat API | `lib/prompt.ts:31-32` + evals |
| Security headers | Preventive | Chat UI / API | `nosniff`, `DENY` frames, strict referrer, restrictive Permissions-Policy; no CSP/HSTS (CDAU F-017) |
| Safe rendering | Preventive | Chat UI | No `dangerouslySetInnerHTML`; unit-tested linkifier |

### Authentication & Authorization

| Component | Authentication | Authorization | Session Management |
|-----------|----------------|---------------|-------------------|
| Chat UI / Chat API | None (public by design) | None (no privileged actions) | None; client-held history, client-generated conversation id |
| Gateway | Bearer key (env) | Account credit limit | n/a |
| Team webhook | Secret URL (env) | Channel permissions | n/a |

---

## Deployment Architecture

See **ARC-001-DIAG-006**. In summary: Vercel serverless (deploy on every push to `main`), region not configured in the repository, no IaC.

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Component(s) | How Achieved |
|-------------|--------|--------------|--------------|
| Response time (NFR-P-001) | First content < 3 s p95; tool turn < 10 s p95 (proposed) | Chat API, Gateway | Streaming; cached prefix; small model; latency logged (no p95 reporting) |
| Throughput (NFR-P-002) | 10 requests/min per IP | Rate-limit windows | Fixed window, per instance |
| Bounded work (NFR-P-003) | ≤ 600 output tokens, ≤ 3 steps, 12-turn window | Chat API | `lib/config.ts:5-12` (assistant turns uncapped: CDAU F-001) |

### Scalability

| Scalability Type | Approach | Component(s) | Max Scale |
|-----------------|----------|--------------|-----------|
| Horizontal | Serverless instances, stateless handler | Chat UI, Chat API | Platform concurrency limits |
| Vertical | n/a | — | — |

### Availability & Resilience

| Requirement | Target | Component(s) | How Achieved |
|-------------|--------|--------------|--------------|
| Availability | Live through ~2026-10-01; 99.5% proposed for production | All | Platform-managed; no uptime monitoring |
| RTO (Recovery Time) | ≤ 15 min | Deployment | Redeploy the previous build |
| RPO (Recovery Point) | n/a for conversations (not stored); 0 once a handoff is posted | Chat API, Team webhook | Best-effort delivery |

### Security & Compliance

| Requirement | Standard | Component(s) | Controls |
|-------------|----------|--------------|----------|
| NFR-SEC-003 Input validation | OWASP ASVS input-validation practices | Chat API | Guard sequence (partial) |
| NFR-C-001 Privacy | GDPR / applicable US state privacy law | Chat API, logs, team channel | Minimisation, masking (partial); DPIA pending |

---

## UK Government Compliance (if applicable)

Not applicable (private US company). The AI risk level is LOW-RISK, and human oversight is on-the-loop through handoffs. See DIAG-001.

---

## Wardley Map Integration

**Related Wardley Map**: N/A (none yet; stages above are indicative)

| Component | Visibility | Evolution | Stage | Strategic Action |
|-----------|-----------|-----------|-------|------------------|
| Chat UI | 0.90 | 0.40 | Custom | BUILD |
| Chat API | 0.70 | 0.35 | Custom | BUILD |
| Knowledge base (content) | 0.60 | 0.30 | Custom | BUILD |
| Rate-limit windows | 0.30 | 0.85 | Commodity | BUILD (flag), move to USE |
| Model gateway | 0.30 | 0.80 | Commodity | USE |
| Team chat webhook | 0.40 | 0.90 | Commodity | USE |

### Strategic Alignment

- [x] All BUILD decisions align with Genesis/Custom stage, except the rate limiter
- [x] All BUY decisions align with Product stage (none bought)
- [x] All USE decisions align with Commodity stage
- [ ] No commodity components being built: the in-memory rate limiter is a commodity capability built in-house (accepted for the MVP; recorded scaling path is a shared store)
- [x] No Genesis components being bought

---

## Linked Artifacts

**Requirements**: `projects/001-cadre-chatbot/ARC-001-REQ-v1.0.md`
**Architecture Principles**: `projects/000-global/ARC-000-PRIN-v1.0.md`
**Codebase Audit**: `projects/001-cadre-chatbot/audits/ARC-001-CDAU-001-v1.0.md`
**Other views**: ARC-001-DIAG-001 (Context), DIAG-003 (Component), DIAG-006 (Deployment)
**Wardley Map / HLD / DLD / TCoP / AI Playbook / ATRS**: N/A

---

## Change Log

| Version | Date | Author | Changes | Rationale |
|---------|------|--------|---------|-----------|
| v1.0 | 2026-09-27 | ArcKit AI | Initial diagram | Document the as-built containers at `d63c3ac` |

**Next Review Date**: 2026-10-27

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| APP | cadre-chatbot repository at `d63c3ac` | Reference implementation | github.com/johnfelipe/cadre-chatbot | `app/`, `components/`, `lib/`, `knowledge/`, `next.config.ts`, `package.json`, `plan.md` |
| CDAU | ARC-001-CDAU-001-v1.0.md | Codebase audit | 001-cadre-chatbot/audits/ | Gap references |
| REQ | ARC-001-REQ-v1.0.md | Requirements | 001-cadre-chatbot/ | Traceability source |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | 001-cadre-chatbot/external/ | Brief contains no container-level design; used via REQ |
| Next Steps  Tech Challenge  Cadre AI.txt | 001-cadre-chatbot/external/ | No container-level content (live credential not reproduced) |

---

**Generated by**: ArcKit `/arckit:diagram` command
**Generated on**: 2026-09-27 GMT
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**AI Model**: Claude Opus 5.5 (claude-opus-5-5)
**Generation Context**: As-built repository at commit `d63c3ac`, ARC-001-REQ-v1.0, ARC-001-CDAU-001-v1.0
