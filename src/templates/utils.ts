import { cloneDeep } from "lodash";
import { FileMap } from "../state/types";

export type RenderContext = {
  name: string;
};

export const renderFiles = (
  fileMap: FileMap,
  context: RenderContext
): FileMap => {
  fileMap = cloneDeep(fileMap);
  Object.keys(fileMap).forEach((key) => {
    // @ts-ignore
    fileMap[key].code = fileMap[key].code.replaceAll(
      "<PACKAGE_NAME_PLACEHOLDER>",
      context.name
    );
  });
  return fileMap;
};
