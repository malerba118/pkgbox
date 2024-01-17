import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

function FolderClosedIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        d="M12.333 12.667H3.667a1 1 0 01-1-1V5a1 1 0 011-1h2.03a1 1 0 01.555.168l1.496.997a1 1 0 00.555.168h4.03a1 1 0 011 1v5.334a1 1 0 01-1 1z"
      ></path>
    </Icon>
  );
}

export default FolderClosedIcon;
