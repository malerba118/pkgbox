import React, { useEffect } from "react";
import { useProject } from "./ProjectProvider";
import { useEditor } from "../editor/editor";
import { tsConfigToCompilerOptions } from "../editor/utils";

const SyncCompilerOptions = () => {
  const project = useProject();
  const { monaco } = useEditor();

  useEffect(() => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      tsConfigToCompilerOptions(
        project.activeApp.typescriptConfig?.compilerOptions || {}
      )
    );
  }, [monaco, project.activeApp.typescriptConfig]);

  return null;
};

export default SyncCompilerOptions;
