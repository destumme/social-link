import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    setupFiles: ["src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["src/generated/**", "src/tests/**", "node_modules/**"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/tests/unit/**/*.test.ts"],
          fileParallelism: true,
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["src/tests/integration/**/*.test.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
