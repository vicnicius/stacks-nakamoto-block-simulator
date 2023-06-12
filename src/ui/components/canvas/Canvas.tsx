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
import { colors } from "./helpers";

// The Blockchain interface describes the data structure that we will use to render the blocks.
// Each block can have a number of children blocks, and each block has it's own state.
const stacksChain: Blockchain<Chain.STX> = {
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

const bitcoinChain: Blockchain<Chain.BTC> = {
  actions: [],
  block: {
    id: "0",
    position: { vertical: 0, horizontal: 0 },
    type: Chain.BTC,
  },
  children: [
    {
      block: {
        id: "1",
        parent: { id: "0", position: { vertical: 0, horizontal: 0 } },
        position: { vertical: 1, horizontal: 0 },
        type: Chain.BTC,
      },
      actions: [],
      children: [
        {
          actions: [],
          block: {
            id: "5",
            parent: { id: "1", position: { vertical: 1, horizontal: 0 } },
            position: { vertical: 2, horizontal: 0 },
            type: Chain.BTC,
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
                type: Chain.BTC,
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
        type: Chain.BTC,
      },
      actions: [],
      children: [
        {
          actions: [],
          block: {
            id: "3",
            parent: { id: "2", position: { vertical: 1, horizontal: 1 } },
            position: { vertical: 2, horizontal: 1 },
            type: Chain.BTC,
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
        type: Chain.BTC,
      },
      children: [],
    },
  ],
};

export const Canvas: FC = () => {
  const { height, width } = useContext(DimensionsContext);
  const { debug } = useContext(DebugContext);

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
          <spotLight
            position={[-width * Math.SQRT2, 0, width * Math.SQRT2]}
            color={colors.lightPurple}
            decay={1}
            intensity={10}
            distance={width * 2}
          />
          <spotLight
            position={[width * Math.SQRT2, 0, -width * Math.SQRT2]}
            color={colors.lightYellow}
            decay={1}
            intensity={10}
            distance={width * 2}
          />
          <Camera isometric />
          <BlockchainRender chain={stacksChain} />
          <BlockchainRender chain={bitcoinChain} />
          <HUDScene />
          <GridHelper />
          <AxesHelper />
          {debug && <OrbitControls />}
        </Environment>
      </FiberCanvas>
    </section>
  );
};
