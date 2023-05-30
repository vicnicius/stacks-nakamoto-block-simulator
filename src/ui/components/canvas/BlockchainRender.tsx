import {
  Billboard,
  Center,
  Circle,
  Edges,
  GradientTexture,
  Line,
  MeshTransmissionMaterial,
  RoundedBox,
  Text,
} from "@react-three/drei";
import React, { FC, useContext } from "react";
import { Block, Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import {
  DimensionsContext,
  blockSpace,
  cubeSize,
} from "../../../domain/Dimensions";

enum BlockConnection {
  BOTTOM,
  LEFT,
  RIGHT,
}

function getIsometricCoordinates(
  horizontalDistance: number,
  verticalDistance: number
): [x: number, y: number, z: number] {
  const x = horizontalDistance * Math.sqrt(2);
  const y = verticalDistance;
  const z = -horizontalDistance * Math.sqrt(2);
  return [x, y, z];
}

const BlockRender: FC<{ block: Block; connections: BlockConnection[] }> = ({
  block: { id, height: blockHeight },
  connections,
}) => {
  const { height, width } = useContext(DimensionsContext);
  const initialCubeY = height / 2 - cubeSize * 2;
  const innerCubeSize = cubeSize * 0.65;
  const [anchorX, anchorY, anchorZ] = getIsometricCoordinates(
    -width / 8,
    initialCubeY - (blockHeight - 1) * blockSpace
  );
  return (
    <group position={[anchorX, anchorY, anchorZ]}>
      <Billboard position={[cubeSize, cubeSize + 5, 0]}>
        <Center>
          <mesh>
            <Circle args={[10]}>
              <meshBasicMaterial color={"#FFFFFF"} />
            </Circle>
            <Circle args={[9]}>
              <meshBasicMaterial color={"#000000"} />
            </Circle>
          </mesh>
          <Text fontSize={12} font="/assets/fonts/Inter-Regular.ttf">
            {id}
          </Text>
        </Center>
      </Billboard>
      <RoundedBox
        args={[innerCubeSize, innerCubeSize, innerCubeSize]}
        radius={0.5}
      >
        <meshBasicMaterial>
          <GradientTexture stops={[0, 1]} colors={["#948BF8", "#DCD9FA"]} />
        </meshBasicMaterial>
        <Edges color="#FFFFFF" scale={1} />
      </RoundedBox>
      <RoundedBox args={[cubeSize, cubeSize, cubeSize]} radius={0.5}>
        <MeshTransmissionMaterial
          color={"#4234E9"}
          transmission={0.5}
          metalness={0}
          reflectivity={0.25}
          roughness={0.15}
          distortionScale={1}
          temporalDistortion={0.5}
          clearcoat={1}
        />
      </RoundedBox>
      {connections.includes(BlockConnection.BOTTOM) && (
        <Line
          points={[
            0,
            // Centering the connection line to the bottom of the cube, accounting for the isometric angle correction
            -cubeSize + cubeSize * Math.SQRT2 - cubeSize,
            0,
            0,
            -cubeSize - blockSpace / 2,
            0,
          ]}
          color={"#CCCCCC"}
        />
      )}
    </group>
  );
};

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX>;
  initialConnection: BlockConnection[];
}> = ({ chain, initialConnection = [] }) => {
  const { block, children } = chain;
  const blockConnection =
    children.length > 0 ? [...initialConnection, BlockConnection.BOTTOM] : [];
  return (
    <group>
      <BlockRender block={block} connections={blockConnection} />
      {children.map((childrenBlock, index) => {
        const childrenBlockConnection =
          index >= 1 && index % 2 === 0
            ? [BlockConnection.LEFT]
            : [BlockConnection.RIGHT];
        return (
          <BlockchainRender
            key={childrenBlock.block.id}
            chain={childrenBlock}
            initialConnection={childrenBlockConnection}
          />
        );
      })}
    </group>
  );
};
