import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const listItem = defineStyle({
  textAlign: "start",
  rounded: "none",
  color: "text-strong",
  _hover: {
    bg: "layer-2",
  },
  fontWeight: 400,
  transition: "none",
  display: "flex",
  justifyContent: "start",
  w: "100%",
});

const primary = defineStyle({
  bg: "gray.900",
  color: "gray.50",
  _hover: {
    bg: "gray.700",
  },
  _active: {
    bg: "gray.600",
  },
  _dark: {
    bg: "gray.100",
    color: "gray.900",
    _hover: {
      bg: "gray.200",
    },
    _active: {
      bg: "gray.300",
    },
  },
  // _dark: {
  //   bg: "orange.300",
  //   color: "gray.800",
  //   _hover: {
  //     bg: "orange.400",
  //   },
  //   _active: {
  //     bg: "orange.500",
  //   },
  // },
});

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 600,
  },
  variants: { primary, "list-item": listItem },
});
