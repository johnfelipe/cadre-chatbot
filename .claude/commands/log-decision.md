---
description: Record a design decision or scope cut in plan.md
argument-hint: <decision, e.g. "use Upstash for rate limiting because ...">
---

Record this decision in `plan.md`: $ARGUMENTS

1. Read `plan.md`. If the decision changes an existing row in **Decisions & trade-offs**, edit that row instead of adding a duplicate.
2. Otherwise add a row: `| Decision | Why | Revisit when |`. Keep each cell to one line and concrete (numbers, triggers).
3. If it moves something in or out of scope, update the **Scope** IN/OUT lists and, if relevant, **Known limitations**.
4. If it changes how the code is organised or which commands to run, update `CLAUDE.md` too.
5. Commit with `docs: <short decision>` in English and push.
