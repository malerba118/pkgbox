import { Template } from "../../state/types";

export const VANILLA_TEMPLATE: Template = {
  library: {
    "/index.ts": {
      code: require("!!raw-loader!./library/index.ts").default,
    },
    "/add.ts": {
      code: require("!!raw-loader!./library/add.ts").default,
    },
    "/subtract.ts": {
      code: require("!!raw-loader!./library/subtract.ts").default,
    },
    "/key-by.ts": {
      code: require("!!raw-loader!./library/key-by.ts").default,
    },
    "/package.json": {
      code: require("!!raw-loader!./library/package.json").default,
    },
    "/tsconfig.json": {
      code: require("!!raw-loader!./library/tsconfig.json").default,
    },
    "/rollup.config.mjs": {
      code: require("!!raw-loader!./library/rollup.config.mjs").default,
    },
  },
  example: {
    "/.eslintrc.cjs": {
      code: require("!!raw-loader!./example/.eslintrc.cjs").default,
    },
    "/.gitignore": {
      code: require("!!raw-loader!./example/.gitignore").default,
    },
    "/README.md": {
      code: require("!!raw-loader!./example/README.md").default,
    },
    "/index.html": {
      code: require("!!raw-loader!./example/index.html").default,
    },
    "/package.json": {
      code: require("!!raw-loader!./example/package.json").default,
    },
    "/public/vite.svg": {
      code: require("!!raw-loader!./example/public/vite.svg").default,
    },
    "/src/App.css": {
      code: require("!!raw-loader!./example/src/App.css").default,
    },
    "/src/App.tsx": {
      code: require("!!raw-loader!./example/src/App.tsx").default,
    },
    "/src/assets/react.svg": {
      code: require("!!raw-loader!./example/src/assets/react.svg").default,
    },
    "/src/index.css": {
      code: require("!!raw-loader!./example/src/index.css").default,
    },
    "/src/main.tsx": {
      code: require("!!raw-loader!./example/src/main.tsx").default,
    },
    "/src/vite-env.d.ts": {
      code: require("!!raw-loader!./example/src/vite-env.d.ts").default,
    },
    "/tsconfig.json": {
      code: require("!!raw-loader!./example/tsconfig.json").default,
    },
    "/tsconfig.node.json": {
      code: require("!!raw-loader!./example/tsconfig.node.json").default,
    },
    "/vite.config.ts": {
      code: require("!!raw-loader!./example/vite.config.ts").default,
    },
  },
  tests: {
    "/README.md": {
      code: "# Vitest Demo\n\nRun `npm test` and change a test or source code to see HMR in action!\n\nLearn more at https://vitest.dev\n",
    },
    "/package.json": {
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
    "math": "file:../math-0.0.0.tgz"
  }
}
`,
    },
    "/tests/math.test.ts": {
      code: 'import { assert, expect, test } from "vitest";\nimport { add, subtract } from "math";\n\ntest("Add", () => {\n  expect(add(1, 1)).toBe(2);\n});\n\ntest("Subtract", () => {\n  expect(subtract(15, 3)).toBe(12);\n});\n',
    },
    "/tsconfig.json": {
      code: '{\n  "compilerOptions": {\n    "target": "es2020",\n    "module": "node16",\n    "strict": true,\n    "declaration": true,\n    "declarationMap": true,\n    "sourceMap": true,\n    "verbatimModuleSyntax": true\n  },\n  "include": ["tests"],\n  "exclude": ["node_modules"]\n}\n',
    },
    "/output.json": {
      code: "{}",
    },
    "/vite.config.ts": {
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
