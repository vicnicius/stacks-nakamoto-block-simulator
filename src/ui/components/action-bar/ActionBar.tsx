import React, {
  ChangeEvent,
  FC,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { TimeAwareUiState, UiStateContext } from "../../../UiState";
import { ImportAction } from "../../../domain/ImportAction";
import { SceneContext } from "../../../domain/SceneContext";
import { TimeActionType } from "../../../domain/TimeAction";
import { parseFile } from "../../../services/stateManagement";
import { Button } from "../button/Button";
import { FileDialogExport } from "../file-dialog/FileDialog";
import "./ActionBar.css";

const ActionBarItem: FC<PropsWithChildren> = ({ children }) => (
  <li className="ActionBar-item">{children}</li>
);

export const ActionBar: FC<{
  toggleActionTimeline: () => void;
}> = ({ toggleActionTimeline }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayExportFileDialog, setDisplayExportFileDialog] = useState(false);
  const { dispatch, state } = useContext(UiStateContext);
  const { zoom, setZoom } = useContext(SceneContext);
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
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

  const onFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
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
            className={!canUndo ? "ActionBar-item--disabled" : undefined}
            icon="undo"
            onClick={() => {
              if (canUndo) {
                dispatch({ type: TimeActionType.UNDO });
              }
            }}
          />
        </ActionBarItem>
        <ActionBarItem>
          <Button
            className={!canRedo ? "ActionBar-item--disabled" : undefined}
            icon="redo"
            onClick={() => {
              if (canRedo) {
                dispatch({ type: TimeActionType.REDO });
              }
            }}
          />
        </ActionBarItem>
        <ActionBarItem>
          <Button
            icon={"list"}
            onClick={() => {
              toggleActionTimeline();
            }}
          />
        </ActionBarItem>
        <ActionBarItem>
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            onChange={handleFileImport}
            hidden
          />
          <Button icon="import" onClick={onImport} />
        </ActionBarItem>
        <ActionBarItem>
          <Button icon="export" onClick={onExport} />
        </ActionBarItem>
        <ActionBarItem>
          <Button icon="zoom-in" onClick={onZoomIn} />
        </ActionBarItem>
        <ActionBarItem>
          <Button icon="zoom-out" onClick={onZoomOut} />
        </ActionBarItem>
        <ActionBarItem>
          <Button icon="fullscreen" onClick={onFullscreen} />
        </ActionBarItem>
      </ul>
      {displayExportFileDialog && (
        <FileDialogExport onClose={onFileDialogClose} />
      )}
    </>
  );
};
