"use client";

import React, { FC, PropsWithChildren, useCallback, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UiStateContext } from "./UiState";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  // eslint-disable-next-line no-console
  console.log("Was it even caught?");
  return (
    <div role="alert" className="ErrorWrapper">
      <p className="ErrorWrapper-label">Something went wrong:</p>
      <pre className="ErrorWrapper-message">{(error as Error).message}</pre>
      <button onClick={() => resetErrorBoundary}>Reset</button>
    </div>
  );
}
export const ErrorWrapper: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line no-console
  console.log("ErrorWrapper");
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
