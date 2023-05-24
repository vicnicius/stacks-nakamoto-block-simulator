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
}>({
  aspect: 16 / 9,
  width: 1024,
  height: 768,
  blockSpace,
  sceneHeight: 0,
  sceneWidth: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSceneWidth: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSceneHeight: () => {},
});
