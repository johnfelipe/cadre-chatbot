# Architecture Diagram: C4 Level 3 — Component (Chat API)

> **Template Origin**: Official | **ArcKit Version**: 6.16.3 | **Command**: `/arckit:diagram`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-DIAG-003-v1.0 |
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

**Type**: C4 Component (Level 3). **Scope**: the **Chat API** container (`app/api/chat/route.ts` and `lib/`). The Chat UI container is a single React module and is shown at code level in DIAG-004. **Layout**: top-down: caller → route handler → collaborators → leaf modules and externals. Part of the set ARC-001-DIAG-001…009.

### PlantUML C4 Format

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Component Diagram - Chat API container (as built, commit d63c3ac)

' Tier 0: caller
Container(ui, "Chat UI", "React 19, AI SDK useChat", "Sends the last 12 messages; renders the stream")

Container_Boundary(api, "Chat API - POST /api/chat (Node.js function)") {
    ' Tier 1: entry point
    Component(handler, "Route handler", "app/api/chat/route.ts POST", "Orders the guards, trims history, builds transcript and tools, calls streamText, returns the UI message stream")

    ' Tier 2: collaborators called by the handler
    Component(guards, "Request guards", "route.ts, zod bodySchema, safeValidateUIMessages", "Key, origin, rate limit, body size, schema, count, user-turn length, non-empty")
    Component(knowledge, "Knowledge loader", "lib/knowledge.ts", "Reads knowledge/*.md once per instance and caches the corpus")
    Component(prompt, "Prompt builder", "lib/prompt.ts", "Behaviour rules plus the knowledge block; no facts of its own")
    Component(tools, "Tool registry", "lib/tools.ts, AI SDK tool()", "get_booking_link and escalate_to_human, built per request")
    Component(sdk, "LLM runtime", "AI SDK 7 streamText, OpenRouter provider", "Multi-step tool calling, 600 output tokens, 3 steps, temperature 0.2")

    ' Tier 3: leaf components
    Component(limiter, "Rate limiter", "lib/rate-limit.ts", "Fixed 60 s window per client IP, per instance")
    ComponentDb(kbfiles, "Knowledge files", "knowledge/*.md, bundled", "9 topic files with sources and NOT PUBLISHED gaps")
    Component(config, "Config", "lib/config.ts", "Model, temperature, limits, rate limit, booking and webhook URLs from env")
    Component(recorder, "Escalation recorder", "lib/escalations.ts", "Builds the record, logs it (email masked when a webhook exists), posts the webhook payload")
}

' Externals
System_Ext(llm, "Model gateway", "OpenRouter, Claude Haiku 4.5")
System_Ext(hook, "Team chat webhook", "Discord or Slack")
System_Ext(logs, "Runtime logs", "stdout JSON lines")

' Directional relationships
Rel_Down(ui, handler, "POST /api/chat", "JSON / SSE")
Rel_Down(handler, guards, "1. validate request")
Rel_Down(handler, knowledge, "2. loadKnowledge()")
Rel_Down(handler, prompt, "3. buildSystemPrompt(corpus)")
Rel_Down(handler, tools, "4. buildTools(conversationId, transcript)")
Rel_Down(handler, sdk, "5. streamText(...)")
Rel_Down(guards, limiter, "checkRateLimit(clientKey)")
Rel_Down(knowledge, kbfiles, "readdir / readFile", "fs")
Rel_Down(tools, config, "booking URL")
Rel_Down(tools, recorder, "escalate_to_human.execute")
Rel_Left(recorder, config, "webhook URL")
Rel_Left(sdk, tools, "executes tool calls")
Rel_Down(sdk, llm, "streaming completion", "HTTPS, bearer key")
Rel_Down(recorder, hook, "POST payload, 3 s timeout", "HTTPS, JSON")
Rel_Down(recorder, logs, "[escalation] record")
Rel_Down(sdk, logs, "onEnd [chat] usage record")

' Layout constraints (consistent with every Rel_* above)
Lay_Down(ui, handler)
Lay_Down(handler, prompt)
Lay_Right(guards, knowledge)
Lay_Right(knowledge, prompt)
Lay_Right(prompt, tools)
Lay_Right(tools, sdk)
Lay_Right(limiter, kbfiles)
Lay_Right(kbfiles, config)
Lay_Right(config, recorder)
Lay_Right(recorder, llm)
Lay_Right(hook, logs)

