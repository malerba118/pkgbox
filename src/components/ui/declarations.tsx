"use client";

import { useLatestRef } from "@chakra-ui/hooks";
import { useEditor } from "./editor";
import { useEffect, useState } from "react";
import { ProjectManager } from "../../state/project";
import { FileMap } from "../../state/types";

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

interface PackageDeclarationsProps {
  packageName: string;
  project: ProjectManager;
}

export const PackageDeclarations = ({
  packageName,
  project,
}: PackageDeclarationsProps) => {
  const [fileMap, setFileMap] = useState<FileMap>({});

  useEffect(() => {
    project.emulator
      .get(`/app/declarations/${encodeURIComponent(packageName)}`)
      .then(setFileMap);
  }, [packageName]);

  return Object.entries(fileMap).map(([path, file]) => (
    <DeclarationFile
      path={`file:///node_modules/${packageName}${path}`}
      contents={file.code}
    />
  ));
};
