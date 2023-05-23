import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import "./Canvas.css";
import { DividerLine } from "./components/DividerLine";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { StacksBlockchain } from "./StacksBlockchain";
import { DimensionsContext } from "../../../domain/Dimensions";
import { OrthographicCamera as ThreeOrtographicCamera } from "three";
import { DebugContext } from "../../../domain/Debug";

export const Canvas: FC = () => {
  const camera = useRef<ThreeOrtographicCamera>();
  const [metaKeyDown, setMetaKeyDown] = useState(false);
  const [alternateKeyDown, setAlternateKeyDown] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const { height, width } = useContext(DimensionsContext);
  useEffect(() => {
    if (camera.current) {
      camera.current.lookAt(0, 0, 0);
    }
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

  return (
    <section className="CanvasWrapper">
      <FiberCanvas style={{ height, width }}>
        <OrthographicCamera
          makeDefault
          position={[10, 10, 10]}
          zoom={1}
          rotation={[Math.atan(-1 / Math.sqrt(2)), -Math.PI / 4, 0]}
          ref={camera}
        />
        <DebugContext.Provider value={{ debug: debugMode }}>
          <StacksBlockchain />
        </DebugContext.Provider>
        <DividerLine />
        {debugMode && <gridHelper args={[width, 100, 1]} />}
        {debugMode && <axesHelper args={[height / 2]} />}
        <OrbitControls />
      </FiberCanvas>
    </section>
  );
};
