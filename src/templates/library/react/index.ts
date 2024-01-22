import { TemplateOptions } from "../..";
import { renderFiles } from "../../utils";

const files = {
  "index.tsx": {
    code: require("!!raw-loader!./files/index.tsx").default,
  },
  "styles.module.css": {
    code: require("!!raw-loader!./files/styles.module.css").default,
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
  "globals.d.ts": {
    code: require("!!raw-loader!./files/globals.d.ts").default,
  },
};

export const getFiles = (options: TemplateOptions) => {
  return renderFiles(files, {
    name: options.name,
  });
};
