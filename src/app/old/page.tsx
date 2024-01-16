"use client";
import Image from "next/image";
import { ProjectManager } from "../../state/project";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../../lib/utils";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useLatestRef } from "@chakra-ui/hooks";
// import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Emulator } from "../../state/runners/emulator";
import { getTemplate } from "@/templates";
import { ServerStatus } from "../../state/runners/example";
import { Editor } from "../../components/editor/editor";
import { ModelFile } from "../../components/editor/models";
import { PackageDeclarations } from "../../components/editor/declarations";
import { InitializationStatus } from "../../state/runners/runner";
import { LibraryTemplateType } from "../../templates/library";
import { ExampleTemplateType } from "../../templates/example";
import {
  Box,
  HStack,
  Stack,
  Tab,
  TabList,
  Tabs,
  chakra,
} from "@chakra-ui/react";

const emulatorPromise = Emulator.create();

const useProject = () => {
  const [project, setProject] = useState<ProjectManager | null>(null);
  const projectAlreadyExistsRef = useRef(false);

  useEffect(() => {
    emulatorPromise.then((emulator) => {
      if (!projectAlreadyExistsRef.current) {
        projectAlreadyExistsRef.current = true;
        const project = new ProjectManager(
          {
            id: nanoid(),
            name: "project",
            files: [],
            folders: [],
          },
          emulator
        );
        project.createFilesFromTemplate(
          getTemplate({
            name: "math",
            library: LibraryTemplateType.React,
            example: ExampleTemplateType.React,
          })
        );
        setProject(project);
      }
    });
  }, []);

  useEffect(() => {
    if (project) {
      project.init();
    }
  }, [project]);

  return project;
};

const ExamplePreview = observer(({ project }: { project: ProjectManager }) => {
  if (
    !project.example.runner.url ||
    project.example.runner.serverStatus === ServerStatus.Starting
  ) {
    return <div>Loading...</div>;
  }

  return (
    <chakra.iframe
      src={project.example.runner.url}
      pos="absolute"
      w="100%"
      h="100%"
    />
  );
});

const TestsPreview = observer(({ project }: { project: ProjectManager }) => {
  if (!project.tests.runner.results) {
    return null;
  }
  return (
    <Box pos="absolute" w="100%" h="100%" overflow="auto">
      <pre>{JSON.stringify(project.tests.runner.results, null, 2)}</pre>
    </Box>
  );
});

const APP_TABS = ["library", "example", "tests"];

const AppTabs = observer(({ project }: any) => {
  return (
    <Tabs
      index={APP_TABS.indexOf(project.activeAppId)}
      onChange={(index) => {
        const val = APP_TABS[index];
        project.setActiveAppId(val);
        if (val === "example" || val === "tests") {
          project.setActivePreview(val);
        }
      }}
    >
      <TabList
        bg="white"
        className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[10000] shadow-xl overflow-hidden"
      >
        <Tab value="library">Library</Tab>
        <Tab value="example">Example</Tab>
        <Tab value="tests">Tests</Tab>
      </TabList>
    </Tabs>
  );
});

const PREVIEW_TABS = ["example", "tests"];

const PreviewTabs = observer(({ project }: any) => {
  return (
    <Tabs
      index={PREVIEW_TABS.indexOf(project.activePreview)}
      onChange={(index) => {
        project.setActivePreview(PREVIEW_TABS[index]);
      }}
    >
      <TabList>
        <Tab>Example</Tab>
        <Tab>Tests</Tab>
      </TabList>
    </Tabs>
  );
});

const Home = () => {
  const project = useProject();

  if (!project) return null;

  return (
    <main className="">
      <HStack>
        <Stack h="100dvh" flex={1} minW={0}>
          <Tabs
            index={project.activeApp.files.findIndex(
              (file) => file.id === project.activeApp.activeFileId || ""
            )}
            onChange={(index) => {
              project.activeApp.setActiveFileId(
                project.activeApp.files[index].id
              );
            }}
            className="w-full overflow-auto"
          >
            <TabList>
              {project.activeApp.files.map((file) => (
                <Tab key={file.id} value={file.id}>
                  {file.name}
                </Tab>
              ))}
            </TabList>
          </Tabs>
          <div className="relative flex-1">
            <div
              className="h-full"
              style={{
                visibility: project.activeApp.activeFile ? "visible" : "hidden",
                background: `#1E1E1E`,
              }}
            >
              <Editor
                className="editor"
                height="100%"
                key={project.activeAppId}
                path={project.activeApp.activeFile?.path}
                value={project.activeApp.activeFile?.contents}
                // keepCurrentModel
                onMount={(editor, monaco) => {
                  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
                    true
                  );
                  const compilerOptions = {
                    target: monaco.languages.typescript.ScriptTarget.Latest,
                    allowNonTsExtensions: true,
                    resolveJsonModule: true,
                    moduleResolution:
                      monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                    module: monaco.languages.typescript.ModuleKind.CommonJS,
                    typeRoots: ["node_modules/@types"],
                    allowSyntheticDefaultImports: true,
                    allowJs: true,
                    strict: false,
                    noImplicitAny: false,
                    allowImportingTsExtensions: true,
                    noEmit: true,
                    esModuleInterop: true,
                    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
                    reactNamespace: "React",
                  };
                  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                    compilerOptions
                  );
                  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
                    compilerOptions
                  );

                  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                    {
                      noSemanticValidation: false,
                      noSyntaxValidation: false,
                    }
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
                }}
                onChange={(val) => {
                  project.activeApp.activeFile?.setContents(val || "");
                }}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  letterSpacing: -0.2,
                }}
              >
                {project.activeApp.files.map((file) => (
                  <ModelFile
                    key={file.id}
                    path={file.path}
                    contents={file.contents}
                    isDisabled={project.activeApp.activeFileId === file.id}
                  />
                ))}
                {project.example.runner.initializationStatus ===
                  InitializationStatus.Initialized && (
                  <>
                    {Object.keys(project.activeApp.dependencies).map(
                      (packageName) => (
                        <PackageDeclarations
                          key={packageName + project.activeAppId}
                          appName={project.activeAppId}
                          packageName={packageName}
                          project={project}
                        />
                      )
                    )}
                  </>
                )}
              </Editor>
            </div>
          </div>
        </Stack>
        <div className="stack flex-1 min-w-0">
          <PreviewTabs project={project} />
          <div className="relative flex-1">
            {project.activePreview === "example" ? (
              <ExamplePreview project={project} />
            ) : (
              <TestsPreview project={project} />
            )}
          </div>
        </div>
      </HStack>
      <AppTabs project={project} />
    </main>
  );
};

export default observer(Home);
