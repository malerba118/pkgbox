"use client";

import { useEditor } from "./editor";
import { useEffect } from "react";

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
