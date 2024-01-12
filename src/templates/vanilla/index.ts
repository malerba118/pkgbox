import { Template } from "../../state/types";

export const VANILLA_TEMPLATE: Template = {
  library: {
    "/index.ts": {
      code: `export { add } from './add';
export { subtract } from './subtract';`,
    },
    "/add.ts": {
      code: `export function add(a: number, b: number): number {
    return a + b;
}`,
    },
    "/subtract.ts": {
      code: `export function subtract(a: number, b: number): number {
    return a - b;
}`,
    },
    "/package.json": {
      code: JSON.stringify(
        {
          name: "math",
          version: "0.0.0",
          main: "index.ts",
          devDependencies: {
            esbuild: "latest",
            rollup: "latest",
            "rollup-plugin-esbuild": "latest",
            "rollup-plugin-dts": "latest",
          },
          scripts: {
            build: "rollup -c",
          },
        },
        null,
        4
      ),
    },
    "/tsconfig.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            target: "esnext",
            module: "esnext",
            moduleResolution: "bundler",
            jsx: "react",
            declaration: true,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
          },
          include: ["./**/*"],
          exclude: ["node_modules", "**/*.spec.ts", "dist/**/*"],
        },
        null,
        4
      ),
    },
    "/rollup.config.mjs": {
      code: `import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs'

const rawData = fs.readFileSync('./package.json');
const packageJson = JSON.parse(rawData);

// Custom Rollup plugin to copy and modify package.json
const copyPackageJson = () => ({
    name: 'copy-package-json',
    generateBundle() {
        const modifiedPackageJson = {
            ...packageJson,
            main: 'index.js',
            module: 'index.mjs',
            typings: 'index.d.ts',
        };
        this.emitFile({
            type: 'asset',
            fileName: 'package.json',
            source: JSON.stringify(modifiedPackageJson, null, 2),
        });
    }
});


const bundle = config => ({
    ...config,
    input: packageJson.main || 'index.ts',
    external: id => !/^[./]/.test(id),
});

export default [
    bundle({
        plugins: [esbuild(), copyPackageJson()],
        output: [
            {
                file: \`dist/index.js\`,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: \`dist/index.mjs\`,
                format: 'es',
                sourcemap: true,
            },
        ],
    }),
    bundle({
        plugins: [dts()],
        output: {
            file: \`dist/index.d.ts\`,
            format: 'es',
        },
    }),
];
          `,
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
    "math": "file:../../math-0.0.0.tgz"
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
