import { animated, config, useSpring } from "@react-spring/three";
import { Box, Edges, Line, MeshTransmissionMaterial } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
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
  return <Line points={points} segments color={colors.gray} />;
};

const getConnections: (
  block: Block,
  chain: Blockchain<Chain.BTC | Chain.STX>
) => BlockConnection[] = (block, chain) => {
  const parent = block.parentId ? chain.blocks[block.parentId] : undefined;
  if (parent === undefined) {
    return [];
  }
  if (parent.position.horizontal === block.position.horizontal) {
    return [BlockConnection.BOTTOM];
  }
  if (parent.position.horizontal < block.position.horizontal) {
    return [BlockConnection.BOTTOM, BlockConnection.LEFT];
  }
  if (parent.position.horizontal > block.position.horizontal) {
    return [BlockConnection.BOTTOM, BlockConnection.RIGHT];
  }
  return [];
};

const AnimatedGroup = animated.group;
const AnimatedBox = animated(Box);
const AnimatedEdges = animated(Edges);
const boxGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);

const BlockRenderCore: FC<{
  id: string;
  block: Block;
  chain: Blockchain<Chain.STX | Chain.BTC>;
}> = ({ block, id, chain }) => {
  const { height, width } = useContext(DimensionsContext);
  const { dispatch } = useContext(UiStateContext);
  const [isHovering, setIsHovering] = useState(false);

  const handleBlockClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      // eslint-disable-next-line no-console
      console.log("Click on block?");
      dispatch({
        type: BlockActionType.MINE,
        targetBlockId: id,
        chain: chain.name,
      });
    },
    [dispatch]
  );
  useEffect(() => {
    document.body.style.cursor = isHovering ? "pointer" : "auto";
  }, [isHovering]);
  const handleCubeMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);
  const handleCubeMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  const handlePopupMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);
  const handlePopupMouseLeave = useCallback(() => {
    setIsHovering(false);
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
    scale: isHovering ? 1.25 : 1,
  });
  const [anchorX, anchorY, anchorZ] = getAnchorsFromPosition(
    block.position,
    width,
    height,
    block.type
  );
  const outerBlockColor =
    block.type === Chain.STX ? colors.darkPurple : colors.darkYellow;
  const connections = getConnections(block, chain);
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
      <group position={[(cubeSize - 8) / 2, cubeSize, -(cubeSize - 8) / 2]}>
        <BlockPopup
          isHovering={isHovering}
          handleMouseEnter={handlePopupMouseEnter}
          handleMouseLeave={handlePopupMouseLeave}
          position={[anchorX, anchorY, anchorZ]}
          blockId={id}
          chain={block.type}
        />
      </group>
      <Connections connections={connections} />
    </AnimatedGroup>
  );
};

export const BlockRender = React.memo(BlockRenderCore, (prev, next) => {
  // We only re-render this component if the type of block being rendered has changed
  if (
    prev.block.type === Chain.STX &&
    next.block.type === Chain.STX &&
    prev.block.state !== next.block.state
  ) {
    return false;
  }
  return true;
});
