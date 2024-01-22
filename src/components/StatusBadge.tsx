import { Box, HStack, Spinner, StackProps, Text } from "@chakra-ui/react";
import React from "react";
import { AsyncStatus } from "../state/types";

interface StatusBadgeProps extends StackProps {
  label: string;
  status: AsyncStatus;
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
      {status === AsyncStatus.Idle && (
        <Box bg="layer-2" w={2} h={2} rounded="full" />
      )}
      {status === AsyncStatus.Pending && (
        <Spinner h={2} w={2} color="text-strong" />
      )}
      {status === AsyncStatus.Success && (
        <Box bg="green.300" w={2} h={2} rounded="full" />
      )}
      {status === AsyncStatus.Error && (
        <Box bg="red.300" w={2} h={2} rounded="full" />
      )}
      <Text fontSize="xs" color="text-strong">
        {label}
      </Text>
    </HStack>
  );
};

export default StatusBadge;
