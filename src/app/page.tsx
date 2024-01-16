"use client";

import { Box, DarkMode, HStack, Stack, Text, chakra } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Emulator } from "../state/runners/emulator";
import { ProjectManager } from "../state/project";
import { Project } from "../state/types";
import { LibraryTemplateType } from "../templates/library";
import { ExampleTemplateType } from "../templates/example";
import { TemplateOptions } from "../templates";
import { ProjectProvider, useProject } from "../components/Project";
import ProjectEditor from "../components/ProjectEditor";

const Overlay = chakra("div", {
  baseStyle: { pos: "absolute", inset: 0, rounded: "inherit" },
});

const EditorTabs = () => {
  return <Box h={12} borderBottom="subtle"></Box>;
};

// const Editor = () => {
//   const project = useProject();
//   useEffect(() => {
//     console.log(project);
//   }, []);
//   return <Box w="100%" h="100%" bg="layer-1"></Box>;
// };

const PreviewTabs = () => {
  return <Box h={12} borderBottom="subtle"></Box>;
};

const ExamplePreview = () => {
  return <Box w="100%" h="100%" bg="layer-0"></Box>;
};

const Home = () => {
  return (
    <DarkMode>
      <Stack h="100dvh" bg="layer-0">
        <Box h={16} borderBottom="subtle"></Box>
        <HStack flex={1}>
          <Box h="100%" w={60} borderRight="subtle"></Box>
          <Stack h="100%" flex={1} minW={0} borderRight="subtle">
            <EditorTabs />
            <Box pos="relative" flex={1}>
              <Overlay overflow="auto">
                <ProjectProvider
                  data={{
                    name: "math",
                    library: LibraryTemplateType.React,
                    example: ExampleTemplateType.React,
                  }}
                >
                  <ProjectEditor />
                </ProjectProvider>
              </Overlay>
            </Box>
          </Stack>
          <Stack h="100%" flex={1} minW={0} borderRight="subtle">
            <PreviewTabs />
            <Box pos="relative" flex={1}>
              <Overlay overflow="auto">
                <ExamplePreview />
              </Overlay>
            </Box>
          </Stack>
        </HStack>
      </Stack>
    </DarkMode>
  );
};

export default observer(Home);
