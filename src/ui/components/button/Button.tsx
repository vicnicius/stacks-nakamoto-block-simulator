import classnames from "classnames";
import React, { FC } from "react";
import { Icon, Icons } from "../icon/Icon";
import "./Button.css";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: Icons;
}

export const Button: FC<ButtonProps> = ({ icon, ...props }) => {
  const css = classnames("Button", props.className);
  return (
    <button {...props} className={css}>
      <Icon name={icon} />
    </button>
  );
};
