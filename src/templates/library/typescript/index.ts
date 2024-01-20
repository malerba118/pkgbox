import { TemplateOptions } from "../..";
import { renderFiles } from "../../utils";

const files = {
  "index.ts": {
    code: require("!!raw-loader!./files/index.ts").default,
  },
  "add.ts": {
    code: require("!!raw-loader!./files/add.ts").default,
  },
  "subtract.ts": {
    code: require("!!raw-loader!./files/subtract.ts").default,
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
  return renderFiles(files, {
    name: options.name,
  });
};
