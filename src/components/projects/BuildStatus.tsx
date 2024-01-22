import React from "react";
import { useProject } from "./ProjectProvider";
import StatusBadge from "../StatusBadge";
import { Center } from "@chakra-ui/react";
import { observer } from "mobx-react";

const BuildStatus = observer(() => {
  const project = useProject();
  return (
    <Center px={2}>
      <StatusBadge label="Build" status={project.library.runner.buildStatus} />
    </Center>
  );
});

export default BuildStatus;
