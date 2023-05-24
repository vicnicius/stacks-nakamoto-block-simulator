import React, { FC, useContext } from "react";
import { DebugContext } from "../../../../domain/Debug";
import { DimensionsContext } from "../../../../domain/Dimensions";

export const GridHelper: FC = () => {
  const { debug } = useContext(DebugContext);
  const { width } = useContext(DimensionsContext);

  if (debug) return <gridHelper args={[width, 100, 1]} />;

  return null;
};
