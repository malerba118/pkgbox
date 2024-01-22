import { TemplateOptions } from "..";
import { FileMap } from "../../state/types";
import { LibraryTemplateType } from "../library";
import * as REACT_TEMPLATE from "./react";

export const getFileMap = (options: TemplateOptions): FileMap => {
  if (options.library === LibraryTemplateType.React) {
    return REACT_TEMPLATE.getFiles(options);
  } else {
    return REACT_TEMPLATE.getFiles(options);
  }
};
