import {
  Bvh,
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import React, { FC, useContext, useState } from "react";
import { UiStateContext } from "../../../UiState";
import { DebugContext } from "../../../domain/Debug";
import { SceneContext } from "../../../domain/SceneContext";
import { BlockchainRender } from "./BlockchainRender";
import { HUDScene } from "./HUDScene";
import { AxesHelper } from "./components/AxesHelper";
import { Camera } from "./components/Camera";
import { GridHelper } from "./components/GridHelper";
import { Lights } from "./components/Lights";
import { colors } from "./helpers";
import "./Canvas.css";

export const Canvas: FC = () => {
  const [dpr, setDpr] = useState(1.5);
  const { height, width, zoom } = useContext(SceneContext);
  const { state } = useContext(UiStateContext);
  const stacks = state.preview?.stacks || state.present.stacks;
  const bitcoin = state.preview?.bitcoin || state.present.bitcoin;
  const { debug } = useContext(DebugContext);

  return (
    <section className="CanvasWrapper">
      <FiberCanvas dpr={dpr} style={{ height, width }}>
        <PerformanceMonitor
          onChange={({ factor }) => setDpr(0.5 + 1.5 * factor)}
        >
          <color attach={"background"} args={[colors.baseGray]} />
          <Environment
            background
            blur={1}
            near={1}
            far={1000}
            files={"/assets/environments/studio.hdr"}
            resolution={256}
          >
            <Lights />
            <Camera isometric zoom={zoom} />
            <Bvh>
              <BlockchainRender chain={stacks} />
              <BlockchainRender chain={bitcoin} />
            </Bvh>
            <HUDScene />
            <GridHelper />
            <AxesHelper />
            {debug && <OrbitControls />}
          </Environment>
        </PerformanceMonitor>
      </FiberCanvas>
    </section>
  );
};
