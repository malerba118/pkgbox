"use client";

import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useProject } from "./ProjectProvider";
import { Editor } from "../editor/editor";
import { ModelFile } from "../editor/models";
import { InitializationStatus } from "../../state/runners/runner";
import { NodeModules } from "./NodeModules";

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
        value={project.activeApp.activeFile?.draftContents}
        // keepCurrentModel
        onMount={(editor, monaco) => {
          editor.onDidChangeModel((ev) => {
            // When switching files we need to run typescript compiler.
            // This forces it to rerun and show appropriate errors.
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
              monaco.languages.typescript.typescriptDefaults.getDiagnosticsOptions()
            );
          });
          var myBinding = editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            function () {
              editor
                .getAction("editor.action.formatDocument")
                ?.run()
                .then(() => {
                  project.activeApp.activeFile?.save();
                });
            }
          );
        }}
        onChange={(val) => {
          project.activeApp.activeFile?.setDraftContents(val || "");
        }}
        options={{
          readOnly: project.activeApp.activeFile?.read_only,
          // inlineSuggest: {
          //   enabled: true,
          // },
          // wordBasedSuggestions: "allDocuments",
          // quickSuggestions: true,
          // snippetSuggestions: "bottom",
          suggest: {
            showValues: true,
            showConstants: true,
            showVariables: true,
            showClasses: true,
            showFunctions: true,
            showConstructors: true,
            showEnums: true,
          },
        }}
      >
        {project.activeApp.files.map((file) => (
          <ModelFile
            key={file.id}
            path={file.path}
            contents={file.draftContents}
            isDisabled={project.activeApp.activeFileId === file.id}
          />
        ))}
        {project.activeApp.runner.initializationStatus ===
          InitializationStatus.Initialized && (
          <>
            <NodeModules appName={project.activeAppId} />
            {/* {Object.keys(project.activeApp.dependencies).map((packageName) => (
              <PackageDeclarations
                key={packageName + project.activeAppId}
                appName={project.activeAppId}
                packageName={packageName}
                project={project}
              />
            ))} */}
          </>
        )}
      </Editor>
    </Box>
  );
});

export default ProjectEditor;
