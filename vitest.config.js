import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["dev"],
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts", "test/**/*.{test,spec}.ts"],
  },
});
