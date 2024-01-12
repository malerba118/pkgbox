import { TemplateOptions } from "..";
import { FileMap } from "../../state/types";
import * as REACT_TEMPLATE from "./react";
import * as TYPESCRIPT_TEMPLATE from "./typescript";

export enum LibraryTemplateType {
  React = "react",
  Typescript = "typescript",
}

export const getFileMap = (options: TemplateOptions): FileMap => {
  if (options.library === LibraryTemplateType.React) {
    return REACT_TEMPLATE.getFiles(options);
  } else if (options.library === LibraryTemplateType.Typescript) {
    return TYPESCRIPT_TEMPLATE.getFiles(options);
  } else {
    return TYPESCRIPT_TEMPLATE.getFiles(options);
  }
};
