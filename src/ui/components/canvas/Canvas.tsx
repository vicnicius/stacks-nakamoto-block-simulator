import React, { FC, useContext, useEffect, useRef } from "react";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import "./Canvas.css";
import { DividerLine } from "./components/DividerLine";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { StacksBlockchain } from "./StacksBlockchain";
import { DimensionsContext } from "../../../domain/Dimensions";
import { OrthographicCamera as ThreeOrtographicCamera } from "three";

export const Canvas: FC = () => {
  const camera = useRef<ThreeOrtographicCamera>();
  const { height, width } = useContext(DimensionsContext);
  useEffect(() => {
    if (camera.current) {
      camera.current.lookAt(0, 0, 0);
    }
  }, []);
  return (
    <section className="CanvasWrapper">
      <FiberCanvas style={{ height, width }}>
        <OrthographicCamera
          makeDefault
          position={[50, 50, 50]}
          zoom={30}
          rotation={[Math.atan(-1 / Math.sqrt(2)), -Math.PI / 4, 0]}
          ref={camera}
        />
        <StacksBlockchain />
        <DividerLine />
        <gridHelper args={[100, 100]} />
        <axesHelper args={[100]} />
        <OrbitControls />
      </FiberCanvas>
    </section>
  );
};
