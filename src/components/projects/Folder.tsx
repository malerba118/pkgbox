import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FolderManager } from "../../state/fs";
import File from "./File";
import { observer } from "mobx-react";
import FolderOpenIcon from "../icons/FolderOpen";
import FolderClosedIcon from "../icons/FolderClosed";
import { FaFolderPlus } from "react-icons/fa";
import { LuFolderPlus, LuFilePlus } from "react-icons/lu";
import { PiFilePlusFill, PiFolderPlusFill } from "react-icons/pi";
import { useProject } from "./ProjectProvider";

const Folder = observer(({ folder }: { folder: FolderManager }) => {
  const project = useProject();
  return (
    <Stack>
      <Button
        pl={folder.pathLength * 8 + "px"}
        pr={1}
        fontSize="sm"
        variant="list-item"
        onClick={() => {
          folder.setExpanded(!folder.expanded);
        }}
        h="1.5rem"
        lineHeight="1.5rem"
        color="text-strong"
        fontWeight={600}
        gap={1}
        role="group"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          project.menus.fs.open({
            position: {
              x: e.clientX,
              y: e.clientY,
            },
            node: folder,
          });
        }}
      >
        {folder.expanded ? <FolderOpenIcon /> : <FolderClosedIcon />}
        <Text isTruncated flex={1}>
          {folder.name}
        </Text>
        {/* <HStack>
          <IconButton
            variant="unstyled"
            minW={0}
            w={5}
            h={5}
            rounded="none"
            icon={<Icon as={PiFilePlusFill} boxSize={4} />}
            aria-label="Add File"
            onClick={(e) => {
              e.stopPropagation();
              folder.createFile({ name: "unititled", contents: "" });
            }}
            _hover={{
              color: "text-vivid",
            }}
            visibility="hidden"
            _groupHover={{
              visibility: "visible",
            }}
          />
          <IconButton
            variant="unstyled"
            minW={0}
            w={5}
            h={5}
            rounded="none"
            icon={<Icon as={PiFolderPlusFill} boxSize={4} mt="0.15rem" />}
            aria-label="Add Folder"
            onClick={(e) => {
              e.stopPropagation();
              folder.createFolder({ name: "unititled" });
            }}
            _hover={{
              color: "text-vivid",
            }}
            visibility="hidden"
            _groupHover={{
              visibility: "visible",
            }}
          />
        </HStack> */}
      </Button>
      {folder.expanded && (
        <Box>
          {folder.children.map((node) => {
            if (node instanceof FolderManager) {
              return <Folder key={node.id} folder={node} />;
            } else {
              return <File key={node.id} file={node} />;
            }
          })}
        </Box>
      )}
    </Stack>
  );
});

export default Folder;
