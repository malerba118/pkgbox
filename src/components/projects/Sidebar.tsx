import React from "react";
import { useProject } from "./ProjectProvider";
import Folder from "./Folder";
import { observer } from "mobx-react";
import { Box } from "@chakra-ui/react";

const Sidebar = observer(() => {
  const project = useProject();
  return (
    <Box py={2}>
      <Folder folder={project.activeApp.root} />
    </Box>
  );
});

export default Sidebar;
