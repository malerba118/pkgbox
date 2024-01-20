"use client";

import { useLatestRef } from "@chakra-ui/hooks";
import { useEditor } from "./editor";
import { useEffect, useState } from "react";
import { ProjectManager } from "../../state/project";
import { FileMap } from "../../state/types";
import { ModelFile } from "./models";
import { useProject } from "../projects/ProjectProvider";
import { useQuery } from "react-query";

interface DeclarationFileProps {
  path: string;
  contents: string;
}

const DeclarationFile = ({ path, contents }: DeclarationFileProps) => {
  const { monaco } = useEditor();

  useEffect(() => {
    const disposable =
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        contents,
        path
      );
    return () => disposable.dispose();
  }, [monaco, path, contents]);

  return null;
};

export default DeclarationFile;
