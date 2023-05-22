import React, { FC, useContext, useEffect, useRef } from "react";
import { Edges, Line, Text, useHelper } from "@react-three/drei";
import { layout } from "./helpers";
import { SpotLight, SpotLightHelper, Vector3 } from "three";
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

interface BlockHeight {
  depth: number;
  actions: Action[];
  blocks: Block[];
}
// One block height is made of one or multiple blocks,
// their connections and the associated actions.
const Title: FC = () => {
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
  const anchorY = 1;
  const anchorX = -2;
  const anchorZ = 3;
  return (
    <group position={[anchorX, anchorY, anchorZ]}>
      <mesh>
        <boxBufferGeometry args={[0.75, 0.75, 0.75]} />
        <meshPhysicalMaterial color="#291F9B" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
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

export const StacksBlockchain: FC = () => {
  const topLight = useRef<SpotLight>(new SpotLight());
  const bottomLight = useRef<SpotLight>(new SpotLight());
  const mainLight = useRef<SpotLight>(new SpotLight());
  useHelper(mainLight, SpotLightHelper, "white");
  useHelper(topLight, SpotLightHelper, "yellow");
  useHelper(bottomLight, SpotLightHelper, "purple");
  useEffect(() => {
    mainLight.current.lookAt(0, 0, 0);
    topLight.current.lookAt(0, 0, 0);
    bottomLight.current.lookAt(0, 0, 0);
  }, []);
  return (
    <group>
      <spotLight
        intensity={10}
        distance={100}
        color={"white"}
        position={[0, 100 / 2, 0]}
        ref={topLight}
      />
      <spotLight
        intensity={10}
        distance={100}
        color={"white"}
        position={[100 / 3, 100 / 3, 100 / 3]}
        ref={mainLight}
      />
      <spotLight
        intensity={75}
        distance={85}
        color={"#7A40EE"}
        position={[0, -100 / 3, 100 / 3]}
        ref={bottomLight}
      />
      <Title />
      {sampleBlocks.map((blockHeight) => (
        <BlockHeightSpace {...blockHeight} key={blockHeight.depth} />
      ))}
    </group>
  );
};
