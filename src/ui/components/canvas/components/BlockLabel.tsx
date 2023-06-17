import { Billboard, Center, Circle, Text } from "@react-three/drei";
import React, { FC } from "react";
import { colors, fonts } from "../helpers";

interface BlockLabelProps {
  cubeSize: number;
  id: string;
}

export const BlockLabel: FC<BlockLabelProps> = ({ cubeSize, id }) => {
  return (
    <Billboard position={[cubeSize, cubeSize + 5, 0]}>
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
    </Billboard>
  );
};
