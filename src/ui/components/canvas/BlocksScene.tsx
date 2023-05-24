import {
  Billboard,
  Center,
  Circle,
  Edges,
  GradientTexture,
  Line,
  Text,
} from "@react-three/drei";
import React, { FC, useContext } from "react";
import {
  DimensionsContext,
  blockSpace,
  cubeSize,
  marginSize,
} from "../../../domain/Dimensions";

type Action = "mine" | "fork" | "freeze";

enum BlockConnection {
  BOTTOM,
  RIGHT,
  LEFT,
}

interface Block {
  id: string;
  state: "new" | "frozen";
  connection: BlockConnection[];
}

interface BlockHeight {
  depth: number;
  actions: Action[];
  blocks: Block[];
}

const sampleBlocks: BlockHeight[] = [
  {
    depth: 1,
    actions: [],
    blocks: [{ id: "1", state: "new", connection: [BlockConnection.BOTTOM] }],
  },
  {
    depth: 2,
    actions: [],
    blocks: [{ id: "2", state: "new", connection: [] }],
  },
];
function getIsometricCoordinates(
  horizontalDistance: number,
  verticalDistance: number
): [x: number, y: number, z: number] {
  const x = horizontalDistance * Math.sqrt(2);
  const y = verticalDistance;
  const z = -horizontalDistance * Math.sqrt(2);
  return [x, y, z];
}

const Block: FC<{
  depth: number;
  id: string;
  connections: BlockConnection[];
}> = ({ connections, depth, id }) => {
  const { height, width } = useContext(DimensionsContext);
  const initialCubeY = height / 2;
  const innerCubeSize = cubeSize * 0.65;
  const [anchorX, anchorY, anchorZ] = getIsometricCoordinates(
    -width / 8,
    initialCubeY - (depth - 1) * blockSpace
  );
  return (
    <>
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
        <mesh>
          <boxGeometry args={[innerCubeSize, innerCubeSize, innerCubeSize]} />
          <meshBasicMaterial>
            <GradientTexture stops={[0, 1]} colors={["#948BF8", "#DCD9FA"]} />
          </meshBasicMaterial>
          <Edges color="#FFFFFF" scale={1} />
        </mesh>
        <mesh>
          <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
          <meshPhysicalMaterial
            color={"#291F9B"}
            transparent={true}
            opacity={0.9}
            transmission={0.15}
            metalness={0}
            roughness={1}
            reflectivity={0.25}
            clearcoat={1}
            clearcoatRoughness={0}
          />
          <Edges color="#FFFFFF" scale={0.95} />
        </mesh>
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
            color={"#FFFFFF"}
          />
        )}
      </group>
    </>
  );
};

const BlockHeightSpace: FC<BlockHeight> = ({ depth, blocks }) => {
  return (
    <>
      {blocks.map((block) => (
        <Block
          key={block.id}
          depth={depth}
          id={block.id}
          connections={block.connection}
        />
      ))}
    </>
  );
};

export const BlocksScene: FC = () => {
  return (
    <group>
      {sampleBlocks.map((blockHeight) => (
        <BlockHeightSpace {...blockHeight} key={blockHeight.depth} />
      ))}
    </group>
  );
};
