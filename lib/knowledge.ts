import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

let cached: Promise<string> | null = null;

export function loadKnowledge(): Promise<string> {
  cached ??= readKnowledge().catch((error: unknown) => {
    cached = null;
    throw error;
  });
  return cached;
}

async function readKnowledge(): Promise<string> {
  const files = (await readdir(KNOWLEDGE_DIR)).filter((file) => file.endsWith(".md")).sort();
  if (files.length === 0) throw new Error(`No knowledge files found in ${KNOWLEDGE_DIR}`);

  const docs = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(path.join(KNOWLEDGE_DIR, file), "utf8");
      return `<doc name="${file}">\n${content.trim()}\n</doc>`;
    }),
  );
  return docs.join("\n\n");
}
