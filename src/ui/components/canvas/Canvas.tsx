import {
  Bvh,
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import React, {
  FC,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { Group, MathUtils } from "three";
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

const handleScroll = ({
  deltaY,
  pageX,
  width,
  maxYLeftScroll,
  maxYRightScroll,
  nativeEvent,
  leftRef,
  rightRef,
}: {
  deltaY: number;
  pageX: number;
  width: number;
  maxYLeftScroll: number;
  maxYRightScroll: number;
  nativeEvent: WheelEvent;
  leftRef: MutableRefObject<Group>;
  rightRef: MutableRefObject<Group>;
}) => {
  nativeEvent.preventDefault();
  const newLeftTranslateY = deltaY + leftRef.current.position.y;
  if (
    pageX < width / 2 &&
    newLeftTranslateY >= 0 &&
    newLeftTranslateY < maxYLeftScroll
  ) {
    leftRef.current.position.y = MathUtils.lerp(
      leftRef.current.position.y,
      newLeftTranslateY,
      0.1
    );
  }
  const newRightTranslateY = deltaY + rightRef.current.position.y;
  if (
    pageX > width / 2 &&
    newRightTranslateY >= 0 &&
    newRightTranslateY < maxYRightScroll
  ) {
    rightRef.current.position.y = MathUtils.lerp(
      rightRef.current.position.y,
      newRightTranslateY,
      0.1
    );
  }
};

export const Canvas: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const stacksRef = useRef<Group>(null!);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const bitcoinRef = useRef<Group>(null!);
  const [dpr, setDpr] = useState(1.5);
  const { height, width, maxYRightScroll, maxYLeftScroll, zoom } =
    useContext(SceneContext);
  const { state } = useContext(UiStateContext);
  const stacks = state.preview?.stacks || state.present.stacks;
  const bitcoin = state.preview?.bitcoin || state.present.bitcoin;
  const { debug } = useContext(DebugContext);

  return (
    <section className="CanvasWrapper">
      <FiberCanvas
        dpr={dpr}
        style={{ height, width }}
        onWheel={({ deltaY, pageX, nativeEvent }) =>
          handleScroll({
            deltaY,
            pageX,
            width,
            maxYLeftScroll,
            maxYRightScroll,
            nativeEvent,
            leftRef: stacksRef,
            rightRef: bitcoinRef,
          })
        }
      >
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
              <BlockchainRender chain={stacks} ref={stacksRef} />
              <BlockchainRender chain={bitcoin} ref={bitcoinRef} />
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
