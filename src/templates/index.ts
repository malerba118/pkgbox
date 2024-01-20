import * as example from "./example";
import * as library from "./library";

import { Template, FileMap } from "../state/types";

export interface TemplateOptions {
  name: string;
  library: library.LibraryTemplateType;
  example: example.ExampleTemplateType;
}

export const getTemplate = (options: TemplateOptions): Template => {
  return {
    library: library.getFileMap(options),
    example: example.getFileMap(options),
    tests: {
      "README.md": {
        code: "# Vitest Demo\n\nRun `npm test` and change a test or source code to see HMR in action!\n\nLearn more at https://vitest.dev\n",
      },
      "package.json": {
        code: `{
    "name": "@vitest/tests",
    "type": "module",
    "private": true,
    "license": "MIT",
    "main": "index.js",
    "scripts": {
      "test": "vitest"
    },
    "devDependencies": {
      "vite": "latest",
      "vitest": "latest",
      "${options.name}": "file:../.library/${options.name}-0.0.0.tgz"
    }
  }
  `,
      },
      "tests/browser.test.ts": {
        code: 'import { assert, expect, test } from "vitest";\nimport { add, subtract } from "<PACKAGE_NAME_PLACEHOLDER>";\n\ntest("Add", () => {\n  expect(add(1, 1)).toBe(2);\n});\n\ntest("Subtract", () => {\n  expect(subtract(15, 3)).toBe(12);\n});\n',
      },
      "tsconfig.json": {
        code: '{\n  "compilerOptions": {\n    "target": "es2020",\n    "module": "node16",\n    "strict": true,\n    "declaration": true,\n    "declarationMap": true,\n    "sourceMap": true,\n    "verbatimModuleSyntax": true\n  },\n  "include": ["tests"],\n  "exclude": ["node_modules"]\n}\n',
      },
      "output.json": {
        code: "{}",
      },
      "vite.config.ts": {
        code: `/// <reference types="vitest" />
    
    // Configure Vitest (https://vitest.dev/config/)
    
    import { defineConfig } from "vite";
    
    export default defineConfig({
      test: {
        globals: false,
        reporters: ['json', 'default'],
        outputFile: './output.json',
      },
    });
        `,
      },
    },
  };
};
