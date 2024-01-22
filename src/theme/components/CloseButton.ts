import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  color: "text-faint",
  _hover: { color: "text-strong" },
});

export const CloseButton = defineStyleConfig({
  baseStyle,
});
