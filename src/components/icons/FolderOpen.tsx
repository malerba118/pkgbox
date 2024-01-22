import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

function FolderOpenIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M12.553 12.667H3.667a1 1 0 01-.873-.511l1.017-4.065a1 1 0 01.97-.758h8.605a1 1 0 01.97 1.243l-.833 3.333a1 1 0 01-.97.758z"></path>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        d="M13.333 6.633v-.3a1 1 0 00-1-1h-4.03a1 1 0 01-.555-.168l-1.496-.997A1 1 0 005.697 4h-2.03a1 1 0 00-1 1v6.667a1 1 0 001 1h8.886a1 1 0 00.97-.758l.833-3.333a1 1 0 00-.97-1.243H4.781a1 1 0 00-.97.758l-1.06 4.242"
      ></path>
    </Icon>
  );
}

export default FolderOpenIcon;
