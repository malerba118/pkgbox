import { observer } from "mobx-react";
import { ServerStatus } from "../../state/runners/example";
import { Center, Spinner, chakra } from "@chakra-ui/react";
import { useProject } from "./ProjectProvider";

const ExamplePreview = observer(() => {
  const project = useProject();
  if (
    !project.example.runner.url ||
    project.example.runner.serverStatus === ServerStatus.Starting
  ) {
    return (
      <Center w="100%" h="100%">
        <Spinner color="text-strong" />
      </Center>
    );
  }

  return <chakra.iframe src={project.example.runner.url} w="100%" h="100%" />;
});

export default ExamplePreview;
