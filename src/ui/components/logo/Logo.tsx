import React, { FC } from "react";
import { ReactComponent as LogoSvg } from "./resources/logo.svg";

import "./Logo.css";

const LogoTitle: FC = () => {
  return (
    <div className="Logo-wrapper">
      <h1 className="Logo-title">Block Simulator</h1>
      <h2 className="Logo-subtitle">Nakamoto Release</h2>
    </div>
  );
};

export const Logo: FC = () => {
  return (
    <div className="Logo">
      <LogoSvg />
      <LogoTitle />
    </div>
  );
};
