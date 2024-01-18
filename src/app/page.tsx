"use client";

import {
  Box,
  DarkMode,
  Flex,
  HStack,
  Stack,
  Text,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Emulator } from "../state/runners/emulator";
import { ProjectManager } from "../state/project";
import { Project } from "../state/types";
import { LibraryTemplateType } from "../templates/library";
import { ExampleTemplateType } from "../templates/example";
import { TemplateOptions } from "../templates";
import {
  ProjectProvider,
  useProject,
} from "../components/projects/ProjectProvider";
import ProjectEditor from "../components/projects/ProjectEditor";
import ExamplePreview from "../components/projects/ExamplePreview";
import EditorTabs from "../components/projects/EditorTabs";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import AppTabs from "../components/projects/AppTabs";
import Folder from "../components/projects/Folder";
import Sidebar from "../components/projects/Sidebar";
import StatusBadge from "../components/StatusBadge";

const Overlay = chakra("div", {
  baseStyle: { pos: "absolute", inset: 0, rounded: "inherit" },
});

const PreviewTabs = () => {
  return <Box h={10} borderBottom="subtle"></Box>;
};

const Home = () => {
  const colorMode = useColorMode();
  return (
    <ProjectProvider
      data={{
        name: "math",
        library: LibraryTemplateType.React,
        example: ExampleTemplateType.React,
      }}
    >
      <Stack h="100dvh" bg="layer-0">
        <HStack h={16} borderBottom="subtle" alignItems="center" px={6}>
          <Box flex={1} />
          <DarkModeSwitch
            checked={colorMode.colorMode === "light"}
            onChange={colorMode.toggleColorMode}
            size={24}
            moonColor="var(--chakra-colors-gray-400)"
            sunColor="var(--chakra-colors-gray-600)"
          />
        </HStack>
        <HStack flex={1}>
          <Box h="100%" w={56} borderRight="subtle">
            <Sidebar />
          </Box>
          <Stack h="100%" flex={1} minW={0} borderRight="subtle">
            <HStack borderBottom="subtle">
              <EditorTabs flex={1} />
              <StatusBadge mx="2" label="Build" status="error" />
            </HStack>
            <Box pos="relative" flex={1}>
              <ProjectEditor />
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
      <AppTabs />
    </ProjectProvider>
  );
};

export default observer(Home);
