import { animated, useSpring } from "@react-spring/three";
import { Billboard, Center, Circle, Text } from "@react-three/drei";
import React, { FC } from "react";
import { colors, fonts } from "../helpers";

interface BlockLabelProps {
  isHovering: boolean;
  cubeSize: number;
  id: string;
}

const AnimatedBillboard = animated(Billboard);

export const BlockLabel: FC<BlockLabelProps> = ({
  cubeSize,
  id,
  isHovering,
}) => {
  const spring = useSpring({
    position: isHovering
      ? [cubeSize + 10, cubeSize + 15, 0]
      : [cubeSize, cubeSize + 5, 0],
  });
  return (
    <AnimatedBillboard
      position={spring.position as unknown as [number, number, number]}
    >
      <Center>
        <mesh>
          <Circle args={[10]}>
            <meshBasicMaterial color={colors.white} />
          </Circle>
          <Circle args={[9]}>
            <meshBasicMaterial color={colors.black} />
          </Circle>
        </mesh>
        <Text fontSize={12} font={fonts.regular}>
          {id}
        </Text>
      </Center>
    </AnimatedBillboard>
  );
};
