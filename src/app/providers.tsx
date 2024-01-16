"use client";

import { ChakraProvider, HStack, Stack } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

Stack.defaultProps = { ...Stack.defaultProps, spacing: 0 };
HStack.defaultProps = { ...HStack.defaultProps, spacing: 0 };

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-fira-mono)",
    body: "var(--font-fira-mono)",
  },
  colors: {
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      920: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-960) 33%)",
      940: "color-mix(in hsl, var(--chakra-colors-gray-900), var(--chakra-colors-gray-960) 66%)",
      960: "#0a0a0a",
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
  components: {},
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
        _dark: "gray.940",
      },
      "layer-1": {
        default: "gray.50",
        _dark: "gray.920",
      },
      "layer-2": {
        default: "gray.100",
        _dark: "gray.900",
      },
      "layer-3": {
        default: "gray.200",
        _dark: "gray.800",
      },
    },
    borders: {
      faint: {
        default: "1px solid rgba(0, 0, 0, 0.02)",
        _dark: "1px solid rgba(255, 255, 255, 0.02)",
      },
      subtle: {
        default: "1px solid rgba(0, 0, 0, 0.04)",
        _dark: "1px solid rgba(255, 255, 255, 0.04)",
      },
      normal: {
        default: "1px solid rgba(0, 0, 0, 0.07)",
        _dark: "1px solid rgba(255, 255, 255, 0.07)",
      },
      strong: {
        default: "1px solid rgba(0, 0, 0, 0.10)",
        _dark: "1px solid rgba(255, 255, 255, 0.10)",
      },
      vivid: {
        default: "1px solid rgba(0, 0, 0, 0.13)",
        _dark: "1px solid rgba(255, 255, 255, 0.13)",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
