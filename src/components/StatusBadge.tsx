import { Box, HStack, Spinner, StackProps, Text } from "@chakra-ui/react";
import React from "react";

interface StatusBadgeProps extends StackProps {
  label: string;
  status: "error" | "success" | "pending";
}

const StatusBadge = ({ label, status, ...otherProps }: StatusBadgeProps) => {
  return (
    <HStack
      border="faint"
      h="6"
      gap={1.5}
      pl={2}
      pr={2.5}
      rounded="full"
      {...otherProps}
    >
      {status === "pending" && <Spinner h={2} w={2} color="text-strong" />}
      {status === "success" && (
        <Box bg="green.300" w={2} h={2} rounded="full" />
      )}
      {status === "error" && <Box bg="red.300" w={2} h={2} rounded="full" />}
      <Text fontSize="xs">{label}</Text>
    </HStack>
  );
};

export default StatusBadge;
