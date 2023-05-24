import { OrbitControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import React, { FC, useContext } from "react";
import { DebugContext } from "../../../domain/Debug";
import { DimensionsContext } from "../../../domain/Dimensions";
import { BlocksScene } from "./BlocksScene";
import { HUDScene } from "./HUDScene";
import { AxesHelper } from "./components/AxesHelper";
import { Camera } from "./components/Camera";
import { GridHelper } from "./components/GridHelper";
import { Lights } from "./components/Lights";
import "./Canvas.css";

export const Canvas: FC = () => {
  const { height, width } = useContext(DimensionsContext);
  const { debug } = useContext(DebugContext);

  return (
    <section className="CanvasWrapper">
      <FiberCanvas style={{ height, width }}>
        <Lights />
        <Camera isometric />
        <BlocksScene />
        <HUDScene />
        <GridHelper />
        <AxesHelper />
        {debug && <OrbitControls />}
      </FiberCanvas>
    </section>
  );
};
