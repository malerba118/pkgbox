import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import fs from "fs";

const rawData = fs.readFileSync("./package.json");
const packageJson = JSON.parse(rawData);

// Custom Rollup plugin to copy and modify package.json
const copyPackageJson = () => ({
  name: "copy-package-json",
  generateBundle() {
    const modifiedPackageJson = {
      ...packageJson,
      main: "index.js",
      module: "index.mjs",
      typings: "index.d.ts",
    };
    this.emitFile({
      type: "asset",
      fileName: "package.json",
      source: JSON.stringify(modifiedPackageJson, null, 2),
    });
  },
});

export default [
  {
    input: "index.tsx",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [esbuild(), copyPackageJson()],
  },
  {
    input: "index.tsx",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
