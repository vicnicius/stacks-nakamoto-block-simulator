import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import throttle from "lodash/throttle";
import React, { FC, useContext, useState } from "react";
import { Chain, StacksBlockState } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import { DebugContext } from "../../../domain/Debug";
import { DimensionsContext } from "../../../domain/Dimensions";
import { BlockchainRender } from "./BlockchainRender";
import "./Canvas.css";
import { HUDScene } from "./HUDScene";
import { AxesHelper } from "./components/AxesHelper";
import { Camera } from "./components/Camera";
import { GridHelper } from "./components/GridHelper";
import { Lights } from "./components/Lights";
import { colors } from "./helpers";

// The Blockchain interface describes the data structure that we will use to render the blocks.
// Each block can have a number of children blocks, and each block has it's own state.
const initialStacksChain: Blockchain<Chain.STX> = {
  name: "stacks",
  actions: [],
  blocks: {
    1: {
      position: { vertical: 0, horizontal: 0 },
      type: Chain.STX,
      state: StacksBlockState.NEW,
    },
  },
};

const initialBitcoinChain: Blockchain<Chain.BTC> = {
  name: "bitcoin",
  actions: [],
  blocks: {
    1: {
      position: { vertical: 0, horizontal: 0 },
      type: Chain.BTC,
    },
  },
};

const handleScroll = throttle(
  ({
    deltaY,
    pageX,
    width,
    leftTranslateY,
    rightTranslateY,
    setLeftTranslateY,
    setRightTranslateY,
    maxYLeftScroll,
    maxYRightScroll,
    nativeEvent,
  }) => {
    nativeEvent.preventDefault();
    const newLeftTranslateY = deltaY + leftTranslateY;
    if (
      pageX < width / 2 &&
      newLeftTranslateY >= 0 &&
      newLeftTranslateY < maxYLeftScroll
    ) {
      setLeftTranslateY(newLeftTranslateY);
    }
    const newRightTranslateY = deltaY + rightTranslateY;
    if (
      pageX > width / 2 &&
      newRightTranslateY >= 0 &&
      newRightTranslateY < maxYRightScroll
    ) {
      setRightTranslateY(newRightTranslateY);
    }
  },
  250,
  { leading: true }
);

export const Canvas: FC = () => {
  const { height, width, maxYRightScroll, maxYLeftScroll } =
    useContext(DimensionsContext);
  const { debug } = useContext(DebugContext);
  const [leftTranslateY, setLeftTranslateY] = useState(0);
  const [rightTranslateY, setRightTranslateY] = useState(0);

  return (
    <section className="CanvasWrapper">
      <FiberCanvas
        dpr={[1, 2]}
        style={{ height, width }}
        onWheel={({ deltaY, pageX, nativeEvent }) =>
          handleScroll({
            deltaY,
            pageX,
            width,
            leftTranslateY,
            rightTranslateY,
            maxYLeftScroll,
            maxYRightScroll,
            setLeftTranslateY,
            setRightTranslateY,
            nativeEvent,
          })
        }
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
          <Camera isometric />
          <BlockchainRender
            chain={initialStacksChain}
            translateY={leftTranslateY}
          />
          <BlockchainRender
            chain={initialBitcoinChain}
            translateY={rightTranslateY}
          />
          <HUDScene />
          <GridHelper />
          <AxesHelper />
          {debug && <OrbitControls />}
        </Environment>
      </FiberCanvas>
    </section>
  );
};
