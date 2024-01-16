"use client";

import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useProject } from "./Project";
import { Editor } from "./editor/editor";
import { ModelFile } from "./editor/models";
import { InitializationStatus } from "../state/runners/runner";
import { PackageDeclarations } from "./editor/declarations";

const ProjectEditor = observer(() => {
  const project = useProject();
  //   useEffect(() => {
  //     console.log(project);
  //   }, []);
  return (
    <Box w="100%" h="100%" bg="layer-1">
      <div
        className="h-full"
        style={{
          visibility: project.activeApp.activeFile ? "visible" : "hidden",
        }}
      >
        <Editor
          className="editor"
          //   loading={<Box pos="absolute" inset={0} bg="layer-1" />}
          height="100%"
          key={project.activeAppId}
          path={project.activeApp.activeFile?.path}
          value={project.activeApp.activeFile?.contents}
          // keepCurrentModel
          onMount={(editor, monaco) => {
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
    </Box>
  );
});

export default ProjectEditor;
