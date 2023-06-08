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
import { Block, BlockPosition, Chain } from "../../../domain/Block";
import { Blockchain } from "../../../domain/Blockchain";
import {
  DimensionsContext,
  blockSpace,
  cubeSize,
} from "../../../domain/Dimensions";

enum BlockConnection {
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
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

const cubeHorizontalDistance = blockSpace;
const cubeVerticalDistance = blockSpace;

const getAnchorsFromPosition: (
  position: BlockPosition,
  spaceWidth: number,
  spaceHeight: number
) => [number, number, number] = (position, spaceWidth, spaceHeight) => {
  const { vertical: positionY, horizontal: positionX } = position;
  const initialY = (spaceHeight / 2) * Math.SQRT2 - cubeSize * 2;
  const initialX = -spaceWidth / 8;
  const cubeX = initialX + (cubeHorizontalDistance * positionX) / 2;
  const cubeY = initialY - cubeVerticalDistance * (positionY + 1);
  return getIsometricCoordinates(cubeX, cubeY);
};

const Connections: FC<{ connections: BlockConnection[] }> = ({
  connections,
}) => {
  const points: [number, number, number][] = [];
  const topConnectionSize =
    connections.includes(BlockConnection.LEFT) ||
    connections.includes(BlockConnection.RIGHT)
      ? cubeSize * Math.SQRT2
      : cubeSize * Math.SQRT2 * 2;

  if (connections.includes(BlockConnection.BOTTOM)) {
    points.push([0, 0, 0], [0, topConnectionSize, 0]);
  }

  if (connections.includes(BlockConnection.LEFT)) {
    points.push(
      [0, cubeSize * Math.SQRT2, 0],
      [
        (-cubeHorizontalDistance * Math.SQRT2) / 2,
        cubeSize * Math.SQRT2,
        (cubeHorizontalDistance * Math.SQRT2) / 2,
      ]
    );
  }

  if (connections.includes(BlockConnection.RIGHT)) {
    points.push(
      [0, cubeSize * Math.SQRT2, 0],
      [
        (cubeHorizontalDistance * Math.SQRT2) / 2,
        cubeSize * Math.SQRT2,
        -(cubeHorizontalDistance * Math.SQRT2) / 2,
      ]
    );
  }
  return <Line points={points} segments color={"#FFFFFF"} />;
};

const BlockRender: FC<{
  block: Block;
}> = ({ block }) => {
  const { height, width } = useContext(DimensionsContext);
  const innerCubeSize = cubeSize * 0.65;
  const [anchorX, anchorY, anchorZ] = getAnchorsFromPosition(
    block.position,
    width,
    height
  );
  const connections = getConnections(block);
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
            {block.id}
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
      <Connections connections={connections} />
    </group>
  );
};

const getConnections: (block: Block) => BlockConnection[] = (block) => {
  if (block.parent === undefined) {
    return [];
  }
  if (block.parent.position.horizontal === block.position.horizontal) {
    return [BlockConnection.BOTTOM];
  }
  if (block.parent.position.horizontal < block.position.horizontal) {
    return [BlockConnection.BOTTOM, BlockConnection.LEFT];
  }
  if (block.parent.position.horizontal > block.position.horizontal) {
    return [BlockConnection.BOTTOM, BlockConnection.RIGHT];
  }
  return [];
};

export const BlockchainRender: FC<{
  chain: Blockchain<Chain.STX>;
}> = ({ chain }) => {
  const { block, children } = chain;
  return (
    <group>
      <BlockRender block={block} />
      {children.map((childrenBlock) => {
        return (
          <BlockchainRender
            key={childrenBlock.block.id}
            chain={childrenBlock}
          />
        );
      })}
    </group>
  );
};
