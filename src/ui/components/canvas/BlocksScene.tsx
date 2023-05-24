import { Edges, Line, Text } from "@react-three/drei";
import React, { FC, useContext } from "react";
import { Vector3 } from "three";
import {
  DimensionsContext,
  fontSize,
  marginSize,
} from "../../../domain/Dimensions";

type Action = "mine" | "fork" | "freeze";

interface Block {
  id: string;
  state: "new" | "frozen";
}

// One block height is made of one or multiple blocks,
// their connections and the associated actions.
interface BlockHeight {
  depth: number;
  actions: Action[];
  blocks: Block[];
}

const sampleBlocks: BlockHeight[] = [
  {
    depth: 1,
    actions: [],
    blocks: [{ id: "1", state: "new" }],
  },
  {
    depth: 2,
    actions: [],
    blocks: [{ id: "2", state: "new" }],
  },
];

const Divider: FC<{ depth: number }> = ({ depth }) => {
  const { blockSpace, height, width } = useContext(DimensionsContext);
  const anchorX = -width / 2 + marginSize;
  const anchorY = height / 2 - marginSize / 2 - depth * blockSpace;
  return (
    <mesh>
      <Line
        points={[
          new Vector3(anchorX, anchorY, 0),
          new Vector3(-marginSize, anchorY, 0),
        ]}
        color={"#666666"}
        lineWidth={0.25}
      />
    </mesh>
  );
};

const BlockHeightLabel: FC<{ depth: number }> = ({ depth }) => {
  const { blockSpace, height, width } = useContext(DimensionsContext);
  const anchorX = -width / 2 + marginSize / 2;
  const anchorY =
    height / 2 - marginSize / 2 - depth * blockSpace + fontSize.small / 2;
  return (
    <Text
      color={"#333333"}
      fontSize={fontSize.small}
      font="Inter"
      textAlign="right"
      anchorY="top"
      anchorX="right"
      position={[anchorX, anchorY, 0]}
    >
      #{depth}
    </Text>
  );
};

const Block: FC<{ depth: number }> = () => {
  const anchorY = 0;
  const anchorX = 0;
  const anchorZ = 0;
  return (
    <group position={[anchorX, anchorY, anchorZ]}>
      <mesh>
        <boxGeometry args={[15, 15, 15]} />
        <meshPhysicalMaterial color="#291F9B" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <boxGeometry args={[20, 20, 20]} />
        <meshPhysicalMaterial color="#291F9B" transparent opacity={0.5} />
        {/* @TODO: Use Edges scale for hover state later */}
        <Edges color="#ffffff" scale={1} />
      </mesh>
    </group>
  );
};

const BlockHeightSpace: FC<BlockHeight> = ({ depth, blocks }) => {
  return (
    <group>
      {blocks.map((block) => (
        <Block key={block.id} depth={depth} />
      ))}
      <BlockHeightLabel depth={depth} />
      <Divider depth={depth} />
    </group>
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
