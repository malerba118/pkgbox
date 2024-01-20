import { observer } from "mobx-react";
import { ServerStatus } from "../../state/runners/example";
import { Box, Center, Spinner, chakra } from "@chakra-ui/react";
import { useProject } from "./ProjectProvider";

const TestsPreview = observer(() => {
  const project = useProject();
  // if (project.tests.runner.serverStatus === ServerStatus.Starting) {
  //   return (
  //     <Center h="100%">
  //       <Spinner color="text-strong" />
  //     </Center>
  //   );
  // }

  if (!project.tests.runner.results) {
    return (
      <Center h="100%">
        <Spinner color="text-strong" />
      </Center>
    );
  }

  return (
    <Box w="100%" h="100%" overflow="auto" p={4}>
      <pre>{JSON.stringify(project.tests.runner.results, null, 2)}</pre>
    </Box>
  );
});

export default TestsPreview;
