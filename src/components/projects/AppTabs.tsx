import { Box, Button, HStack, Tab, TabList, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useProject } from "./ProjectProvider";

const APP_TABS = ["library", "example", "tests"];

const AppTabs = observer(() => {
  const project = useProject();

  return (
    <HStack
      pos="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      p={2.5}
      gap={4}
      bg="whiteAlpha.500"
      boxShadow={`2xl`}
      border="faint"
      rounded="calc(0.75rem + 0.5rem)"
      _dark={{
        background: `rgba(30, 30, 30, 0.5)`,
      }}
      backdropFilter="blur(16px)"
    >
      <Tabs
        index={APP_TABS.indexOf(project.activeAppId)}
        onChange={(index) => {
          const val = APP_TABS[index];
          project.setActiveAppId(val);
          if (val === "example" || val === "tests") {
            project.setActivePreview(val);
          }
        }}
        size="sm"
        variant="fancy"
        h={10}
      >
        <TabList h="100%" gap={2} overflow="hidden">
          <Tab>Library</Tab>
          <Tab>Example</Tab>
          <Tab>Tests</Tab>
        </TabList>
      </Tabs>
      <Box h={6} borderRight="vivid" />
      <Button colorScheme="orange" rounded="xl" fontSize="sm">
        Publish
      </Button>
    </HStack>
  );
});

export default AppTabs;
