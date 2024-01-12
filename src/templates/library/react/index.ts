import { TemplateOptions } from "../..";

const files = {
  "index.tsx": {
    code: require("!!raw-loader!./files/index.tsx").default,
  },
  "add.ts": {
    code: require("!!raw-loader!./files/add.ts").default,
  },
  "subtract.ts": {
    code: require("!!raw-loader!./files/subtract.ts").default,
  },
  "key-by.ts": {
    code: require("!!raw-loader!./files/key-by.ts").default,
  },
  "package.json": {
    code: require("!!raw-loader!./files/package.json").default,
  },
  "tsconfig.json": {
    code: require("!!raw-loader!./files/tsconfig.json").default,
  },
  "rollup.config.mjs": {
    code: require("!!raw-loader!./files/rollup.config.mjs").default,
  },
};

export const getFiles = (options: TemplateOptions) => {
  const pkg = JSON.parse(files["package.json"].code);
  pkg.name = options.name;
  return { ...files, "package.json": { code: JSON.stringify(pkg, null, 2) } };
};