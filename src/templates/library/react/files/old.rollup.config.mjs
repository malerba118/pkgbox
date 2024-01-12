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

const bundle = (config) => ({
  ...config,
  input: packageJson.main || "index.ts",
  // external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), copyPackageJson()],
    output: [
      {
        file: `dist/index.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `dist/index.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  }),
];
