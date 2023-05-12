import React, { FC } from "react";
import { ActionBar } from "../action-bar/ActionBar";
import { Logo } from "../logo/Logo";
import "./Header.css";

export const Header: FC = () => {
  return (
    <header className="Header">
      <Logo />
      <ActionBar />
    </header>
  );
};
