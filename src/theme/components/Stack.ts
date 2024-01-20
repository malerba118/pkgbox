import { Stack as ChakraComponent, defineStyleConfig } from "@chakra-ui/react";

ChakraComponent.defaultProps = {
  ...ChakraComponent.defaultProps,
  spacing: 0,
  minW: 0,
  minH: 0,
};

export const Stack = defineStyleConfig({});
