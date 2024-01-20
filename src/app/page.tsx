"use client";

import {
  Avatar,
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
import BuildStatus from "../components/projects/BuildStatus";
import TestsPreview from "../components/projects/TestsPreview";
import PreviewTabs from "../components/projects/PreviewTabs";
import Image from "next/image";
import logo from "../../public/logo.png";

const Overlay = chakra("div", {
  baseStyle: { pos: "absolute", inset: 0, rounded: "inherit" },
});

const ProjectPage = observer(() => {
  const project = useProject();
  const colorMode = useColorMode();
  return (
    <Stack h="100dvh" bg="layer-0">
      <HStack
        h={16}
        minH={16}
        borderBottom="subtle"
        alignItems="center"
        pl={3}
        pr={6}
      >
        <HStack gap={1.5}>
          <Box boxSize={8} _light={{ filter: "invert(1)" }}>
            <Image src={logo} alt="pkgbox logo" />
          </Box>
          <Text
            fontSize="sm"
            fontWeight={600}
            fontFamily="var(--font-inter)"
            color="text-vivid"
          >
            pkgbox
          </Text>
        </HStack>
        <Box flex={1} />
        <DarkModeSwitch
          checked={colorMode.colorMode === "light"}
          onChange={colorMode.toggleColorMode}
          size={22}
          moonColor="var(--chakra-colors-gray-600)"
          sunColor="var(--chakra-colors-gray-400)"
        />
      </HStack>
      <HStack flex={1}>
        <Box h="100%" w={56} borderRight="subtle">
          <Sidebar />
        </Box>
        <Stack pos="relative" h="100%" flex={1} borderRight="subtle">
          <HStack h={10} borderBottom="subtle">
            <EditorTabs flex={1} />
            <BuildStatus />
          </HStack>
          <Box pos="relative" flex={1}>
            <ProjectEditor />
          </Box>
        </Stack>
        <Stack h="100%" flex={1} borderRight="subtle">
          <HStack h={10} borderBottom="subtle">
            <PreviewTabs />
          </HStack>
          <Box pos="relative" flex={1}>
            {project.activePreview === "example" && <ExamplePreview />}
            {project.activePreview === "tests" && <TestsPreview />}
          </Box>
        </Stack>
      </HStack>
      <AppTabs />
    </Stack>
  );
});

const ProjectPageWithProvider = () => {
  return (
    <ProjectProvider
      data={{
        name: "my-lib",
        library: LibraryTemplateType.React,
        example: ExampleTemplateType.React,
      }}
    >
      <ProjectPage />
    </ProjectProvider>
  );
};

export default ProjectPageWithProvider;
