import {
  chakra,
  Box,
  Button,
  HStack,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useProject } from "./ProjectProvider";

const PREVIEW_TABS = ["example", "tests"];

const PreviewTabs = observer(() => {
  const project = useProject();

  return (
    <Tabs
      index={PREVIEW_TABS.findIndex((tab) => tab === project.activePreview)}
      onChange={(index) => {
        project.setActivePreview(PREVIEW_TABS[index]);
      }}
      overflowX="auto"
      overflowY="hidden"
      size="sm"
      h="100%"
      w="100%"
    >
      <TabList h="100%" w="100%">
        {PREVIEW_TABS.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            gap={1.5}
            w="50%"
            alignItems="center"
            _last={{ borderRight: "none" }}
            _selected={{
              color: "text-vivid",
              bg: "layer-1",
            }}
          >
            <chakra.span mb="1px" textTransform="capitalize">
              {tab}
            </chakra.span>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
});

export default PreviewTabs;
