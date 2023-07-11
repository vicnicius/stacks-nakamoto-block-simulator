import React, { FC } from "react";
import { ReactComponent as Export } from "./resources/export.svg";
import { ReactComponent as Fork } from "./resources/fork.svg";
import { ReactComponent as Fullscreen } from "./resources/fullscreen.svg";
import { ReactComponent as Github } from "./resources/github.svg";
import { ReactComponent as Import } from "./resources/import.svg";
import { ReactComponent as ListFilled } from "./resources/list-filled.svg";
import { ReactComponent as List } from "./resources/list.svg";
import { ReactComponent as Mine } from "./resources/mine.svg";
import { ReactComponent as Redo } from "./resources/redo.svg";
import { ReactComponent as Twitter } from "./resources/twitter.svg";
import { ReactComponent as Undo } from "./resources/undo.svg";
import { ReactComponent as ZoomIn } from "./resources/zoom-in.svg";
import { ReactComponent as ZoomOut } from "./resources/zoom-out.svg";

export type Icons =
  | "fork"
  | "fullscreen"
  | "github"
  | "twitter"
  | "list"
  | "list-filled"
  | "export"
  | "import"
  | "mine"
  | "redo"
  | "undo"
  | "zoom-in"
  | "zoom-out";

interface IconProps {
  name: Icons;
  className?: string;
}

export const Icon: FC<IconProps> = ({ className, name }) => {
  if (name === "export") {
    return <Export className={className} />;
  }
  if (name === "fork") {
    return <Fork className={className} />;
  }
  if (name === "fullscreen") {
    return <Fullscreen className={className} />;
  }
  if (name === "import") {
    return <Import className={className} />;
  }
  if (name === "list") {
    return <List className={className} />;
  }
  if (name === "list-filled") {
    return <ListFilled className={className} />;
  }
  if (name === "mine") {
    return <Mine className={className} />;
  }
  if (name === "redo") {
    return <Redo className={className} />;
  }
  if (name === "undo") {
    return <Undo className={className} />;
  }
  if (name === "zoom-in") {
    return <ZoomIn className={className} />;
  }
  if (name === "zoom-out") {
    return <ZoomOut className={className} />;
  }
  if (name === "github") {
    return <Github className={className} />;
  }
  if (name === "twitter") {
    return <Twitter className={className} />;
  }
  return null;
};
