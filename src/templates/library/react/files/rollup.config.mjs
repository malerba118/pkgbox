import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import fs from "fs";

const rawData = fs.readFileSync("./package.json");
const packageJson = JSON.parse(rawData);

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
        dir: "dist",
        entryFileNames: "[name].js",
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: "dist",
        entryFileNames: "[name].mjs",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
      },
    ],
    plugins: [
      esbuild({}),
      postcss({
        modules: true,
        inject(cssVariableName) {
          return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
        },
      }),
      copyPackageJson(),
    ],
  },
  {
    input: "./index.tsx",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
