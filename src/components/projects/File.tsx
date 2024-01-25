import React from "react";
import { FileManager } from "../../state/fs";
import { Button, Text } from "@chakra-ui/react";
import FileIcon from "../icons/FileIcon";
import { observer } from "mobx-react";
import InlineInput from "../InlineInput";
import { useProject } from "./ProjectProvider";

const File = observer(({ file }: { file: FileManager }) => {
  const project = useProject();
  return (
    <Button
      fontSize="sm"
      variant="list-item"
      onClick={() => {
        file.open();
      }}
      pl={file.pathLength * 8 + "px"}
      h="1.5rem"
      lineHeight="1.5rem"
      fontWeight={400}
      gap={1}
      color="text-normal"
      bg={file.isActive ? "layer-2" : undefined}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        project.menus.fs.open({
          position: {
            x: e.clientX,
            y: e.clientY,
          },
          node: file,
        });
      }}
    >
      <FileIcon />
      <InlineInput defaultValue={file.name} onChange={() => {}} />
    </Button>
  );
});

export default File;
