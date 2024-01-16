import { chakra, CloseButton, Tab, TabList, Tabs } from "@chakra-ui/react";
import React from "react";
import { useProject } from "../ProjectProvider";
import { observer } from "mobx-react";

const EditorTabs = observer(() => {
  const project = useProject();

  return (
    <Tabs
      index={project.activeApp.files.findIndex(
        (file) => file.id === project.activeApp.activeFileId || ""
      )}
      onChange={(index) => {
        project.activeApp.setActiveFileId(project.activeApp.files[index].id);
      }}
      w="100%"
      overflow="auto"
      size="sm"
      borderBottom="subtle"
      h={12}
    >
      <TabList h="100%">
        {project.activeApp.files.map((file) => (
          <Tab
            key={file.id}
            value={file.id}
            gap={1.5}
            pr={2}
            alignItems="center"
          >
            <chakra.span mb="1px">{file.name}</chakra.span>
            <CloseButton size="sm" />
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
});

export default EditorTabs;
