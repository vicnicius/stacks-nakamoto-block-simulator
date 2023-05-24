import React, { FC, useContext } from "react";
import { DebugContext } from "../../../../domain/Debug";
import { DimensionsContext } from "../../../../domain/Dimensions";

export const AxesHelper: FC = () => {
  const { debug } = useContext(DebugContext);
  const { height } = useContext(DimensionsContext);
  if (debug) return <axesHelper args={[height / 2]} />;
  return null;
};
