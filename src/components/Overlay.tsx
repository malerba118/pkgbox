import { chakra } from "@chakra-ui/react";

const Overlay = chakra("div", {
  baseStyle: { pos: "absolute", inset: 0, rounded: "inherit" },
});

export default Overlay;
