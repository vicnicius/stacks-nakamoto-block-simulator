import noop from "lodash/noop";
import { createContext } from "react";
import { Euler } from "three";

export const blockSpace = 96;
export const marginSize = 32;
export const headerSize = 60;
export const cubeSize = 30;
export const fontSize = {
  small: 12,
  regular: 16,
};
export const isometricCameraAngle = new Euler(
  Math.atan(-1 / Math.sqrt(2)),
  -Math.PI / 4,
  0
);

export const DimensionsContext = createContext<{
  aspect: number;
  width: number;
  height: number;
  blockSpace: number;
  sceneHeight: number;
  sceneWidth: number;
  setSceneHeight: (height: number) => void;
  setSceneWidth: (width: number) => void;
  maxYLeftScroll: number;
  maxYRightScroll: number;
  setMaxYLeftScroll: (maxYLeftScroll: number) => void;
  setMaxYRightScroll: (maxYRightScroll: number) => void;
}>({
  aspect: 16 / 9,
  width: 1024,
  height: 768,
  blockSpace,
  sceneHeight: 0,
  sceneWidth: 0,
  maxYLeftScroll: 9999,
  maxYRightScroll: 9999,
  setMaxYRightScroll: noop,
  setMaxYLeftScroll: noop,
  setSceneWidth: noop,
  setSceneHeight: noop,
});
