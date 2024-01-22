import React from "react";
import { FileManager } from "../../state/fs";
import { Button, Text } from "@chakra-ui/react";
import FileIcon from "../icons/FileIcon";
import { observer } from "mobx-react";

const File = observer(({ file }: { file: FileManager }) => {
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
    >
      <FileIcon />
      <Text isTruncated pr="3">
        {file.name}
      </Text>
    </Button>
  );
});

export default File;
