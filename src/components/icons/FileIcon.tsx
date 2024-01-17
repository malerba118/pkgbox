import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

function FileIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4.5 4.333a.5.5 0 01.5-.5h3.167v2.734a.6.6 0 00.6.6H11.5v5.166a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5v-8zm8 2.343v-.01-.252a1.5 1.5 0 00-.44-1.06L9.98 3.272a1.5 1.5 0 00-1.06-.44H5a1.5 1.5 0 00-1.5 1.5v8a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V6.676zM9.167 3.899a.5.5 0 01.106.08l2.08 2.082a.5.5 0 01.081.106H9.167V3.899z"
        clipRule="evenodd"
      ></path>
    </Icon>
  );
}

export default FileIcon;
