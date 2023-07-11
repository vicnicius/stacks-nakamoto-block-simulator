import noop from "lodash/noop";
import { createContext } from "react";
import { Euler } from "three";

export const blockSpace = 96;
export const marginSize = 32;
export const headerSize = 48;
export const footerSize = 64;
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
  maxYLeftScroll: number;
  maxYRightScroll: number;
  setMaxYLeftScroll: (maxYLeftScroll: number) => void;
  setMaxYRightScroll: (maxYRightScroll: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}>({
  aspect: 16 / 9,
  width: 1024,
  height: 768,
  blockSpace,
  maxYLeftScroll: 9999,
  maxYRightScroll: 9999,
  zoom: 1,
  setMaxYRightScroll: noop,
  setMaxYLeftScroll: noop,
  setZoom: noop,
});
