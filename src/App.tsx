import React, { FC, useEffect, useState } from "react";
import {
  DimensionsContext,
  blockSpace,
  headerSize,
  marginSize,
} from "./domain/Dimensions";
import { Header } from "./ui/components/header/Header";
import { Canvas } from "./ui/components/canvas/Canvas";
import "./App.css";

export const App: FC = () => {
  const [height, setHeight] = useState(
    // Canvas height is the window height minus the header height minus two times
    // the margin size for the page margins and one more for the canvas top margin.
    window.innerHeight - headerSize - 3 * marginSize
  );
  // Canvas width is the window width minus two times the margin size for
  // the page margins.
  const [width, setWidth] = useState(window.innerWidth - 2 * marginSize);
  // The sceneWidth sets the whole width of the scene in its own coordinate unit
  const [sceneWidth, setSceneWidth] = useState(0);
  // The sceneHeight sets the whole height of the scene in its own coordinate unit
  const [sceneHeight, setSceneHeight] = useState(0);
  const aspect = width / height;

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - headerSize - 3 * marginSize);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="App">
      <DimensionsContext.Provider
        value={{
          blockSpace,
          width,
          height,
          aspect,
          sceneHeight,
          sceneWidth,
          setSceneHeight,
          setSceneWidth,
        }}
      >
        <Header />
        <Canvas />
      </DimensionsContext.Provider>
    </main>
  );
};
