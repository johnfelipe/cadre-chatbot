// Runs evals/cases.ts against a running /api/chat. Every case is a real model call and spends budget.
// Usage: npm run eval [-- <case-id-prefix> ...]   Target: EVAL_URL (default http://localhost:3000)
import { readdir, readFile } from "node:fs/promises";
import { cases, type EvalCase, type ToolName } from "./cases.ts";

const BASE_URL = process.env.EVAL_URL ?? "http://localhost:3000";
// The chat route allows 10 requests per minute per IP.
const DELAY_MS = 6500;
const URL_PATTERN = /https?:\/\/[^\s)\]>"'<,]+/g;

function normalizeUrl(url: string): string {
  return url.replace(/[.;:!?]+$/, "").replace(/\/$/, "");
}

// URLs the bot may cite: the ones written in knowledge/, plus whatever a tool returned in the same answer.
async function knowledgeUrls(): Promise<Set<string>> {
  const dir = new URL("../knowledge/", import.meta.url);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md"));
  const texts = await Promise.all(files.map((file) => readFile(new URL(file, dir), "utf8")));
  return new Set(texts.flatMap((text) => (text.match(URL_PATTERN) ?? []).map(normalizeUrl)));
}

type Answer = { text: string; tools: ToolName[]; toolUrls: string[]; error?: string };

async function ask(evalCase: EvalCase): Promise<Answer> {
  const turns = [...(evalCase.history ?? []), { role: "user" as const, text: evalCase.prompt }];
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: `eval-${evalCase.id}`,
      trigger: "submit-message",
      messages: turns.map((turn, i) => ({
        id: `${evalCase.id}-${i}`,
        role: turn.role,
        parts: [{ type: "text", text: turn.text }],
      })),
    }),
  });

  if (!res.ok) return { text: "", tools: [], toolUrls: [], error: `HTTP ${res.status}: ${await res.text()}` };

  const answer: Answer = { text: "", tools: [], toolUrls: [] };
  for (const line of (await res.text()).split("\n")) {
    if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
    const chunk = JSON.parse(line.slice(6));
    if (chunk.type === "text-delta") answer.text += chunk.delta;
    if (chunk.type === "tool-input-available") answer.tools.push(chunk.toolName);
    if (chunk.type === "tool-output-available") {
      for (const key of ["url", "fallbackUrl"]) if (chunk.output?.[key]) answer.toolUrls.push(chunk.output[key]);
    }
    if (chunk.type === "error") answer.error = chunk.errorText;
  }
  return answer;
}

function check(evalCase: EvalCase, answer: Answer, allowedUrls: Set<string>): string[] {
  if (answer.error) return [answer.error];
  const failures: string[] = [];

  if (evalCase.expectTool && !answer.tools.includes(evalCase.expectTool)) {
    failures.push(`expected tool ${evalCase.expectTool}, got [${answer.tools.join(", ")}]`);
  }
  if (evalCase.forbidTool && answer.tools.includes(evalCase.forbidTool)) {
    failures.push(`called forbidden tool ${evalCase.forbidTool}`);
  }
  for (const pattern of evalCase.mustMatch ?? []) {
    if (!pattern.test(answer.text)) failures.push(`missing ${pattern}`);
  }
  for (const pattern of evalCase.mustNotMatch ?? []) {
    if (pattern.test(answer.text)) failures.push(`matched forbidden ${pattern}`);
  }

  const toolUrls = answer.toolUrls.map(normalizeUrl);
  for (const url of (answer.text.match(URL_PATTERN) ?? []).map(normalizeUrl)) {
    if (!allowedUrls.has(url) && !toolUrls.includes(url)) failures.push(`URL not in knowledge or tool output: ${url}`);
  }
  return failures;
}

async function main() {
  const filters = process.argv.slice(2);
  const selected = filters.length ? cases.filter((c) => filters.some((f) => c.id.startsWith(f))) : cases;
  if (selected.length === 0) throw new Error(`No cases match: ${filters.join(", ")}`);

  const allowedUrls = await knowledgeUrls();
  console.log(`Running ${selected.length} case(s) against ${BASE_URL}\n`);
  let failed = 0;

  for (const [i, evalCase] of selected.entries()) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    const answer = await ask(evalCase);
    const failures = check(evalCase, answer, allowedUrls);
    if (failures.length) failed += 1;

    console.log(`${failures.length ? "FAIL" : "PASS"}  ${evalCase.id}`);
    console.log(`  Q: ${evalCase.prompt}`);
    console.log(`  A: ${answer.text.replace(/\s+/g, " ").trim() || "(no text)"}`);
    if (answer.tools.length) console.log(`  tools: ${answer.tools.join(", ")}`);
    for (const failure of failures) console.log(`  x ${failure}`);
    console.log();
  }

  console.log(`${selected.length - failed}/${selected.length} passed`);
  if (failed) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
