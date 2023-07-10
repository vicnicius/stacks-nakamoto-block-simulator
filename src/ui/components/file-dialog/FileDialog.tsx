import React, { FC, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UiStateContext } from "../../../UiState";
import { buildShareableState } from "../../../services/stateManagement";
import "./FileDialog.css";

export const FileDialogExport: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [exportableJson, setExportableJson] = useState("");
  const { state } = useContext(UiStateContext);
  useEffect(() => {
    buildShareableState(state)
      .then(({ shareUrl: generatedUrl, exportableJson: generatedJson }) => {
        setShareUrl(generatedUrl);
        setExportableJson(generatedJson);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error generating JSON", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return createPortal(
    <div className="FileDialog--container">
      <div className="FileDialogBlur" />
      <div className="FileDialog">
        {loading ? (
          <div className="FileDialog--loading">
            Generating JSON... Please wait, this might take a while.
          </div>
        ) : (
          <>
            <h2 className="FileDialog--title">Export Current Simulation</h2>
            <div className="FileDialog--input">
              <label>Share Url:</label>
              <input id="url" type="text" disabled value={shareUrl} />
            </div>
            <div className="FileDialog--actions">
              <button onClick={onClose} className="FileDialog--close">
                Close
              </button>
              <a
                className="FileDialog--link"
                href={`data:text/plain;charset=utf-8,${exportableJson}`}
                download
              >
                Download as File
              </a>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
