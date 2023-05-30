import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import React, { FC, useContext } from "react";
import { Chain, StacksBlockState } from "../../../domain/Block";
import { BlockAction } from "../../../domain/BlockAction";
import { Blockchain } from "../../../domain/Blockchain";
import { DebugContext } from "../../../domain/Debug";
import { DimensionsContext } from "../../../domain/Dimensions";
import { BlockchainRender } from "./BlockchainRender";
import "./Canvas.css";
import { HUDScene } from "./HUDScene";
import { AxesHelper } from "./components/AxesHelper";
import { Camera } from "./components/Camera";
import { GridHelper } from "./components/GridHelper";

export const Canvas: FC = () => {
  const { height, width } = useContext(DimensionsContext);
  const { debug } = useContext(DebugContext);
  // The Blockchain interface describes the data structure that we will use to render the blocks.
  // Each block can have a number of children blocks, and each block has it's own state.
  const blockchain: Blockchain<Chain.STX> = {
    block: {
      id: "0",
      height: 0,
      type: Chain.STX,
      state: StacksBlockState.NEW,
    },
    actions: [BlockAction.MINE],
    children: [
      {
        block: {
          id: "1",
          height: 1,
          type: Chain.STX,
          state: StacksBlockState.NEW,
        },
        actions: [],
        children: [],
      },
    ],
  };

  return (
    <section className="CanvasWrapper">
      <FiberCanvas dpr={[1, 2]} style={{ height, width }}>
        <color attach={"background"} args={["#151515"]} />
        <Environment
          background
          blur={1}
          near={1}
          far={1000}
          resolution={256}
          preset="studio"
        >
          <pointLight
            position={[-width / 2, -width / 2, width / 2]}
            color="red"
            intensity={7.5}
          />
          <Camera isometric />
          <BlockchainRender chain={blockchain} initialConnection={[]} />
          <HUDScene />
          <GridHelper />
          <AxesHelper />
          {debug && <OrbitControls />}
        </Environment>
      </FiberCanvas>
    </section>
  );
};
