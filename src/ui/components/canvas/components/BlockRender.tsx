import { animated, config, useSpring } from "@react-spring/three";
import { Box, Edges, Line, MeshTransmissionMaterial } from "@react-three/drei";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BoxGeometry } from "three";
import { UiStateContext } from "../../../../UiState";
import { Block, BlockPosition, Chain } from "../../../../domain/Block";
import { BlockActionType } from "../../../../domain/BlockAction";
import { BlockConnection } from "../../../../domain/BlockConnection";
import { Blockchain } from "../../../../domain/Blockchain";
import {
  DimensionsContext,
  blockSpace,
  cubeSize,
} from "../../../../domain/Dimensions";
import { colors } from "../helpers";
import { BlockLabel } from "./BlockLabel";
import { BlockPopup } from "./BlockPopup";

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
  spaceHeight: number,
  chain: Chain
) => [number, number, number] = (position, spaceWidth, spaceHeight, chain) => {
  const { vertical: positionY, horizontal: positionX } = position;
  const initialY = (spaceHeight / 2) * Math.SQRT2 - cubeSize * 2;
  const initialX = -spaceWidth / 8;
  const cubeX =
    (chain === Chain.STX ? initialX : -initialX) +
    (cubeHorizontalDistance * positionX) / 2;
  const cubeY = initialY - cubeVerticalDistance * (positionY + 1);
  return getIsometricCoordinates(cubeX, cubeY);
};

