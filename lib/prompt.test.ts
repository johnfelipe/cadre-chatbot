import { readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadKnowledge } from "@/lib/knowledge";
import { buildSystemPrompt } from "@/lib/prompt";

describe("loadKnowledge", () => {
  it("includes every knowledge file, wrapped in a doc tag", async () => {
    const files = (await readdir(path.join(process.cwd(), "knowledge"))).filter((f) => f.endsWith(".md"));
    const knowledge = await loadKnowledge();

    expect(files.length).toBeGreaterThan(0);
    for (const file of files) expect(knowledge).toContain(`<doc name="${file}">`);
  });

  it("caches the result", async () => {
    expect(await loadKnowledge()).toBe(await loadKnowledge());
  });
});

describe("buildSystemPrompt", () => {
  it("injects the knowledge inside the knowledge block, after the rules", () => {
    const prompt = buildSystemPrompt("<doc name=\"x.md\">FACT</doc>");
    expect(prompt).toMatch(/<rules>[\s\S]*<\/rules>[\s\S]*<knowledge>\s*<doc name="x.md">FACT<\/doc>\s*<\/knowledge>/);
  });

  it("holds behaviour only: no URLs of its own", () => {
    expect(buildSystemPrompt("")).not.toMatch(/https?:\/\//);
  });
});
