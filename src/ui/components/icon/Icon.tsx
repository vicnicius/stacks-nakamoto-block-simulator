import React, { FC } from "react";
import { ReactComponent as Fork } from "./resources/fork.svg";
import { ReactComponent as ListFilled } from "./resources/list-filled.svg";
import { ReactComponent as List } from "./resources/list.svg";
import { ReactComponent as Load } from "./resources/load.svg";
import { ReactComponent as Mine } from "./resources/mine.svg";
import { ReactComponent as Redo } from "./resources/redo.svg";
import { ReactComponent as Save } from "./resources/save.svg";
import { ReactComponent as Undo } from "./resources/undo.svg";
import { ReactComponent as ZoomIn } from "./resources/zoom-in.svg";
import { ReactComponent as ZoomOut } from "./resources/zoom-out.svg";

export type Icons =
  | "fork"
  | "list"
  | "list-filled"
  | "load"
  | "mine"
  | "redo"
  | "save"
  | "undo"
  | "zoom-in"
  | "zoom-out";

interface IconProps {
  name: Icons;
  className?: string;
}

export const Icon: FC<IconProps> = ({ className, name }) => {
  if (name === "list") {
    return <List className={className} />;
  }
  if (name === "list-filled") {
    return <ListFilled className={className} />;
  }
  if (name === "load") {
    return <Load className={className} />;
  }
  if (name === "mine") {
    return <Mine className={className} />;
  }
  if (name === "fork") {
    return <Fork className={className} />;
  }
  if (name === "save") {
    return <Save className={className} />;
  }
  if (name === "zoom-in") {
    return <ZoomIn className={className} />;
  }
  if (name === "zoom-out") {
    return <ZoomOut className={className} />;
  }
  if (name === "undo") {
    return <Undo className={className} />;
  }
  if (name === "redo") {
    return <Redo className={className} />;
  }

  return null;
};
