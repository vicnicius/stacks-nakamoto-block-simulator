import React, {
  FC,
  MutableRefObject,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  Box,
  Edges,
  GradientTexture,
  Line,
  Text,
  useHelper,
} from "@react-three/drei";
import { layout } from "./helpers";
import {
  CameraHelper,
  OrthographicCamera,
  SpotLight,
  SpotLightHelper,
  Vector3,
} from "three";
import {
  DimensionsContext,
  fontSize,
  marginSize,
} from "../../../domain/Dimensions";
import { useFrame } from "@react-three/fiber";

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
  // {
  //   depth: 2,
  //   actions: [],
  //   blocks: [{ id: "2", state: "new" }],
  // },
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

const Block: FC<{ depth: number }> = ({ depth }) => {
  const { height } = useContext(DimensionsContext);
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry args={[0.75, 0.75, 0.75]} />
        <meshPhysicalMaterial color="#291F9B" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#291F9B" transparent opacity={0.8} />
        {/* // Use Edges scale for hover state later */}
        <Edges color="#ffffff" scale={1} />
      </mesh>
    </group>
  );
};

const BlockHeightSpace: FC<BlockHeight> = ({ depth, actions, blocks }) => {
  return (
    <>
      {blocks.map((block) => (
        <Block depth={depth} />
      ))}
      <BlockHeightLabel depth={depth} />
      <Divider depth={depth} />
    </>
  );
};

export const StacksBlockchain: FC = () => {
  const light = useRef<SpotLight>(null!);
  // useHelper(light, SpotLightHelper, "cyan");
  return (
    <>
      <spotLight
        intensity={15}
        distance={5}
        color={"white"}
        position={[1, 1, 1]}
        ref={light}
      />
      <Title />
      {sampleBlocks.map((blockHeight) => (
        <BlockHeightSpace {...blockHeight} key={blockHeight.depth} />
      ))}
    </>
  );
};
