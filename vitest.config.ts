import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Globs skip dot-folders, so the Claude Code hook tests are listed explicitly.
    include: ["**/*.test.{ts,tsx}", ".claude/hooks/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    restoreMocks: true,
    unstubEnvs: true,
  },
});
