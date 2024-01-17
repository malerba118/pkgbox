import React from "react";
import { FileManager } from "../../state/fs";
import { Button, Text } from "@chakra-ui/react";

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
      h="1.4rem"
      color="text-normal"
      _hover={{
        bg: "layer-1",
        color: "text-strong",
      }}
      transition="none"
      w="100%"
      fontWeight={400}
    >
      {file.name}
    </Button>
  );
};

export default File;
