import React, { FC, PropsWithChildren, useContext, useState } from "react";
import { UiStateContext } from "../../../UiState";
import { DimensionsContext } from "../../../domain/Dimensions";
import { TimeActionType } from "../../../domain/TimeAction";
import { Button } from "../button/Button";
import "./ActionBar.css";
import { FileDialogExport } from "../file-dialog/FileDialog";

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
  const [displayExportFileDialog, setDisplayExportFileDialog] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { dispatch } = useContext(UiStateContext);
  const { zoom, setZoom } = useContext(DimensionsContext);
  const baseMouseHandler = (item: string) => ({
    onMouseEnter: () => {
      if (item === "list" && isActionTimelineVisible) return;
      setHoveredItem(item);
    },
    onMouseLeave: () => setHoveredItem(null),
  });
  const onZoomIn = () => {
    setZoom(zoom + 0.1);
  };

  const onZoomOut = () => {
    setZoom(zoom - 0.1);
  };

  const onFileDialogClose = () => {
    setDisplayExportFileDialog(false);
  };

  const onExport = () => {
    setDisplayExportFileDialog(true);
  };
  return (
    <>
      <ul className="ActionBar">
        <ActionBarItem>
          <Button
            icon="undo"
            {...baseMouseHandler("undo")}
            onClick={() => dispatch({ type: TimeActionType.UNDO })}
          />
          <ActionTooltip active={hoveredItem === "undo"}>undo</ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon="redo"
            {...baseMouseHandler("redo")}
            onClick={() => dispatch({ type: TimeActionType.REDO })}
          />
          <ActionTooltip active={hoveredItem === "redo"}>redo</ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon={isActionTimelineVisible ? "list-filled" : "list"}
            {...baseMouseHandler("list")}
            onClick={() => {
              toggleActionTimeline();
              setHoveredItem(null);
            }}
          />
          <ActionTooltip active={hoveredItem === "list"}>actions</ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button icon="import" {...baseMouseHandler("import")} />
          <ActionTooltip active={hoveredItem === "import"}>
            import
          </ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon="export"
            {...baseMouseHandler("export")}
            onClick={onExport}
          />
          <ActionTooltip active={hoveredItem === "export"}>
            export
          </ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon="zoom-in"
            {...baseMouseHandler("zoom-in")}
            onClick={onZoomIn}
          />
          <ActionTooltip active={hoveredItem === "zoom-in"}>
            zoom in
          </ActionTooltip>
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon="zoom-out"
            {...baseMouseHandler("zoom-out")}
            onClick={onZoomOut}
          />
          <ActionTooltip active={hoveredItem === "zoom-out"}>
            zoom out
          </ActionTooltip>
        </ActionBarItem>
      </ul>
      {displayExportFileDialog && (
        <FileDialogExport onClose={onFileDialogClose} />
      )}
    </>
  );
};