SHOW_LEGEND()
@enduml
```

**View this diagram** (PlantUML does NOT render in GitHub markdown):

- **Online**: https://www.plantuml.com/plantuml/uml/ (paste code above)
- **VS Code**: Install PlantUML extension (jebbs.plantuml)
- **CLI**: `java -jar plantuml.jar diagram.puml`

**Legend**: `SHOW_LEGEND()` renders the C4 key. Numbers on the handler's edges give the call order within one request. Config is also read by the handler (model, limits) and the rate limiter (window); those two edges are omitted to avoid crossings and are listed in the inventory.

### Layout conflict check

| Lay_* constraint | Rel_* on the same pair | Compatible |
|------------------|------------------------|------------|
| `Lay_Down(ui, handler)` | `Rel_Down(ui, handler)` | ✅ |
| `Lay_Down(handler, prompt)` | `Rel_Down(handler, prompt)` | ✅ |
| `Lay_Right(tools, sdk)` | `Rel_Left(sdk, tools)` | ✅ (Lay_Right(a,b) ↔ Rel_Left(b,a)) |
| `Lay_Right(config, recorder)` | `Rel_Left(recorder, config)` | ✅ |
| `Lay_Right(guards, knowledge)`, `Lay_Right(knowledge, prompt)`, `Lay_Right(prompt, tools)`, `Lay_Right(limiter, kbfiles)`, `Lay_Right(kbfiles, config)`, `Lay_Right(recorder, llm)`, `Lay_Right(hook, logs)` | none on these pairs | ✅ |

### Diagram Quality Gate

| # | Criterion | Target | Result | Status |
|---|-----------|--------|--------|--------|
| 1 | Edge crossings | < 5 | About 1 expected (`sdk → logs` passes between recorder and gateway columns); accepted | PASS |
| 2 | Visual hierarchy | Boundary most prominent | `Container_Boundary` encloses all 10 components | PASS |
| 3 | Grouping | Related elements proximate | Each collaborator sits directly above its leaf (guards→limiter, loader→files, tools→recorder, runtime→gateway) | PASS |
| 4 | Flow direction | Consistent | Top-down | PASS |
| 5 | Relationship traceability | Unambiguous | Numbered handler calls; one edge per pair | PASS |
| 6 | Abstraction level | One C4 level | Components of one container | PASS |
| 7 | Edge label readability | Legible | Function names as labels | PASS |
| 8 | Node placement | No long edges | All edges span ≤ 1 tier except `sdk → logs` (2 tiers) | PASS |
| 9 | Element count | ≤ 12 per container | 10/12 inside the boundary (+1 caller, 3 externals) | PASS |

**Accepted trade-off**: Two config edges (handler → config, limiter → config) are omitted, and one crossing on `sdk → logs` is accepted, to keep the tier ordering of the call sequence readable.

---

## Component Inventory

| Component | Type | Technology | Responsibility | Evolution Stage (indicative) | Build/Buy |
|-----------|------|------------|----------------|------------------------------|-----------|
| Route handler | Component | Next.js route handler (`route.ts:33-119`) | Orchestrates one turn; `trimHistory`, `messageText`, `transcriptOf` helpers | Custom (0.35) | BUILD |
| Request guards | Component | zod `bodySchema`, `safeValidateUIMessages`, explicit checks (`route.ts:34-78`) | Rejects bad requests before any model call; JSON `{ error }` contract | Custom (0.40) | BUILD |
| Rate limiter | Component | In-memory `Map` (`lib/rate-limit.ts`) | 10 requests / 60 s per IP; `clientKey` from `x-forwarded-for` / `x-real-ip` | Commodity (0.85) | BUILD (flag: USE a shared store at scale) |
| Knowledge loader | Component | `node:fs/promises` (`lib/knowledge.ts`) | Sorted `<doc name>` corpus, cached, cache reset on failure | Custom (0.40) | BUILD |
| Knowledge files | Component store | Markdown (`knowledge/*.md`) | Facts, Not published, How to answer | Custom (0.30) | BUILD (content) |
| Prompt builder | Component | Template string (`lib/prompt.ts`) | Grounding, links, escalation, scope/safety and style rules | Custom (0.30) | BUILD |
| Tool registry | Component | AI SDK `tool()` + zod (`lib/tools.ts`) | Deterministic booking URL; escalation with context | Custom (0.40) | BUILD |
| Escalation recorder | Component | `fetch` + `AbortSignal.timeout(3000)` (`lib/escalations.ts`) | Record, mask, log, post; never throws | Custom (0.40) | BUILD |
| Config | Component | Constant object (`lib/config.ts`) | Single home for model, limits and URLs (read by handler, limiter, tools, recorder) | Commodity (0.80) | BUILD (trivial) |
| LLM runtime | Component (library) | AI SDK 7 `streamText`, `@openrouter/ai-sdk-provider` | Streaming, multi-step tools, usage metrics | Product (0.65) | USE (open source) |

---

## Architecture Decisions

### Key Design Decisions

**Decision 1**: Guards run before any costly work, in cost order

- **Context**: A public endpoint pays per token.
- **Decision**: Cheap checks first (key, origin, rate limit, declared size), then parsing and schema, then semantic checks.
- **Rationale**: A rejected request never reaches the model (unit test `route.test.ts:110-113`).
- **Consequences**: The length check covers user turns only, and the size check trusts `Content-Length` (CDAU F-001, F-005).

**Decision 2**: Tools are built per request

- **Context**: Escalations need the conversation id and recent turns.
- **Decision**: `buildTools({ conversationId, transcript })` runs per request; a static `tools` instance is used only for message validation types.
- **Rationale**: Context travels with the tool without globals.
- **Consequences**: The transcript comes from client-supplied history (blocking decision C-1 in CDAU).

**Decision 3**: Behaviour, knowledge and configuration live in separate modules

- **Context**: Facts must never live in code (PRIN P-06).
- **Decision**: Rules in `prompt.ts`, facts in `knowledge/`, URLs and limits in `config.ts`.
- **Consequences**: Unit test `prompt.test.ts:27` asserts the prompt holds no URLs of its own.

### Technology Choices

| Technology | Purpose | Rationale | Evolution Stage |
|------------|---------|-----------|-----------------|
| AI SDK 7 `streamText` | Generation loop | `stopWhen: isStepCount(3)`, `instructions` with provider cache control | Product |
| zod 4 | Schemas | Body schema and tool input schema | Commodity |
| `AbortSignal.timeout` | Webhook bound | Built-in, no dependency | Commodity |

---

## Requirements Traceability

| Requirement ID | Description | Component(s) | Coverage Status |
|----------------|-------------|--------------|-----------------|
| FR-003 | Grounded answers | Knowledge loader, Prompt builder | ✅ |
| FR-007 | Booking tool | Tool registry, Config | ✅ |
| FR-013 / FR-014 | Human request flow and escalation tool | Prompt builder, Tool registry, Escalation recorder | ✅ |
| FR-015 | Truthful handoff confirmation | Escalation recorder, Tool registry | ⚠️ (always `ok: true`; CDAU F-003) |
| NFR-P-002 | Rate limit | Rate limiter | ⚠️ (per instance) |
| NFR-P-003 / NFR-F-001 | Bounded work, cost caps | Request guards, Config, LLM runtime | ⚠️ (CDAU F-001, F-002, F-015) |
| NFR-SEC-003 | Input validation | Request guards | ⚠️ |
| NFR-F-002 | Prompt caching | Route handler, LLM runtime | ✅ |
| NFR-M-001 | Observability | LLM runtime (onEnd), Escalation recorder | ⚠️ |
| DR-001 | Knowledge provenance | Knowledge files (guard hook outside runtime) | ⚠️ (CDAU F-013) |
| DR-002 | Escalation schema | Escalation recorder | ✅ |
| DR-004 | PII minimisation | Escalation recorder, Route handler | ⚠️ |

**Coverage Summary**:

- Total Requirements: 14 (grouped rows counted individually)
- Covered: 6 (43%)
- Partially Covered: 8
- Not Covered: 0

---

## Integration Points

### External Systems

| External System | Interface | Protocol | Responsibility | SLA |
|----------------|-----------|----------|----------------|-----|
| Model gateway | `openrouter(CONFIG.model)` via `streamText` | HTTPS, bearer key | Generation | 30 s function limit; no abort on client disconnect (CDAU F-015) |
| Team chat webhook | `fetch(webhook, { method: "POST" })` | HTTPS, JSON | Handoff delivery | 3 s timeout; no retry |
| Runtime logs | `console.info` / `console.error` | stdout | Telemetry | Platform |

### APIs and Endpoints

| API | Endpoint | Method | Purpose | Authentication |
|-----|----------|--------|---------|----------------|
| Chat API | `/api/chat` | POST | See DIAG-002 | None (Origin check, rate limit) |
| Tool `get_booking_link` | in-process | — | Returns `{ url }` from config | n/a |
| Tool `escalate_to_human` | in-process | — | Input `{ email, name?, question, reason }` → `{ ok, id }` | n/a |

---

## Data Flow

Within one request, the history is trimmed to the last 12 messages, starting at the first user turn. The transcript is the last 6 non-empty turns (≤ 500 chars each). The corpus is read once per instance. Full PII table: see **ARC-001-DIAG-002**. Logical data model: see **ARC-001-DIAG-007**.

**DPIA Required**: Yes (before production)
**DPO Consulted**: N/A

---

## Security Architecture

| Control | Type | Component(s) | Implementation |
|---------|------|--------------|----------------|
| Guard ordering | Preventive | Request guards | `route.ts:34-78` |
| Deterministic outputs | Preventive | Tool registry, Config | URLs from config only |
| Webhook timeout, never-throw | Resilience | Escalation recorder | `escalations.ts:70-82` |
| Content-free usage telemetry | Privacy | LLM runtime (onEnd) | `route.ts:98-113` (raw error logging exception: CDAU F-009) |

Zones, authentication and headers: see **ARC-001-DIAG-002**.

---

## Deployment Architecture

All components run inside one serverless function instance; see **ARC-001-DIAG-006**.

---

## Non-Functional Requirements

| Requirement | Target | Component(s) | How Achieved |
|-------------|--------|--------------|--------------|
| Bounded output | ≤ 600 tokens per step, ≤ 3 steps | LLM runtime, Config | `maxOutputTokens`, `stopWhen` |
| History window | 12 messages | Route handler | `trimHistory` |
| Rate | 10 / 60 s / IP | Rate limiter | Fixed window |
| Webhook bound | 3 s | Escalation recorder | `AbortSignal.timeout` |

---

## UK Government Compliance (if applicable)

Not applicable (private US company).

---

## Wardley Map Integration

**Related Wardley Map**: N/A. Indicative stages are in the inventory. The only mismatch is the in-memory rate limiter: a commodity capability built in-house, accepted for the MVP.

- [x] All BUILD decisions align with Genesis/Custom stage, except the rate limiter and config (trivial)
- [x] All BUY decisions align with Product stage (none)
- [x] All USE decisions align with Commodity/Product stage (LLM runtime library)
- [ ] No commodity components being built (rate limiter, see above)
- [x] No Genesis components being bought

---

## Linked Artifacts

**Requirements**: `projects/001-cadre-chatbot/ARC-001-REQ-v1.0.md`
**Architecture Principles**: `projects/000-global/ARC-000-PRIN-v1.0.md`
**Codebase Audit**: `projects/001-cadre-chatbot/audits/ARC-001-CDAU-001-v1.0.md`
**Other views**: DIAG-002 (Container), DIAG-004 (Code), DIAG-005 (Sequence), DIAG-009 (Flowchart)

---

## Change Log

| Version | Date | Author | Changes | Rationale |
|---------|------|--------|---------|-----------|
| v1.0 | 2026-09-27 | ArcKit AI | Initial diagram | Document Chat API components at `d63c3ac` |

**Next Review Date**: 2026-10-27

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| APP | cadre-chatbot repository at `d63c3ac` | Reference implementation | github.com/johnfelipe/cadre-chatbot | `app/api/chat/route.ts`, `lib/*.ts`, `knowledge/`, tests |
| CDAU | ARC-001-CDAU-001-v1.0.md | Codebase audit | 001-cadre-chatbot/audits/ | Gap references |
| REQ | ARC-001-REQ-v1.0.md | Requirements | 001-cadre-chatbot/ | Traceability |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf | 001-cadre-chatbot/external/ | No component-level content |
| Next Steps  Tech Challenge  Cadre AI.txt | 001-cadre-chatbot/external/ | No component-level content (live credential not reproduced) |

---

**Generated by**: ArcKit `/arckit:diagram` command
**Generated on**: 2026-09-27 GMT
**ArcKit Version**: 6.16.3
**Project**: Cadre AI Support Chatbot — cadre-chatbot (Project 001)
**AI Model**: Claude Opus 5.5 (claude-opus-5-5)
**Generation Context**: As-built repository at commit `d63c3ac`, ARC-001-CDAU-001-v1.0, ARC-001-REQ-v1.0
