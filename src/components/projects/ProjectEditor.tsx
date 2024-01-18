"use client";

import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useProject } from "./ProjectProvider";
import { Editor } from "../editor/editor";
import { ModelFile } from "../editor/models";
import { InitializationStatus } from "../../state/runners/runner";
import { PackageDeclarations } from "../editor/declarations";

const ProjectEditor = observer(() => {
  const project = useProject();

  return (
    <Box
      w="100%"
      h="100%"
      bg="layer-1"
      visibility={project.activeApp.activeFile ? "visible" : "hidden"}
    >
      <Editor
        className="editor"
        loading={<Box />}
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
        options={{
          readOnly: project.activeApp.activeFile?.read_only,
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
            {Object.keys(project.activeApp.dependencies).map((packageName) => (
              <PackageDeclarations
                key={packageName + project.activeAppId}
                appName={project.activeAppId}
                packageName={packageName}
                project={project}
              />
            ))}
          </>
        )}
      </Editor>
    </Box>
  );
});

export default ProjectEditor;
