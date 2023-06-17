import { animated, useSpring, config } from "@react-spring/three";
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
  const scaleSpring = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    delay: 350,
    config: config.wobbly,
  });
  const positionSpring = useSpring({
    position: isHovering
      ? [cubeSize + 10, cubeSize + 15, 0]
      : [cubeSize, cubeSize + 5, 0],
  });
  return (
    <AnimatedBillboard
      position={positionSpring.position as unknown as [number, number, number]}
      scale={scaleSpring.scale}
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
