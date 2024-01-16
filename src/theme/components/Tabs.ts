import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const enclosed = definePartsStyle({
  // define the part you're going to style
  tab: {
    borderBottom: "none",
    borderTop: "none",
    rounded: "none",
    color: "text-subtle",
    _hover: {
      bg: "layer-1",
      color: "text-strong",
    },
    _active: {
      bg: "layer-1",
      color: "text-strong",
    },
    _selected: {
      bg: "layer-1",
      color: "text-strong",
      borderColor: "layer-2",
    },
  },
  tablist: {
    borderBottom: "none",
  },
});

// export the component theme
export const Tabs = defineMultiStyleConfig({
  variants: {
    enclosed,
  },
  defaultProps: {
    variant: "enclosed",
  },
});
