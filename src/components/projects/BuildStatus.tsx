import React, { useEffect, useRef, useState } from "react";
import { useProject } from "./ProjectProvider";
import StatusBadge from "../StatusBadge";
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import "xterm/css/xterm.css";

import { TerminalManager } from "../../state/terminal";

const Terminal = ({ terminal }: { terminal: TerminalManager }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const terminalEl = document.createElement("div");
    // terminalEl.style.paddingBlock = "8px";
    // terminalEl.style.paddingInline = "12px";
    containerRef.current?.appendChild(terminalEl);
    terminal.mount(terminalEl);
    terminal.fitter.fit();
    return () => {
      containerRef.current?.removeChild(terminalEl);
    };
  }, [terminal]);

  useEffect(() => {
    terminal.setTheme(
      colorMode === "dark" ? terminal.themes.dark : terminal.themes.light
    );
  }, [colorMode]);

  return (
    <Box
      fontFamily="body"
      bg={
        colorMode === "dark"
          ? terminal.themes.dark.background
          : terminal.themes.light.background
      }
      px="12px"
      py="8px"
      ref={containerRef}
    />
  );
};

const BuildLogsModal = observer(({ isOpen, onClose }: any) => {
  const project = useProject();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay
        bg="whiteAlpha.200"
        backdropFilter="blur(6px)"
        _dark={{ bg: "whiteAlpha.200" }}
      />
      <ModalContent
        minW="3xl"
        rounded="xl"
        overflow="hidden"
        border="faint"
        shadow={`0px 5.4px 8.3px rgba(0, 0, 0, 0.014),
  0px 13px 20px rgba(0, 0, 0, 0.02),
  0px 24.5px 37.6px rgba(0, 0, 0, 0.025),
  0px 43.8px 67px rgba(0, 0, 0, 0.03),
  0px 81.9px 125.3px rgba(0, 0, 0, 0.036),
  0px 196px 300px rgba(0, 0, 0, 0.05)`}
      >
        <ModalBody p={0}>
          <Terminal terminal={project.library.terminal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

const BuildStatus = observer(() => {
  const project = useProject();
  const modal = useDisclosure();
  return (
    <Center px={2}>
      <StatusBadge
        label="Build"
        status={project.library.runner.buildStatus}
        onClick={modal.onOpen}
        cursor="pointer"
      />
      <BuildLogsModal isOpen={modal.isOpen} onClose={modal.onClose} />
    </Center>
  );
});

export default BuildStatus;
