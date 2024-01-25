import React from "react";
import { useProject } from "./ProjectProvider";
import Folder from "./Folder";
import { observer } from "mobx-react";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import FsMenu from "./FsMenu";

const Sidebar = observer(() => {
  const project = useProject();
  return (
    <Box>
      <Stack p={2.5} gap={0.5} borderBottom="subtle">
        <Text ml={0.5} fontSize="sm" fontWeight={600} color="text-vivid">
          {project.name}
        </Text>
        <HStack gap={1.5}>
          <Box w={4} h={4} bg="gray.700" rounded="full" />
          <Text fontSize="sm" color="text-normal">
            malerba118
          </Text>
        </HStack>
      </Stack>
      <Box py={1.5}>
        <FsMenu />
        <Folder folder={project.activeApp.root} />
      </Box>
    </Box>
  );
});

export default Sidebar;
