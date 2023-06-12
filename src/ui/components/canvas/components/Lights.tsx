import React, { useContext } from "react";
import { DimensionsContext } from "../../../../domain/Dimensions";
import { colors } from "../helpers";

export const Lights = () => {
  const { width } = useContext(DimensionsContext);
  return (
    <>
      <spotLight
        position={[-width * Math.SQRT2, 0, width * Math.SQRT2]}
        color={colors.lightPurple}
        decay={1}
        intensity={40}
        distance={width * 2}
      />
      <spotLight
        position={[width * Math.SQRT2, 0, -width * Math.SQRT2]}
        color={colors.lightYellow}
        decay={1}
        intensity={40}
        distance={width * 2}
      />
    </>
  );
};
