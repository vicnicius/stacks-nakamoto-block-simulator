import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import {
  UiStateContext,
  initialBitcoinChain,
  initialStacksChain,
  timeAwareReducer,
} from "./UiState";
import { DebugContext } from "./domain/Debug";
import {
  DimensionsContext,
  blockSpace,
  headerSize,
  marginSize,
} from "./domain/Dimensions";
import { Canvas } from "./ui/components/canvas/Canvas";
import { Header } from "./ui/components/header/Header";
import "./App.css";

export const App: FC = () => {
  const [zoom, setZoom] = useState(1);
  const [metaKeyDown, setMetaKeyDown] = useState(false);
  const [alternateKeyDown, setAlternateKeyDown] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [height, setHeight] = useState(
    // Canvas height is the window height minus the header height minus two times
    // the margin size for the page margins and one more for the canvas top margin.
    window.innerHeight - headerSize - 3 * marginSize
  );
  // Canvas width is the window width minus two times the margin size for
  // the page margins.
  const [width, setWidth] = useState(window.innerWidth - 2 * marginSize);
  // The maxYLeftScroll sets the maximum amount of pixels that the user can scroll
  const [maxYLeftScroll, setMaxYLeftScroll] = useState(9999);
  // the maxYRightScroll sets the maximum amount of pixels that the user can scroll
  const [maxYRightScroll, setMaxYRightScroll] = useState(9999);

  const aspect = width / height;
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - headerSize - 3 * marginSize);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const keyDownEventListener = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setMetaKeyDown(true);
      }
      if (e.key === "d") {
        setAlternateKeyDown(true);
      }
      return false;
    };
    document.addEventListener("keydown", keyDownEventListener);

    const keyUpEventListener = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setMetaKeyDown(false);
      }
      if (e.key === "d") {
        setAlternateKeyDown(false);
      }
    };
    document.addEventListener("keyup", keyUpEventListener);

    return () => {
      document.removeEventListener("keydown", keyDownEventListener);
      document.removeEventListener("keyup", keyUpEventListener);
    };
  }, []);

  useEffect(() => {
    if (metaKeyDown && alternateKeyDown) {
      setDebugMode(!debugMode);
    }
  }, [metaKeyDown, alternateKeyDown]);

  const handleSetZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const [state, dispatch] = useReducer(timeAwareReducer, {
    past: [],
    present: {
      bitcoin: initialBitcoinChain,
      stacks: initialStacksChain,
      longestChainStartId: "1",
      actions: [],
      lastId: 1,
    },
    future: [],
  });

  return (
    <main className="App">
      <DimensionsContext.Provider
        value={{
          blockSpace,
          width,
          height,
          aspect,
          maxYLeftScroll,
          maxYRightScroll,
          setMaxYLeftScroll,
          setMaxYRightScroll,
          zoom,
          setZoom: handleSetZoom,
        }}
      >
        <DebugContext.Provider value={{ debug: debugMode }}>
          <UiStateContext.Provider value={{ state, dispatch }}>
            <Header />
            <Canvas />
          </UiStateContext.Provider>
        </DebugContext.Provider>
      </DimensionsContext.Provider>
    </main>
  );
};
