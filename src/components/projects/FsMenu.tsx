import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useProject } from "./ProjectProvider";
import { observer } from "mobx-react";

const FsMenu = observer(() => {
  const project = useProject();
  return (
    <Menu
      isOpen={project.menus.fs.isOpen}
      strategy="fixed"
      placement="bottom-start"
      onClose={() => project.menus.fs.close()}
    >
      <MenuButton
        className="fixed w-0 h-0 invisible"
        pos="fixed"
        w={0}
        h={0}
        visibility="hidden"
        style={{
          left: project.menus.fs.context?.position.x ?? 0,
          top: project.menus.fs.context?.position.y ?? 0,
        }}
      />
      <MenuList fontSize="sm" py={0.5}>
        <MenuItem>Add File</MenuItem>
        <MenuItem>Add Folder</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
});

export default FsMenu;
