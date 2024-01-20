import { Box as ChakraComponent, defineStyleConfig } from "@chakra-ui/react";

ChakraComponent.defaultProps = {
  ...ChakraComponent.defaultProps,
  minW: 0,
  minH: 0,
};

export const Box = defineStyleConfig({});
