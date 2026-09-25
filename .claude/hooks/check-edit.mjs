// PostToolUse hook: after Claude edits a .ts/.tsx file, lint that file and typecheck the project.
// Exit code 2 sends the errors back to Claude so it fixes them before moving on.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const event = JSON.parse(readFileSync(0, "utf8"));
const filePath = event.tool_input?.file_path ?? "";
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

if (/\.(ts|tsx)$/.test(filePath) && !path.relative(root, filePath).startsWith("node_modules")) {
  const run = (args) => spawnSync("npx", args, { cwd: root, encoding: "utf8", shell: process.platform === "win32" });
  const failures = [
    ["eslint", run(["eslint", filePath])],
    ["tsc", run(["tsc", "--noEmit", "--pretty", "false"])],
  ].filter(([, result]) => result.status !== 0);

  if (failures.length > 0) {
    const report = failures
      .map(([name, result]) => `${name} failed:\n${(result.stdout + result.stderr).trim().slice(0, 4000)}`)
      .join("\n\n");
    process.stderr.write(`${report}\n\nFix these before continuing.\n`);
    process.exit(2);
  }
}
