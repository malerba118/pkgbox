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
    borderRight: "subtle",
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
      borderColor: "none",
    },
  },
  tablist: {
    borderBottom: "none",
  },
});

// define the base component styles
const fancy = definePartsStyle({
  // define the part you're going to style
  tab: {
    px: 3,
    rounded: "0.75rem",
    border: "1px solid transparent",
    fontWeight: 600,
    color: "text-strong",
    _selected: {
      bg: "blackAlpha.50",
      border: "faint",
    },
    _dark: {
      _hover: {},
      _active: {},
      _selected: {
        bg: "whiteAlpha.50",
        border: "faint",
      },
    },
  },
  tablist: {},
});

// export the component theme
export const Tabs = defineMultiStyleConfig({
  variants: {
    enclosed,
    fancy,
  },
  defaultProps: {
    variant: "enclosed",
  },
});
