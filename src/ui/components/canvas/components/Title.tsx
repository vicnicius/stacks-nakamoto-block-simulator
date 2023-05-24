import { Text } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { DimensionsContext, fontSize } from "../../../../domain/Dimensions";
import { layout } from "../helpers";

export const Title: FC = () => {
  const { height } = useContext(DimensionsContext);
  return (
    <Text
      color={"#FFFFFF"}
      fontSize={fontSize.regular}
      font="Inter"
      textAlign="right"
      anchorY="top"
      anchorX="right"
      position={[-layout.defaultMargin / 2, height / 2, 0]}
    >
      Stacks
    </Text>
  );
};
