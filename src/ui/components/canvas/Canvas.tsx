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
      position: { vertical: 0, horizontal: 0 },
      type: Chain.STX,
      state: StacksBlockState.NEW,
    },
    actions: [BlockAction.MINE, BlockAction.MINE],
    children: [
      {
        block: {
          id: "1",
          parent: { id: "0", position: { vertical: 0, horizontal: 0 } },
          position: { vertical: 1, horizontal: 0 },
          type: Chain.STX,
          state: StacksBlockState.NEW,
        },
        actions: [],
        children: [
          {
            actions: [],
            block: {
              id: "5",
              parent: { id: "1", position: { vertical: 1, horizontal: 0 } },
              position: { vertical: 2, horizontal: 0 },
              type: Chain.STX,
              state: StacksBlockState.NEW,
            },
            children: [
              {
                actions: [],
                block: {
                  id: "6",
                  parent: {
                    id: "5",
                    position: { vertical: 2, horizontal: 0 },
                  },
                  position: { vertical: 3, horizontal: 0 },
                  type: Chain.STX,
                  state: StacksBlockState.NEW,
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        block: {
          id: "2",
          parent: { id: "0", position: { vertical: 0, horizontal: 0 } },
          position: { vertical: 1, horizontal: 1 },
          type: Chain.STX,
          state: StacksBlockState.NEW,
        },
        actions: [],
        children: [
          {
            actions: [],
            block: {
              id: "3",
              parent: { id: "2", position: { vertical: 1, horizontal: 1 } },
              position: { vertical: 2, horizontal: 1 },
              type: Chain.STX,
              state: StacksBlockState.NEW,
            },
            children: [],
          },
        ],
      },
      {
        actions: [],
        block: {
          id: "4",
          parent: { id: "0", position: { vertical: 0, horizontal: 0 } },
          position: { vertical: 1, horizontal: -1 },
          type: Chain.STX,
          state: StacksBlockState.NEW,
        },
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
          files={"/assets/environments/studio.hdr"}
          resolution={256}
        >
          <pointLight
            position={[-width / 2, -width / 2, width / 2]}
            color="red"
            intensity={7.5}
          />
          <Camera isometric />
          <BlockchainRender chain={blockchain} />
          <HUDScene />
          <GridHelper />
          <AxesHelper />
          {debug && <OrbitControls />}
        </Environment>
      </FiberCanvas>
    </section>
  );
};
