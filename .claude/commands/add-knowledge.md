---
description: Research a topic on cadreai.com and add sourced facts to knowledge/
argument-hint: <topic or cadreai.com URL>
---

Add or correct what the bot knows about: $ARGUMENTS

1. Use the `knowledge-writer` subagent with the topic and the most relevant file in `knowledge/` (create a new file only if no existing one fits).
2. Review its diff yourself: every new fact has a URL that was fetched, nothing was inferred, and `[NOT PUBLISHED]` bullets were removed only when replaced by a sourced fact.
3. If the change adds a real link (booking, portal), it belongs in `lib/config.ts` or an env var, not only in Markdown. Say which.
4. Add or update the eval case in `evals/cases.ts` that covers the new answer.
5. Report the facts added, the gaps left, and which `/eval` cases to run.
