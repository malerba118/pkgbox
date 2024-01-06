"use client";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { ProjectManager } from "../state/app";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../lib/utils";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { useLatestRef } from "@chakra-ui/hooks";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

const project = new ProjectManager({ id: nanoid(), name: "project" });

project.library.createFile({
  name: "index.ts",
  contents: `import { add } from './tests/math.test'

const sum = add(1, 2)`,
});
const tests = project.library.createFolder({ name: "tests" });
tests.createFile({
  name: "math.test.ts",
  contents: `export const add = (a: number, b: number): number => {
    return a + b
}`,
});

let fileMap: Record<string, string> = {};
console.log(
  project.library.files.forEach((file) => {
    fileMap[file.path] = file.contents;
  })
);
console.log(fileMap);

const ModelFile = ({ path, contents, isDisabled }: any) => {
  const monaco = useMonaco();
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

const Home = () => {
  return (
    <main className="">
      <Tabs
        value={project.library.activeFileId || ""}
        onValueChange={(val) => {
          project.library.setActiveFileId(val);
        }}
        className="w-[400px]"
      >
        <TabsList>
          {project.library.files.map((file) => (
            <TabsTrigger key={file.id} value={file.id}>
              {file.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Editor
        height="100vh"
        // key={project.library.activeFile?.id}
        path={project.library.activeFile?.path}
        value={project.library.activeFile?.contents}
        keepCurrentModel
        onMount={(editor, monaco) => {
          monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
            true
          );
          editor.onDidChangeModel(() => {
            // When switching files we need to run typescript compiler.
            // This forces it to rerun and show appropriate errors.
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
              monaco.languages.typescript.typescriptDefaults.getDiagnosticsOptions()
            );
          });
          // AutoTypings.create(editor, {
          //   monaco,
          //   sourceCache: new LocalStorageCache(),
          //   fileRootPath: "./",
          // }).then(() => {
          //   console.log("Watching package declarations.");
          // });
        }}
        onChange={(val) => {
          project.library.activeFile?.setContents(val || "");
        }}
      />
      {project.library.files.map((file) => (
        <ModelFile
          key={file.id}
          path={file.path}
          contents={file.contents}
          isDisabled={project.library.activeFileId === file.id}
        />
      ))}
    </main>
  );
};

export default observer(Home);
