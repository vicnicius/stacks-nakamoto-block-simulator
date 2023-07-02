import React, { FC, PropsWithChildren, useContext, useState } from "react";
import { UiStateContext } from "../../../UiState";
import { TimeActionType } from "../../../domain/TimeAction";
import { Button } from "../button/Button";
import "./ActionBar.css";

const ActionBarItem: FC<PropsWithChildren> = ({ children }) => (
  <li className="ActionBar-item">{children}</li>
);

const ActionTooltip: FC<PropsWithChildren<{ active: boolean }>> = ({
  active,
  children,
}) => (
  <span className={`ActionBar-tooltip ${active && "ActionBar-tooltip--show"}`}>
    {children}
  </span>
);

export const ActionBar: FC<{
  toggleActionTimeline: () => void;
  isActionTimelineVisible: boolean;
}> = ({ toggleActionTimeline, isActionTimelineVisible }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { dispatch } = useContext(UiStateContext);
  const mouseHandler = (item: string) => ({
    onMouseEnter: () => {
      if (item === "list" && isActionTimelineVisible) return;
      setHoveredItem(item);
    },
    onMouseLeave: () => setHoveredItem(null),
  });
  return (
    <ul className="ActionBar">
      <ActionBarItem>
        <Button
          icon="undo"
          {...mouseHandler("undo")}
          onClick={() => dispatch({ type: TimeActionType.UNDO })}
        />
        <ActionTooltip active={hoveredItem === "undo"}>undo</ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button
          icon="redo"
          {...mouseHandler("redo")}
          onClick={() => dispatch({ type: TimeActionType.REDO })}
        />
        <ActionTooltip active={hoveredItem === "redo"}>redo</ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button
          icon={isActionTimelineVisible ? "list-filled" : "list"}
          {...mouseHandler("list")}
          onClick={() => {
            toggleActionTimeline();
            setHoveredItem(null);
          }}
        />
        <ActionTooltip active={hoveredItem === "list"}>actions</ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button icon="load" {...mouseHandler("load")} />
        <ActionTooltip active={hoveredItem === "load"}>load</ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button icon="save" {...mouseHandler("save")} />
        <ActionTooltip active={hoveredItem === "save"}>save</ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button icon="zoom-in" {...mouseHandler("zoom-in")} />
        <ActionTooltip active={hoveredItem === "zoom-in"}>
          zoom in
        </ActionTooltip>
      </ActionBarItem>
      <ActionBarItem>
        <Button icon="zoom-out" {...mouseHandler("zoom-out")} />
        <ActionTooltip active={hoveredItem === "zoom-out"}>
          zoom out
        </ActionTooltip>
      </ActionBarItem>
    </ul>
  );
};
