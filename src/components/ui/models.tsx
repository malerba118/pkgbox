"use client";

import { useLatestRef } from "@chakra-ui/hooks";
import { useEditor } from "./editor";
import { useEffect } from "react";

export const ModelFile = ({ path, contents, isDisabled }: any) => {
  const { monaco } = useEditor();
  const disabledRef = useLatestRef(isDisabled);

  useEffect(() => {
    if (!monaco || disabledRef.current) return;
    let model = monaco.editor.getModel(monaco.Uri.file(path));
    if (!model) {
      model = monaco.editor.createModel(
        contents,
        undefined,
        monaco.Uri.file(path)
      );
    } else {
      model.setValue(contents);
    }
  }, [monaco, path, contents]);

  useEffect(() => {
    if (!monaco || disabledRef.current) return;
    // if path changes, dispose of model for old path
    return () => {
      let model = monaco.editor.getModel(monaco.Uri.file(path));
      if (model && !model.isDisposed()) {
        model.dispose();
      }
    };
  }, [monaco, path]);

  return null;
};
