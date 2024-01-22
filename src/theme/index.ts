import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Tabs } from "./components/Tabs";
import { Stack } from "./components/Stack";
import { HStack } from "./components/HStack";
import { CloseButton } from "./components/CloseButton";
import { Button } from "./components/Button";
import { Box } from "./components/Box";

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-geist-mono)",
    body: "var(--font-geist-mono)",
  },
  colors: {
    // gray: {
    //   50: "#fafafa",
    //   100: "#f5f5f5",
    //   200: "#e5e5e5",
    //   300: "#d4d4d4",
    //   400: "#a3a3a3",
    //   500: "#737373",
    //   600: "#525252",
    //   700: "#404040",
    //   800: "#262626",
    //   900: "#171717",
    //   925: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 50%)",
    //   950: "#0a0a0a",
    // },
    gray: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      925: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 50%)",
      950: "#09090b",
    },
    orange: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
    // gray: {
    //   50: "#fafafa",
    //   100: "#f4f4f5",
    //   200: "#e4e4e7",
    //   300: "#d4d4d8",
    //   400: "#a1a1aa",
    //   500: "#71717a",
    //   600: "#52525b",
    //   700: "#3f3f46",
    //   800: "#27272a",
    //   850: "color-mix(in hsl, var(--chakra-colors-gray-800), var(--chakra-colors-gray-900))",
    //   900: "#18181b",
    //   910: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 20%)",
    //   920: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 40%)",
    //   930: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 60%)",
    //   940: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-950) 80%)",
    //   950: "#09090b",
    // },
  },
  semanticTokens: {
    colors: {
      //   "layer-0": {
      //     default: "white",
      //     _dark: "hsl(240, 15%, 4%)",
      //   },
      //   "layer-1": {
      //     default: "gray.50",
      //     _dark: "hsl(240, 8%, 7.5%)",
      //   },
      //   "layer-2": {
      //     default: "gray.100",
      //     _dark: "hsl(240, 6%, 10.25%)",
      //   },
      //   "layer-3": {
      //     default: "gray.200",
      //     _dark: "hsl(240, 4%, 13%)",
      //   },
      "layer-0": {
        default: "white",
        _dark: "gray.925",
      },
      "layer-1": {
        default: "gray.50",
        _dark: "gray.900",
      },
      "layer-2": {
        default: "gray.100",
        _dark: "gray.800",
      },
      "layer-3": {
        default: "gray.200",
        _dark: "gray.800",
      },
      "text-faint": {
        default: "blackAlpha.400",
        _dark: "whiteAlpha.400",
      },
      "text-subtle": {
        default: "blackAlpha.500",
        _dark: "whiteAlpha.500",
      },
      "text-normal": {
        default: "blackAlpha.600",
        _dark: "whiteAlpha.600",
      },
      "text-strong": {
        default: "blackAlpha.700",
        _dark: "whiteAlpha.700",
      },
      "text-vivid": {
        default: "blackAlpha.900",
        _dark: "whiteAlpha.900",
      },
    },
    borders: {
      faint: {
        default: "1px solid rgba(0, 0, 0, 0.05)",
        _dark: "1px solid rgba(255, 255, 255, 0.05)",
      },
      subtle: {
        default: "1px solid rgba(0, 0, 0, 0.075)",
        _dark: "1px solid rgba(255, 255, 255, 0.075)",
      },
      normal: {
        default: "1px solid rgba(0, 0, 0, 0.1)",
        _dark: "1px solid rgba(255, 255, 255, 0.1)",
      },
      strong: {
        default: "1px solid rgba(0, 0, 0, 0.125)",
        _dark: "1px solid rgba(255, 255, 255, 0.125)",
      },
      vivid: {
        default: "1px solid rgba(0, 0, 0, 0.15)",
        _dark: "1px solid rgba(255, 255, 255, 0.15)",
      },
    },
  },
  components: {
    Button,
    Box,
    Tabs,
    Stack,
    HStack,
    CloseButton,
  },
});
