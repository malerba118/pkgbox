import { observer } from "mobx-react";
import { ProjectManager } from "../../state/project";
import { ServerStatus } from "../../state/runners/example";
import { chakra } from "@chakra-ui/react";
import { useProject } from "./ProjectProvider";

const ExamplePreview = observer(() => {
  const project = useProject();
  if (
    !project.example.runner.url ||
    project.example.runner.serverStatus === ServerStatus.Starting
  ) {
    return <div>Loading...</div>;
  }

  return (
    <chakra.iframe
      src={project.example.runner.url}
      pos="absolute"
      w="100%"
      h="100%"
    />
  );
});

export default ExamplePreview;
