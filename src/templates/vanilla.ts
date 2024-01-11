import { Template } from "../state/types";

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
      code: "module.exports = {\n  root: true,\n  env: { browser: true, es2020: true },\n  extends: [\n    'eslint:recommended',\n    'plugin:@typescript-eslint/recommended',\n    'plugin:react-hooks/recommended',\n  ],\n  ignorePatterns: ['dist', '.eslintrc.cjs'],\n  parser: '@typescript-eslint/parser',\n  plugins: ['react-refresh'],\n  rules: {\n    'react-refresh/only-export-components': [\n      'warn',\n      { allowConstantExport: true },\n    ],\n  },\n}\n",
    },
    "/.gitignore": {
      code: "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n",
    },
    "/README.md": {
      code: "# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type aware lint rules:\n\n- Configure the top-level `parserOptions` property like this:\n\n```js\nexport default {\n  // other rules...\n  parserOptions: {\n    ecmaVersion: 'latest',\n    sourceType: 'module',\n    project: ['./tsconfig.json', './tsconfig.node.json'],\n    tsconfigRootDir: __dirname,\n  },\n}\n```\n\n- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`\n- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`\n- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list\n",
    },
    "/index.html": {
      code: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n',
    },
    "/package.json": {
      code: `{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --force",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "math": "file:../../math-0.0.0.tgz"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
`,
    },
    "/public/vite.svg": {
      code: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>',
    },
    "/src/App.css": {
      code: "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n",
    },
    "/src/App.tsx": {
      code: `import { useState } from 'react';
  import { add, subtract } from 'math';
  import reactLogo from './assets/react.svg';
  import viteLogo from '/vite.svg';
  import './App.css';
  
  function App() {
    const [count, setCount] = useState(0);
  
    return (
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((currentCount) => add(currentCount, 1))}>
            count is {count}
          </button>
          <button onClick={() => setCount((currentCount) => subtract(currentCount, 1))}>
            Decrement
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    );
  }
  
  export default App;
      `,
    },
    "/src/assets/react.svg": {
      code: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>',
    },
    "/src/index.css": {
      code: ":root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n",
    },
    "/src/main.tsx": {
      code: "import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.tsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n",
    },
    "/src/vite-env.d.ts": {
      code: '/// <reference types="vite/client" />\n',
    },
    "/tsconfig.json": {
      code: '{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"],\n  "references": [{ "path": "./tsconfig.node.json" }]\n}\n',
    },
    "/tsconfig.node.json": {
      code: '{\n  "compilerOptions": {\n    "composite": true,\n    "skipLibCheck": true,\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "allowSyntheticDefaultImports": true\n  },\n  "include": ["vite.config.ts"]\n}\n',
    },
    "/vite.config.ts": {
      code: `import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
  
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        react(),
      ]
    });`,
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
