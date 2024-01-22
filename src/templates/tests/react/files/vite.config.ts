/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: false,
    reporters: ["json", "default"],
    outputFile: "./output.json",
  },
});
