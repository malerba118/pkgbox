import * as React from "react";
import styles from "./styles.module.css";

interface ButtonProps extends React.ComponentProps<"button"> {}

export const Button = ({ className, ...otherProps }: ButtonProps) => {
  return (
    <button className={[styles.button, className].join(" ")} {...otherProps} />
  );
};
