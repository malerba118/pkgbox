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
  appName: string;
  packageName: string;
  project: ProjectManager;
}

export const PackageDeclarations = ({
  appName,
  packageName,
  project,
}: PackageDeclarationsProps) => {
  const [fileMap, setFileMap] = useState<FileMap>({});

  useEffect(() => {
    project.emulator
      .get(`/${appName}/declarations/${encodeURIComponent(packageName)}`)
      .then(setFileMap);
  }, [packageName]);

  return Object.entries(fileMap).map(([path, file]) => (
    <DeclarationFile
      key={path}
      path={`file:///node_modules/${packageName}/${path}`}
      contents={file.code}
    />
  ));
};
