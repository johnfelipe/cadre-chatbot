import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contentAfter, unsourcedFacts } from "./guard-knowledge.mjs";

const file = (facts: string, extra = "") => `# Pricing\n\n## Facts\n${facts}\n\n## How to answer\n${extra}\n`;

describe("guard-knowledge hook", () => {
  it("accepts every fact already in knowledge/", () => {
    const dir = path.join(process.cwd(), "knowledge");
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      expect(unsourcedFacts("", readFileSync(path.join(dir, name), "utf8")), name).toEqual([]);
    }
  });

  it("blocks a new fact with a price and no source", () => {
    const before = file("- Service pricing is a common inquiry.");
    const after = contentAfter("Edit", { old_string: "inquiry.", new_string: "inquiry.\n- Engagements start at $5,000." }, before);
    expect(unsourcedFacts(before, after)).toEqual(["Engagements start at $5,000."]);
  });

  it("allows the same fact with a source, including on a continuation line", () => {
    const after = file("- Engagements start at $5,000.\n  (source: https://cadreai.com/pricing)");
    expect(unsourcedFacts("", after)).toEqual([]);
  });

  it("ignores numbers outside the Facts section, such as suggested wording", () => {
    const after = file("- Pricing isn't published.", '- Suggested wording: "call (619) 324-3223 or visit https://cadreai.com/contact"');
    expect(unsourcedFacts("", after)).toEqual([]);
  });

  it("does not flag facts that were already there", () => {
    const before = file("- Legacy fact from 2024.");
    expect(unsourcedFacts(before, `${before}\n`)).toEqual([]);
  });

  it("applies MultiEdit edits in order", () => {
    const after = contentAfter(
      "MultiEdit",
      { edits: [{ old_string: "A", new_string: "B" }, { old_string: "B", new_string: "C" }] },
      "A",
    );
    expect(after).toBe("C");
  });
});
