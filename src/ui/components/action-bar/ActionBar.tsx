import React, {
  ChangeEvent,
  FC,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { TimeAwareUiState, UiStateContext } from "../../../UiState";
import { DimensionsContext } from "../../../domain/Dimensions";
import { ImportAction } from "../../../domain/ImportAction";
import { TimeActionType } from "../../../domain/TimeAction";
import { parseFile } from "../../../services/stateManagement";
import { Button } from "../button/Button";
import { FileDialogExport } from "../file-dialog/FileDialog";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const onImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      throw new Error("No file selected");
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedState = parseFile(event.target?.result as string);
      const importAction: ImportAction<TimeAwareUiState> = {
        type: "import",
        importedState,
      };

      dispatch(importAction);
    };
    reader.readAsText(file);
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
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            onChange={handleFileImport}
            hidden
          />
          <Button
            icon="import"
            {...baseMouseHandler("import")}
            onClick={onImport}
          />
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
