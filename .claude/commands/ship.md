---
description: Verify, review, commit and push the current change, then redeploy if the project is linked to Vercel
argument-hint: [optional commit intent, e.g. "fix booking fallback"]
---

Ship the current working-tree change. Intent from the user: $ARGUMENTS

1. Run `git status` and `git diff HEAD`. If there is nothing to ship, say so and stop.
2. Run `npm run lint`, `npm run typecheck` and `npm run build`. If any fails, fix the cause (not the check) and rerun. Stop and report if you can't.
3. Use the `code-reviewer` subagent on the diff. Fix every **Must fix** item and rerun step 2 if you changed code.
4. If `knowledge/`, `lib/prompt.ts` or `lib/tools.ts` changed, remind the user to run `/eval` for the affected scenarios. Don't run it yourself: it spends budget.
5. Split unrelated changes into separate commits. For each one, write the message in English: a conventional prefix (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`), a title under ~70 characters, and a body that says what changed and why.
6. If the change affects scope or a decision, update `plan.md` in the same commit (use `/log-decision` for new decisions).
7. `git push` right after committing.
8. If `.vercel/` exists, run `npx vercel --prod` and report the URL. Otherwise say the deploy is not set up.

Report: commits created (hash and title), checks run, reviewer findings, and deploy result.
