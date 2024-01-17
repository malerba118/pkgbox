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
    // bg: "red.100",
    px: 3,
    rounded: "0.75rem",
    border: "1px solid transparent",
    _dark: {
      _hover: {},
      _active: {},
      _selected: {
        bg: "whiteAlpha.50",
        border: "faint",
      },
    },
  },
  tablist: {
    // p: 2,
    // gap: 0.5,
    // bg: "whiteAlpha.500",
    // boxShadow: `0px 24px 28px 0px rgba(0, 0, 0, 0.20)`,
    // border: "faint",
    // rounded: "calc(0.75rem + 0.5rem)",
    // _dark: {
    //   background: `linear-gradient(180deg, rgba(255, 255, 255, 0.04) -81.36%, rgba(255, 255, 255, 0.00) 214.41%)`,
    // },
    // backdropFilter: "blur(16px)",
  },
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
