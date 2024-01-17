"use client";

import { Box, DarkMode, HStack, Stack, Text, chakra } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Emulator } from "../../state/runners/emulator";
import { ProjectManager } from "../../state/project";
import { Project } from "../../state/types";
import { LibraryTemplateType } from "../../templates/library";
import { ExampleTemplateType } from "../../templates/example";
import { TemplateOptions } from "../../templates";

const ProjectContext = createContext<ProjectManager | undefined>(undefined);

export const ProjectProvider = ({
  data,
  children,
}: {
  data: Project | TemplateOptions;
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();
  const query = useQuery(
    ["project"],
    async ({ queryKey }) => {
      const oldProject = queryClient.getQueryData<ProjectManager | undefined>(
        queryKey
      );
      oldProject?.dispose();
      const emulator = await Emulator.create();
      const project = new ProjectManager(data, emulator);
      return project;
    },
    {
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (query.data) {
      query.data.init();
    }
  }, [query.data]);

  if (query.isLoading) {
    return <Text>Loading...</Text>;
  } else if (query.isError) {
    return <Text>Error</Text>;
  }
  return (
    <ProjectContext.Provider value={query.data}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const project = useContext(ProjectContext);
  if (!project) {
    throw Error("useProject must be used inside of ProjectProvider");
  }
  return project;
};
