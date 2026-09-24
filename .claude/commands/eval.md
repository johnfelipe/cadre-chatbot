---
description: Run behavioural evals (real model calls, spends budget) and diagnose failures
argument-hint: [case-id prefixes, e.g. "s2 pricing"; empty = all cases]
---

Run the evals with the `eval-runner` subagent. Cases to run: $ARGUMENTS (all cases if empty).

Before starting, state how many cases will run and the rough cost (about $0.006 each, see plan.md), and confirm a server is reachable at `EVAL_URL` or http://localhost:3000.

After the subagent reports:
1. Show its table of results and proposed fixes.
2. Apply the fixes the user approves. Knowledge changes go through the `knowledge-writer` subagent; prompt and tool changes are edited directly.
3. For every real bot bug that was found, make sure a case in `evals/cases.ts` covers it.
4. Re-run only the cases that failed, once.
