import { Text } from "@react-three/drei";
import React, { FC, PropsWithChildren } from "react";
import { fontSize } from "../../../../domain/Dimensions";

export const Title: FC<
  PropsWithChildren<{
    position: [number, number, number];
    anchor: "left" | "right";
  }>
> = ({ anchor, children, position }) => {
  return (
    <Text
      color={"#FFFFFF"}
      fontSize={fontSize.regular}
      font="Inter"
      textAlign="right"
      anchorY="top"
      anchorX={anchor}
      position={position}
    >
      {children}
    </Text>
  );
};
