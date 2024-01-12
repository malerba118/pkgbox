import { TemplateOptions } from "..";
import { FileMap } from "../../state/types";
import * as REACT_TEMPLATE from "./react";

export enum ExampleTemplateType {
  React = "react",
}

export const getFileMap = (options: TemplateOptions): FileMap => {
  if (options.example === "react") {
    return REACT_TEMPLATE.getFiles(options);
  }
  return REACT_TEMPLATE.getFiles(options);
};
