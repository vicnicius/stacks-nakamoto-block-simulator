import { createContext } from "react";

export const blockSpace = 96;
export const marginSize = 32;
export const headerSize = 60;
export const fontSize = {
  small: 12,
  regular: 16,
};

export const DimensionsContext = createContext<{
  aspect: number;
  width: number;
  height: number;
  blockSpace: number;
}>({
  aspect: 16 / 9,
  width: 1024,
  height: 768,
  blockSpace,
});
