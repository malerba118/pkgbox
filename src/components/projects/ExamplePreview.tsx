import { observer } from "mobx-react";
import { ServerStatus } from "../../state/runners/example";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  Spinner,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { useProject } from "./ProjectProvider";
import { IoChevronBack, IoChevronForward, IoRefresh } from "react-icons/io5";
import { useRef, useState } from "react";

const Browser = ({ defaultUrl }: { defaultUrl: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <Stack h="100%" w="100%">
      <HStack bg="layer-1" borderBottom="subtle" h={10} px={1.5} gap={1}>
        <IconButton
          variant="ghost"
          w={7}
          h={7}
          minW={0}
          icon={<IoRefresh />}
          aria-label="Refresh"
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.src += "";
            }
          }}
        />
        <Input
          h={7}
          flex={1}
          px={3}
          rounded="full"
          bg="layer-0"
          defaultValue={defaultUrl}
          onKeyDown={(e) => {
            if (e.key === "Enter" && iframeRef.current) {
              iframeRef.current.src = e.currentTarget.value;
            }
          }}
          fontSize="xs"
          border="subtle"
        />
      </HStack>
      <Box flex={1} minH={0}>
        <chakra.iframe ref={iframeRef} src={defaultUrl} w="100%" h="100%" />
      </Box>
    </Stack>
  );
};

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

  return <Browser defaultUrl={project.example.runner.url} />;
});

export default ExamplePreview;
