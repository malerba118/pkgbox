import React from "react";
import { FileManager } from "../../state/fs";
import { Button, Text } from "@chakra-ui/react";
import FileIcon from "../icons/FileIcon";

const File = ({ file }: { file: FileManager }) => {
  return (
    <Button
      fontSize="sm"
      variant="unstyled"
      onClick={() => {
        file.open();
      }}
      textAlign="start"
      rounded="none"
      //   px={3}
      pl={file.pathLength * 8 + "px"}
      h="1.5rem"
      lineHeight="1.5rem"
      color="text-normal"
      _hover={{
        bg: "layer-1",
        color: "text-strong",
      }}
      transition="none"
      w="100%"
      fontWeight={400}
      display="flex"
      justifyContent="start"
      gap={1}
    >
      <FileIcon />
      <span>{file.name}</span>
    </Button>
  );
};

export default File;
