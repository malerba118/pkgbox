import { TemplateOptions } from "../..";
import { renderFiles } from "../../utils";

const files = {
  "README.md": {
    code: require("!!raw-loader!./files/README.md").default,
  },
  "package.json": {
    code: require("!!raw-loader!./files/package.json").default,
  },
  "tests/browser.test.ts": {
    code: require("!!raw-loader!./files/tests/browser.test.ts").default,
  },
  "tsconfig.json": {
    code: require("!!raw-loader!./files/tsconfig.json").default,
  },
  "output.json": {
    code: require("!!raw-loader!./files/output.json").default,
  },
  "vite.config.ts": {
    code: require("!!raw-loader!./files/vite.config.ts").default,
  },
};

export const getFiles = (options: TemplateOptions) => {
  return renderFiles(files, {
    name: options.name,
  });
};
