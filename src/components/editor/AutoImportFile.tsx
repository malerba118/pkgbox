import { useEffect } from "react";
import { useEditor } from "./editor";
import { regexTokeniser } from "./auto-import";

interface AutoImportFileProps {
  path: string;
  contents: string;
  aliases: string[];
}

const AutoImportFile = ({
  path,
  contents,
  aliases = [],
}: AutoImportFileProps) => {
  const { monaco, completor } = useEditor();

  useEffect(() => {
    completor.imports.saveFile({
      path,
      aliases,
      imports: regexTokeniser(contents),
    });
  }, [monaco, completor, path, contents]);

  return null;
};

export default AutoImportFile;
