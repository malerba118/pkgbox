import {
  Box,
  chakra,
  CloseButton,
  HStack,
  Tab,
  TabList,
  Tabs,
  TabsProps,
} from "@chakra-ui/react";
import React from "react";
import { useProject } from "./ProjectProvider";
import { observer } from "mobx-react";
import Overlay from "../Overlay";

interface EditorTabsProps extends Omit<TabsProps, "children"> {}

const EditorTabs = observer((props: EditorTabsProps) => {
  const project = useProject();

  return (
    <Tabs
      index={project.activeApp.tabs.findIndex(
        (file) => file.id === project.activeApp.activeFileId || ""
      )}
      onChange={(index) => {
        project.activeApp.openFile(project.activeApp.tabs[index]);
      }}
      overflowX="auto"
      overflowY="hidden"
      size="sm"
      h="100%"
      {...props}
    >
      <TabList h="100%">
        {project.activeApp.tabs.map((file) => (
          <Tab key={file.id} value={file.id} pr={2} alignItems="center">
            <HStack gap={1.5} role="group">
              <chakra.span mb="1px">{file.name}</chakra.span>
              <Box pos="relative" w="6" h="6">
                <CloseButton
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    project.activeApp.closeFile(file);
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  opacity={file.isDirty ? 0 : 1}
                  _groupHover={{
                    opacity: 1,
                  }}
                  transition="none"
                />
                <Overlay
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  pointerEvents="none"
                  opacity={file.isDirty ? 1 : 0}
                  _groupHover={{
                    opacity: 0,
                  }}
                  transition="none"
                >
                  <Box bg="text-vivid" w={2} h={2} rounded="full" />
                </Overlay>
              </Box>
            </HStack>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
});

export default EditorTabs;
