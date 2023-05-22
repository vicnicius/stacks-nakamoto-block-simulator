import React, { FC } from "react";
import { Icons, Icon } from "../icon/Icon";
import "./Button.css";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: Icons;
}

export const Button: FC<ButtonProps> = ({ icon, ...props }) => {
  return (
    <button className="Button" {...props}>
      <Icon name={icon} />
    </button>
  );
};