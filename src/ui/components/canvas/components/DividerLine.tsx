import { Line } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { Vector3 } from "three";
import { DimensionsContext } from "../../../../domain/Dimensions";

export const DividerLine: FC = () => {
  const { height } = useContext(DimensionsContext);
  const vertices = [
    new Vector3(0, -height / 2, 0),
    new Vector3(0, height / 2, 0),
  ];
  return (
    <mesh>
      <Line points={vertices} color={"#FAFAFA"} lineWidth={0.25} />
    </mesh>
  );
};