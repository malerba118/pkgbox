import { Box, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

interface InlineInputProps {
  defaultValue: string;
  onChange: (val: string) => void;
  isDisabled?: boolean;
  defaultIsEditing?: boolean;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

const InlineInput = ({
  defaultValue,
  onChange,
  isDisabled,
  isEditing,
  onEditingChange,
}: InlineInputProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Box pos="relative" lineHeight={1.5}>
      <Text
        fontSize="sm"
        visibility={isEditing ? "hidden" : "visible"}
        maxW={48}
        isTruncated
        wordBreak="break-word"
        whiteSpace="pre"
        title={value}
      >
        {value || "Untitled"}
      </Text>
      {isEditing && (
        <Input
          autoFocus
          onBlur={(e) => {
            onEditingChange?.(false);
            onChange?.(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder="Untitled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          pos="absolute"
          inset={0}
          variant="unstyled"
          fontSize="sm"
          w={"calc(100% + 1rem)"}
          px={".25rem"}
          ml={"-0.25rem"}
          maxW="calc(100% + 1rem)"
          shadow="outline"
          // maxLength={24}
        />
      )}
    </Box>
  );
};

export default InlineInput;
