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
      boxShadow={`0px 2.2px 4px -10px rgba(0, 0, 0, 0.022),
      0px 5.3px 9.6px -10px rgba(0, 0, 0, 0.032),
      0px 10px 18.2px -10px rgba(0, 0, 0, 0.04),
      0px 17.9px 32.4px -10px rgba(0, 0, 0, 0.048),
      0px 33.4px 60.6px -10px rgba(0, 0, 0, 0.058),
      0px 80px 145px -10px rgba(0, 0, 0, 0.08)`}
      border="faint"
      rounded="calc(0.75rem + 0.5rem)"
      bg="whiteAlpha.200"
      _dark={{
        bg: "rgba(31, 31, 31, 0.6)",
      }}
      backdropFilter="blur(12px)"
      zIndex={100}
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
      <Button variant="primary" rounded="xl" fontSize="sm">
        Publish
      </Button>
    </HStack>
  );
});

export default AppTabs;
