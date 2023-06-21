import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import throttle from "lodash/throttle";
import React, { FC, useContext, useState } from "react";
import { UiStateContext } from "../../../UiState";
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
  500,
  { leading: true }
);

export const Canvas: FC = () => {
  const { height, width, maxYRightScroll, maxYLeftScroll } =
    useContext(DimensionsContext);
  const { state } = useContext(UiStateContext);
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
          <BlockchainRender chain={state.stacks} translateY={leftTranslateY} />
          <BlockchainRender
            chain={state.bitcoin}
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
