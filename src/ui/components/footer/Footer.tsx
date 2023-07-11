import React from "react";
import { Icon } from "../icon/Icon";
import "./Footer.css";
import { ReactComponent as Stacks } from "./resources/stacks.svg";

export const Footer = () => (
  <footer className="Footer-wrapper">
    <div className="Footer-left">
      <Stacks className="Footer-logo" />
      <span className="Footer-copyright">
        Copyright - Stacks Foundation - 2023
      </span>
    </div>
    <div className="Footer-right">
      <a
        className="Footer-link"
        href="https://github.com/vicnicius/stacks-nakamoto-block-simulator/"
      >
        <Icon name="github" />
      </a>
      <a className="Footer-link" href="https://twitter.com/vicnicius">
        <Icon name="twitter" />
      </a>
    </div>
  </footer>
);
