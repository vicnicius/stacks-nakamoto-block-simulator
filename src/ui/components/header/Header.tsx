import React, { FC, useState } from "react";
import { ActionBar } from "../action-bar/ActionBar";
import { ActionTimeline } from "../action-timeline/ActionTimeline";
import { Logo } from "../logo/Logo";
import "./Header.css";

export const Header: FC = () => {
  const [showActionTimeline, setShowActionTimeline] = useState(false);
  return (
    <header className="Header">
      <Logo />
      <ActionBar
        toggleActionTimeline={() => setShowActionTimeline(!showActionTimeline)}
        isActionTimelineVisible={showActionTimeline}
      />
      <ActionTimeline visible={showActionTimeline} />
    </header>
  );
};
