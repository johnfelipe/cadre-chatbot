// PreToolUse hook: blocks an edit to knowledge/*.md that adds a fact with a number, price, percentage or URL
// under "## Facts" without a "(source: ...)". Exit code 2 blocks the tool call and shows stderr to Claude.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const RISKY = /\d|\$|%|https?:\/\//;

export function factItems(markdown) {
  const items = [];
  let inFacts = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      inFacts = line.trim().toLowerCase() === "## facts";
      continue;
    }
    if (!inFacts) continue;
    if (line.startsWith("- ")) items.push(line.slice(2).trim());
    else if (/^\s+\S/.test(line) && items.length) items[items.length - 1] += ` ${line.trim()}`;
  }
  return items;
}

export function unsourcedFacts(before, after) {
  const existing = new Set(factItems(before));
  return factItems(after).filter((item) => !existing.has(item) && RISKY.test(item) && !item.includes("(source:"));
}

function applyEdit(content, oldString, newString, replaceAll) {
  return replaceAll ? content.split(oldString).join(newString) : content.replace(oldString, () => newString);
}

export function contentAfter(toolName, input, before) {
  if (toolName === "Write") return input.content ?? "";
  if (toolName === "Edit") return applyEdit(before, input.old_string ?? "", input.new_string ?? "", input.replace_all);
  if (toolName === "MultiEdit") {
    return (input.edits ?? []).reduce((acc, e) => applyEdit(acc, e.old_string ?? "", e.new_string ?? "", e.replace_all), before);
  }
  return before;
}

function main() {
  const event = JSON.parse(readFileSync(0, "utf8"));
  const filePath = event.tool_input?.file_path ?? "";
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const relative = path.relative(root, path.resolve(root, filePath)).split(path.sep).join("/");
  if (!relative.startsWith("knowledge/") || !relative.endsWith(".md")) return;

  const before = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
  const problems = unsourcedFacts(before, contentAfter(event.tool_name, event.tool_input, before));
  if (problems.length === 0) return;

  process.stderr.write(
    `Blocked: ${relative} gets facts with numbers, prices or URLs but no "(source: <url>)":\n` +
      problems.map((p) => `- ${p}`).join("\n") +
      "\nAdd the URL you fetched, or mark the gap as [NOT PUBLISHED] instead (CLAUDE.md rules).\n",
  );
  process.exit(2);
}

// Run only as a hook, not when imported by a test.
if (process.argv[1]?.endsWith("guard-knowledge.mjs")) main();
