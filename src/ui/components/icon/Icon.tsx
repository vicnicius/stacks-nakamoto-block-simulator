import React, { FC } from "react";
import { ReactComponent as List } from "./resources/list.svg";
import { ReactComponent as Load } from "./resources/load.svg";
import { ReactComponent as Redo } from "./resources/redo.svg";
import { ReactComponent as Save } from "./resources/save.svg";
import { ReactComponent as Undo } from "./resources/undo.svg";
import { ReactComponent as ZoomIn } from "./resources/zoom-in.svg";
import { ReactComponent as ZoomOut } from "./resources/zoom-out.svg";

export type Icons =
  | "undo"
  | "redo"
  | "list"
  | "load"
  | "save"
  | "zoom-in"
  | "zoom-out";

interface IconProps {
  name: Icons;
}

export const Icon: FC<IconProps> = ({ name }) => {
  if (name === "list") {
    return <List />;
  }
  if (name === "load") {
    return <Load />;
  }
  if (name === "save") {
    return <Save />;
  }
  if (name === "zoom-in") {
    return <ZoomIn />;
  }
  if (name === "zoom-out") {
    return <ZoomOut />;
  }
  if (name === "undo") {
    return <Undo />;
  }
  if (name === "redo") {
    return <Redo />;
  }

  return null;
};
