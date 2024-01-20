import * as example from "./example";
import * as library from "./library";
import * as tests from "./tests";

import { Template, FileMap } from "../state/types";

export interface TemplateOptions {
  name: string;
  library: library.LibraryTemplateType;
  example: example.ExampleTemplateType;
}

export const getTemplate = (options: TemplateOptions): Template => {
  return {
    library: library.getFileMap(options),
    example: example.getFileMap(options),
    tests: tests.getFileMap(options),
  };
};
