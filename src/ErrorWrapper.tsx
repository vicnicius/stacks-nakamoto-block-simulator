import React, { FC, PropsWithChildren, useCallback, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UiStateContext } from "./UiState";
import "./ErrorWrapper.css";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="ErrorWrapper">
      <div className="ErrorDialog">
        <p className="ErrorWrapper-label">
          We&apos;re sorry — something&apos;s gone wrong:
        </p>
        <pre className="ErrorWrapper-message">{(error as Error).message}</pre>
        <button
          className="ErrorWrapper-button"
          onClick={() => resetErrorBoundary()}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
export const ErrorWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { dispatch } = useContext(UiStateContext);
  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, [dispatch]);
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      // eslint-disable-next-line no-console
      onError={(error) => console.log("Error:", error)}
      onReset={() => {
        reset();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
