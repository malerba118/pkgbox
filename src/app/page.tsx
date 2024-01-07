"use client";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { ProjectManager } from "../state/project";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../lib/utils";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useLatestRef } from "@chakra-ui/hooks";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Emulator } from "../state/emulator";
import { autorun, when } from "mobx";
import { VANILLA_TEMPLATE } from "../templates/vanilla";

const emulatorPromise = Emulator.create();

const useProject = () => {
  const [project, setProject] = useState<ProjectManager | null>(null);

  useEffect(() => {
    emulatorPromise.then((emulator) => {
      const project = new ProjectManager(
        {
          id: nanoid(),
          name: "project",
          files: [],
          folders: [],
        },
        emulator
      );
      // project.library.createFile({
      //   name: "index.ts",
      //   contents: `import { add } from './tests/math.test'

      // const sum = add(1, 2)`,
      // });
      // const tests = project.library.createFolder({ name: "tests" });
      // tests.createFile({
      //   name: "math.test.ts",
      //   contents: `export const add = (a: number, b: number): number => {
      //     return a + b
      // }`,
      // });
      project.createFilesFromTemplate(VANILLA_TEMPLATE);
      setProject(project);
    });
  }, []);

  useEffect(() => {
    if (project) {
      project.init();
      autorun(() => {
        console.log(JSON.stringify(project.library.runner.initialization));
      });
    }
  }, [project]);

  return project;
};

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

const ExamplePreview = observer(() => {
  return <iframe className="h-full w-full bg-red-300" />;
});

const AppTabs = observer(({ project }: any) => {
  return (
    <Tabs
      // className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[10000] shadow-xl overflow-hidden"
      value={project.activeApp}
      onValueChange={(val) => {
        project.setActiveApp(val);
      }}
    >
      <TabsList className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[10000] shadow-xl overflow-hidden">
        <TabsTrigger value="library">Library</TabsTrigger>
        <TabsTrigger value="example">Example</TabsTrigger>
        <TabsTrigger value="tests">Tests</TabsTrigger>
      </TabsList>
    </Tabs>
  );
});

const Home = () => {
  const project = useProject();

  if (!project) return null;

  return (
    <main className="">
      <div className="hstack">
        <div className="stack h-screen gap-1 flex-1">
          <Tabs
            value={project.library.activeFileId || ""}
            onValueChange={(val) => {
              project.library.setActiveFileId(val);
            }}
          >
            <TabsList>
              {project.library.files.map((file) => (
                <TabsTrigger key={file.id} value={file.id}>
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative flex-1">
            <div
              className="overlay"
              style={{
                visibility: project.library.activeFile ? "visible" : "hidden",
              }}
            >
              <Editor
                height="100%"
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
                  var myBinding = editor.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                    function () {
                      editor.getAction("editor.action.formatDocument")?.run();
                    }
                  );

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
                options={{
                  minimap: {
                    enabled: false,
                  },
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
            </div>
          </div>
        </div>
        <div className="flex-1">
          <ExamplePreview />
        </div>
      </div>
      <AppTabs project={project} />
    </main>
  );
};

export default observer(Home);
