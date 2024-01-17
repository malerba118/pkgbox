import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { FolderManager } from "../../state/fs";
import File from "./File";
import { observer } from "mobx-react";

const Folder = observer(({ folder }: { folder: FolderManager }) => {
  return (
    <Stack>
      <Button
        pl={folder.pathLength * 8 + "px"}
        fontSize="sm"
        variant="unstyled"
        onClick={() => {
          folder.setExpanded(!folder.expanded);
        }}
        textAlign="start"
        rounded="none"
        h="1.4rem"
        _hover={{
          bg: "layer-1",
        }}
        fontWeight={600}
        transition="none"
      >
        {folder.name || "Library"}
      </Button>
      {folder.expanded && (
        <Box>
          {folder.children.map((node) => {
            if (node instanceof FolderManager) {
              return <Folder key={node.id} folder={node} />;
            } else {
              return <File key={node.id} file={node} />;
            }
          })}
        </Box>
      )}
    </Stack>
  );
});

export default Folder;