const Connections: FC<{
  connections: BlockConnection[];
  isHighlighted: boolean;
}> = ({ connections, isHighlighted }) => {
  const deltaY = cubeSize * Math.SQRT2;
  const points: [number, number, number][] = [];
  connections.forEach((connection: BlockConnection, index: number) => {
    const deltaX = cubeHorizontalDistance * Math.SQRT2;
    // If it's right behind the parent, we just draw a straight line
    if (connection === BlockConnection.TOP && connections.length === 2) {
      return points.push([0, 0, 0], [0, deltaY * 2, 0]);
    }
    if (connection === BlockConnection.TOP && index === 0) {
      return points.push([0, 0, 0], [0, deltaY, 0]);
    }

    // Final connection
    if (
      connection === BlockConnection.TOP &&
      index === connections.length - 1
    ) {
      const initial: [number, number, number] =
        connections[index - 1] === BlockConnection.LEFT
          ? [
              (-deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2,
              (deltaX * (index - 1)) / 2,
            ]
          : [
              (deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2,
              (-deltaX * (index - 1)) / 2,
            ];
      const final: [number, number, number] =
        connections[index - 1] === BlockConnection.LEFT
          ? [
              (-deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2 * 2,
              (deltaX * (index - 1)) / 2,
            ]
          : [
              (deltaX * (index - 1)) / 2,
              cubeSize * Math.SQRT2 * 2,
              (-deltaX * (index - 1)) / 2,
            ];
      return points.push(initial, final);
    }
    if (connection === BlockConnection.LEFT) {
      return points.push(
        [
          (-deltaX * (index - 1)) / 2,
          cubeSize * Math.SQRT2,
          (deltaX * (index - 1)) / 2,
        ],
        [(-deltaX * index) / 2, cubeSize * Math.SQRT2, (deltaX * index) / 2]
      );
    }
    if (connections.includes(BlockConnection.RIGHT)) {
      return points.push(
        [
          (deltaX * (index - 1)) / 2,
          cubeSize * Math.SQRT2,
          (-deltaX * (index - 1)) / 2,
        ],
        [(deltaX * index) / 2, cubeSize * Math.SQRT2, (-deltaX * index) / 2]
      );
    }
  });
  const lineWidth = isHighlighted ? 1.5 : 0.25;
  const color = isHighlighted ? colors.white : colors.gray;
  return <Line points={points} segments color={color} lineWidth={lineWidth} />;
};

const getConnections: (
  block: Block,
  chain: Blockchain<Chain.BTC | Chain.STX>
) => BlockConnection[] = (block, chain) => {
  const parent = block.parentId ? chain.blocks[block.parentId] : undefined;
  if (parent === undefined) {
    return [];
  }
  const connections = [BlockConnection.TOP];
  if (parent.position.horizontal < block.position.horizontal) {
    for (
      let i = block.position.horizontal;
      i > parent.position.horizontal;
      i = i - 1
    ) {
      connections.push(BlockConnection.LEFT);
    }
  }
  if (parent.position.horizontal > block.position.horizontal) {
    for (
      let i = block.position.horizontal;
      i < parent.position.horizontal;
      i = i + 1
    ) {
      connections.push(BlockConnection.RIGHT);
    }
  }
  connections.push(BlockConnection.TOP);
  return connections;
};

const AnimatedGroup = animated.group;
const AnimatedBox = animated(Box);
const AnimatedEdges = animated(Edges);
const boxGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);

export const BlockRender: FC<{
  id: string;
  block: Block;
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ block, id, chain }) => {
  const { height, width } = useContext(DimensionsContext);
  const { dispatch } = useContext(UiStateContext);
  const [isHovering, setIsHovering] = useState(false);

  const handleBlockClick = useCallback(() => {
    dispatch({
      type: BlockActionType.MINE,
      targetBlockId: id,
      chain: chain.name,
    });
  }, [dispatch]);
  useEffect(() => {
    document.body.style.cursor = isHovering ? "pointer" : "auto";
  }, [isHovering]);
  const setHover = (hover: boolean) => {
    dispatch({
      type: BlockActionType.HOVER,
      targetBlockId: id,
      chain: chain.name,
      value: hover,
    });
    setIsHovering(hover);
  };
  const handleCubeMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handleCubeMouseLeave = useCallback(() => {
    setHover(false);
  }, []);
  const handlePopupMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handlePopupMouseLeave = useCallback(() => {
    setHover(false);
  }, []);
  const springScale = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: config.gentle,
  });
  const outerCubeSpring = useSpring({
    rotation: isHovering
      ? [0, Math.PI, 0]
      : ([0, 0, 0] as [number, number, number]),
  });
  const edgesSpring = useSpring({
    scale: isHovering || block.isHighlighted ? 1.25 : 1,
  });
  const [anchorX, anchorY, anchorZ] = getAnchorsFromPosition(
    block.position,
    width,
    height,
    block.type
  );
  const hasChildren = block.childrenIds.length > 0;
  const outerBlockColor =
    block.type === Chain.STX ? colors.darkPurple : colors.darkYellow;
  const connections = useMemo(
    () => getConnections(block, chain),
    [block, chain]
  );
  return (
    <AnimatedGroup
      position={[anchorX, anchorY, anchorZ]}
      onClick={handleBlockClick}
    >
      <BlockLabel isHovering={isHovering} cubeSize={cubeSize} id={id} />
      <AnimatedBox
        args={[cubeSize, cubeSize, cubeSize]}
        geometry={boxGeometry}
        // @FIXME: fix this type casting
        rotation={
          outerCubeSpring.rotation as unknown as [
            x: number,
            y: number,
            z: number
          ]
        }
        scale={springScale.scale}
        onPointerOver={handleCubeMouseEnter}
        onPointerOut={handleCubeMouseLeave}
      >
        <MeshTransmissionMaterial
          color={outerBlockColor}
          transmission={0.5}
          metalness={0}
          reflectivity={0.25}
          roughness={0.15}
          distortionScale={1}
          temporalDistortion={0.5}
          clearcoat={1}
          transmissionSampler
        />
        <AnimatedEdges color={colors.white} scale={edgesSpring.scale} />
      </AnimatedBox>
      <group position={[18, 0, -18]}>
        <BlockPopup
          blockId={id}
          chain={block.type}
          hasChildren={block.childrenIds.length > 0}
          handleMouseEnter={handlePopupMouseEnter}
          handleMouseLeave={handlePopupMouseLeave}
          position={[anchorX, anchorY, anchorZ]}
          visible={isHovering && hasChildren}
        />
      </group>
      <Connections
        isHighlighted={block.isHighlighted}
        connections={connections}
      />
    </AnimatedGroup>
  );
};
